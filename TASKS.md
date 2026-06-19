# TASKS.md — LinkedIn Ghost Writer

Checklist of all work completed so far, derived from the actual codebase.

---

## Setup & Config

- [x] Git repository initialised
- [x] `CLAUDE.md` written with full project spec, tech stack, DB schema, and API reference
- [x] `PRD.md` created
- [x] `README.md` created
- [x] Reference HTML files added (`Sign in.html`, `User persona.html`, `Post Generator.html`)
- [x] Prompt files added (`prompts/Boilerplate_prompt.md`, `prompts/generate-claude-md.md`)
- [x] Python virtual environment created (`LinkedInvenv/`)
- [x] Backend dependencies installed (`fastapi`, `uvicorn`, `pydantic`, `openai`)
- [x] `frontend/.env.example` created with Supabase + API base URL keys
- [x] `backend/.env.example` created with OpenAI + Supabase service role keys

---

## Backend

- [x] `main.py` — FastAPI app with CORS middleware and generate router registered at `/generate`
- [x] `requirements.txt` — pinned versions for fastapi, uvicorn, pydantic, openai
- [x] `models/schemas.py` — `GeneratePostRequest` and `GeneratePostResponse` Pydantic models
- [x] `routers/generate.py` — `POST /generate/post` endpoint with error handling (502 for OpenAI errors, 500 for unexpected)
- [x] `services/openai_service.py` — `generate_post()` using `gpt-4o`, `temperature=0.8`, `max_tokens=600`, system prompt with tone injection, catches `APIError`

### Not yet built — Backend
- [ ] `routers/auth.py` — JWT verification middleware (Supabase token validation)
- [ ] `routers/persona.py` — `POST /persona`, `GET /persona`
- [ ] `routers/posts.py` — `POST /posts`, `GET /posts`, `PATCH /posts/:id`, `DELETE /posts/:id`
- [ ] `routers/analytics.py` — `POST /analytics/:post_id`, `GET /analytics/:post_id`
- [ ] `services/scraper_service.py` — URL scraping with httpx + BeautifulSoup4
- [ ] `services/supabase_service.py` — Supabase admin client
- [ ] `POST /generate/from-url` — generate post from scraped URL
- [ ] `POST /generate/variants` — return 2–3 post variants as structured JSON
- [ ] `POST /generate/virality-score` — return `{ score, reasons, tips }`
- [ ] `POST /generate/emojis` — return contextual emoji suggestions
- [ ] `POST /generate/hashtags` — return ranked hashtag recommendations
- [ ] Auth header validation on all protected routes
- [ ] `.env` loading via `python-dotenv` (CORS origins currently hardcoded)

---

## Frontend

- [x] Next.js 14 App Router project scaffolded with TypeScript strict mode
- [x] `package.json` — dependencies: next 14, react 18, axios, next-themes, lucide-react, shadcn/ui primitives (radix-ui, cva, clsx, tailwind-merge)
- [x] `tsconfig.json` — strict mode enabled, `@/*` path alias configured
- [x] `tailwind.config.ts` — dark mode via `class`, full CSS variable colour token system
- [x] `globals.css` — CSS variable tokens for light and dark themes (background, foreground, primary, destructive, muted, card, border, etc.)
- [x] `app/layout.tsx` — root layout with `ThemeProvider` (next-themes), Inter font, page metadata
- [x] `app/page.tsx` — home page mounting `PostGenerator` and `ThemeToggle`
- [x] `components/ThemeToggle.tsx` — dark/light toggle button with Moon/Sun icons, hydration-safe (`mounted` guard)
- [x] `components/PostGenerator.tsx` — full post generation card: API key input, tone selector (Badge chips, 4 tones), topic textarea, generate button with loading state, editable output textarea, copy-to-clipboard button
- [x] `components/ui/badge.tsx` — shadcn Badge primitive
- [x] `components/ui/button.tsx` — shadcn Button primitive
- [x] `components/ui/card.tsx` — shadcn Card primitive
- [x] `components/ui/input.tsx` — shadcn Input primitive
- [x] `components/ui/textarea.tsx` — shadcn Textarea primitive
- [x] `lib/api.ts` — Axios client pointed at `localhost:8000`; `generatePost()` function with structured error handling
- [x] `lib/utils.ts` — `cn()` helper (clsx + tailwind-merge)

### Not yet built — Frontend
- [ ] `app/(auth)/login/page.tsx` and `app/(auth)/signup/page.tsx`
- [ ] `components/auth/LoginForm.tsx` and `SignupForm.tsx`
- [ ] `app/(dashboard)/persona/page.tsx`
- [ ] `components/persona/PersonaForm.tsx`
- [ ] `app/(dashboard)/product/page.tsx` — full dashboard
- [ ] `components/product/UrlInput.tsx` — URL-to-post input
- [ ] `components/product/PostVariants.tsx` — 2–3 variant cards
- [ ] `components/product/ViralityScore.tsx` — colour-coded score badge + tips
- [ ] `components/product/EmojiSuggestor.tsx` — click-to-insert emojis
- [ ] `components/product/HashtagRecommender.tsx` — click-to-append hashtags
- [ ] `components/product/SavedPosts.tsx` — sidebar / drawer of saved posts
- [ ] `components/product/PostAnalytics.tsx` — per-post metrics entry and charts
- [ ] `context/AuthContext.tsx` — Supabase session context
- [ ] `context/PersonaContext.tsx` — persona loaded on app boot
- [ ] `lib/supabase.ts` — Supabase browser client
- [ ] `middleware.ts` — route protection using Supabase server client
- [ ] `types/index.ts` — shared TypeScript types
- [ ] Supabase auth integration (email/password + Google OAuth)
- [ ] Persona sent with every generation request
- [ ] Virality score debounce (1.5 s on post edit)

---

## Database / Infrastructure

- [ ] Supabase project created and configured
- [ ] `personas` table created with RLS policy
- [ ] `posts` table created with RLS policy
- [ ] `post_analytics` table created with RLS policy
- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to Railway / Render
- [ ] `ALLOWED_ORIGINS` env var set on backend for production domain
