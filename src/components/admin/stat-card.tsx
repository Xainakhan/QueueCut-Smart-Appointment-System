type StatCardProps = { label: string; value: string | number; detail: string };
export function StatCard({ label, value, detail }: StatCardProps) { return <section className="stat-card"><p>{label}</p><strong>{value}</strong><span>{detail}</span></section>; }
