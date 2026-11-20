import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/db";
import { shops } from "@/db/schema";

export default async function AdminRedirect() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const shop = await db.query.shops.findFirst({ where: eq(shops.id, session.user.shopId) });
  if (!shop) redirect("/login?error=access");

  redirect(`/admin/${shop.slug}`);
}
