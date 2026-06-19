Read CLAUDE.md fully before writing any code.

## Task
Generate a boilerplate project for the LinkedIn Ghost Writer app with a working 
end-to-end post generation flow. This is the starting foundation — not the full 
app — so keep it clean, minimal, and production-ready.

---

## What to Build

### Frontend (Next.js 14 + TypeScript + Tailwind + shadcn/ui)

A single page at `/` with:
- A text area for the user to type their post topic or brief
- A tone selector (4 pills: Professional / Casual / Conversational / Viral-Hook Style)
- An OpenAI API key input field (for local testing — stored in useState only, never 
  persisted or sent to any third party)
- A "Generate Post" button
- A result area that displays the generated LinkedIn post
- A "Copy to Clipboard" button on the result
- Loading state while the API call is in progress
- Error state if the API call fails
- Dark/Light theme toggle using next-themes

Design rules:
- Use shadcn/ui components for all UI elements (Button, Input, Textarea, Card, Badge)
- Use Tailwind CSS for all styling
- Clean, minimal layout — centered card, max-w-2xl, good spacing
- Mobile responsive

### Backend (FastAPI + Python)

A single endpoint:
POST /generate/post
Request body:
{
  "topic": string,
  "tone": "professional" | "casual" | "conversational" | "viral-hook",
  "api_key": string
}

Response:
{
  "post": string
}

- Use the api_key from the request body to initialise the OpenAI client per request
- Use model gpt-4o
- Temperature 0.8, max_tokens 600
- System prompt must instruct the model to write a LinkedIn post that:
  - Hooks the reader in the first line (no "I" as the first word)
  - Uses short paragraphs (1-3 lines max)
  - Ends with a call to action or question
  - Matches the selected tone exactly
  - Does NOT use generic LinkedIn filler 
    ("Excited to share", "Humbled", "I am thrilled" etc.)
  - Does NOT include hashtags in the body
- Handle OpenAI errors gracefully and return a clear error message
- CORS enabled for localhost:3000

---

## Folder Structure to Generate

linkedin-ghostwriter/
├── frontend/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx           ← main UI
│   │   └── globals.css
│   ├── components/
│   │   ├── PostGenerator.tsx  ← main form component
│   │   └── ThemeToggle.tsx
│   ├── lib/
│   │   └── api.ts             ← axios call to backend
│   ├── package.json
│   ├── tailwind.config.ts
│   └── tsconfig.json
│
├── backend/
│   ├── main.py                ← FastAPI app + CORS
│   ├── routers/
│   │   └── generate.py        ← POST /generate/post
│   ├── services/
│   │   └── openai_service.py  ← all OpenAI logic
│   ├── models/
│   │   └── schemas.py         ← Pydantic models
│   └── requirements.txt
│
├── CLAUDE.md
└── README.md                  ← how to run locally

---

## README Must Include

Step by step commands to:
1. Install and run the frontend (npm install, npm run dev)
2. Install and run the backend (pip install, uvicorn)
3. How to use the API key input to test the app locally

---

## Rules
- No authentication in this boilerplate (that comes later)
- No Supabase in this boilerplate (that comes later)
- No .env file needed — API key is entered in the UI for now
- TypeScript strict mode — no `any` types
- All OpenAI calls must live in openai_service.py only
- Functional React components only
- Do not install any libraries outside the approved tech stack in CLAUDE.md
- Generate complete, working, copy-paste ready code for every file