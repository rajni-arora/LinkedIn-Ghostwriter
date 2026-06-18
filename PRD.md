# PRD.md — LinkedIn Ghost Writer
### Product Requirements Document · v1.0

---

## 1. Problem Statement

### The Pain
LinkedIn has become the #1 platform for B2B visibility, personal branding, and inbound leads — but most founders, marketers, and solopreneurs struggle to post consistently. Writing high-performing LinkedIn posts requires:
- A strong hook that stops the scroll
- A clear, structured narrative
- The right tone, emojis, and hashtags
- Time — which most builders don't have

The result: people either don't post at all, or post generic content that gets no engagement.

### Who Has This Pain
| User Type | Pain Level | Context |
|---|---|---|
| Solo founders | High | Building in public but no time or writing skills |
| Marketers managing personal brand | High | Need volume + consistency across accounts |
| Solopreneurs | High | Know their niche but can't translate it to posts |
| Agencies | Medium | Managing multiple client voices at scale |

### Cost of Not Solving It
- Lost inbound leads and brand visibility
- Inconsistent posting = algorithm deprioritisation
- Hours wasted staring at a blank text box
- Generic posts that damage rather than build credibility

---

## 2. Product Vision

> **LinkedIn Ghost Writer** is the AI writing partner that knows your voice, your niche, and your audience — so every post sounds like you, not a robot.

Users input a topic, URL, or idea in seconds. The app generates polished, tone-matched LinkedIn posts with virality scoring, emoji & hashtag recommendations, and per-post analytics. No more blank page. No more generic content.

---

## 3. Goals & Success Metrics

### v1 Goals
- Ship a working, live product that generates revenue
- Validate that users return to generate more than 3 posts per week
- Prove that AI-generated posts with persona matching feel authentic to users

### KPIs

| Metric | Target (30 days post-launch) |
|---|---|
| Signed-up users | 100+ |
| Activation rate (generated ≥1 post) | > 60% |
| Posts generated per active user / week | ≥ 3 |
| Day-7 retention | > 30% |
| Posts saved (not just generated) | > 40% of generated |
| Average virality score of saved posts | > 55 / 100 |

---

## 4. Target Users

### Primary Persona — "The Builder"
- Solo founder or early-stage co-founder
- Posts 2–4x per week to build in public
- Has a clear niche but no time to write
- Wants posts that sound like them, not AI

### Secondary Persona — "The Marketer"
- Marketing professional managing their personal LinkedIn
- Needs consistent output — 5+ posts per week
- Values tone control and hashtag relevance
- Tracks what performs via basic analytics

### Tertiary Persona — "The Agency"
- Manages LinkedIn for 3–10 clients (v2 scope for multi-seat)
- Needs to match different voices per client
- Currently using spreadsheets + manual writing

---

## 5. User Stories

### Authentication (P0)
- As a new user, I want to sign up with my email and password so I can start using the app.
- As a returning user, I want to log in with Google so I don't have to remember a password.
- As a user who forgot my password, I want to receive a magic link so I can regain access.

### Persona Setup (P0)
- As a new user, I want to set up my writing persona (tone, industry, audience) so every post matches my voice.
- As an existing user, I want to update my persona anytime so the app evolves with me.

### Post Generation (P0)
- As a user, I want to type a brief idea and get a full LinkedIn post so I don't have to write from scratch.
- As a user, I want to select my tone before generating so the post matches how I communicate.
- As a user, I want to edit the generated post before saving so I have full control over what goes out.

### Post from URL (P1)
- As a user, I want to paste a URL and get a LinkedIn post based on its content so I can repurpose articles and blogs quickly.
- As a user, I want to see a loading state while the URL is being fetched so I know the app is working.

### Post Variants (P1)
- As a user, I want to see 2–3 rewrites of my post so I can pick the version that resonates most.
- As a user, I want to click a variant to load it into the editor so I can continue refining it.

### Virality Score (P1)
- As a user, I want to see a virality score for my post so I know how likely it is to perform well.
- As a user, I want to see specific tips to improve my score so I can make the post better before saving.
- As a user, I want the score to update as I edit my post so I get real-time feedback.

### Emoji & Hashtag Suggestions (P1)
- As a user, I want contextually relevant emoji suggestions so I can add personality without guessing.
- As a user, I want hashtag recommendations ranked by relevance so I can maximise reach.
- As a user, I want to click an emoji or hashtag to add it to my post so the workflow is seamless.

### Save & Manage Posts (P0)
- As a user, I want to save my final post so I can reference it later.
- As a user, I want to view all my saved posts in one place so I can manage my content library.
- As a user, I want to delete a saved post so I can keep my library clean.

### Analytics (P2)
- As a user, I want to manually log views, likes, comments, and reposts for a saved post so I can track real performance.
- As a user, I want to see a simple chart of my post's performance over time so I can spot trends.

### Theme (P2)
- As a user, I want to toggle between dark and light mode so the app is comfortable to use at any time.

---

## 6. Feature Specifications

### 6.1 Authentication

