import { eq } from "drizzle-orm";
import { PageHeader } from "@/components/ui/page-header";
import { db } from "@/db";
import { staff } from "@/db/schema";
import { requireShopOwner } from "@/server/admin";
import { addStaff } from "@/server/owner";
export default async function TeamPage({ params }: { params: Promise<{ shopSlug: string }> }) { const { shopSlug } = await params; const { shop } = await requireShopOwner(shopSlug); const rows = await db.query.staff.findMany({ where: eq(staff.shopId, shop.id) }); return <><PageHeader title="Team" description="Working hours and breaks for your team." /><section className="card rows">{rows.map(row => <div key={row.id}><b>{row.name}</b><span>{Object.values(row.workingHours)[0] as string}</span><i className={row.active ? "on" : "off"}>{row.active ? "Active" : "Away"}</i></div>)}<form action={async form => { "use server"; await addStaff(Object.fromEntries(form)); }} className="add-form"><input name="name" placeholder="Staff name" required /><input name="workingHours" placeholder="09:00–20:00" required /><input name="breakStart" placeholder="Break start" required /><input name="breakEnd" placeholder="Break end" required /><button>Add staff</button></form></section></>; }
