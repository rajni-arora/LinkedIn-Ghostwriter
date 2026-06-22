# PRD — LinkedInWrites

**Version:** 1.1
**Status:** MVP Built — Pending Deployment
**Last Updated:** June 2026

---

## 1. Problem Statement

LinkedIn professionals — founders, marketers, consultants, executives — know they should post consistently on LinkedIn. They don't. Writing takes too long, they don't know what to say, and they're not confident the post will actually perform.

The result: inconsistent posting, low engagement, missed visibility.

---

## 2. Solution

**LinkedInWrites** — a web app where users set up their professional persona once (role, industry, audience, tone), then generate 3 AI-written LinkedIn posts on any topic in seconds. Each post comes with a virality score so users know which variation to publish. The best posts get saved to a personal dashboard for future use.

---

## 3. Target Users

| User | Pain Point |
|---|---|
| Founders | No time to write but need to build personal brand |
| Marketers | Need consistent LinkedIn content for themselves or clients |
| Consultants | Want to demonstrate expertise without spending hours writing |
| Executives | Know visibility matters but struggle to find the right words |

**Primary persona:** A professional with 5–15 years of experience who understands the value of LinkedIn but treats writing as a bottleneck.

---

## 4. Goals

### Business Goals
- Ship a live, working product that can charge users
- Validate willingness to pay for AI LinkedIn content
- Build a foundation for premium features (scheduling, analytics, team accounts)

### User Goals
- Generate a publish-ready LinkedIn post in under 2 minutes
- Posts that sound like the user — not generic AI content
- Know which variation will perform best before publishing
- Keep a personal library of the best posts

---

## 5. MVP Scope

