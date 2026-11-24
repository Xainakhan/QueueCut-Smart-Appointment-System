import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { CustomerShell } from "@/components/customer/customer-shell";
import { getShopBySlug } from "@/server/shop";
import { reservedShopSlugs } from "@/lib/shop-slugs";
export default async function CustomerLayout({ children, params }: { children: ReactNode; params: Promise<{ shopSlug: string }> }) { const { shopSlug } = await params; if (reservedShopSlugs.has(shopSlug)) notFound(); const shop = await getShopBySlug(shopSlug); if (!shop) notFound(); return <CustomerShell shop={{ id: shop.id, name: shop.name, slug: shop.slug, timeZone: shop.timeZone }}>{children}</CustomerShell>; }
