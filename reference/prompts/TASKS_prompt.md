You are a senior software engineer and project manager.

I want you to create a complete TASKS.md file for my project.

TASKS.md is a running checklist of every task in the project —
organized by category, marked [x] when done and [ ] when pending.
It is read at the start of every coding session to know exactly
where to pick up.

Here are my project details:

PROJECT NAME: [e.g. LinkedIn Post Generator]
TECH STACK: [e.g. Next.js, OpenAI, Supabase, Vercel]

WHAT IS ALREADY DONE:
[List everything that has been completed so far]
Example:
- CLAUDE.md created
- PRD.md created
- package.json created
- npm install done
- Build passes successfully

WHAT STILL NEEDS TO BE BUILT:
[List all remaining features and files]
Example:
- Login page
- Signup page
- Persona setup page
- Post generator page
- Saved posts dashboard
- API routes
- Supabase setup
- Vercel deployment

PRODUCT SCREENS:
[List each screen and the files/components needed for it]
Example:
Screen 1 - Login/Signup: login page, signup page,
           LoginForm component, SignupForm component
Screen 2 - Persona: persona page, PersonaForm component
Screen 3 - Generator: generate page, PostForm component,
           PostOutput component, PostVariation component
Screen 4 - Dashboard: saved page, SavedPostCard component

API ROUTES NEEDED:
[List all API endpoints to be built]

EXTERNAL SERVICES TO SET UP:
[e.g. Supabase project, Vercel deployment, GitHub repo]

QA TESTS TO RUN:
[List the key things to test before going live]

Based on the above, generate a complete TASKS.md file that:

1. Starts with a rules header:
   "Read this file at the start of every session.
    Mark tasks [x] immediately after completing them.
    Add subtasks before starting any new feature.
    Never start coding without checking here first."

2. Groups tasks into clear categories:
   - Setup & Config
   - One section per product screen
   - API Routes
   - External services (Supabase, etc.)
   - Deployment (Vercel)
   - QA & Testing

3. Marks already completed tasks as [x]

4. Marks all pending tasks as [ ]

5. Each task is one clear line — short and actionable

6. Adds a short description after each task explaining
   what file it refers to or what it does

Format it cleanly with markdown headers and checkboxes.
Make it easy to scan at a glance.
