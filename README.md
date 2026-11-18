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
