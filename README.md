# QueueCut

A multi-tenant barber and salon scheduling service with live queue operations.

## Setup

1. Copy `.env.example` to `.env.local` and add Neon pooled `DATABASE_URL` plus direct `DATABASE_URL_UNPOOLED`.
2. Set `SEED_OWNER_EMAIL` and `SEED_OWNER_PASSWORD` in `.env.local` if you want demo data.
3. Run `npm install`.
4. Apply migrations using the direct connection: `npx drizzle-kit migrate`.
5. Seed the demo: `npx tsx src/db/seed.ts`.
6. Run `npm run dev` and sign in at `/login` with the owner account you configured.

## Try the app

After seeding, visit `/s/queuecut-studio` to book an appointment. Sign in and open `/dashboard/queue` to manage the live queue. The development OTP appears in the server console.

`DATABASE_URL` is for app traffic. Migrations use `DATABASE_URL_UNPOOLED` because Neon pooling is unsuitable for session-level migration work.

## Database-backed integration tests

Copy `.env.test.example` to `.env.test` and set `DATABASE_URL_TEST` to a separate, disposable Postgres database's real connection string. Apply the schema with `npm.cmd run db:test:migrate`, then run `npm.cmd run test:integration`. These tests truncate only that test database between cases.

## Included

- Strict TypeScript Next.js App Router foundation
- Drizzle schema and SQL migrations, including a GiST exclusion constraint preventing active booking overlap per staff member
- Credentials-based Auth.js staff/owner login and role protection
- Live queue updates, walk-ins, delays, earlier offers, and customer ticket pages

## Deploying a pilot (Vercel + Neon)

Vercel works well for this application when paired with Neon Postgres. Import the GitHub repository into Vercel; it detects Next.js automatically. Add `DATABASE_URL` (the Neon pooled connection string), `DATABASE_URL_UNPOOLED` (the direct connection string), and a new random `AUTH_SECRET` to Production, Preview, and Development as appropriate. Add the seed and VAPID variables only when those features are in use. `AUTH_URL` is optional on Vercel and should be the canonical production URL if set.

Before the first deployment, run `npm run db:migrate` from a trusted machine with `DATABASE_URL_UNPOOLED` set to the production database. Run it again for every migration. Never use the test database for a pilot. Queue pages use short polling intervals rather than process-local server events, which keeps updates reliable across Vercel's independent function instances.

Pilot checklist: create the shop and its public slug; add services and staff; set each person’s hours and breaks; print or share the public booking URL; make one complete booking; start and finish it from the staff queue; verify the ticket link receives the queue update.

## Route audit

`/` redirects to sign-in; `/login` is the owner/staff sign-in form; `/owner` manages shop, services and staff; `/dashboard/queue` is the live staff queue; `/s/[shopSlug]` is the customer booking portal and public queue; `/t/[ticketToken]` is the customer ticket. API routes supply booking, live events, ticket acceptance, authentication, and queue operations. Global `not-found` and `error` screens now cover invalid links and rendering failures.
