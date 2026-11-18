# QueueCut

Phase 1 foundation for a multi-tenant barber and salon scheduling service.

## Setup

1. Copy `.env.example` to `.env.local` and add Neon pooled `DATABASE_URL` plus direct `DATABASE_URL_UNPOOLED`.
2. Run `npm install`.
3. Apply migrations using the **direct** connection: `npx drizzle-kit migrate`.
4. Seed the demo: `npx tsx src/db/seed.ts` (owner: `owner@hassans.test`, password: `QueueCut123!`).
5. Run `npm run dev` and sign in at `/login`.

## Try the booking portal

After seeding, visit `/s/hassans-studio`. Select one or more services, choose a slot, and enter a Pakistani-format phone number such as `+923001234567`. The development OTP appears in the server console. The seed login remains available at `/login`.

`DATABASE_URL` is for app traffic. Migrations use `DATABASE_URL_UNPOOLED` because Neon pooling is unsuitable for session-level migration work.

## Database-backed integration tests

Copy `.env.test.example` to `.env.test` and set `DATABASE_URL_TEST` to a separate, disposable Postgres database's real connection string (never point it at development or production). `USER`, `PASSWORD`, and `HOST` are placeholders, not literal values. Apply the schema with `npm.cmd run db:test:migrate`, then run `npm.cmd run test:integration`. These tests truncate only that test database between cases. Without `DATABASE_URL_TEST`, the integration suite is skipped; the regular `npm.cmd test` suite remains database-free.

## Included

- Strict TypeScript Next.js App Router foundation
- Drizzle schema and SQL migration, including a GiST exclusion constraint preventing active booking overlap per staff member
- Credentials-based Auth.js staff/owner login and owner-only middleware
- Owner shop, service, and staff/break management screens
- Seed data: one shop, two staff and five services

## Live operations (Phase 3)

After seeding, sign in with `owner@hassans.test` / `QueueCut123!` and open `/dashboard/queue`. The queue is role-protected; owners may select a staff member. Open `/s/hassans-studio` in another tab to see public availability refresh after queue changes. Ticket URLs are available from each confirmed booking's `ticket_token` in the database.

Phase 3 includes live queue updates, walk-ins, delay tooling and customer ticket pages. Notifications, background jobs, Web Push and localisation are intentionally not included yet.
