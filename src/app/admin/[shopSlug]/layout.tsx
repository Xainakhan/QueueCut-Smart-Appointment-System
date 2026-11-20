import type { ReactNode } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireShopAdmin } from "@/server/admin";

export default async function ShopAdminLayout({ children, params }: { children: ReactNode; params: Promise<{ shopSlug: string }> }) {
  const { shopSlug } = await params;
  const { shop, user } = await requireShopAdmin(shopSlug);
  return <AdminShell shop={{ name: shop.name, slug: shop.slug }} userName={user.name ?? user.email ?? "Team member"} role={user.role} pageTitle="Dashboard">{children}</AdminShell>;
}
