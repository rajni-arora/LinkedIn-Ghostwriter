You are an expert full-stack software architect and technical writer. Your job is to generate a 
comprehensive CLAUDE.md file — a single source of truth for an AI coding assistant working on 
this codebase. The file must be so complete and unambiguous that Claude never needs to ask 
clarifying questions before writing code.

---

PROJECT: LinkedIn Ghost Writer
A SaaS tool that helps founders, marketers, solopreneurs, and agencies write high-performing 
LinkedIn posts using AI.

---

PAGES TO BUILD (3 total):

1. LOGIN & SIGNUP PAGE (/login, /signup)
   - Email/password auth + Google OAuth via Supabase
   - Forgot password (magic link)
   - Redirect to /persona on first login, /product on return logins
   - Inline Supabase error handling
   - Fully responsive

2. USER PERSONA PAGE (/persona)
   - Collect: name, headline, industry/niche, target audience, preferred tone(s), content 
     pillars (up to 5 tags), writing style notes, LinkedIn URL (optional)
   - Persona saved to Supabase (upsert, one row per user)
   - Loaded into PersonaContext and sent with every AI generation request
   - User can update anytime from settings

3. PRODUCT PAGE (/product) — Main dashboard with ALL of these features:
   - Post Generator: text input → AI generates LinkedIn post
   - Tone Selector: Professional / Casual / Conversational / Viral-Hook Style (pill UI)
   - Post from URL: scrape any URL → generate post from content
   - Refine Post: generate 2-3 variants of the current post
   - Virality Score Predictor: score out of 100 with colour badge + tips (re-scores on edit, 
     debounced 1.5s)
   - Emoji Suggestor: 6-10 contextual emojis, click to insert at cursor
   - Hashtag Recommender: 5-10 ranked hashtags, click to append, copy-all button
   - Dark/Light Theme Toggle: next-themes, persists in localStorage, default = system
   - Save Your Post: saves post + metadata to Supabase, shown in sidebar/drawer, soft-delete
   - Per-Post Analytics: user manually enters views, likes, comments, reposts + date posted; 
     displayed as charts with recharts

---

TECH STACK:

Frontend:
- Framework: Next.js 14 (App Router)
- Language: TypeScript (strict mode, no `any`)
- Styling: Tailwind CSS (no inline styles, no CSS modules except globals.css)
- UI Components: shadcn/ui only (no other component libraries)
- HTTP Client: Axios (all calls via lib/api.ts with auth interceptor)
- Auth: Supabase JS SDK (createBrowserClient / createServerClient)
- State: React useState / useContext
- Theme: next-themes

Backend:
- Runtime: Python 3.11+
- Framework: FastAPI (async handlers only)
- AI: OpenAI GPT-4o via openai SDK (all calls in services/openai_service.py only)
- URL Scraping: httpx + BeautifulSoup4
- Auth: Supabase service role JWT verification
- Data validation: Pydantic models for all request/response schemas

Infrastructure:
- Auth + DB: Supabase (PostgreSQL + RLS)
- Frontend hosting: Vercel
- Backend hosting: Railway or Render

---

ENVIRONMENT VARIABLES:

Frontend (.env.local):
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

Backend (.env):
OPENAI_API_KEY=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
ALLOWED_ORIGINS=https://your-app.vercel.app

---

INSTRUCTIONS FOR THE CLAUDE.md FILE:

Generate a CLAUDE.md that includes all of the following sections. Be exhaustive — do not 
leave anything vague or to interpretation:

1. PROJECT OVERVIEW — what the product does, who it's for, core value prop

2. TARGET USERS — list with context

3. TECH STACK TABLE — frontend and backend, every layer

4. ENVIRONMENT VARIABLES — both files, separated and labelled

5. FULL PROJECT FOLDER STRUCTURE — every directory and file, named and placed correctly 
   (components, pages, services, routers, context, lib, types, models)

6. PAGES & FEATURES — for each of the 3 pages:
   - Purpose
   - Every feature with UI behaviour, loading states, and error handling
   - Exact API endpoints it calls

7. DATABASE SCHEMA — full SQL for all tables with:
   - Correct column types and constraints
   - Foreign keys
   - Soft-delete pattern (deleted_at)
   - RLS enabled + example policies

8. API ENDPOINTS TABLE — method, path, description for every endpoint

9. OPENAI PROMPTING RULES — model to use, temperature per task type, max_tokens per call, 
   when to use json_object response format, and a concrete system prompt template for post 
   generation that uses the persona fields

10. AUTH FLOW — step-by-step: Supabase → frontend session → FastAPI JWT verification → 
    scoped DB queries

11. CODE STYLE & CONVENTIONS — TypeScript rules, component patterns, where API calls live, 
    naming conventions, Python async rules

12. V1 SCOPE BOUNDARIES — explicit "do NOT build" list to prevent scope creep

13. IMPORTANT RULES — a bullet list of non-negotiable behaviours (e.g. never auto-save, 
    always debounce virality re-score, never use service role key on frontend, always show 
    loading states)

14. LOCAL DEV SETUP — copy-paste commands to run frontend and backend locally

---

OUTPUT FORMAT:
- Output only the raw Markdown for the CLAUDE.md file
- Use headers (##, ###), tables, and code blocks where appropriate
- Be direct and precise — this file is read by an AI, not a human, so eliminate all 
  ambiguity
- Do not add any commentary before or after the file content