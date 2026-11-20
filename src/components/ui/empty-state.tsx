import type { ReactNode } from "react";

type EmptyStateProps = { title: string; description: string; action?: ReactNode; icon?: ReactNode };

export function EmptyState({ title, description, action, icon }: EmptyStateProps) {
  return <section className="empty-state" aria-label={title}>
    {icon ? <div className="empty-state__icon" aria-hidden="true">{icon}</div> : null}
    <h2>{title}</h2><p>{description}</p>{action ? <div>{action}</div> : null}
  </section>;
}
