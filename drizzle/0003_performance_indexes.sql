CREATE INDEX "staff_shop_active_idx" ON "staff" USING btree ("shop_id", "active");
CREATE INDEX "staff_user_idx" ON "staff" USING btree ("user_id");
CREATE INDEX "bookings_shop_start_idx" ON "bookings" USING btree ("shop_id", "start_at");
CREATE INDEX "bookings_staff_start_idx" ON "bookings" USING btree ("staff_id", "start_at");
CREATE INDEX "bookings_customer_idx" ON "bookings" USING btree ("customer_id");
