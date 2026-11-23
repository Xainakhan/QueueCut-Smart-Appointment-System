import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import BookingPortal from "@/app/s/[shopSlug]/portal";
import { db } from "@/db";
import { services, shops, staff } from "@/db/schema";
export default async function BookPage({ params }: { params: Promise<{ shopSlug: string }> }) { const { shopSlug } = await params; const shop = await db.query.shops.findFirst({ where: eq(shops.slug, shopSlug) }); if (!shop) notFound(); const [catalog, team] = await Promise.all([db.query.services.findMany({ where: eq(services.shopId, shop.id) }), db.query.staff.findMany({ where: eq(staff.shopId, shop.id) })]); return <BookingPortal shop={{ slug: shop.slug, name: shop.name, timeZone: shop.timeZone, buffer: shop.bufferMinutes }} services={catalog.filter(item => item.active).map(item => ({ id: item.id, name: item.name, duration: item.durationMinutes, price: item.price }))} staff={team.filter(item => item.active).map(item => ({ id: item.id, name: item.name }))} />; }
