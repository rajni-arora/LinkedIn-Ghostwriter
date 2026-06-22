# TASKS.md — LinkedInWrites

> Read this file at the start of every session.
> Mark tasks [x] immediately after completing them.
> Add subtasks before starting any new feature.
> Never start coding without checking here first.

---

## Setup & Config

- [x] CLAUDE.md created and updated to reflect current codebase
- [x] TASKS.md created
- [x] PRD.md created
- [x] package.json (next, openai, lucide-react, @supabase/ssr, @supabase/supabase-js, sonner)
- [x] tsconfig.json
- [x] next.config.js — devIndicators disabled
- [x] tailwind.config.ts
- [x] postcss.config.js
- [x] .env.local — OPENAI_API_KEY, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
- [x] .gitignore
- [x] npm install completed

---

## Supabase Setup

- [x] Connected Supabase via MCP
- [x] Created `users` table (id, email, first_name, last_name, created_at) with RLS
- [x] Created `user_persona` table (id, user_id, role, industry, target_audience, preferred_tone) with RLS
- [x] Created `saved_posts` table (id, user_id, topic, tone, post_text, virality_score, virality_rationale, created_at) with RLS
- [x] Email confirmation disabled in Supabase dashboard

---

## Auth

- [x] lib/supabase/client.ts — createBrowserClient
- [x] lib/supabase/server.ts — createServerClient with cookie forwarding
- [x] middleware.ts — protects /generate, /saved, /persona; redirects logged-in users away from /login, /signup
- [x] app/(auth)/layout.tsx — animated gradient background + LinkedInWrites logo
- [x] app/(auth)/login/page.tsx
- [x] app/(auth)/signup/page.tsx
- [x] components/auth/LoginForm.tsx — email + password, checks persona on login, redirects accordingly
- [x] components/auth/SignupForm.tsx — first name + last name + email + password, saves to users table
- [x] components/auth/SignOutButton.tsx — signs out, redirects to /login
- [x] app/page.tsx — root redirects to /generate or /login based on auth state

---

## UI — Login / Signup Pages

- [x] LinkedIn blue animated gradient background (#0077B5 shades)
- [x] LinkedInWrites logo SVG in auth layout
- [x] Real LinkedInWrites logo image (logo.png) replacing SVG
- [x] "LinkedIn Post Generator" heading (replaced PostGenius)
- [x] "Make the most of your professional life" tagline (title large, subtitle small)
- [x] Gray card (#E8E8E8) with 7px border radius
- [x] Sign In / Sign Up buttons with 7px border radius (not pill shape)
- [x] First name + Last name fields on signup (side by side → stacked)
- [x] Placeholder text "John" / "Doe" in light grey on signup fields
- [x] Heading stays fixed at top (pt-16, not justify-center) so it doesn't jump between pages
- [x] Next.js "N" dev indicator removed (devIndicators: false)

---

## Persona Setup

- [x] app/(dashboard)/persona/page.tsx — server component, fetches existing persona
- [x] components/persona/PersonaForm.tsx — 4 fields, upserts to user_persona by user_id
- [x] Role dropdown (10 options)
- [x] Industry dropdown (10 options)
- [x] Target audience free text input
- [x] Preferred tone button group (5 options)
- [x] "Save Persona & Continue" → redirects to /generate
- [x] Pre-fills fields if persona already exists ("Edit Your Persona")

---

## Post Generator

- [x] app/(dashboard)/generate/page.tsx — fetches persona server-side, passes as prop
- [x] components/PostGenerator.tsx — full generate UI
- [x] Topic textarea with live character count (0 / 300)
- [x] Generate button disabled when topic empty or over 300 chars
- [x] Tone selector (5 buttons, defaults to persona's preferred tone)
- [x] Persona info card showing role, industry, target audience
- [x] Animated skeleton loading cards (3) while generating
- [x] 3 variation cards with color-coded borders (green 80+, yellow 60-79, orange <60)
- [x] Virality score badge (color-coded)
- [x] Virality rationale in italic
- [x] Copy button → sonner toast "Copied to clipboard!"
- [x] Save button → POST /api/posts → sonner toast "Post saved to your library!"

---

## AI — OpenAI Integration

- [x] app/api/generate/route.ts — POST, calls gpt-4o server-side only
- [x] Persona fetched server-side in API (client only sends topic + tone)
- [x] System prompt with LinkedIn post writing guidelines
- [x] Persona context injected into prompt (role, industry, target audience, preferred tone)
- [x] Virality scoring criteria defined (hook + insight + emotion + CTA, 25pts each)
- [x] Honest scoring instructions (no hardcoded placeholder numbers)

---

## Save Posts

- [x] app/api/posts/route.ts — GET (list user's posts) + POST (save post)
- [x] app/api/posts/[id]/route.ts — DELETE (checks user_id ownership)
- [x] app/(dashboard)/saved/page.tsx — client component, fetches via API
- [x] components/dashboard/SavedPostCard.tsx — card with modal
- [x] Post count badge ("12 posts") in saved page heading
- [x] Click card → opens full post modal with Copy Full Post button
- [x] Copy button → sonner toast
- [x] Delete button → confirm on first click, delete on second click → sonner toast
- [x] Empty state with link to /generate

---

## Sidebar & Dashboard Layout

- [x] app/(dashboard)/layout.tsx — fixed left sidebar, 240px wide
- [x] LinkedInWrites logo in sidebar top
- [x] components/dashboard/SidebarNav.tsx — active link highlight using usePathname
- [x] Navigation links: Generate Posts, My Persona, Saved Posts
- [x] User avatar with initials (blue circle)
- [x] User display name (first + last name or email)
- [x] Logout button at bottom of sidebar
- [x] Sonner <Toaster /> added to root layout (bottom-right, richColors)

---

## Vercel Deployment

- [ ] Push project to GitHub
- [ ] Connect repo to Vercel (Add New Project)
- [ ] Add environment variables in Vercel: OPENAI_API_KEY, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
- [ ] Trigger deploy — verify build passes
- [ ] Test live URL end-to-end

---

## QA & Testing

- [ ] Full user flow: Sign up → Persona → Generate → Save → View saved → Delete
- [ ] Test in incognito (new user simulation)
- [ ] Post generation works for all 5 tones
- [ ] Virality score color coding correct (green / yellow / orange)
- [ ] Persona context reflects in generated posts
- [ ] Toast notifications appear for Copy, Save, Delete
- [ ] Saved post modal opens and shows full text
- [ ] Character count turns red over 300
- [ ] Skeleton cards appear while generating
- [ ] Mobile layout correct (1-column on small screens)
- [ ] Logout works and redirects to login

---

## Pending / Next Steps

- [ ] Switch AI from OpenAI (gpt-4o) to Claude (claude-sonnet-4-6) — requires ANTHROPIC_API_KEY + @anthropic-ai/sdk
- [ ] Add "Regenerate" button to get 3 new post variations without clearing topic
- [ ] Add favicon using LinkedInWrites logo
- [ ] Add Open Graph meta tags for social sharing
