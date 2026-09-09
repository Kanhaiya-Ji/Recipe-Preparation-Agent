# Recipe Preparation Agent — Web Application Plan

## Top-Level Overview

**Goal:** Build a complete, production-ready Next.js web application (App Router) with Tailwind CSS that provides a beautiful culinary UI for the IBM watsonx Orchestrate-powered Recipe Preparation RAG agent. The app allows users to input pantry ingredients as chips, select dietary preferences, and receive structured recipe responses via a secure server-side API route that proxies all IBM credentials.

**Scope:**
- New Next.js 14+ (App Router) project scaffolded inside a `web/` subdirectory of this workspace.
- Tailwind CSS with a warm culinary palette (sage green, warm orange, soft white/cream).
- Three core UI components: PantryInput, PreferencesPanel, ChatInterface.
- One secure Next.js API route (`/api/recipe`) that calls IBM watsonx Orchestrate server-side.
- A `.env.example` file specific to the Recipe Agent project.
- No credentials or IBM API calls exposed to the browser.

**Non-goals:**
- Not modifying existing ADK workspace files (agents/, tools/, etc.).
- Not adding authentication/user accounts.
- Not adding a database layer.

**Confirmed Design Decisions:**
- Project lives inside `web/` subdirectory of this workspace (monorepo-style).
- ChatInterface attempts RecipeCard structured parsing first; falls back to a raw markdown bubble if headers are not detected.
- Backend API route supports two IBM call patterns toggled by `IBM_ORCHESTRATE_CALL_PATTERN` env var: `"chat"` (watsonx Orchestrate `/v1/chat`) or `"assistant"` (Watson Assistant v2 `/v2/assistants/{id}/sessions` + message). Defaults to `"chat"`.

**Approach:** Scaffold a Next.js app inside `web/`, implement components bottom-up (design tokens → shared UI → feature components → page), then wire the API route.

---

## Sub-Tasks

---

### Sub-Task 1 — Project Scaffolding & Configuration

**Intent:** Create the Next.js + Tailwind project skeleton with the correct package.json, config files, and directory structure so every subsequent sub-task has a stable foundation to build on.

**Expected Outcomes:**
- `web/` directory exists with a valid Next.js 14 App Router project.
- Tailwind CSS is configured with a custom culinary theme (colors, fonts).
- `web/.env.example` lists all required environment variables with comments.
- `web/next.config.js` has no client-side exposure of secrets.
- `web/tsconfig.json` set up for strict TypeScript.

**Todo List:**
1. Create `web/package.json` with dependencies: `next`, `react`, `react-dom`, `tailwindcss`, `postcss`, `autoprefixer`, `typescript`, `@types/react`, `@types/node`, `lucide-react`.
2. Create `web/tsconfig.json` (strict mode, App Router path aliases `@/*`).
3. Create `web/next.config.js` — ensure no `env:` block leaks secrets; `serverExternalPackages` if needed.
4. Create `web/tailwind.config.ts` with custom theme extending colors: `sage`, `amber`, `cream`; font family `inter`.
5. Create `web/postcss.config.js`.
6. Create `web/src/app/globals.css` importing Tailwind base/components/utilities + Google Font Inter.
7. Create `web/src/app/layout.tsx` — root layout with metadata, font, and global styles.
8. Create `web/.env.example` with all required variables and inline comments (see Relevant Context).

**Relevant Context:**
- Mirror variable naming from root `env.example`: `IBM_ORCHESTRATE_BASE_URL`, `IBM_ORCHESTRATE_API_KEY`, `IBM_ORCHESTRATE_AGENT_ID`, `IBM_ORCHESTRATE_AGENT_VERSION`, `IBM_ORCHESTRATE_ENVIRONMENT`, `IBM_ORCHESTRATE_AGENT_ENV_ID`.
- Add `NEXT_PUBLIC_APP_NAME` and `NODE_ENV` for app-level config.
- Do NOT prefix IBM variables with `NEXT_PUBLIC_` — they must stay server-only.
- Tailwind palette reference: sage = `#7C9A6E`, amber/orange = `#E8834E`, cream = `#FDF6EC`.

