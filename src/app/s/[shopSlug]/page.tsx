import { permanentRedirect } from "next/navigation";
export default async function LegacyShopRedirect({ params }: { params: Promise<{ shopSlug: string }> }) { const { shopSlug } = await params; permanentRedirect(`/${shopSlug}/book`); }
