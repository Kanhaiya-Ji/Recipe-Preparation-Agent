import { NextRequest, NextResponse } from "next/server";
import type { Ingredient, Preferences } from "@/types";

// ─────────────────────────────────────────────────────────────
// Environment variable helpers (server-only — never NEXT_PUBLIC_)
// ─────────────────────────────────────────────────────────────

function requireEnv(name: string): string {
  const val = process.env[name];
  if (!val) {
    throw new Error(
      `Missing required environment variable: ${name}. ` +
        `Copy web/.env.example to web/.env.local and fill in your IBM credentials.`
    );
  }
  return val;
}

// ─────────────────────────────────────────────────────────────
// IBM IAM token exchange
// Docs: https://cloud.ibm.com/docs/account?topic=account-iamtoken_from_apikey
// ─────────────────────────────────────────────────────────────

async function getIAMToken(apiKey: string): Promise<string> {
  const res = await fetch("https://iam.cloud.ibm.com/identity/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ibm:params:oauth:grant-type:apikey",
      apikey: apiKey,
    }),
    // IAM tokens are valid for ~1 hour — no caching here for simplicity
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`IAM token exchange failed (${res.status}): ${body}`);
  }

  const data = (await res.json()) as { access_token?: string };
  if (!data.access_token) {
    throw new Error("IAM response did not include an access_token.");
  }
  return data.access_token;
}

// ─────────────────────────────────────────────────────────────
// Prompt builder
// ─────────────────────────────────────────────────────────────

function buildPrompt(ingredients: Ingredient[], prefs: Preferences): string {
  const ingList = ingredients.map((i) => i.label).join(", ");

  const activePrefs = (
    [
      prefs.vegan && "vegan",
      prefs.vegetarian && "vegetarian",
      prefs.glutenFree && "gluten-free",
      prefs.dairyFree && "dairy-free",
      prefs.keto && "keto",
      prefs.nutFree && "nut-free",
    ] as (string | false)[]
  )
    .filter(Boolean)
    .join(", ");

  const prefSentence =
    activePrefs.length > 0
      ? `The recipe must be ${activePrefs}.`
      : "No specific dietary restrictions.";

  const timeSentence =
    prefs.maxCookingTime !== "any"
      ? `The total cooking time should not exceed ${prefs.maxCookingTime} minutes.`
      : "There is no cooking time restriction.";

  return (
    `I have the following ingredients available: ${ingList}. ` +
    `${prefSentence} ` +
    `${timeSentence} ` +
    `Please suggest a recipe I can make using only (or mostly) these ingredients. ` +
    `Include: a recipe title, the ingredients used, step-by-step cooking instructions, ` +
    `possible ingredient substitutions, and any helpful cooking tips.`
  );
}

// ─────────────────────────────────────────────────────────────
// Extract text from IBM Orchestrate response
// Handles both /v1/chat (watsonx Orchestrate) and
// /v2/assistants (Watson Assistant v2) response shapes.
// ─────────────────────────────────────────────────────────────

/** Safe deep-access helper: navigate a path of keys on an unknown object. */
function deepGet(obj: unknown, ...keys: string[]): unknown {
  let cur: unknown = obj;
  for (const key of keys) {
    if (cur == null || typeof cur !== "object") return undefined;
    cur = (cur as Record<string, unknown>)[key];
  }
  return cur;
}

function extractRecipeText(data: unknown, callPattern: string): string {
  // ── Pattern: "chat" — watsonx Orchestrate /v1/chat ──────────
  if (callPattern === "chat") {
    // Common response paths for Orchestrate chat endpoint
    const generic0 = deepGet(data, "output", "generic");
    const resultGeneric0 = deepGet(data, "result", "output", "generic");
    const text =
      deepGet(Array.isArray(generic0) ? generic0[0] : undefined, "text") ??
      deepGet(Array.isArray(resultGeneric0) ? resultGeneric0[0] : undefined, "text") ??
      deepGet(data, "output", "text") ??
      deepGet(data, "result", "output", "text") ??
      deepGet(data, "response", "text") ??
      deepGet(data, "text");

    if (text) return String(text);
  }

  // ── Pattern: "assistant" — Watson Assistant v2 message ──────
  if (callPattern === "assistant") {
    const generic0 = deepGet(data, "output", "generic");
    const resultGeneric0 = deepGet(data, "result", "output", "generic");
    const text =
      deepGet(Array.isArray(generic0) ? generic0[0] : undefined, "text") ??
      deepGet(Array.isArray(resultGeneric0) ? resultGeneric0[0] : undefined, "text");

    if (text) return String(text);
  }

  // ── Universal fallback: walk common structures ───────────────
  if (typeof data === "string") return data;

  if (data != null && typeof data === "object") {
    for (const val of Object.values(data as Record<string, unknown>)) {
      if (typeof val === "string" && val.length > 20) return val;
      const nested = deepGet(val, "text") ?? deepGet(deepGet(val, "generic"), "0", "text");
      if (nested && typeof nested === "string") return nested;
    }
  }

  throw new Error(
    "Could not extract recipe text from the IBM Orchestrate response. " +
      "Check IBM_ORCHESTRATE_CALL_PATTERN in your .env.local and verify the agent endpoint."
  );
}