**Status:** [ ] pending

---

### Sub-Task 2 — Shared UI Primitives

**Intent:** Build the small, reusable Tailwind-styled components (Button, Badge/Chip, Toggle, Card, Spinner) that the feature components will compose. Establishing these first avoids duplication and enforces visual consistency.

**Expected Outcomes:**
- `web/src/components/ui/` directory with: `Button.tsx`, `Chip.tsx`, `Toggle.tsx`, `Card.tsx`, `Spinner.tsx`.
- Each component accepts standard HTML props plus a `variant`/`size` prop where appropriate.
- All components are fully typed with TypeScript interfaces.
- Visual style matches the warm culinary theme from Sub-Task 1.

**Todo List:**
1. Create `web/src/components/ui/Button.tsx` — variants: `primary` (amber fill), `secondary` (sage outline), `ghost`.
2. Create `web/src/components/ui/Chip.tsx` — ingredient tag with label + ✕ dismiss button; `active` and `default` states.
3. Create `web/src/components/ui/Toggle.tsx` — styled checkbox-as-pill toggle for dietary preferences.
4. Create `web/src/components/ui/Card.tsx` — cream-background card with optional header slot and subtle shadow.
5. Create `web/src/components/ui/Spinner.tsx` — animated SVG/CSS spinner in sage color with size variants.
6. Create `web/src/components/ui/index.ts` — barrel export for all UI primitives.

**Relevant Context:**
- Use Tailwind `group`, `peer`, and `transition` utilities for interactive states.
- Chip component will be used by PantryInput (Sub-Task 3); Toggle by PreferencesPanel (Sub-Task 3).
- Spinner will be used in the API loading state (Sub-Task 4).

**Status:** [ ] pending

---

### Sub-Task 3 — Feature Components: PantryInput & PreferencesPanel

**Intent:** Implement the two user-input feature components. PantryInput handles the dynamic ingredient chip UX. PreferencesPanel renders dietary restriction toggles and a cooking time selector. Together they form the left/top panel of the main page.

**Expected Outcomes:**
- `web/src/components/PantryInput.tsx` — text field that adds ingredients as Chip components on Enter/comma; chips are removable; empty-state prompt shown when no ingredients are added.
- `web/src/components/PreferencesPanel.tsx` — Toggle rows for: Vegan, Vegetarian, Gluten-Free, Dairy-Free, Keto, Nut-Free; a `<select>` for cooking time (15 min, 30 min, 45 min, 60 min, No limit).
- Both components are fully controlled via props (ingredients array + setter, preferences object + setter) so state lives in the parent page.
- Fully responsive (stack vertically on mobile, side-by-side on md+).

**Todo List:**
1. Create `web/src/types/index.ts` — define `Ingredient`, `Preferences`, `RecipeMessage` TypeScript types.
2. Create `web/src/components/PantryInput.tsx` — controlled input, `onAdd`/`onRemove` callbacks, renders `Chip` list, handles Enter and comma key events, trims whitespace, prevents duplicate ingredients.
3. Create `web/src/components/PreferencesPanel.tsx` — renders dietary `Toggle` grid plus cooking-time `<select>`, emits `onPreferencesChange` callback.
4. Create `web/src/components/index.ts` — barrel export.

**Relevant Context:**
- `Preferences` type: `{ vegan, vegetarian, glutenFree, dairyFree, keto, nutFree: boolean; maxCookingTime: string }`.
- `Ingredient` type: `{ id: string; label: string }` — use `crypto.randomUUID()` for id.
- State management stays in `web/src/app/page.tsx` (Sub-Task 5) via `useState`.
- Mobile: PantryInput is full-width below PreferencesPanel on small screens.

**Status:** [ ] pending

---

