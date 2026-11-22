import { redirect } from "next/navigation";
export default async function PublicShopRedirect({ params }: { params: Promise<{ shopSlug: string }> }) { const { shopSlug } = await params; redirect(`/s/${shopSlug}`); }
