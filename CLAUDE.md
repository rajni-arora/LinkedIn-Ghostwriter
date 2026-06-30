# CLAUDE.md — LinkedInWrites

## PRD Rule — Read Before Building Anything

> **Every feature request must be checked against PRD.md first.**
>
> - Feature is in PRD **In Scope** → build it
> - Feature is **NOT in PRD** → stop and say: *"This feature is not in the PRD. Update PRD.md first, then I will build it."*
> - Feature is in PRD **Out of Scope** → stop and say: *"This feature is marked Out of Scope. Move it to In Scope in PRD.md first."*
>
> PRD.md is the single source of truth. No feature gets built without being in the PRD first.

---

## Project Overview

**LinkedInWrites** is a LinkedIn AI Post Generator SaaS. Users sign up, set up a persona once (role, industry, audience, tone), then generate AI-written LinkedIn posts on any topic. The AI returns 3 post variations each with a virality score. Users can save posts to a personal dashboard and view them anytime.

**Goal:** Live, deployed product on Vercel that professionals can use to generate high-performing LinkedIn content.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript) |
| AI | OpenAI API — model `gpt-4o` |
| Auth + Database | Supabase (email/password + PostgreSQL + RLS) |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Toasts | Sonner |
| Deployment | Vercel |

---

## Environment Variables

```
OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Add to `.env.local` locally. Add the same keys to Vercel → Project → Environment Variables before deploying.

---

## Installed Packages

```bash
npm install openai @supabase/ssr @supabase/supabase-js lucide-react sonner
```

---

## Features Built

- **Login / Signup** — email + password auth via Supabase. Signup collects first name + last name, saves to `users` table.
- **Persona Setup** — one-time onboarding with 4 fields saved to `user_persona` table
- **LinkedIn Post Generator** — topic input (300 char limit) + tone selector + persona info card → calls OpenAI API server-side
- **Generated Post Output** — 3 variation cards with color-coded borders + virality score badge + rationale + Copy + Save buttons
- **Toast Notifications** — `sonner` toasts for Copy, Save, Delete actions (bottom-right)
- **Save Post** — saves to `saved_posts` table with one click
- **Saved Posts Dashboard** — grid of saved posts, click to open full post modal, copy + delete with confirm
- **Sidebar Navigation** — fixed left sidebar on all dashboard pages with active link highlight + user avatar + logout

---

## User Flow

1. `/` → redirects to `/login` (unauthenticated) or `/generate` (authenticated)
2. `/signup` → fills first name, last name, email, password → saved to `users` table → redirect to `/persona`
3. `/login` → signs in → checks if `user_persona` exists → redirect to `/persona` (no persona) or `/generate` (has persona)
4. `/persona` → fills role, industry, target audience, preferred tone → saved to `user_persona` → redirect to `/generate`
5. `/generate` → enters topic → AI generates 3 posts with virality scores → copy or save any post
6. `/saved` → view all saved posts, click to read full post in modal, copy or delete

---

## Product Screens

### Screen 1 — Login / Signup (`/login`, `/signup`)

**Design:** Animated gradient background (`#0077B5` shades), LinkedInWrites logo image at top, tagline "Make the most of your professional life", light gray card (`#E8E8E8`), `7px` border radius, rounded-`[7px]` buttons.

**Login:** Email + password → Sign In button → checks persona → redirect
**Signup:** First name + last name + email + password → Sign Up button → saves to `users` table → redirect to `/persona`

---

### Screen 2 — Persona Setup (`/persona`)

Inside dashboard layout (sidebar visible). Pre-fills fields if persona already exists.

**4 fields:**
1. **Role** — dropdown: Founder, Executive, Marketer, Consultant, Sales Professional, HR Professional, Engineer, Designer, Educator, Other
2. **Industry** — dropdown: SaaS / Tech, Finance, Healthcare, Marketing & Advertising, Consulting, E-commerce, Education, Real Estate, Legal, Other
3. **Target Audience** — free text input
4. **Preferred Tone** — button group: Authoritative | Conversational | Inspirational | Data-Driven | Storytelling

