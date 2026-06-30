# Workshop Instructor Script — Build a SaaS Product Live
## LinkedInWrites — LinkedIn AI Post Generator

---

> **INSTRUCTOR NOTE:** Speak naturally. Pause after every key moment.
> Ask questions to the audience regularly. Make them feel involved.
> Everything in `"quotes"` is what you say out loud.
> Everything in `code blocks` is what you type live.

---

## CONTEXT FOR INSTRUCTOR

**Already done before this session starts:**
- ✅ PRD.md created
- ✅ TASKS.md created
- ✅ .env.example created
- ✅ .env.local filled with real keys

**What we build today (in this order):**
1. Boilerplate code
2. Feature 1 — Post Generator (frontend + backend)
3. Run `/init` → create CLAUDE.md
4. Update TASKS.md
5. Feature 2 — Login / Signup
6. Update CLAUDE.md + TASKS.md
7. Feature 3 — Persona Setup
8. Update CLAUDE.md + TASKS.md
9. Feature 4 — Save Posts + Dashboard
10. Update CLAUDE.md + TASKS.md
11. Deploy to Vercel

---

---

# PART 1 — BOILERPLATE CODE

---

## Opening

> "Alright everyone. We've done the planning. PRD is ready. Tasks are listed. Keys are configured. Now we do the part everyone has been waiting for — we write code.
>
> But before we write a single feature, we need to build the foundation. Think of it like this. You want to build a house. Do you start with the kitchen? The bedroom? No. You lay the foundation first. You put up the walls. You connect electricity and water. Then you add rooms one by one.
>
> That foundation in our project is called boilerplate code. Let's build it."

---

## What Goes in Boilerplate

> "Boilerplate is the minimum files your project needs to just run — with zero features. Just structure, config, and connections."

**Write this on the board or show on screen:**

```
What boilerplate includes:
✅ package.json         → what packages we need
✅ tsconfig.json        → TypeScript rules
✅ next.config.js       → Next.js settings
✅ tailwind.config.ts   → styling setup
✅ postcss.config.js    → Tailwind helper
✅ app/layout.tsx       → root of the entire app
✅ app/globals.css      → global fonts + styles
✅ app/page.tsx         → homepage (blank for now)
✅ lib/supabase/        → database connection ready
✅ middleware.ts        → route protection ready

What boilerplate does NOT include:
❌ Login page
❌ Post generator
❌ Dashboard
❌ Any feature
```

> "Notice — no features yet. Zero. Just the skeleton. Everything needed to run, nothing extra."

---

## The Prompt — Boilerplate

> "We're going to ask Claude to create the boilerplate. Here's the prompt I'm going to use."

**Paste this prompt into Claude Code:**

```
Read the PRD.md file carefully.

Create the complete boilerplate for this Next.js project.
Include:
- package.json with all required dependencies from the PRD
- tsconfig.json
- next.config.js (disable devIndicators)
- tailwind.config.ts with Inter font
- postcss.config.js
- app/layout.tsx with Sonner Toaster
- app/globals.css with Inter font import + auth gradient animation
- app/page.tsx that redirects to /login or /generate based on auth
- lib/supabase/client.ts (createBrowserClient)
- lib/supabase/server.ts (createServerClient with cookies)
- middleware.ts (protect /generate, /saved, /persona — redirect to /login)
- .gitignore

Do NOT build any feature pages yet.
The app should run with npm run dev without errors.
```

---

## After Claude Generates

> "Watch Claude create all these files in seconds. This would have taken a developer 2-3 hours manually."

**Run this after generation:**

```bash
npm install
npm run dev
```

> "Open your browser. Go to localhost:3000. What do you see?"
>
> *(audience answers — blank page or redirect)*
>
> "Perfect. That's exactly right. No features yet — just a running app. Our foundation is solid. Let's add the first room."

---

---

# PART 2 — FEATURE 1: POST GENERATOR

---

## Why Post Generator First?

> "Now — important question. We have 4 features to build. Login, Persona, Post Generator, Saved Posts. Which one do we build first?
>
> *(pause for audience)*
>
> Most people say login. Makes sense right? You need to log in before you can use anything.
>
> Wrong answer. We build the Post Generator first.
>
> Here's why. The Post Generator is the core of our product. It calls OpenAI, returns posts, shows them on screen. If the AI doesn't work — nothing else matters. We validate the hardest, most uncertain part first. Everything else is just UI around it.
>
> Also — without auth, we can test the generator immediately without needing to log in. Faster feedback. Faster iteration."

