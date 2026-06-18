# CLAUDE.md — LinkedIn Ghost Writer

> This file is the single source of truth for Claude (or any AI coding assistant) working on this codebase. Read it fully before writing any code. Follow every rule exactly.

---

## Project Overview

**Product:** LinkedIn Ghost Writer — an AI-powered SaaS tool that helps founders, marketers, solopreneurs, and agencies write high-performing LinkedIn posts in seconds.

**Core Value Proposition:** Users input a topic, URL, or idea → the app generates polished, tone-matched LinkedIn posts with virality scoring, emoji & hashtag recommendations, and per-post analytics.

---

## Target Users

- Founders & co-founders building in public
- Marketers managing personal or brand LinkedIn presence
- Solopreneurs growing an audience
- Agencies managing multiple client LinkedIn accounts

---

## Tech Stack

### Frontend
| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| HTTP Client | Axios |
| Auth Client | Supabase JS SDK |
| State | React `useState` / `useContext` |
| Theme | next-themes (dark/light toggle) |

### Backend
| Layer | Technology |
|---|---|
| Runtime | Python 3.11+ |
| Framework | FastAPI |
| AI Model | OpenAI GPT-4o via `openai` SDK |
| URL Scraping | `httpx` + `BeautifulSoup4` |
| Auth Validation | Supabase service role JWT verification |
| CORS | `fastapi.middleware.cors` |

### Infrastructure & Services
| Service | Purpose |
|---|---|
| Supabase | Auth (email/password + OAuth), PostgreSQL DB, Row Level Security |
| Vercel | Frontend hosting |
| Railway / Render | FastAPI backend hosting |
| OpenAI API | Post generation, virality scoring, emoji & hashtag suggestions |

---

## Environment Variables

### Frontend (`/.env.local`)
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

### Backend (`/.env`)
```env
OPENAI_API_KEY=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
ALLOWED_ORIGINS=https://your-app.vercel.app
```

> **Never** commit `.env` or `.env.local` to version control. Both are listed in `.gitignore`.

---

## Project Structure

```
/
├── frontend/                     # Next.js 14 App Router
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── signup/page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── persona/page.tsx       # User persona setup
│   │   │   └── product/page.tsx       # Main post generator
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                        # shadcn/ui primitives
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   └── SignupForm.tsx
│   │   ├── persona/
│   │   │   └── PersonaForm.tsx
│   │   └── product/
│   │       ├── PostGenerator.tsx
│   │       ├── ToneSelector.tsx
│   │       ├── UrlInput.tsx
│   │       ├── PostVariants.tsx
│   │       ├── ViralityScore.tsx
│   │       ├── EmojiSuggestor.tsx
│   │       ├── HashtagRecommender.tsx
│   │       ├── SavedPosts.tsx
│   │       └── PostAnalytics.tsx
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   └── PersonaContext.tsx
│   ├── lib/
│   │   ├── supabase.ts               # Supabase browser client
│   │   └── api.ts                    # Axios instance + API calls
│   └── types/
│       └── index.ts
│
├── backend/                          # FastAPI
│   ├── main.py                       # App entry, CORS, router registration
│   ├── routers/
│   │   ├── auth.py                   # Token verification helpers
│   │   ├── generate.py               # Post generation endpoints
│   │   ├── persona.py                # Persona CRUD
│   │   ├── posts.py                  # Save / fetch / delete posts
│   │   └── analytics.py             # Per-post analytics
│   ├── services/
│   │   ├── openai_service.py         # All OpenAI calls
│   │   ├── scraper_service.py        # URL → clean text
│   │   └── supabase_service.py       # Supabase admin client
│   ├── models/
│   │   └── schemas.py                # Pydantic request/response models
│   └── requirements.txt
│
└── CLAUDE.md                         # ← You are here
```

---

## Pages & Features

### Page 1 — Login & Signup (`/login`, `/signup`)

**Purpose:** Authenticate users via Supabase Auth.

**Features:**
- Email + password login and signup
- Google OAuth login (Supabase provider)
- "Forgot password" flow (Supabase magic link)
- Redirect to `/persona` on first login, `/product` on subsequent logins
- Show inline validation errors from Supabase
- Fully responsive; works on mobile

**Rules:**
- Use `supabase.auth.signInWithPassword()` and `supabase.auth.signUp()` — never roll custom auth
- Store session in Supabase's built-in cookie/localStorage handler via `createBrowserClient`
- Protect all non-auth routes with a middleware check (`middleware.ts` using `createServerClient`)

---

### Page 2 — User Persona (`/persona`)

**Purpose:** Collect writing preferences so every generated post matches the user's voice and niche.

