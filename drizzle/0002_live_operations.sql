ALTER TABLE "shops" ADD COLUMN "grace_minutes" integer NOT NULL DEFAULT 10;
ALTER TABLE "staff" ADD COLUMN "delayed_minutes" integer NOT NULL DEFAULT 0;
ALTER TABLE "bookings" ADD COLUMN "ticket_token" text NOT NULL DEFAULT gen_random_uuid()::text;
ALTER TABLE "bookings" ADD COLUMN "offered_start_at" timestamptz;
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_ticket_token_unique" UNIQUE("ticket_token");