### Sub-Task 4 — Feature Component: ChatInterface & Recipe Card

**Intent:** Build the chat/result display area. This component renders a conversation thread where each assistant message is displayed as a structured Recipe Card with sections for ingredients used, step-by-step instructions, substitutions, and tips. User messages appear as simple bubbles. A loading state shows the Spinner with an appetizing micro-copy message.

**Expected Outcomes:**
- `web/src/components/ChatInterface.tsx` — renders an array of `RecipeMessage` objects; scrolls to latest message; shows loading skeleton/spinner while awaiting response.
- `web/src/components/RecipeCard.tsx` — parses the agent's markdown/text response and renders structured sections: "Ingredients Used", "Steps", "Substitutions & Tips"; uses icons from `lucide-react`.
- Empty-state illustration/prompt when no messages exist yet.
- Streaming-ready: can accept a `isLoading` prop to show intermediate state.

**Todo List:**
1. Create `web/src/components/RecipeCard.tsx` — receives raw text response, parses it into sections using simple string splitting on known headers (e.g. `**Steps:**`, `**Substitutions:**`); renders each section with styled headers, numbered lists, and tip call-out boxes.
2. Create `web/src/components/ChatInterface.tsx` — maps `RecipeMessage[]` to user bubbles and `RecipeCard` components; auto-scrolls via `useEffect` + `useRef`; renders `Spinner` + loading message when `isLoading=true`; renders SVG empty-state when messages array is empty.
3. Update `web/src/components/index.ts` barrel export.