**Fields to capture:**
- Full name & professional headline
- Industry / niche (dropdown + free text)
- Target audience description
- Preferred tone(s) — multi-select: Professional, Casual, Conversational, Viral-Hook Style
- Content pillars / topics they post about (up to 5 tags)
- Writing style notes (free text, e.g. "I avoid buzzwords", "I use short punchy sentences")
- LinkedIn profile URL (optional, for context)

**Behaviour:**
- On first login, user is redirected here before accessing the product
- Persona is saved to Supabase `personas` table (one row per user, upsert on save)
- Persona is loaded into `PersonaContext` and sent with every generation request
- User can update persona anytime from the settings/profile menu

**API:**
- `POST /persona` — create or update persona
- `GET /persona` — fetch current user's persona

---

### Page 3 — Product / Post Generator (`/product`)

This is the main dashboard. All features below live here.

#### 3.1 Post Generator
- Text area: user types a topic, idea, or short brief
- "Generate" button calls `POST /generate/post`
- Backend builds a prompt using the user's persona + tone + brief → calls OpenAI → returns post
- Display generated post in an editable text area so user can tweak before saving

#### 3.2 Tone Selector
- Pill/chip UI with 4 options: **Professional · Casual · Conversational · Viral-Hook Style**
- Selection is sent with every generation request
- Default to persona's preferred tone; user can override per-session

#### 3.3 Post from URL
- Input field for any URL (article, blog post, tweet, product page)
- Backend scrapes URL with `httpx` + `BeautifulSoup4`, extracts clean body text
- Passes extracted content + persona + tone to OpenAI → generates LinkedIn post summarising or riffing on the content
- Show a "Fetching URL…" loading state
- Endpoint: `POST /generate/from-url`

#### 3.4 Refine Post (2–3 Variants)
- After initial generation, show a "Get Variants" button
- Calls `POST /generate/variants` — returns 2–3 rewritten versions of the same post (different hooks, structures, lengths)
- User can click any variant to load it into the main editor
- Variants are generated in one OpenAI call using a structured JSON response

#### 3.5 Virality Score Predictor
- After a post is generated or edited, display a score out of 100
- Calls `POST /generate/virality-score` with the post text
- OpenAI returns a JSON object: `{ score: number, reasons: string[], tips: string[] }`
- Display score as a colour-coded badge (red < 40, amber 40–70, green > 70) with expandable tips
- Re-score automatically when user edits the post (debounced, 1.5 s)

#### 3.6 Emoji Suggestor
- Below the editor, show 6–10 contextually relevant emojis
- Calls `POST /generate/emojis` — OpenAI returns an array of emoji characters with labels
- Click any emoji to insert it at cursor position in the editor
- Refresh button to get a new set

#### 3.7 Hashtag Recommender
- Below the emoji panel, show 5–10 recommended hashtags
- Calls `POST /generate/hashtags` — OpenAI returns hashtags ranked by relevance
- Click a hashtag to append it to the post
- "Copy all hashtags" button

#### 3.8 Dark / Light Theme Toggle
- Toggle button in the top-right nav using `next-themes`
- Persists preference in `localStorage`
- Tailwind `dark:` variants used throughout; shadcn/ui components already support dark mode
- Default: system preference

#### 3.9 Save Your Post
- "Save Post" button stores the final post text + metadata to Supabase `posts` table
- Saved posts appear in a left-sidebar or "My Posts" drawer
- Fields saved: `id`, `user_id`, `content`, `tone`, `source` (manual/url), `source_url`, `virality_score`, `emojis_used`, `hashtags_used`, `created_at`, `updated_at`
- User can delete saved posts; soft-delete preferred (`deleted_at` timestamp)
- Endpoint: `POST /posts`, `GET /posts`, `DELETE /posts/:id`

#### 3.10 Per-Post Analytics
- Each saved post has an expandable analytics panel
- Metrics tracked (user-reported or manual entry — no LinkedIn API required in v1):
  - Views / Impressions
  - Likes, Comments, Reposts
  - Date posted
- Optional: user manually enters metrics after posting to LinkedIn
- Display simple bar/line charts using `recharts`
- Endpoint: `POST /analytics/:post_id`, `GET /analytics/:post_id`

---

## Database Schema (Supabase / PostgreSQL)

```sql
-- Users are managed by Supabase Auth (auth.users table)

create table public.personas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade unique,
  full_name text,
  headline text,
  industry text,
  target_audience text,
  preferred_tones text[],          -- e.g. ['professional', 'casual']
  content_pillars text[],          -- up to 5 tags
  writing_style_notes text,
  linkedin_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  content text not null,
  tone text,
  source text check (source in ('manual', 'url')),
  source_url text,
  virality_score int,
  emojis_used text[],
  hashtags_used text[],
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz           -- soft delete
);

create table public.post_analytics (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references public.posts(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  views int default 0,
  likes int default 0,
  comments int default 0,
  reposts int default 0,
  date_posted date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

**Row Level Security:** Enable RLS on all tables. Users can only read/write their own rows.

```sql
alter table public.personas enable row level security;
create policy "Users manage own persona" on public.personas
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Repeat pattern for posts and post_analytics
```

---

## API Endpoints (FastAPI)

All endpoints require `Authorization: Bearer <supabase_access_token>` header. The backend verifies the token using the Supabase service role key.

```
POST   /persona                    Create or update user persona
GET    /persona                    Get current user's persona