---

## Building Frontend and Backend Together

> "Here's our approach. For every feature we build frontend and backend together — not one after the other. Backend first, test it, then frontend, connect them, see it work. Let me show you."

**The pattern we follow every time:**

```
Step 1 → Build backend API route  (the kitchen)
Step 2 → Test the API alone
Step 3 → Build frontend component (the dining room)
Step 4 → Connect frontend to API
Step 5 → Test in browser
Step 6 → Feature complete ✅
```

---

## Step 1 — Backend: The API Route

> "First we build the backend. In Next.js, our backend lives in `app/api/`. We need one route — POST /api/generate — that takes a topic and tone, calls OpenAI GPT-4o, and returns 3 post variations."

**Paste this prompt into Claude Code:**

```
Read CLAUDE.md for the full project context and design rules.

Build the backend for the Post Generator feature:

Create app/api/generate/route.ts that:
- Accepts POST request with { topic, tone }
- Has a system prompt that instructs GPT-4o to write
  LinkedIn posts for a professional
- Has a user prompt that asks for 3 variations with
  viralityScore (1-100) and viralityRationale
- Calls OpenAI GPT-4o with response_format: json_object
- Returns { variations: [{ postText, viralityScore, 
  viralityRationale }] }
- Returns 500 with error message if OpenAI fails

Also create lib/claude.ts with the OpenAI client instance.
Use OPENAI_API_KEY from environment variables.
Server-side only — never expose to browser.
```

---

## Test the Backend First

> "Before we touch any UI — let's test the API directly. We'll use a simple tool called the browser's network tab, or we can test with a curl command."

```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"topic": "why founders should post on LinkedIn", "tone": "Conversational"}'
```

> "Look at what comes back. Three posts. Virality scores. Rationale. This is real GPT-4o output. Our backend works.
>
> *(pause)*
>
> How many of you have ever built something that talks to an AI before? Show of hands.
>
> *(look at audience)*
>
> Today everyone in this room has. Let's now make it look good."

---

## Step 2 — Frontend: The Post Generator UI

> "Now we build what the user sees. The form to enter a topic, choose a tone, click generate, and see 3 post cards appear."

**Paste this prompt into Claude Code:**

```
Read CLAUDE.md for design system colors, fonts, and rules.

Build the frontend for the Post Generator feature:

1. components/PostGenerator.tsx (use client) with:
   - Persona info card at top (role, industry, audience)
   - Topic textarea with live character count (0/300)
   - Tone selector — 5 buttons (Authoritative, Conversational,
     Inspirational, Data-Driven, Storytelling)
   - Generate button — disabled if topic empty or >300 chars
   - On click: fetch POST /api/generate with {topic, tone}
   - Loading state: show 3 animated skeleton cards
   - On success: show 3 variation cards

2. Each variation card shows:
   - "Variation 1/2/3" label
   - Virality score badge — green (80+), yellow (60-79),
     orange (<60)
   - Color-coded border-2 matching the score
   - Virality rationale in italic
   - Full post text
   - Copy button → copies text → sonner toast "Copied!"
   - Save button → POST /api/posts → sonner toast "Saved!"
     → button turns blue and disabled

3. app/(dashboard)/generate/page.tsx:
   - Server component
   - Fetches user persona from Supabase
   - Passes persona as prop to PostGenerator

Use design system from CLAUDE.md — colors #0077B5, 
#F3F2EF background, Inter font, rounded-xl cards.
```

---

## See It Live

> "Run the app. Go to localhost:3000/generate. Type a topic. Click Generate Posts."

```bash
npm run dev
```

> "Look at that. Skeleton cards while loading. Then 3 real LinkedIn posts appear. Green score, yellow score, orange score. Each one with a reason why it will perform.
>
> *(pause for effect)*
>
> We just built an AI-powered LinkedIn post generator. From scratch. In under 30 minutes.
>
> This is what's possible when you combine a clear plan, the right tools, and Claude doing the heavy lifting."

---

---

# PART 3 — RUN /init AND CREATE CLAUDE.md

---

> "Now that we have real code in the project — boilerplate plus our first feature — it's time to brief our AI properly. We run `/init`."

```
/init
```