// ─────────────────────────────────────────────────────────────
// Watson Assistant v2 — session + message flow
// ─────────────────────────────────────────────────────────────

async function callViaAssistant(
  baseUrl: string,
  token: string,
  agentId: string,
  prompt: string
): Promise<string> {
  // Step 1: Create a session
  const sessionRes = await fetch(
    `${baseUrl}/v2/assistants/${agentId}/sessions`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    }
  );

  if (!sessionRes.ok) {
    const body = await sessionRes.text();
    throw new Error(`Session creation failed (${sessionRes.status}): ${body}`);
  }

  const { session_id } = (await sessionRes.json()) as { session_id: string };

  // Step 2: Send message
  const msgRes = await fetch(
    `${baseUrl}/v2/assistants/${agentId}/sessions/${session_id}/message`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: {
          message_type: "text",
          text: prompt,
        },
      }),
    }
  );

  if (!msgRes.ok) {
    const body = await msgRes.text();
    throw new Error(`Assistant message failed (${msgRes.status}): ${body}`);
  }

  const data = await msgRes.json();
  return extractRecipeText(data, "assistant");
}

// ─────────────────────────────────────────────────────────────
// watsonx Orchestrate /v1/orchestrate/runs flow
// ─────────────────────────────────────────────────────────────

interface RunInitResponse {
  thread_id: string;
  run_id: string;
  status?: string;
  detail?: string;
}

interface RunStatusResponse {
  id: string;
  status: "queued" | "running" | "in_progress" | "completed" | "failed" | "cancelled";
  error?: string | { message?: string };
}

interface MessageContentItem {
  type?: string;
  response_type?: string;
  text?: string;
}

interface ThreadMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string | MessageContentItem[];
  created_on?: string;
}

