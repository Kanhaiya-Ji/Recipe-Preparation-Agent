"use client";

import React from "react";
import {
  ChefHat,
  ListChecks,
  Lightbulb,
  RefreshCcw,
  Leaf,
} from "lucide-react";
import type { ParsedRecipe } from "@/types";

// ─────────────────────────────────────────────────────────────
// Parser: tries to extract structured sections from agent text.
// Falls back gracefully — all sections are optional.
// ─────────────────────────────────────────────────────────────

const SECTION_PATTERNS: Record<keyof Omit<ParsedRecipe, "raw" | "title">, RegExp[]> = {
  ingredientsUsed: [
    /(?:^|\n)\s*#{0,3}\s*\*{0,2}ingredients(?: you have| used| needed)?:?\*{0,2}/i,
    /🧑‍🍳\s*ingredients/i,
  ],
  steps: [
    /(?:^|\n)\s*#{0,3}\s*\*{0,2}(?:step[\u2011\u002d]by[\u2011\u002d]step(?: instructions)?(?:\s*\(.*?\))?|instructions|steps|method|directions|how to (?:make|cook|prepare)):?\*{0,2}/i,
    /📋\s*steps/i,
  ],
  substitutions: [
    /(?:^|\n)\s*#{0,3}\s*\*{0,2}(?:what you[’']?re missing|missing ingredients|substitutions?|alternatives?):?\*{0,2}/i,
    /🔄\s*substitutions?/i,
  ],
  tips: [
    /(?:^|\n)\s*#{0,3}\s*\*{0,2}(?:tips?(?:\s*(?:&|and)\s*shortcuts)?|notes?|suggestions?|chef'?s?\s+notes?|practical cooking):?\*{0,2}/i,
    /💡\s*tips?/i,
  ],
};

/** Strip leading markdown bullets, bold markers */
function cleanLine(line: string): string {
  return line
    .replace(/^\s*[-*•]\s+/, "")
    .replace(/^\s*#+\s*/, "")
    .replace(/\s*#+\s*.*$/, "")
    .replace(/\*\*/g, "")
    .trim();
}

function splitListBlock(block: string, isSteps = false): string[] {
  const rawLines = block.split(/\n/).map((l) => l.trim()).filter(Boolean);

  if (isSteps) {
    const steps: string[] = [];
    let currentStep = "";

    for (const line of rawLines) {
      if (/^\d+[.)]/.test(line)) {
        if (currentStep) steps.push(currentStep);
        currentStep = line.replace(/^\d+[.)]\s*/, "").replace(/\*\*/g, "").trim();
      } else if (line.startsWith("-") || line.startsWith("*") || line.startsWith("•")) {
        const sub = line.replace(/^[-*•]\s*/, "").replace(/\*\*/g, "").trim();
        currentStep = currentStep ? `${currentStep} — ${sub}` : sub;
      } else if (!line.startsWith("|") && !line.startsWith("---")) {
        currentStep = currentStep ? `${currentStep} ${cleanLine(line)}` : cleanLine(line);
      }
    }
    if (currentStep) steps.push(currentStep);
    return steps.length > 0 ? steps : rawLines.map(cleanLine).filter(Boolean);
  }

  // Substitutions / Tips / Ingredients — also parse table rows if present
  const items: string[] = [];
  for (const line of rawLines) {
    if (/^\|[-:\s|]+\|$/.test(line)) continue; // skip markdown table delimiter row
    if (line.startsWith("|") && line.endsWith("|")) {
      const cells = line
        .split("|")
        .map((c) => c.trim())
        .filter(Boolean);
      if (cells.length > 0 && !cells[0].toLowerCase().includes("ingredient") && !cells[0].toLowerCase().includes("item")) {
        items.push(cells.join(" — "));
        continue;
      } else if (cells.length > 0 && (cells[0].toLowerCase().includes("ingredient") || cells[0].toLowerCase().includes("item"))) {
        continue; // skip header row
      }
    }
    const cleaned = cleanLine(line);
    if (cleaned) items.push(cleaned);
  }

  return items.length > 0 ? items : rawLines.map(cleanLine).filter(Boolean);
}