> "Watch what happens. Claude scans every file we just created. It reads our folder structure, our API routes, our components, our tech stack. And it writes a complete CLAUDE.md file that captures all of it.
>
> From this moment forward — every time we start a new session, Claude reads this file and instantly knows everything about our project. No explaining from scratch. No repeating context. It just picks up and keeps building."

**Show the generated CLAUDE.md on screen:**

> "Look at what it created. Tech stack. Folder structure. API routes. Database schema. Design system. Key rules. This is the memory of our project."

---

---

# PART 4 — UPDATE TASKS.md

---

> "We just completed our first feature. First thing we do — open TASKS.md and mark it done."

**Paste this prompt:**

```
Read TASKS.md. 
The following tasks are now complete — mark them [x]:
- package.json and all config files
- lib/supabase/client.ts and server.ts
- middleware.ts
- app/globals.css, layout.tsx, page.tsx
- app/api/generate/route.ts
- components/PostGenerator.tsx
- app/(dashboard)/generate/page.tsx
- npm install and npm run dev working

Update the status. Keep all remaining tasks as [ ].
```

> "Why do we do this immediately? Because in 3 hours when we come back to this project, we won't remember where we stopped. TASKS.md tells us instantly. This habit saves hours of confusion."

---

---

# PART 5 — FEATURE 2: LOGIN / SIGNUP

---

> "Our post generator works. But right now anyone can use it. We need users to sign up, log in, and have their own account. Let's add authentication."

---

## The Prompt

```
Read CLAUDE.md for full project context and design rules.

Build the Login / Signup feature:

1. app/(auth)/layout.tsx — animated gradient background
   (cycling #0077B5 → #004182 → #0a66c2), LinkedInWrites
   logo at top, tagline "Make the most of your professional life"

2. app/(auth)/login/page.tsx + components/auth/LoginForm.tsx:
   - Email + password fields
   - Sign In button → supabase.auth.signInWithPassword()
   - On success: check user_persona table
     → has persona? redirect to /generate
     → no persona? redirect to /persona
   - Inline error for wrong credentials
   - Link to /signup

3. app/(auth)/signup/page.tsx + components/auth/SignupForm.tsx:
   - First name + last name + email + password (min 8 chars)
   - Sign Up button → supabase.auth.signUp()
   - On success: save to users table → redirect to /persona
   - Inline validation errors
   - Link to /login

4. components/auth/SignOutButton.tsx:
   - Sign out button → supabase.auth.signOut()
   - Redirect to /login

Design: light gray card #E8E8E8, 7px border radius,
blue buttons #0077B5, rounded-[7px] on buttons.
```

---

## Test Login / Signup

> "Go to localhost:3000. What happens?"
>
> *(audience: redirects to /login)*
>
> "Correct. Middleware catches unauthenticated users. Try signing up with a new email. Fill in your name. Set a password. Click Sign Up."
>
> *(live demo)*
>
> "It redirects to /persona — which doesn't exist yet. That's fine. That's our next feature. The redirect is proof that auth is working."

---

## Update CLAUDE.md and TASKS.md

```
Read CLAUDE.md. 
The Login/Signup feature is now complete. Update CLAUDE.md 
to reflect: auth pages exist, users table is used, 
LoginForm checks persona on login, SignupForm saves 
to users table.

Then read TASKS.md and mark all Login/Signup tasks as [x].
```

---

---

# PART 6 — FEATURE 3: PERSONA SETUP

---

> "After signup, users land on /persona. Right now that page doesn't exist. Let's build it.
>
> The persona page is crucial. This is where users tell us who they are — their role, industry, audience, and preferred tone. This information goes into every AI prompt we send. It's what makes the posts sound like the user, not like generic AI."

---

## The Prompt

```
Read CLAUDE.md for full project context and design rules.

Build the Persona Setup feature:

1. app/(dashboard)/layout.tsx:
   - Fixed left sidebar with:
     → LinkedInWrites logo at top
     → Nav links: Generate, Saved Posts, Persona
     → Active link highlighted in LinkedIn blue
     → User avatar with initials at bottom
     → Sign Out button
   - Uses SidebarNav component
   - Server component — fetches user for avatar initials

2. components/dashboard/SidebarNav.tsx (use client):
   - usePathname() to detect active route
   - Highlight active link

3. app/(dashboard)/persona/page.tsx:
   - Server component
   - Fetch existing persona from user_persona table
   - Pass to PersonaForm as prop
   - Heading: "Set Up Your Persona" (new) or 
     "Edit Your Persona" (returning)

4. components/persona/PersonaForm.tsx (use client):
   - Role dropdown (10 options from CLAUDE.md)
   - Industry dropdown (10 options from CLAUDE.md)
   - Target Audience free text input
   - Preferred Tone — 5 button group
   - Pre-fill all fields if persona exists
   - Save button → upsert to user_persona by user_id
   - On success → redirect to /generate

Database: upsert to user_persona table using 
onConflict: user_id
```