async function callViaOrchestrateRuns(
  baseUrl: string,
  token: string,
  agentId: string,
  agentEnvId: string,
  prompt: string
): Promise<string> {
  const runPayload: Record<string, unknown> = {
    agent_id: agentId,
    message: {
      role: "user",
      content: prompt,
    },
  };

  if (agentEnvId) {
    runPayload.agent_environment_id = agentEnvId;
  }

  const res = await fetch(`${baseUrl}/v1/orchestrate/runs`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(runPayload),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`IBM Orchestrate run initiation failed (${res.status}): ${errBody}`);
  }

  const runData = (await res.json()) as RunInitResponse;
  const { thread_id, run_id } = runData;

  if (!thread_id || !run_id) {
    throw new Error("IBM Orchestrate did not return thread_id or run_id.");
  }

  // Poll for run completion (up to 50s timeout)
  const startTime = Date.now();
  const maxWaitMs = 50000;
  let runStatus: string = "running";

  while (runStatus === "running" || runStatus === "queued" || runStatus === "in_progress") {
    if (Date.now() - startTime > maxWaitMs) {
      throw new Error("Timed out waiting for IBM Orchestrate agent to complete.");
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const pollRes = await fetch(`${baseUrl}/v1/orchestrate/runs/${run_id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    if (!pollRes.ok) {
      const errBody = await pollRes.text();
      throw new Error(`IBM Orchestrate run polling failed (${pollRes.status}): ${errBody}`);
    }

    const pollData = (await pollRes.json()) as RunStatusResponse;
    runStatus = pollData.status;

    if (runStatus === "failed" || runStatus === "cancelled") {
      const errMsg =
        typeof pollData.error === "string"
          ? pollData.error
          : pollData.error?.message || `Run ended with status: ${runStatus}`;
      throw new Error(`IBM Orchestrate agent run failed: ${errMsg}`);
    }
  }

  // Fetch resulting thread messages
  const msgRes = await fetch(`${baseUrl}/v1/orchestrate/threads/${thread_id}/messages`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  if (!msgRes.ok) {
    const errBody = await msgRes.text();
    throw new Error(`Failed to fetch thread messages (${msgRes.status}): ${errBody}`);
  }

  const messages = (await msgRes.json()) as ThreadMessage[];
  const assistantMsgs = messages.filter((m) => m.role === "assistant");

  if (assistantMsgs.length === 0) {
    throw new Error("No response message received from the agent.");
  }

  const lastMsg = assistantMsgs[assistantMsgs.length - 1];

  if (Array.isArray(lastMsg.content)) {
    const textPieces = lastMsg.content
      .map((item) => (typeof item === "string" ? item : item.text || ""))
      .filter((t) => t.trim().length > 0);

    if (textPieces.length > 0) {
      return textPieces.join("\n\n");
    }
  } else if (typeof lastMsg.content === "string" && lastMsg.content.trim().length > 0) {
    return lastMsg.content;
  }

  return extractRecipeText(lastMsg, "chat");
}

// ─────────────────────────────────────────────────────────────
// POST /api/recipe — main handler
// ─────────────────────────────────────────────────────────────

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // ── Parse & validate request body ──────────────────────────
    const body = (await request.json()) as {
      ingredients?: Ingredient[];
      preferences?: Preferences;
    };

    const { ingredients, preferences } = body;

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return NextResponse.json(
        { error: "At least one ingredient is required." },
        { status: 400 }
      );
    }

    if (!preferences || typeof preferences !== "object") {
      return NextResponse.json(
        { error: "Preferences object is required." },
        { status: 400 }
      );
    }

    // ── Check for Mock AI mode ──────────────────────────────────
    if (process.env.ENABLE_MOCK_AI === "true") {
      const ingList = ingredients.map((i) => i.label).join(", ");
      const recipe =
        `**Sourced from the Recipe Knowledge Base: Quick Pantry Stir-Fry**\n\n` +
        `**Ingredients you have**\n` +
        ingredients.map((i) => `- ${i.label}`).join("\n") +
        `\n\n**Missing ingredients**\n` +
        `- Optional cooking oil or salt for seasoning\n\n` +
        `**Step-by-step instructions (≈15 minutes total)**\n\n` +
        `1. **Prep (3 min)**: Clean and chop all fresh ingredients (${ingList}).\n` +
        `2. **Heat Pan (2 min)**: Heat 1 tbsp oil in a skillet or wok over medium-high heat.\n` +
        `3. **Cook & Combine (8 min)**: Add the ingredients in order of density, stirring continuously.\n` +
        `4. **Season & Serve (2 min)**: Season with salt or pepper to taste and serve warm.\n\n` +
        `**Tips & shortcuts**\n` +
        `- Serve hot for best flavor and texture.\n` +
        `- Store any leftovers in an airtight container for up to 2 days.`;

      return NextResponse.json({ recipe });
    }

    // ── Read server-only env vars ───────────────────────────────
    const apiKey      = requireEnv("IBM_ORCHESTRATE_API_KEY");
    const baseUrl     = requireEnv("IBM_ORCHESTRATE_BASE_URL");
    const agentId     = requireEnv("IBM_ORCHESTRATE_AGENT_ID");
    const agentEnvId  = process.env.IBM_ORCHESTRATE_AGENT_ENV_ID ?? "";
    const callPattern = process.env.IBM_ORCHESTRATE_CALL_PATTERN ?? "orchestrate";

    // ── Exchange API key for IAM bearer token ───────────────────
    const token = await getIAMToken(apiKey);

    // ── Build natural-language prompt ───────────────────────────
    const prompt = buildPrompt(ingredients, preferences);

    // ── Call the IBM agent ──────────────────────────────────────
    let recipe: string;

    if (callPattern === "assistant") {
      recipe = await callViaAssistant(baseUrl, token, agentId, prompt);
    } else {
      // Default: watsonx Orchestrate Runs API
      recipe = await callViaOrchestrateRuns(
        baseUrl,
        token,
        agentId,
        agentEnvId,
        prompt
      );
    }

    return NextResponse.json({ recipe });
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "An unexpected error occurred while generating your recipe.";

    // Log server-side for debugging (never includes token values)
    console.error("[/api/recipe] Error:", message);

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