**Acceptance Criteria:**
- User can sign up with email + password
- User can log in with Google OAuth via Supabase
- User can request a password reset via magic link
- First-time login redirects to `/persona`
- Subsequent logins redirect to `/product`
- All non-auth routes are protected — unauthenticated users are redirected to `/login`
- Inline validation errors are shown on form submission

**Edge Cases:**
- User tries to sign up with an already-registered email → show "email already in use" error
- Google OAuth account already linked to an existing email account → Supabase handles merge
- Magic link expired → show re-send option

---

### 6.2 Persona Setup

**Acceptance Criteria:**
- Form captures: full name, headline, industry, target audience, preferred tone(s), content pillars (up to 5), writing style notes, LinkedIn URL (optional)
- Persona is saved via `POST /persona` (upsert)
- Persona loads on `/product` page render via `PersonaContext`
- User can edit persona at any time from settings menu
- Save button shows success/error feedback

**Edge Cases:**
- User skips optional fields → post generation still works with available data
- User has no persona saved and lands on `/product` directly → redirect to `/persona`
- Persona save fails due to network error → show retry prompt, don't lose form data

---

### 6.3 Post Generator

**Acceptance Criteria:**
- User types a brief (topic, idea, or short description) in a text area
- Tone selector is visible and pre-filled from persona; user can override
- "Generate" button is disabled while a request is in flight
- Generated post appears in an editable text area
- User must explicitly click "Save Post" — no auto-save
- Character count is displayed (LinkedIn limit: 3,000 characters)

**Edge Cases:**
- Empty brief submitted → show inline validation error
- OpenAI API timeout or error → show user-friendly error message with retry option
- Generated post exceeds 3,000 characters → highlight the count in red, warn user

---

### 6.4 Post from URL

**Acceptance Criteria:**
- URL input field accepts any valid HTTP/HTTPS URL
- "Fetch & Generate" button triggers `POST /generate/from-url`
- "Fetching URL…" loading state is shown during scraping
- Generated post appears in the same editable text area as manual generation
- Invalid URL format → client-side validation before API call

**Edge Cases:**
- URL returns 404 / is unreachable → show "Could not fetch content from this URL"
- URL is behind a paywall → show "Content could not be extracted — try pasting the article text manually"
- URL scraping times out (> 10s) → cancel request, show timeout message
- URL returns non-text content (PDF, image) → show unsupported content type message

---

### 6.5 Post Variants

**Acceptance Criteria:**
- "Get Variants" button appears after a post is generated
- Clicking it calls `POST /generate/variants` with the current post text
- 2–3 variants are displayed as selectable cards below the editor
- Clicking a variant loads it into the main editor
- Loading state shown while variants are being generated

**Edge Cases:**
- User edits the post before getting variants → variants are based on the edited version
- Only 1 variant returned from OpenAI → display it without breaking the UI

---

### 6.6 Virality Score Predictor

**Acceptance Criteria:**
- Score (0–100) is displayed after post generation
- Score updates automatically as user edits (debounced 1.5s)
- Score badge colour: red (< 40), amber (40–70), green (> 70)
- Expandable panel shows `reasons[]` and `tips[]` from OpenAI response
- Re-score button available for manual trigger

**Edge Cases:**
- Post is empty or < 20 characters → don't trigger scoring, show "Write more to get a score"
- Scoring API fails → show previous score with a stale indicator, don't clear the score
- User edits rapidly → debounce prevents multiple in-flight requests

---

### 6.7 Emoji Suggestor

**Acceptance Criteria:**
- 6–10 emojis displayed below the editor after post generation
- Each emoji shown with a label/tooltip
- Clicking an emoji inserts it at the current cursor position
- "Refresh" button fetches a new set of emojis
- Loading state shown during fetch

**Edge Cases:**
- Cursor not placed in text area → append emoji to end of post
- OpenAI returns < 6 emojis → display however many are returned

---

### 6.8 Hashtag Recommender

**Acceptance Criteria:**
- 5–10 hashtags displayed below the emoji panel
- Hashtags ranked by relevance
- Clicking a hashtag appends it to the end of the post
- "Copy all hashtags" button copies the full list to clipboard
- Already-added hashtags are visually marked (e.g. greyed out / checkmark)

**Edge Cases:**
- Hashtag already in post body → mark as already added, don't duplicate on click
- Clipboard API not available → show a fallback "Select all and copy" instruction

---

### 6.9 Save & Manage Posts

**Acceptance Criteria:**
- "Save Post" stores content, tone, source, source_url, virality_score, emojis_used, hashtags_used
- Saved posts listed in a left sidebar or "My Posts" drawer, sorted by `created_at` descending
- Each saved post shows a preview (first 100 chars), tone badge, virality score, and date
- Delete button soft-deletes (`deleted_at` timestamp) — post disappears from UI immediately
- Saved posts persist across sessions

**Edge Cases:**
- User saves the same post twice → allow it (different `id`, same content)
- Save fails → show error toast, keep the post in the editor
- No saved posts → show an empty state with a prompt to generate the first post

---

### 6.10 Per-Post Analytics