---

## Test Persona Setup

> "Sign up fresh. You land on /persona. Fill in your details. What role are you? What industry? Who's your audience?
>
> *(live demo — fill in the form)*
>
> Click Save. You land on /generate with your persona info card showing at the top. Generate a post. See how the AI writes specifically for your role and audience.
>
> *(generate a post live)*
>
> This is the power of persona context. The same topic generates completely different posts for a Founder vs a Marketer vs an Engineer."

---

## Update CLAUDE.md and TASKS.md

```
Read CLAUDE.md.
Persona Setup feature is now complete. Update CLAUDE.md 
to reflect: persona page exists, PersonaForm upserts 
to user_persona, SidebarNav uses usePathname for active 
states, dashboard layout has sidebar.

Then read TASKS.md and mark all Persona Setup tasks [x].
```

---

---

# PART 7 — FEATURE 4: SAVE POSTS + DASHBOARD

---

> "Our users can now generate posts. But they have no way to keep them. Every time they refresh — gone. Let's build the library.
>
> Feature 4 has two parts. Save Post — the button on each variation card. And Saved Posts Dashboard — the page where all saved posts live."

---

## Step 1 — Save API Route

```
Read CLAUDE.md for full project context.

Build the Save Posts backend:

1. app/api/posts/route.ts:
   - GET: fetch all saved posts for authenticated user
     from saved_posts table, ordered by created_at DESC
     Return { posts: [...] }
   - POST: insert new post to saved_posts table
     Body: { topic, tone, post_text, virality_score, 
     virality_rationale }
     Return { post: {...} }

2. app/api/posts/[id]/route.ts:
   - DELETE: delete post where id matches AND
     user_id matches authenticated user
     Return { success: true }

All routes check auth first — return 401 if not logged in.
RLS on Supabase handles security at database level too.
```

---

## Step 2 — Saved Posts Dashboard

```
Read CLAUDE.md for design system and rules.

Build the Saved Posts Dashboard:

1. app/(dashboard)/saved/page.tsx (use client):
   - Fetch GET /api/posts on load
   - Responsive grid: 3 columns desktop, 1 column mobile
   - Show post count badge: "Saved Posts (12)"
   - Empty state: "No saved posts yet. Generate your 
     first post!" + link to /generate
   - Delete removes post from UI without page refresh

2. components/dashboard/SavedPostCard.tsx (use client):
   - Topic as bold heading
   - Tone pill badge
   - Virality score badge (same color coding)
   - First 3 lines of post text preview
   - "Click to read full post →" text
   - Date saved formatted as "Jun 15, 2025"
   - On card click → open modal with full post text
   - Modal has: full post text + Copy Full Post button
   - Copy button → sonner toast "Copied to clipboard!"
   - Delete button → first click: "Confirm Delete"
     second click: DELETE /api/posts/[id] + remove from UI
     + sonner toast "Post deleted"

3. Update PostGenerator.tsx Save button:
   - On click: POST /api/posts with post data
   - On success: sonner toast "Post saved to your library!"
   - Button turns blue and disabled (can't save twice)
```

---

## Test Save + Dashboard

> "Generate 3 posts. Save one. Click Saved Posts in the sidebar. See it there.
>
> *(live demo)*
>
> Click on the card. Full post opens in a modal. Copy it. Delete it.
>
> *(demonstrate each action)*
>
> This is a complete product. Users can generate, save, revisit, copy, and delete their best LinkedIn content."

---

## Update CLAUDE.md and TASKS.md

```
Read CLAUDE.md.
Save Posts and Dashboard feature is now complete. 
Update CLAUDE.md to reflect: save post API routes exist,
SavedPostCard has modal, delete has confirm step,
post count shows in heading, save button disables 
after saving.

Then read TASKS.md and mark all Save Posts and 
Dashboard tasks [x]. We should only have Vercel 
deployment remaining.
```

---

---

# PART 8 — DEPLOY TO VERCEL

---

> "We have a fully working product. Login, persona, generate, save. Everything works locally.
>
> But right now it only exists on your laptop. Nobody else can use it. Let's change that. Let's put it on the internet."

