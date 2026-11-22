import type { ReactNode } from "react";

export function AppShell({ children, title }: { children: ReactNode; title?: string }) {
  return <><a className="skip" href="#main">Skip to content</a><header className="app-header"><a href="/" className="brand">QueueCut</a>{title ? <span className="page-title">{title}</span> : null}</header>{children}</>;
}

export function EmptyState({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return <section className="card empty" role="status"><p>{children}</p>{action}</section>;
}

export function LoadingCard() {
  return <section className="card skeleton" aria-busy="true"><span className="sr-only">Loading</span><i /><i /><i /></section>;
}
