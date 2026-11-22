import { redirect } from "next/navigation";
import { db } from "@/db";
export const dynamic = "force-dynamic";
export default async function Home() {
  const shop = await db.query.shops.findFirst();
  redirect(shop ? `/s/${shop.slug}` : "/login");
}