**Save button:** "Save Persona & Continue" → upserts to `user_persona` by `user_id` → redirect to `/generate`

---

### Screen 3 — Post Generator (`/generate`)

**Persona info card** at top shows: role, industry, target audience in use.

**Form:**
- Topic textarea with live character count (`0 / 300`)
- Tone selector (5 buttons, defaults to persona's preferred tone)
- "Generate Posts" button → disabled if topic empty or over 300 chars

**On generate:**
- Shows 3 animated skeleton cards while loading
- Replaces with real cards when done

**Each variation card:**
- Color-coded `border-2`: green (`80+`), yellow (`60–79`), orange (`<60`)
- Virality score badge (same color coding)
- Virality rationale in italic
- Full post text
- Copy button → toast "Copied to clipboard!"
- Save button → toast "Post saved to your library!" → turns blue/disabled

---

### Screen 4 — Saved Posts (`/saved`)

Responsive 3-column grid. Shows post count badge in heading.

**Each card:** topic, tone badge, virality score, date, 3-line preview, "Click to read full post →"
- Click card → opens modal with full post text + Copy Full Post button
- Copy button → toast notification
- Delete button → first click "Confirm Delete", second click deletes + toast

---

## Folder Structure

```
/
├── app/
│   ├── (auth)/
│   │   ├── layout.tsx              ← animated gradient bg + LinkedIn logo
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx              ← sidebar with logo, nav, user avatar, logout
│   │   ├── generate/page.tsx       ← fetches persona, passes to PostGenerator
│   │   ├── persona/page.tsx        ← fetches existing persona, passes to PersonaForm
│   │   └── saved/page.tsx          ← client component, fetches posts via API
│   ├── api/
│   │   ├── generate/route.ts       ← fetches persona server-side, calls OpenAI
│   │   └── posts/
│   │       ├── route.ts            ← GET list + POST save
│   │       └── [id]/route.ts       ← DELETE
│   ├── globals.css                 ← Inter font, auth-bg animation keyframes
│   ├── layout.tsx                  ← root layout with <Toaster />
│   └── page.tsx                    ← redirects to /login or /generate
│
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx           ← 'use client', checks persona on login
│   │   ├── SignupForm.tsx          ← 'use client', saves to users table
│   │   └── SignOutButton.tsx       ← 'use client', signs out + redirects
│   ├── persona/
│   │   └── PersonaForm.tsx         ← 'use client', upserts user_persona
│   ├── dashboard/
│   │   ├── SidebarNav.tsx          ← 'use client', active link via usePathname
│   │   └── SavedPostCard.tsx       ← 'use client', card + full post modal
│   └── PostGenerator.tsx           ← 'use client', full generate page UI
│
├── lib/
│   └── supabase/
│       ├── client.ts               ← use in 'use client' components
│       └── server.ts               ← use in Server Components + API routes
│
├── public/
│   └── logo.png                    ← LinkedInWrites logo
│
├── middleware.ts                   ← route protection + auth redirects
└── .env.local
```

---

## Database Schema (Supabase)

```sql
-- User profiles
create table users (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  first_name text,
  last_name text,
  created_at timestamp with time zone default now()
);

-- Persona (one per user)
create table user_persona (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  role text not null,
  industry text not null,
  target_audience text not null,
  preferred_tone text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Saved posts
create table saved_posts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  topic text not null,
  tone text not null,
  post_text text not null,
  virality_score integer not null,
  virality_rationale text not null,
  created_at timestamp with time zone default now()
);

-- RLS on all tables
alter table users enable row level security;
alter table user_persona enable row level security;
alter table saved_posts enable row level security;

create policy "Users can view own profile"   on users for select using (auth.uid() = id);
create policy "Users can insert own profile" on users for insert with check (auth.uid() = id);
create policy "Users can update own profile" on users for update using (auth.uid() = id);

create policy "Users can view own persona"   on user_persona for select using (auth.uid() = user_id);
create policy "Users can insert own persona" on user_persona for insert with check (auth.uid() = user_id);
create policy "Users can update own persona" on user_persona for update using (auth.uid() = user_id);

create policy "Users can view own posts"   on saved_posts for select using (auth.uid() = user_id);
create policy "Users can insert own posts" on saved_posts for insert with check (auth.uid() = user_id);
create policy "Users can delete own posts" on saved_posts for delete using (auth.uid() = user_id);
```

---

## API Routes

| Method | Route | What it does |
|---|---|---|
| POST | `/api/generate` | Fetches user persona server-side → calls OpenAI gpt-4o → returns 3 variations |
| GET | `/api/posts` | Returns all saved posts for authenticated user, ordered by newest |
| POST | `/api/posts` | Saves a post to `saved_posts` table |
| DELETE | `/api/posts/[id]` | Deletes post (checks user_id ownership via RLS) |

**OpenAI call shape** (`/api/generate`):
- Request body: `{ topic, tone }` — persona is fetched server-side automatically
- Response: `{ variations: [{ postText, viralityScore, viralityRationale }, ...] }`
- Model: `gpt-4o`, temperature: `0.8`, response_format: `json_object`
- Virality scoring criteria: hook strength + insight quality + emotional resonance + CTA (25pts each)

---

## Design System

| Token | Value |
|---|---|
| Primary blue | `#0077B5` |
| Primary hover | `#005f8e` |
| Auth background | Animated gradient cycling `#0077B5 → #004182 → #0a66c2` |
| Dashboard background | `#F3F2EF` |
| Card background | `#FFFFFF` |
| Auth card background | `#E8E8E8` |
| Card border radius | `rounded-xl` (dashboard) · `rounded-[7px]` (auth) |
| Button border radius | `rounded-[7px]` |
| Score border 80–100 | `border-green-400` |
| Score border 60–79 | `border-yellow-400` |
| Score border < 60 | `border-orange-400` |
| Score badge 80–100 | `bg-green-100 text-green-800` |
| Score badge 60–79 | `bg-yellow-100 text-yellow-800` |
| Score badge < 60 | `bg-orange-100 text-orange-800` |
| Font | Inter (Google Fonts) |
| Toast position | bottom-right (sonner, richColors) |

---

## Middleware

- `/generate`, `/saved`, `/persona` → protected; unauthenticated → redirect to `/login`
- `/login`, `/signup` → if already logged in → redirect to `/generate`
- `/` → redirect to `/generate` (logged in) or `/login` (not logged in)
- Uses `@supabase/ssr` `createServerClient` with cookie forwarding

---

## Key Rules

- **OpenAI API is server-side only** — never call `/api/generate` logic in a client component
- **Supabase is split** — `lib/supabase/client.ts` for `'use client'` components, `lib/supabase/server.ts` for Server Components and API routes
- **Persona fetched server-side in API** — `/api/generate` fetches persona itself; client only sends `{ topic, tone }`
- **Persona is required** — login flow checks `user_persona` table; redirects to `/persona` if missing
- **No `useEffect` for data fetching in server components** — fetch in Server Components, pass as props
- **Next.js dev indicator disabled** — set in `next.config.js` (`devIndicators: false`)

---

## Running Locally

```bash
npm install
npm run dev        # http://localhost:3000
```

Fill in `.env.local` with your OpenAI API key, Supabase URL, and Supabase anon key first.

---

## Deploying to Vercel

1. Push project to a GitHub repository
2. Go to vercel.com → Add New Project → import the repo
3. Add environment variables:
   - `OPENAI_API_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click Deploy

---

## Task Tracking

Always read `TASKS.md` at the start of every session to understand what has been completed and what is pending.

- After completing any task, immediately mark it `[x]` in `TASKS.md`
- Before starting a new feature, add its subtasks to `TASKS.md` first
- Never start coding without checking `TASKS.md` first
