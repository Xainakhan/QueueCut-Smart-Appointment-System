import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { shops } from "@/db/schema";

export default async function AboutPage({ params }: { params: Promise<{ shopSlug: string }> }) {
  const { shopSlug } = await params;
  const shop = await db.query.shops.findFirst({ where: eq(shops.slug, shopSlug) });
  if (!shop) notFound();
  return <div className="customer-page customer-info-page">
    <p className="customer-eyebrow">ABOUT {shop.name.toUpperCase()}</p><h1>Appointments made simple.</h1>
    <p className="customer-info-page__intro">Book online, choose your preferred professional, and follow your appointment through a private live ticket.</p>
    <section className="customer-info-card"><h2>Good to know</h2><dl><div><dt>Booking</dt><dd>No customer account required</dd></div><div><dt>Time zone</dt><dd>{shop.timeZone.replace("_", " ")}</dd></div><div><dt>Updates</dt><dd>Available on your live ticket</dd></div></dl></section>
  </div>;
}
