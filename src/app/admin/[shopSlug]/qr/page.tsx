import { PageHeader } from "@/components/ui/page-header";
import { requireShopOwner } from "@/server/admin";
import { QrActions } from "@/components/admin/qr-actions";
export default async function QrPage({ params }: { params: Promise<{ shopSlug: string }> }) { const { shopSlug } = await params; const { shop } = await requireShopOwner(shopSlug); const url = `/s/${shop.slug}`; return <><PageHeader title="QR code" description="Share this link with customers or print it at your counter." /><section className="card"><h2>Public booking link</h2><p className="muted-copy">{url}</p><div className="action-row"><a className="button ghost" href={url}>Open booking page</a></div><QrActions url={url} shopName={shop.name} /></section></>; }
