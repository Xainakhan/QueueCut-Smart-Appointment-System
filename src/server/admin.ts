import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import { shops } from "@/db/schema";

export async function requireShopAdmin(shopSlug: string) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const shop = await db.query.shops.findFirst({ where: eq(shops.slug, shopSlug) });
  if (!shop || shop.id !== session.user.shopId) redirect("/login?error=access");
  return { shop, user: session.user };
}

export async function requireShopOwner(shopSlug: string) {
  const context = await requireShopAdmin(shopSlug);
  if (context.user.role !== "owner") redirect(`/admin/${shopSlug}`);
  return context;
}
