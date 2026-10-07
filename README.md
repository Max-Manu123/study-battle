# Study Battle

Early validation landing page for Study Battle — a gamified study platform where students prepare for exams through challenges, competition and AI-powered practice.

## Current goal

Validate demand before building the full product.

**Landing page promise:** Turn studying into a competition.

The beta form collects:
- What the student is preparing for
- Exam timing
- Interest in competing with friends
- What would make the product useful
- Email

## Stack

- React + Vite
- Supabase for beta signups
- PostHog for validation analytics

## Events

- `beta_cta_clicked`
- `beta_form_submitted_attempt`
- `beta_form_submitted`

## Local setup

1. Clone the repository.
2. Install dependencies with `npm install`.
3. Copy `.env.example` to `.env.local`.
4. Add the Supabase and PostHog values.
5. Start the dev server with `npm run dev`.

Do not commit `.env.local`.

## Supabase

The migration at `supabase/migrations/202610070001_create_beta_signups.sql` creates the beta signup table and its anonymous INSERT policy.

**Important:** the current connected Supabase project is an existing project for another app, so it has intentionally not been modified. Create/connect a dedicated Study Battle Supabase project before applying this migration.

The browser only needs the Supabase URL and publishable/anon key. Never put a service-role key in frontend code.

## Validation

The first objective is not scale. It is signal:

**20 real interested students → 5–10 testers → retention → first payment.**

Do not build the full app until the landing page produces meaningful demand.
