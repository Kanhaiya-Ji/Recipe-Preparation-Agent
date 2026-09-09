# 🍳 Recipe Preparation Agent

An intelligent, AI-powered culinary assistant and meal planning application powered by **IBM watsonx Orchestrate**, **Next.js 14**, and **Tailwind CSS**. 

Enter what ingredients you have in your pantry, configure your dietary restrictions (vegan, keto, halal, gluten-free, etc.), cooking time, and skill level, and receive delicious, structured recipes step-by-step.

---

## 🌟 Key Features

- 🥗 **Pantry-to-Plate Generation**: Input pantry ingredients to get instant recipe recommendations minimizing food waste.
- ⚡ **Dietary & Lifestyle Filters**: Support for Vegetarian, Vegan, Gluten-Free, Dairy-Free, Keto, Halal, Kosher, Nut-Free, Low-Carb, High-Protein, and Quick Meal filters.
- 👨‍🍳 **Interactive Cook Mode**: Full-screen step-by-step cooking guide with built-in timer, progress tracking, and voice support.
- 💬 **Interactive Culinary Chat**: Ask follow-up questions, request substitutions, or ask for culinary tips in real time.
- 🔒 **Secure Architecture**: Server-side proxy for IBM watsonx Orchestrate credentials ensuring IAM keys and agent IDs are never leaked to client browsers.
- 📱 **Responsive & Accessible**: Modern, elegant culinary aesthetic optimized for mobile, tablet, and desktop screens.

---

## 🏗️ Project Architecture

```
Browser (Client)                Next.js App Server (API Proxy)           IBM Cloud
─────────────────────────────   ───────────────────────────────   ──────────────────────
• PantryInput                   POST /api/recipe                  • IAM Token Service
• PreferencesPanel    ──────►   ├─ Validate user input            • watsonx Orchestrate
• ChatInterface                 ├─ Secure IAM authentication ──►  • RAG Recipe Agent
• CookModeModal                 ├─ Call Recipe Agent API    ◄───  • Recipe Knowledge Base
                                └─ Return parsed recipe JSON
◄────────────────────────────
```

---

## 📁 Repository Structure

```
.
├── web/                       # Next.js 14 frontend & backend proxy
│   ├── src/
│   │   ├── app/               # Next.js App Router (pages & API routes)
│   │   │   ├── api/recipe/    # IBM watsonx Orchestrate proxy endpoint
│   │   │   ├── globals.css    # Global styling & Tailwind CSS
│   │   │   └── page.tsx       # Main recipe application
│   │   ├── components/        # React components (ChatInterface, PantryInput, CookMode, etc.)
│   │   ├── data/              # Curated starter cookbook & sample recipes
│   │   └── types/             # TypeScript interfaces
│   ├── .env.example           # Frontend environment template
│   └── package.json           # Dependencies and scripts
├── agents/                    # IBM watsonx Orchestrate agent definitions
├── tools/                     # Agent tools and integrations
├── toolkits/                  # Agent toolkits
├── knowledge-bases/           # Knowledge base configurations
├── models/                    # Model definitions
├── connections/               # External service connections
├── workspace_config.yaml      # watsonx Orchestrate workspace config
├── env.example                # Root environment template
└── README.md
```

---

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/Kanhaiya-Ji/Recipe-Preparation-Agent.git
cd Recipe-Preparation-Agent
```

### 2. Navigate to the web application
```bash
cd web
npm install
```

### 3. Setup Environment Variables
```bash
cp .env.example .env.local
```

Edit `.env.local` with your IBM watsonx Orchestrate credentials:
```env
IBM_ORCHESTRATE_BASE_URL=https://api.<region>.watson-orchestrate.cloud.ibm.com/instances/<instance-id>
IBM_ORCHESTRATE_API_KEY=your_iam_api_key_here
IBM_ORCHESTRATE_AGENT_ID=your_agent_id_here
IBM_ORCHESTRATE_ENVIRONMENT=live
```

### 4. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛡️ Security & Privacy

- All API keys and secrets are loaded exclusively server-side in API routes.
- Real `.env` and `.env.local` files are ignored via `.gitignore` to prevent accidental credential leakage.

---

## 📜 License

This project is licensed under the MIT License.
