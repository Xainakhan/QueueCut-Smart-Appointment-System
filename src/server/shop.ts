import { and, eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { db } from "@/db";
import { shops, staff } from "@/db/schema";

/** Shop settings rarely change; caching avoids a remote database round trip on each customer page. */
export const getShopBySlug = unstable_cache(
  async (slug:string) => db.query.shops.findFirst({where:eq(shops.slug,slug)}),
  ["shop-by-slug"],
  {revalidate:60},
);

export const getShopById = unstable_cache(
  async (id:string) => db.query.shops.findFirst({where:eq(shops.id,id)}),
  ["shop-by-id"],
  {revalidate:60},
);

/** Public team data changes infrequently; cache it to keep customer pages fast on Vercel. */
export const getActiveStaffByShopId = unstable_cache(
  async (shopId: string) => db.query.staff.findMany({
    where: and(eq(staff.shopId, shopId), eq(staff.active, true)),
  }),
  ["active-staff-by-shop"],
  { revalidate: 60, tags: ["active-staff"] },
);
