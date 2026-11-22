import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { ServiceForm } from "@/components/admin/service-form";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { PageHeader } from "@/components/ui/page-header";
import { db } from "@/db";
import { services } from "@/db/schema";
import { requireShopOwner } from "@/server/admin";
import { addService, deleteService } from "@/server/owner";

export default async function ServicesPage({ params }: { params: Promise<{ shopSlug: string }> }) {
  const { shopSlug } = await params;
  const { shop } = await requireShopOwner(shopSlug);
  const rows = await db.query.services.findMany({ where: eq(services.shopId, shop.id) });
  const createService = async (form: FormData) => { "use server"; await addService(Object.fromEntries(form)); revalidatePath(`/admin/${shopSlug}/services`); };
  const removeService = async (id: string) => { "use server"; await deleteService(id); revalidatePath(`/admin/${shopSlug}/services`); };
  return <><PageHeader title="Services" description="Manage the services customers can book." /><section className="card rows">{rows.map(row => <div key={row.id}><b>{row.name}</b><span>{row.durationMinutes} minutes · Rs {row.price}</span><i className={row.active ? "on" : "off"}>{row.active ? "Active" : "Paused"}</i><ConfirmDeleteButton itemName={row.name} itemType="Service" action={removeService.bind(null, row.id)} /></div>)}<ServiceForm action={createService} /></section></>;
}
