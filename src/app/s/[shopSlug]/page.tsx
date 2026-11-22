import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { services, shops, staff } from "@/db/schema";
import BookingPortal from "./portal";
import PublicQueue from "./public-queue";

export default async function ShopPage({ params }: { params: Promise<{ shopSlug: string }> }) {
  const { shopSlug } = await params;
  const shop = await db.query.shops.findFirst({ where: eq(shops.slug, shopSlug) });
  if (!shop) notFound();
  const [catalog, team] = await Promise.all([
    db.query.services.findMany({ where: eq(services.shopId, shop.id) }),
    db.query.staff.findMany({ where: eq(staff.shopId, shop.id) }),
  ]);
  return (
    <BookingPortal
      shop={{ slug: shop.slug, name: shop.name, timeZone: shop.timeZone, buffer: shop.bufferMinutes }}
      services={catalog.filter(x => x.active).map(x => ({ id: x.id, name: x.name, duration: x.durationMinutes, price: x.price }))}
      staff={team.filter(x => x.active).map(x => ({ id: x.id, name: x.name }))}
    >
      <PublicQueue shopId={shop.id} timeZone={shop.timeZone} />
    </BookingPortal>
  );
}