---

## Step 1 — Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit — LinkedInWrites MVP"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/linkedinwrites.git
git push -u origin main
```

> "Our code is now on GitHub. Vercel is going to watch this repo and auto-deploy every time we push."

---

## Step 2 — Deploy on Vercel

> "Go to vercel.com. Sign in. Click Add New Project. Import your GitHub repo."

**Show live on screen:**

1. Select the repo → `linkedinwrites`
2. Framework detected automatically → Next.js ✅
3. Go to Environment Variables → Add all 3:

```
OPENAI_API_KEY          → paste your key
NEXT_PUBLIC_SUPABASE_URL → paste your URL
NEXT_PUBLIC_SUPABASE_ANON_KEY → paste your key
```

4. Click **Deploy**

> "Watch the build logs. This is the same `npm run build` we ran locally — now running on Vercel's servers."

---

## Step 3 — It's Live

> "Build complete. Vercel gives you a URL. Something like `linkedinwrites.vercel.app`.
>
> *(open the URL on screen)*
>
> This is your product. On the internet. Anyone in the world can go to this URL right now and use what we just built.
>
> *(pause)*
>
> How long did this take us? A few hours. From zero files to a live SaaS product.
>
> This is what building with Claude Code looks like."

---

## Final TASKS.md Update

```
Read TASKS.md. 
Mark all remaining tasks as [x] including:
- Vercel deployment
- Environment variables added to Vercel
- Live URL tested end to end

Add a new section at the bottom:

## Live Product
- URL: https://linkedinwrites.vercel.app
- All 4 features working in production
- MVP complete ✅
```

---

---

# CLOSING — WHAT WE BUILT TODAY

---

> "Let's look at what we actually built today."

**Write on board:**

```
✅ Boilerplate — foundation set up in minutes
✅ Feature 1 — Post Generator (frontend + backend + OpenAI)
✅ CLAUDE.md — AI briefed on the entire project
✅ Feature 2 — Login / Signup (Supabase auth)
✅ Feature 3 — Persona Setup (personalised AI)
✅ Feature 4 — Save Posts + Dashboard (full CRUD)
✅ Deployed — live on Vercel
```

---

> "And here's the process we followed — the same process you can use for any SaaS product you build:"

```
PRD.md       → decide what to build
.env files   → set up secrets
Boilerplate  → lay the foundation
Feature 1    → core feature first (most uncertain)
/init        → brief Claude with CLAUDE.md
TASKS.md     → track progress
Feature 2+   → add features one by one
              → update CLAUDE.md and TASKS.md after each
Deploy       → ship it
```

---

> "The most important thing you learned today is not the code. You can Google code. You can ask Claude for code.
>
> The most important thing you learned is the process. Plan first. Build the foundation. Add features one at a time. Test after every step. Keep your AI briefed. Track your progress.
>
> That process works for a LinkedIn post generator. It works for a booking platform. It works for a marketplace. It works for any SaaS product you ever want to build.
>
> You now have a live product on the internet. Go share it."

---

---

## INSTRUCTOR CHEAT SHEET

| Step | What to do | Prompt needed? |
|---|---|---|
| Boilerplate | Paste boilerplate prompt | Yes |
| Feature 1 - Backend | Paste API route prompt | Yes |
| Feature 1 - Frontend | Paste component prompt | Yes |
| /init | Type `/init` in Claude Code | No |
| TASKS.md update | Paste update prompt | Yes |
| Feature 2 | Paste auth prompt | Yes |
| Update docs | Paste update prompt | Yes |
| Feature 3 | Paste persona prompt | Yes |
| Update docs | Paste update prompt | Yes |
| Feature 4 | Paste save/dashboard prompt | Yes |
| Update docs | Paste update prompt | Yes |
| Deploy | Live demo on Vercel | No |

---

## TIMING GUIDE

| Section | Time |
|---|---|
| Boilerplate | 15 min |
| Feature 1 — Post Generator | 25 min |
| /init + TASKS.md | 5 min |
| Feature 2 — Login/Signup | 20 min |
| Update docs | 5 min |
| Feature 3 — Persona | 20 min |
| Update docs | 5 min |
| Feature 4 — Save Posts | 20 min |
| Update docs | 5 min |
| Deploy to Vercel | 15 min |
| Closing | 5 min |
| **Total** | **~2.5 hours** |