**Acceptance Criteria:**
- Expandable analytics panel on each saved post card
- User manually enters: views, likes, comments, reposts, date posted
- Metrics saved via `POST /analytics/:post_id`
- Simple bar chart (recharts) shows metrics at a glance
- Last updated timestamp shown

**Edge Cases:**
- User submits 0 for all metrics → valid, save as-is
- User updates analytics multiple times → upsert, show latest values
- No analytics entered yet → show empty state with "Log your post performance" prompt

---

## 7. User Flows

### Flow 1 — New User Onboarding
```
Land on /login
  → Sign up with email or Google
  → Redirect to /persona
  → Fill in persona form → Save
  → Redirect to /product
  → See empty post generator with persona loaded
```

### Flow 2 — Generate & Save a Post
```
/product
  → Type brief in text area
  → Select tone (or use persona default)
  → Click "Generate"
  → Read generated post → Edit if needed
  → Review virality score → Apply tips if desired
  → Add emojis / hashtags from suggestions
  → Click "Save Post"
  → Post appears in My Posts sidebar
```

### Flow 3 — Generate Post from URL
```
/product
  → Paste URL in URL input field
  → Click "Fetch & Generate"
  → See "Fetching URL…" state
  → Generated post appears in editor
  → Continue same as Flow 2 from "Edit if needed"
```

### Flow 4 — Get Variants
```
Post is in the editor (from Flow 2 or 3)
  → Click "Get Variants"
  → See 3 variant cards appear below editor
  → Click preferred variant → loads into editor
  → Continue editing / saving
```

### Flow 5 — Log Post Analytics
```
My Posts sidebar → click saved post
  → Expand analytics panel
  → Enter views, likes, comments, reposts, date posted
  → Click "Save Analytics"
  → See bar chart update
```

---

## 8. Assumptions & Constraints

### Assumptions
- Users will copy-paste posts to LinkedIn manually (no LinkedIn API in v1)
- Users have a basic understanding of their own niche and audience
- OpenAI GPT-4o output quality is sufficient for production use without fine-tuning
- Virality scoring is directional, not scientifically precise — users understand this
- A single persona per user is sufficient for v1

### Constraints
| Constraint | Detail |
|---|---|
| OpenAI rate limits | GPT-4o has TPM and RPM limits — implement request queuing if needed |
| Supabase free tier | 500MB DB, 50MB file storage, 2GB bandwidth — sufficient for early users |
| LinkedIn character limit | Posts capped at 3,000 characters — enforce in UI |
| URL scraping reliability | Paywalled or JS-rendered pages may not scrape cleanly |
| No LinkedIn API | Cannot verify if posts actually performed — analytics are self-reported |

---

## 9. Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| OpenAI API outage | Low | High | Show graceful error; consider fallback message |
| Generated posts feel generic | Medium | High | Persona prompt tuning; allow style notes override |
| Users don't return after first session | Medium | High | Email follow-up; saved posts as re-engagement hook |
| Virality scores feel arbitrary | Medium | Medium | Show reasoning (`reasons[]`) to build trust |
| URL scraping fails on popular sites | High | Medium | Handle gracefully with clear error messages |
| Low activation (users sign up but don't generate) | Medium | High | Simplify onboarding; add sample post on first load |

---

## 10. Open Questions

| # | Question | Owner | Due |
|---|---|---|---|
| 1 | Should the virality score be explained to users as "AI estimate" to set expectations? | Product | Before launch |
| 2 | Do we show a character counter live as user types, or only after generation? | Design | Before build |
| 3 | What happens if a user has no persona and tries to generate? Hard block or soft warning? | Product | Before build |
| 4 | Should "My Posts" be a sidebar or a separate `/posts` page? | Design | Before build |
| 5 | Do we want to add a "Copy to clipboard" button on the generated post? | Product | Before launch |
| 6 | Should variants replace the current post or appear alongside it? | Design | Before build |

---

## 11. v1 Release Criteria

The product is ready to ship when:

- [ ] User can sign up, set persona, and generate a post end-to-end
- [ ] Post generation works for both manual brief and URL input
- [ ] Virality score displays with tips on every generated post
- [ ] Emoji and hashtag suggestions load and are insertable
- [ ] Posts can be saved and viewed in My Posts
- [ ] Dark / light mode works on all pages
- [ ] All pages are responsive on mobile
- [ ] Auth is secure — all routes protected, RLS enabled on all tables
- [ ] Environment variables are not committed to version control
- [ ] App is deployed and accessible via public URL

---

## 12. Out of Scope (v1)

- LinkedIn OAuth / direct posting
- Multi-seat / agency accounts
- Scheduled posting
- Image or carousel generation
- Billing / Stripe integration
- Mobile app
- Post performance benchmarking against industry averages
- AI fine-tuning on user's past posts

---

## 13. v2 Roadmap (Planned, Not Committed)

- Stripe subscription billing (monthly / annual plans)
- Multi-seat agency accounts with per-client personas
- Scheduled post queue with LinkedIn OAuth
- AI learns from user's saved posts to improve future generation
- Carousel / image post generation
- Post performance benchmarking
- Chrome extension for one-click post generation from any webpage
