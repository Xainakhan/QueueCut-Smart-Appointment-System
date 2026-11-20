import { eq } from "drizzle-orm";
import { PageHeader } from "@/components/ui/page-header";
import { db } from "@/db";
import { services } from "@/db/schema";
import { requireShopOwner } from "@/server/admin";
import { addService } from "@/server/owner";
export default async function ServicesPage({ params }: { params: Promise<{ shopSlug: string }> }) { const { shopSlug } = await params; const { shop } = await requireShopOwner(shopSlug); const rows = await db.query.services.findMany({ where: eq(services.shopId, shop.id) }); return <><PageHeader title="Services" description="Manage the services customers can book." /><section className="card rows">{rows.map(row => <div key={row.id}><b>{row.name}</b><span>{row.durationMinutes} minutes · Rs {row.price}</span><i className={row.active ? "on" : "off"}>{row.active ? "Active" : "Paused"}</i></div>)}<form action={async form => { "use server"; await addService(Object.fromEntries(form)); }} className="add-form"><input name="name" placeholder="Service name" required /><input name="durationMinutes" type="number" placeholder="Minutes" required /><input name="price" type="number" placeholder="Price" required /><button>Add service</button></form></section></>; }