export function parseRecipe(raw: string): ParsedRecipe {
  // Normalize inline section markers like "— *Possible ingredient substitutions" into "\n\n*Possible ingredient substitutions"
  const normalizedRaw = raw
    .replace(
      /\s*[\u2014\u2013\-\s]*\*+(?:Possible [Ii]ngredient [Ss]ubstitutions|Possible [Ss]ubstitutions|Missing [Ii]ngredients|Substitutions|What you[’']?re missing|Helpful [Cc]ooking [Tt]ips|Tips|Notes|Practical [Cc]ooking)/gi,
      (match) => "\n\n" + match.replace(/^[\u2014\u2013\-\s]+/, "")
    )
    .replace(
      /\s*[\u2014\u2013\-]+\s*(?:Possible [Ss]ubstitutions|Helpful [Cc]ooking [Tt]ips|Practical [Cc]ooking)/gi,
      (match) => "\n\n" + match.replace(/^[\u2014\u2013\-\s]+/, "")
    )
    .replace(
      /\s*[\u2014\u2013\-]+\s*(?:Prep\s*:\s*\d+|Cook\s*:\s*\d+|Total time\s*:)/gi,
      (match) => "\n" + match.replace(/^[\u2014\u2013\-\s]+/, "- ")
    );

  const result: ParsedRecipe = { raw: normalizedRaw };

  // Extract title — first markdown heading or first bold line
  const titleMatch =
    normalizedRaw.match(/^#{1,3}\s+(.+)/m) ??
    normalizedRaw.match(/^\*{2}(.+?)\*{2}/m) ??
    normalizedRaw.match(/^\*([^*]+)\*/m);

  if (titleMatch) {
    result.title = titleMatch[1]
      .replace(/^Sourced from the (?:Recipe )?Knowledge Base:\s*/i, "")
      .trim();
  }

  // Find section boundaries
  type SectionKey = keyof Omit<ParsedRecipe, "raw" | "title">;
  const sectionKeys = Object.keys(SECTION_PATTERNS) as SectionKey[];

  interface Boundary {
    key: SectionKey;
    start: number;
  }
  const boundaries: Boundary[] = [];

  for (const key of sectionKeys) {
    for (const pattern of SECTION_PATTERNS[key]) {
      const match = pattern.exec(normalizedRaw);
      if (match) {
        boundaries.push({ key, start: match.index });
        break; // first matching pattern wins per section
      }
    }
  }

  // Sort by position in text
  boundaries.sort((a, b) => a.start - b.start);

  for (let i = 0; i < boundaries.length; i++) {
    const { key, start } = boundaries[i];
    const end = boundaries[i + 1]?.start ?? normalizedRaw.length;
    // Grab text after the header line
    const headerEnd = normalizedRaw.indexOf("\n", start);
    if (headerEnd === -1) continue;
    const block = normalizedRaw.slice(headerEnd + 1, end);
    result[key] = splitListBlock(block, key === "steps");
  }

  return result;
}

/** True if the parsed result has at least one structured section */
export function hasStructuredContent(p: ParsedRecipe): boolean {
  return (
    (p.ingredientsUsed?.length ?? 0) > 0 ||
    (p.steps?.length ?? 0) > 0 ||
    (p.substitutions?.length ?? 0) > 0 ||
    (p.tips?.length ?? 0) > 0
  );
}

// ─────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────

interface SectionProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

function Section({ icon, title, children }: SectionProps) {
  return (
    <div className="mb-5 last:mb-0">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sage-500" aria-hidden="true">{icon}</span>
        <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">{title}</h3>
      </div>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// RecipeCard — structured display
// ─────────────────────────────────────────────────────────────

interface RecipeCardProps {
  raw: string;
}

export function RecipeCard({ raw }: RecipeCardProps) {
  const parsed = parseRecipe(raw);

  // Fall back to raw markdown bubble if no structure found
  if (!hasStructuredContent(parsed)) {
    return (
      <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
        {raw}
      </div>
    );
  }

  return (
    <div className="animate-slide-up pb-2">
      {/* Title */}
      {parsed.title && (
        <div className="flex items-center gap-2 mb-5 pb-4 border-b border-cream-200">
          <ChefHat size={20} className="text-amber-500" aria-hidden="true" />
          <h2 className="text-lg font-bold text-gray-800">{parsed.title}</h2>
        </div>
      )}

      {/* Ingredients Used */}
      {parsed.ingredientsUsed && parsed.ingredientsUsed.length > 0 && (
        <Section icon={<Leaf size={16} />} title="Ingredients Used">
          <ul className="flex flex-wrap gap-2">
            {parsed.ingredientsUsed.map((ing, i) => (
              <li
                key={i}
                className="px-3 py-1 bg-sage-50 border border-sage-200 text-sage-800 rounded-full text-sm"
              >
                {ing}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Steps */}
      {parsed.steps && parsed.steps.length > 0 && (
        <Section icon={<ListChecks size={16} />} title="Instructions">
          <ol className="space-y-2.5">
            {parsed.steps.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm text-gray-700 leading-relaxed">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-700 font-bold text-xs flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </Section>
      )}

      {/* Substitutions */}
      {parsed.substitutions && parsed.substitutions.length > 0 && (
        <Section icon={<RefreshCcw size={16} />} title="Substitutions">
          <ul className="space-y-1.5">
            {parsed.substitutions.map((sub, i) => (
              <li key={i} className="text-sm text-gray-700 flex gap-2">
                <span className="text-amber-400 mt-0.5 flex-shrink-0">→</span>
                <span>{sub}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Tips */}
      {parsed.tips && parsed.tips.length > 0 && (
        <Section icon={<Lightbulb size={16} />} title="Tips">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 space-y-1.5">
            {parsed.tips.map((tip, i) => (
              <p key={i} className="text-sm text-amber-900">
                {tip}
              </p>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}
