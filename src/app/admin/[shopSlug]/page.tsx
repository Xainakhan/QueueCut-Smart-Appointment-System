import { and, eq, gte, lt } from "drizzle-orm";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/admin/stat-card";
import { db } from "@/db";
import { bookings, customers } from "@/db/schema";
import { requireShopAdmin } from "@/server/admin";

export default async function OverviewPage({ params }: { params: Promise<{ shopSlug: string }> }) {
  const { shopSlug } = await params; const { shop } = await requireShopAdmin(shopSlug);
  const start = new Date(); start.setHours(0, 0, 0, 0); const end = new Date(start); end.setDate(end.getDate() + 1);
  const today = await db.select().from(bookings).where(and(eq(bookings.shopId, shop.id), gte(bookings.startAt, start), lt(bookings.startAt, end)));
  const customerRows = await db.select({ id: customers.id }).from(customers).innerJoin(bookings, eq(bookings.customerId, customers.id)).where(eq(bookings.shopId, shop.id));
  const completed = today.filter(item => item.status === "done").length; const waiting = today.filter(item => item.status === "confirmed").length;
  return <><PageHeader title="Overview" description={`Your shop at a glance — times are shown in ${shop.timeZone}.`} action={<a className="button" href={`/admin/${shop.slug}/queue`}>Open live queue</a>} /><div className="stat-grid"><StatCard label="Today’s bookings" value={today.length} detail={`${completed} completed`} /><StatCard label="Waiting now" value={waiting} detail="Confirmed appointments" /><StatCard label="Customers" value={new Set(customerRows.map(row => row.id)).size} detail="Across all bookings" /><StatCard label="Cancelled / no-show" value={today.filter(item => item.status === "cancelled" || item.status === "no_show").length} detail="Today" /></div><section className="card"><h2>Today at a glance</h2><p className="muted-copy">Use the live queue to start, finish, or manage today’s appointments.</p><a className="button ghost" href={`/admin/${shop.slug}/bookings`}>View all bookings</a></section></>;
}