**Relevant Context:**
- `RecipeMessage` type: `{ id: string; role: 'user' | 'assistant'; content: string; timestamp: Date }`.
- The IBM Orchestrate agent returns plain text or markdown — RecipeCard must be resilient to varied response formats (don't assume fixed delimiters always exist; fall back to rendering raw text).
- Use `lucide-react` icons: `ChefHat`, `Clock`, `Leaf`, `Lightbulb`, `ListChecks` for section headers.
- `useRef` scroll target at bottom of message list.

**Status:** [ ] pending

---

### Sub-Task 5 — Main Page Assembly & State Orchestration

**Intent:** Compose all feature components onto the main `page.tsx`, wire up shared state (ingredients, preferences, messages), implement the `handleSubmit` function that calls the Next.js API route, and ensure the layout is fully responsive.

**Expected Outcomes:**
- `web/src/app/page.tsx` renders a two-column layout (input panel left, chat right) on desktop; single-column stacked on mobile.
- Submit button triggers `POST /api/recipe`, sets `isLoading`, appends the user message and assistant response to the messages array.
- Error states display an inline error chip/toast.
- Page has a branded header with the app name, a leaf/chef icon, and a tagline.

**Todo List:**
1. Implement `web/src/app/page.tsx` with `useState` for `ingredients`, `preferences`, `messages`, `isLoading`, `error`.
2. Implement `handleSubmit` async function: validates at least 1 ingredient is present, appends user message, calls `fetch('/api/recipe', { method: 'POST', body: JSON.stringify({ingredients, preferences}) })`, appends assistant response on success, sets error on failure.
3. Render page layout: sticky header → two-panel grid → submit button row.
4. Add inline error display below the submit button.
5. Ensure `min-h-screen` background uses cream color and the layout is responsive via Tailwind `md:grid-cols-2` breakpoint.

**Relevant Context:**
- The `fetch` call goes to the relative path `/api/recipe` — never to IBM directly.
- Optimistic UX: append the user's ingredient list as a readable message immediately before the API resolves.
- The submit button should be disabled when `isLoading=true` or `ingredients.length === 0`.

**Status:** [ ] pending

---

### Sub-Task 6 — Secure Backend API Route

**Intent:** Implement the `POST /api/recipe` Next.js Route Handler that runs exclusively on the server. It reads IBM credentials from `process.env`, exchanges the API key for an IAM bearer token, constructs the agent chat payload from the user's ingredients and preferences, calls the IBM watsonx Orchestrate agent endpoint, and returns the recipe text to the client — never exposing credentials.

**Expected Outcomes:**
- `web/src/app/api/recipe/route.ts` exists and handles POST requests.
- IBM IAM token exchange (`https://iam.cloud.ibm.com/identity/token`) is performed server-side with the API key.
- The agent chat endpoint is called using the pattern from the existing `env.example`: `{IBM_ORCHESTRATE_BASE_URL}/v1/chat` with the correct headers and `agent_id` + `environment` in the body.
- Returns `{ recipe: string }` JSON to the client on success; returns `{ error: string }` with appropriate HTTP status on failure.
- All IBM env vars are accessed via `process.env.*` — none are in client-side code.

**Todo List:**
1. Create `web/src/app/api/recipe/route.ts` with exported `POST` async function.
2. Implement `getIAMToken(apiKey: string): Promise<string>` — POST to IAM token endpoint, return `access_token`.
3. Build prompt string from `ingredients[]` and `preferences` object: natural-language sentence like "I have: tomatoes, pasta, garlic. I am vegan. Max cooking time: 30 minutes. Suggest a recipe."
4. Build IBM Orchestrate request body: `{ agent_id, input: { text: prompt }, context: { global: { system: { user_id: "web-user" } } } }` — align with the IBM watsonx Orchestrate Chat API schema.
5. POST to `${IBM_ORCHESTRATE_BASE_URL}/v1/chat` with `Authorization: Bearer {token}` and `Content-Type: application/json`.
6. Extract recipe text from response (`output.generic[0].text` or similar path — add fallback extraction logic).
7. Return `NextResponse.json({ recipe })` on success; return `NextResponse.json({ error: message }, { status: 500 })` on failure.
8. Add validation: reject non-POST methods and empty ingredient lists at the route level.

**Relevant Context:**
- IAM token endpoint: `https://iam.cloud.ibm.com/identity/token` with body `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey={IBM_ORCHESTRATE_API_KEY}` and `Content-Type: application/x-www-form-urlencoded`.
- The existing `env.example` shows `IBM_ORCHESTRATE_AGENT_ENV_ID` is separate from `IBM_ORCHESTRATE_AGENT_ID` — include both in route logic.
- IBM Orchestrate Chat API response shape reference: check `output.generic` array or `result.output.text` depending on agent version; implement safe optional-chaining extraction.
- Never call `console.log` with token values in production code.

**Status:** [x] done

---

### Sub-Task 7 — Final Polish, Responsiveness & README

**Intent:** Add the finishing touches: loading animations, mobile layout audit, accessibility attributes, and a project README so the app is ready for use and deployment.

**Expected Outcomes:**
- CSS keyframe animations for the Spinner and a subtle "pulse" shimmer on the loading state in ChatInterface.
- `aria-label`, `aria-busy`, `role` attributes on interactive elements for accessibility.
- README at `web/README.md` covering: setup, environment variable configuration, `npm run dev`, and how the IBM Orchestrate integration works.
- `web/.env.example` finalized and confirmed correct for this project (Recipe Agent, not Interview Trainer).

**Todo List:**
1. Add `@keyframes` shimmer animation to `globals.css` for the chat loading state.
2. Audit all feature components for missing `aria-label` on icon-only buttons (Chip ✕, Submit).
3. Test layout at 375px viewport width mentally — ensure PantryInput chips wrap correctly, PreferencesPanel toggles don't overflow.
4. Write `web/README.md` with sections: Overview, Prerequisites, Setup, Environment Variables table, Running Locally, Architecture Notes.
5. Verify `web/.env.example` has no Interview Trainer references — update all comments to reflect Recipe Agent context.

**Relevant Context:**
- README should reference the architecture diagram in the plan (Mermaid) as a description, not embed it literally.
- Shimmer animation: `background: linear-gradient(90deg, cream, sage-light, cream)` animated via `background-position`.

**Status:** [ ] pending
