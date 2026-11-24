import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { shops } from "@/db/schema";

export default async function MyBookingPage({ params }: { params: Promise<{ shopSlug: string }> }) {
  const { shopSlug } = await params;
  const shop = await db.query.shops.findFirst({ where: eq(shops.slug, shopSlug) });
  if (!shop) notFound();
  return <div className="customer-page customer-info-page">
    <p className="customer-eyebrow">YOUR BOOKING</p><h1>Find your appointment</h1>
    <p className="customer-info-page__intro">Your live ticket link is shown after you confirm an appointment. Keep it saved to see your current place in line.</p>
    <section className="customer-info-card"><h2>Need to book?</h2><p>Choose a service and a time that works for you. No account is required.</p><Link className="button" href={`/${shop.slug}/book`}>Book an appointment</Link></section>
  </div>;
}
