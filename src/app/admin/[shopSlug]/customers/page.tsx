import { desc, eq } from "drizzle-orm";
import { DataTable } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { db } from "@/db";
import { bookings, customers } from "@/db/schema";
import { requireShopOwner } from "@/server/admin";

export default async function CustomersPage({ params }: { params: Promise<{ shopSlug: string }> }) {
  const { shopSlug } = await params; const { shop } = await requireShopOwner(shopSlug); const rows = await db.selectDistinct({ id: customers.id, name: customers.name, phone: customers.phone, phoneVerifiedAt: customers.phoneVerifiedAt, createdAt: customers.createdAt }).from(customers).innerJoin(bookings, eq(bookings.customerId, customers.id)).where(eq(bookings.shopId, shop.id)).orderBy(desc(customers.createdAt)).limit(100);
  return <><PageHeader title="Customers" description="Your verified customer directory." /><DataTable caption="Customers" rows={rows} getRowKey={row => row.id} empty={<EmptyState title="No customers yet" description="Customers are created when they verify their phone number." />} columns={[{ key: "name", header: "Name", cell: row => row.name || "—" }, { key: "phone", header: "Phone", cell: row => row.phone }, { key: "verified", header: "Verification", cell: row => row.phoneVerifiedAt ? "Verified" : "Pending" }]} /></>;
}
