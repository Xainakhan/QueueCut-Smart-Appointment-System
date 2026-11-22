import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { TeamForm } from "@/components/admin/team-form";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { PageHeader } from "@/components/ui/page-header";
import { db } from "@/db";
import { staff } from "@/db/schema";
import { requireShopOwner } from "@/server/admin";
import { addStaff, deleteStaff } from "@/server/owner";

export default async function TeamPage({ params }: { params: Promise<{ shopSlug: string }> }) {
  const { shopSlug } = await params;
  const { shop } = await requireShopOwner(shopSlug);
  const rows = await db.query.staff.findMany({ where: eq(staff.shopId, shop.id) });
  const createStaff = async (form: FormData) => { "use server"; await addStaff(Object.fromEntries(form)); revalidatePath(`/admin/${shopSlug}/team`); };
  const removeStaff = async (id: string) => { "use server"; await deleteStaff(id); revalidatePath(`/admin/${shopSlug}/team`); };
  return <><PageHeader title="Team" description="Working hours and breaks for your team." /><section className="card rows">{rows.map(row => <div key={row.id}><b>{row.name}</b><span>{Object.values(row.workingHours)[0] as string}</span><i className={row.active ? "on" : "off"}>{row.active ? "Active" : "Away"}</i><ConfirmDeleteButton itemName={row.name} itemType="Team member" action={removeStaff.bind(null, row.id)} /></div>)}<TeamForm action={createStaff} /></section></>;
}
