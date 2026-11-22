import { PageHeader } from "@/components/ui/page-header";
import { requireShopOwner } from "@/server/admin";
import { QrActions } from "@/components/admin/qr-actions";
export default async function QrPage({ params }: { params: Promise<{ shopSlug: string }> }) { const { shopSlug } = await params; const { shop } = await requireShopOwner(shopSlug); const path = `/${shop.slug}`; return <><PageHeader title="Booking QR code" description="Give customers a quick, reliable way to open your booking page." /><section className="qr-card"><div><p className="badge">CUSTOMER BOOKING</p><h2>{shop.name}</h2><p className="muted-copy">Print this code at your counter or share the booking link directly.</p></div><QrActions path={path} shopName={shop.name} /></section></>; }