### In Scope ✅ (Built)
- Email + password authentication (Supabase) with first name + last name on signup
- Persona setup: role, industry, target audience, preferred tone
- Post generator: topic input (300 char limit) + tone selector + OpenAI API
- Persona context injected into AI prompt (posts written in user's voice)
- 3 post variations per request with honest virality scores + rationale
- Color-coded card borders based on virality score
- Skeleton loading cards while AI generates
- Save post to personal dashboard with toast notifications
- Copy post to clipboard with toast notifications
- Full post modal on saved posts page
- Delete saved posts with confirmation step
- Post count on saved posts page
- Sidebar navigation with active page highlighting
- User avatar with initials
- Responsive design (mobile + desktop)
- Animated gradient background on auth pages
- LinkedInWrites branding + logo

### Out of Scope (v1)
- Social login (Google, LinkedIn OAuth)
- Direct publish to LinkedIn
- Post scheduling
- Team / agency accounts
- Post analytics and performance tracking
- Voice input
- Post history / version history
- Custom tone creation
- Rate limiting on /api/generate
- Email verification on signup

---

## 6. User Flow

```
Landing (/) ──→ Login / Signup (Screen 1)
                      │
              ┌───────┴────────┐
           Login             Signup
              │                 │
     Check user_persona      Save to users table
              │                 │
     Has persona?            Redirect to /persona
      Yes ──→ /generate
      No  ──→ /persona
                      │
                      ▼
              Persona Setup (Screen 2)  ←── editable anytime
                      │
                      ▼
           Post Generator (Screen 3)  ←──────────────────┐
                      │                                    │
                      ▼                                    │
           Generated Post Output                          │
           [Variation 1] [Variation 2] [Variation 3]      │
                      │                                    │
               Save Post ──→ Saved Posts Dashboard ────────┘
                             (Screen 4)
```

---

## 7. Product Screens

### Screen 1 — Login / Signup (`/login`, `/signup`)

**Purpose:** Authenticate the user before accessing any feature.

**Design:**
- Animated gradient background (LinkedIn blue shades: #0077B5 → #004182 → #0a66c2)
- LinkedInWrites logo image at top
- Tagline: "Make the most of your professional life"
- Light gray card (#E8E8E8) with 7px border radius
- Blue (#0077B5) buttons with 7px border radius

**Login (`/login`):**
- Email + password → Supabase `signInWithPassword`
- Success: checks `user_persona` table → redirect to `/generate` (has persona) or `/persona` (no persona)
- Failure: inline error message

**Signup (`/signup`):**
- First name + last name + email + password (min 8 chars)
- Success: saves user to `users` table → redirect to `/persona`
- Failure: inline validation error
- Note: Email confirmation is disabled — users can sign in immediately

**Acceptance Criteria:**
- [x] User can log in with valid credentials
- [x] User sees error for wrong credentials
- [x] User can sign up with first name, last name, email, password
- [x] Password under 8 chars shows validation error
- [x] After login: redirect to /persona (new) or /generate (returning)
- [x] After signup: redirect to /persona
- [x] Signed-in users visiting /login or /signup are redirected to /generate

---

### Screen 2 — Persona Setup (`/persona`)

**Purpose:** Capture the user's professional identity so the AI writes posts that sound like them.

**Design:** Inside dashboard layout (sidebar visible). White card with clean form.

**Fields:**
| Field | Type | Required |
|---|---|---|
| Role | Dropdown (10 options) | Yes |
| Industry | Dropdown (10 options) | Yes |
| Target Audience | Free text | Yes |
| Preferred Tone | Button group (5 options) | Yes |

**Role options:** Founder, Executive, Marketer, Consultant, Sales Professional, HR Professional, Engineer, Designer, Educator, Other

**Industry options:** SaaS / Tech, Finance, Healthcare, Marketing & Advertising, Consulting, E-commerce, Education, Real Estate, Legal, Other

**Tone options:** Authoritative | Conversational | Inspirational | Data-Driven | Storytelling

**Behavior:**
- New user: blank form, heading "Set Up Your Persona"
- Returning user: pre-filled form, heading "Edit Your Persona"
- Save: upserts to `user_persona` table by `user_id`
- On success: redirect to `/generate`

**Acceptance Criteria:**
- [x] All 4 fields are required
- [x] Returning user sees saved values pre-filled
- [x] Save redirects to /generate
- [x] Data persists in Supabase user_persona table

---

### Screen 3 — Post Generator (`/generate`)

**Purpose:** Core feature. User inputs a topic, selects a tone, and receives 3 AI-written LinkedIn posts with virality scores.

**Persona Info Card (top of page):**
- Shows: "Writing as a [Role] in [Industry] · Audience: [Target Audience]"
- Always visible so user knows which context is being used

**Generator Form:**
| Element | Detail |
|---|---|
| Topic textarea | 300 character limit with live counter (turns red over limit) |
| Tone selector | 5 toggle buttons, defaults to persona's preferred tone |
| Generate button | Disabled when topic empty or over 300 chars |
| Loading state | 3 animated skeleton cards while AI generates |

**API Call:** `POST /api/generate`
```
Request:  { topic, tone }   ← persona fetched server-side automatically
Response: { variations: [{ postText, viralityScore, viralityRationale }] }
```

**Generated Output (3 variation cards):**
| Element | Detail |
|---|---|
| Card border | Color-coded border-2: green (80+), yellow (60-79), orange (<60) |
| Label | "Variation 1 / 2 / 3" |
| Virality Score badge | Color-coded: green (80+), yellow (60-79), orange (<60) |
| Rationale | Italic sentence — specific reasoning for the score |
| Post text | Full post, whitespace preserved |
| Copy button | Copies to clipboard → toast "Copied to clipboard!" |
| Save button | Saves to Supabase → toast "Post saved to your library!" → button stays blue/disabled |

**Acceptance Criteria:**
- [x] Persona info card shows correct user context
- [x] Generate button disabled when topic is empty or over 300 chars
- [x] Skeleton cards show while AI is generating
- [x] Exactly 3 variation cards render after generation
- [x] Card borders and score badges use correct color coding
- [x] Copy button triggers toast notification
- [x] Save button saves to Supabase and triggers toast
- [x] Error message shows if API call fails

---

### Screen 4 — Saved Posts (`/saved`)

**Purpose:** Personal library of saved LinkedIn posts.

**Layout:** 3-column grid (desktop) → 1-column (mobile). Post count shown in heading badge.

**Each post card:**
| Element | Detail |
|---|---|
| Topic | Bold heading |
| Tone | Small pill badge |
| Virality score | Color-coded badge |
| Post preview | 3-line preview (line-clamp) |
| "Click to read full post →" | Hint text |
| Date saved | e.g. "Jun 15, 2025" |
| Copy button | Copies full post → toast notification |
| Delete button | First click: "Confirm Delete", second click: deletes + toast "Post deleted." |

**Full Post Modal:**
- Opens when user clicks anywhere on the card
- Shows topic, tone badge, virality score, full post text (scrollable)
- Copy Full Post button with toast
- Close with X button or click outside

**Empty state:** "No saved posts yet. Generate your first post!" + link to `/generate`

**Acceptance Criteria:**
- [x] All saved posts load on page visit
- [x] Post count badge shows correct number
- [x] Click card opens full post modal
- [x] Copy triggers toast notification
- [x] Delete requires confirm step (two clicks)
- [x] Deleted post disappears from UI without page refresh
- [x] Empty state shows when no posts exist

---

### Sidebar Navigation (all dashboard screens)

**Design:** Fixed left sidebar, 240px wide, white background.

| Element | Detail |
|---|---|
| Logo | LinkedInWrites logo image at top |
| Generate Posts | Link to /generate — highlights blue when active |
| My Persona | Link to /persona — highlights blue when active |
| Saved Posts | Link to /saved — highlights blue when active |
| User avatar | Blue circle with initials (e.g. "RA") |
| Display name | First + last name, or email if no name |
| Logout button | Signs out → redirects to /login |

---

## 8. AI Prompt Design

**Model:** `gpt-4o` (OpenAI)
**Called from:** Server-side API route only — never from the browser.

**System prompt** defines:
- Expert LinkedIn ghostwriter persona
- Post writing rules (hook, short paragraphs, insight, CTA)
- Honest virality scoring criteria (hook + insight + emotion + CTA, 25pts each)
- Score calibration: generic = 50–65, strong = 75–85, exceptional = 86–95

**User prompt** includes:
- Topic + tone
- Persona context (role, industry, target audience, preferred tone)
- JSON response schema (no placeholder numbers — LLM evaluates each post individually)

**Response schema:**
```json
{
  "variations": [
    {
      "postText": "full post text",
      "viralityScore": 78,
      "viralityRationale": "Specific reason this post will or won't perform well."
    }
  ]
}
```

---

## 9. Data Model

### `users` table
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK, FK → auth.users |
| email | text | |
| first_name | text | |
| last_name | text | |
| created_at | timestamptz | |

### `user_persona` table
| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| user_id | uuid | FK → auth.users, unique (one per user) |
| role | text | |
| industry | text | |
| target_audience | text | |
| preferred_tone | text | |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### `saved_posts` table
| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| user_id | uuid | FK → auth.users |
| topic | text | |
| tone | text | |
| post_text | text | |
| virality_score | integer | |
| virality_rationale | text | |
| created_at | timestamptz | |

**Security:** Row Level Security (RLS) enabled on all 3 tables. Users can only read and write their own rows.

---

## 10. Non-Functional Requirements

| Requirement | Target |
|---|---|
| Post generation time | < 10 seconds |
| Mobile responsive | Yes — all screens |
| Auth security | Supabase RLS + server-side auth checks on every API route |
| API key security | OPENAI_API_KEY stored as server-side env var only, never exposed to browser |
| Error handling | All API routes return structured errors; UI shows inline error messages + toasts |
| Character limit | Topic input capped at 300 characters |

---

## 11. Success Metrics (Post-Launch)

- User completes full flow (signup → persona → generate → save) in under 5 minutes
- At least 1 post saved per active user per session
- Zero API key leaks (OpenAI key never appears in client bundle)
- App loads and generates posts on Vercel without errors

---

## 12. Pending Decisions / Next Steps

| Item | Status |
|---|---|
| Switch AI from OpenAI (gpt-4o) to Claude (claude-sonnet-4-6) | Pending |
| Deploy to Vercel + add env vars | Pending |
| Add "Regenerate" button for fresh variations on same topic | Pending |
| Add favicon using LinkedInWrites logo | Pending |
| Add Open Graph meta tags for social sharing | Pending |
| Rate limiting on /api/generate | Nice to have |
| Pricing model for monetization | Out of scope for MVP |
