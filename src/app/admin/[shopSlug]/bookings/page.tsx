import { desc, eq } from "drizzle-orm";
import { DataTable } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { db } from "@/db";
import { bookings, customers } from "@/db/schema";
import { requireShopAdmin } from "@/server/admin";

export default async function BookingsPage({ params }: { params: Promise<{ shopSlug: string }> }) {
  const { shopSlug } = await params; const { shop } = await requireShopAdmin(shopSlug);
  const rows = await db.select({ id: bookings.id, ticket: bookings.ticketNumber, status: bookings.status, startAt: bookings.startAt, customer: customers.name }).from(bookings).innerJoin(customers, eq(bookings.customerId, customers.id)).where(eq(bookings.shopId, shop.id)).orderBy(desc(bookings.startAt)).limit(50);
  return <><PageHeader title="Bookings" description="Searchable booking history and today’s appointments." /><DataTable caption="Bookings" rows={rows} getRowKey={row => row.id} empty={<EmptyState title="No bookings yet" description="Bookings made from your public page will appear here." />} columns={[{ key: "ticket", header: "Ticket", cell: row => row.ticket }, { key: "customer", header: "Customer", cell: row => row.customer }, { key: "start", header: "Start", cell: row => new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short", timeZone: shop.timeZone }).format(row.startAt) }, { key: "status", header: "Status", cell: row => <span className={`status ${row.status}`}>{row.status.replace("_", " ")}</span> }]} /></>;
}
