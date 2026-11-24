import { eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { db } from "@/db";
import { shops } from "@/db/schema";

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
