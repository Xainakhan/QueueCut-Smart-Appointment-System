import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { shops } from "@/db/schema";
import MyBookings from "./my-bookings";

export default async function MyBookingPage({ params }: { params: Promise<{ shopSlug: string }> }) {
  const { shopSlug } = await params;
  const shop = await db.query.shops.findFirst({ where: eq(shops.slug, shopSlug) });
  if (!shop) notFound();
  return <div className="customer-page customer-info-page">
    <p className="customer-eyebrow">YOUR BOOKING</p><h1>Find your appointment</h1>
    <p className="customer-info-page__intro">Your live ticket link is shown after you confirm an appointment. Keep it saved to see your current place in line.</p>
    <MyBookings shopSlug={shop.slug} timeZone={shop.timeZone}/>
  </div>;
}
