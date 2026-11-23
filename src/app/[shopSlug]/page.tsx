import Link from "next/link";
import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { services, shops, staff } from "@/db/schema";

type CustomerHomeProps = { params: Promise<{ shopSlug: string }> };

export default async function CustomerHome({ params }: CustomerHomeProps) {
  const { shopSlug } = await params;
  const shop = await db.query.shops.findFirst({ where: eq(shops.slug, shopSlug) });
  if (!shop) notFound();

  const [catalog, team] = await Promise.all([
    db.query.services.findMany({ where: and(eq(services.shopId, shop.id), eq(services.active, true)), limit: 3 }),
    db.query.staff.findMany({ where: and(eq(staff.shopId, shop.id), eq(staff.active, true)), limit: 4 }),
  ]);

  return <div className="customer-page customer-home">
    <section className="customer-home__hero">
      <p className="customer-eyebrow">ONLINE BOOKING</p>
      <h1>Your time matters.</h1>
      <p className="customer-home__intro">Book an appointment with {shop.name} in a few simple steps. No account needed.</p>
      <div className="customer-home__actions">
        <Link className="button" href={`/${shop.slug}/book`}>Book an appointment</Link>
        <Link className="button button--ghost" href={`/${shop.slug}/services`}>View services</Link>
      </div>
    </section>

    <section className="customer-home__section" aria-labelledby="services-heading">
      <div className="customer-section-heading"><div><p className="customer-eyebrow">WHAT WE OFFER</p><h2 id="services-heading">Popular services</h2></div><Link href={`/${shop.slug}/services`}>See all services <span aria-hidden="true">→</span></Link></div>
      {catalog.length ? <div className="customer-service-grid">{catalog.map((service) => <article className="customer-service-card" key={service.id}><div><h3>{service.name}</h3><p>{service.durationMinutes} min appointment</p></div><strong>Rs {service.price}</strong></article>)}</div> : <p className="customer-empty-copy">Services will be available soon.</p>}
    </section>

    <section className="customer-home__section customer-home__team" aria-labelledby="team-heading">
      <div className="customer-section-heading"><div><p className="customer-eyebrow">MEET THE TEAM</p><h2 id="team-heading">Choose your professional</h2></div><Link href={`/${shop.slug}/team`}>Meet the team <span aria-hidden="true">→</span></Link></div>
      {team.length ? <div className="customer-team-list">{team.map((member) => <div className="customer-team-member" key={member.id}><span aria-hidden="true">{member.name.slice(0, 1).toUpperCase()}</span><div><h3>{member.name}</h3><p>Available for appointments</p></div></div>)}</div> : <p className="customer-empty-copy">Our team details will be available soon.</p>}
    </section>
  </div>;
}
