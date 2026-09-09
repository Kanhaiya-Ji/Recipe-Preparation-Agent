# Recipe Preparation Agent — Web Application

A modern, mobile-responsive AI-powered cooking assistant built with **Next.js 14**, **Tailwind CSS**, and **IBM watsonx Orchestrate**. Add ingredients from your pantry, set dietary preferences, and receive complete, structured recipes — reducing food waste one meal at a time.

---

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 18.x or 20.x |
| npm | 9.x + |
| IBM watsonx Orchestrate account | Active instance with a deployed Recipe agent |

---

## Setup

```bash
# 1. Navigate to the web directory
cd web

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local
# Open .env.local and fill in your IBM credentials (see table below)

# 4. Start the development server
npm run dev
```

The app will be available at **http://localhost:3000**.

---

## Environment Variables

Copy [`web/.env.example`](.env.example) to `web/.env.local` and fill in:

| Variable | Required | Description |
|----------|----------|-------------|
| `IBM_ORCHESTRATE_BASE_URL` | ✅ | Full API base URL — `https://api.<region>.watson-orchestrate.cloud.ibm.com/instances/<id>` |
| `IBM_ORCHESTRATE_API_KEY` | ✅ | IBM Cloud IAM API Key (from IBM Cloud → Manage → Access → API keys) |
| `IBM_ORCHESTRATE_AGENT_ID` | ✅ | Agent ID from watsonx Orchestrate → Agent settings |
| `IBM_ORCHESTRATE_ENVIRONMENT` | ✅ | `live` or `draft` |
| `IBM_ORCHESTRATE_AGENT_ENV_ID` | ⬜ | Agent Environment ID (from the embedded chat script) |
| `IBM_ORCHESTRATE_CALL_PATTERN` | ⬜ | `chat` (default) or `assistant` — see API Patterns below |
| `NEXT_PUBLIC_APP_NAME` | ⬜ | Display name (default: `Recipe Preparation Agent`) |

> **Security:** IBM credentials are server-only. None are prefixed with `NEXT_PUBLIC_` and none reach the browser. The client only ever calls the relative path `/api/recipe`.

---

## API Patterns

The backend route supports two IBM calling strategies toggled via `IBM_ORCHESTRATE_CALL_PATTERN`:

### `chat` (default — watsonx Orchestrate)
```
POST {IBM_ORCHESTRATE_BASE_URL}/v1/chat
Authorization: Bearer {IAM_TOKEN}
Body: { agent_id, environment, input: { text }, context }
```

### `assistant` (Watson Assistant v2)
```
POST {IBM_ORCHESTRATE_BASE_URL}/v2/assistants/{agent_id}/sessions  → get session_id
POST {IBM_ORCHESTRATE_BASE_URL}/v2/assistants/{agent_id}/sessions/{session_id}/message
Authorization: Bearer {IAM_TOKEN}
```

Switch between patterns by setting `IBM_ORCHESTRATE_CALL_PATTERN=assistant` in `.env.local`.

---

## Architecture

```
Browser                     Next.js Server              IBM Cloud
──────────────────────────  ──────────────────────────  ──────────────────────
PantryInput                 POST /api/recipe             IAM Token Service
PreferencesPanel  ──────►   ├─ Validate inputs          iam.cloud.ibm.com
ChatInterface               ├─ Read process.env.*
                            ├─ Exchange API Key          watsonx Orchestrate
                            │  for IAM token    ──────►  RAG Recipe Agent
                            ├─ Build prompt              └─ Recipe KB
                            ├─ Call IBM agent   ◄──────  Recipe text JSON
◄───── JSON { recipe }      └─ Return recipe
```

> IBM credentials never leave the server. The browser only sends ingredients and preferences to `/api/recipe` and receives the recipe text back.

---

## Project Structure

```
web/
├── src/
│   ├── app/
│   │   ├── api/recipe/route.ts   # Secure IBM proxy (server-only)
│   │   ├── page.tsx              # Main page + state
│   │   ├── layout.tsx            # Root layout
│   │   └── globals.css           # Tailwind + animations
│   ├── components/
│   │   ├── ui/                   # Button, Chip, Toggle, Card, Spinner
│   │   ├── PantryInput.tsx       # Ingredient chip input
│   │   ├── PreferencesPanel.tsx  # Dietary toggles + time selector
│   │   ├── ChatInterface.tsx     # Chat thread display
│   │   └── RecipeCard.tsx        # Structured recipe renderer + parser
│   └── types/index.ts            # Shared TypeScript types
├── tailwind.config.ts            # Culinary theme (sage, amber, cream)
├── .env.example                  # Variable template (commit this)
└── .env.local                    # Your real secrets (never commit)
```

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint check |

---

## Deployment

### Vercel (recommended)
1. Push the `web/` directory (or the full repo with `web/` as the root).
2. In Vercel → Settings → Environment Variables, add all `IBM_ORCHESTRATE_*` variables.
3. Deploy. Vercel automatically handles Next.js App Router.

### Self-hosted
```bash
npm run build
npm run start
```

Set all environment variables on the host before starting.

---

*Powered by IBM watsonx Orchestrate · Built with Next.js + Tailwind CSS*