POST   /generate/post              Generate a LinkedIn post from brief
POST   /generate/from-url          Generate post from URL
POST   /generate/variants          Get 2-3 post variants
POST   /generate/virality-score    Score a post for virality
POST   /generate/emojis            Suggest emojis for a post
POST   /generate/hashtags          Recommend hashtags for a post

POST   /posts                      Save a post
GET    /posts                      List user's saved posts
PATCH  /posts/:id                  Update a saved post
DELETE /posts/:id                  Soft-delete a post

POST   /analytics/:post_id         Create or update analytics for a post
GET    /analytics/:post_id         Get analytics for a post
```

---

## OpenAI Prompting Guidelines

- Always use model `gpt-4o`
- Always include the user's persona in the system prompt
- Return structured data (variants, virality score, emojis, hashtags) as JSON — use `response_format: { type: "json_object" }` in the API call
- Keep system prompts under 800 tokens; keep user prompts focused
- Temperature: `0.8` for creative generation, `0.3` for scoring/analysis
- Always include a `max_tokens` limit per call (post generation: 600, variants: 1200, scoring: 300, emojis: 100, hashtags: 150)

### System Prompt Template (post generation)
```
You are an expert LinkedIn ghostwriter. Your job is to write high-performing LinkedIn posts.

User persona:
- Name: {full_name}
- Headline: {headline}
- Industry: {industry}
- Target audience: {target_audience}
- Preferred tone: {tone}
- Content pillars: {content_pillars}
- Writing style notes: {writing_style_notes}

Rules:
- Write in first person
- Match the requested tone exactly
- Hook the reader in the first line (no "I" as the first word)
- Use short paragraphs (1-3 lines max)
- End with a call to action or question
- Do NOT use hashtags in the body (they are added separately)
- Do NOT use generic LinkedIn filler phrases ("Excited to share", "Humbled", etc.)
- Output only the post text, nothing else
```

---

## Code Style & Conventions

### TypeScript / Frontend
- Strict TypeScript — no `any` types
- Functional components only — no class components
- All API calls go through `lib/api.ts` (Axios instance with base URL + auth header interceptor)
- Use `useContext(AuthContext)` to access session/user — never call `supabase.auth.getUser()` directly in components
- shadcn/ui components only for UI primitives (Button, Input, Card, Dialog, etc.) — do not install additional component libraries
- Tailwind for all styling — no inline styles, no CSS modules (except `globals.css`)
- File naming: `PascalCase` for components, `camelCase` for utilities and hooks

### Python / Backend
- Type-annotate all function signatures with Pydantic models
- All OpenAI calls live in `services/openai_service.py` — routers import from services, never call OpenAI directly
- Handle OpenAI errors gracefully — catch `openai.APIError` and return structured 502 responses
- Never log or store raw OpenAI prompts/responses that contain user content in production
- Use `async def` for all FastAPI route handlers

---

## Authentication Flow

1. User signs up / logs in via Supabase on the frontend
2. Supabase returns a JWT access token
3. Frontend stores the session (Supabase handles this automatically)
4. Every API call to FastAPI includes `Authorization: Bearer <token>`
5. FastAPI middleware calls `supabase.auth.get_user(token)` to verify and extract `user_id`
6. All DB queries are scoped to that `user_id`

---

## What NOT to Build (v1 Scope Boundaries)

- No LinkedIn OAuth or direct LinkedIn posting (users copy-paste manually)
- No team / agency multi-seat accounts (single user per account)
- No scheduled posting
- No image or carousel generation
- No billing / Stripe integration (add in v2)
- No mobile app (responsive web only)

---

## Things to Always Remember

- Every generated post must be editable before saving — never auto-save
- Virality score re-runs must be debounced (1.5 s) to avoid excessive API calls
- All Supabase queries must respect RLS — never use the service role key on the frontend
- The persona must be loaded and available before the product page renders — show a loading state
- Dark mode must be tested on every new component before committing
- URL scraping must handle failures gracefully (timeout, paywalled content, invalid URL) with a user-friendly error message
- Hashtags and emojis are suggestions — the user always has final control

---

## Getting Started (Local Dev)

```bash
# Frontend
cd frontend
npm install
cp .env.example .env.local   # fill in Supabase keys
npm run dev                  # http://localhost:3000

# Backend
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env         # fill in keys
uvicorn main:app --reload    # http://localhost:8000
```
