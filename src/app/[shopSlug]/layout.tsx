import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import type { ReactNode } from "react";
import { CustomerShell } from "@/components/customer/customer-shell";
import { db } from "@/db";
import { shops } from "@/db/schema";
import { reservedShopSlugs } from "@/lib/shop-slugs";
export default async function CustomerLayout({ children, params }: { children: ReactNode; params: Promise<{ shopSlug: string }> }) { const { shopSlug } = await params; if (reservedShopSlugs.has(shopSlug)) notFound(); const shop = await db.query.shops.findFirst({ where: eq(shops.slug, shopSlug) }); if (!shop) notFound(); return <CustomerShell shop={{ id: shop.id, name: shop.name, slug: shop.slug, timeZone: shop.timeZone }}>{children}</CustomerShell>; }
