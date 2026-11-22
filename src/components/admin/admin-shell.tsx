"use client";

import { useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { FiCalendar, FiClipboard, FiGrid, FiHome, FiImage, FiScissors, FiSettings, FiUsers, FiUserCheck } from "react-icons/fi";

export type AdminNavItem = { label: string; href: string; icon: ReactNode; ownerOnly?: boolean };
export const adminNavigation: AdminNavItem[] = [
  { label: "Overview", href: "", icon: <FiHome /> }, { label: "Live queue", href: "/queue", icon: <FiGrid /> }, { label: "Calendar", href: "/calendar", icon: <FiCalendar /> }, { label: "Bookings", href: "/bookings", icon: <FiClipboard /> }, { label: "Customers", href: "/customers", icon: <FiUserCheck />, ownerOnly: true }, { label: "Services", href: "/services", icon: <FiScissors />, ownerOnly: true }, { label: "Team", href: "/team", icon: <FiUsers />, ownerOnly: true }, { label: "QR code", href: "/qr", icon: <FiImage />, ownerOnly: true }, { label: "Settings", href: "/settings", icon: <FiSettings />, ownerOnly: true },
];
type Props = { children: ReactNode; shop: { name: string; slug: string; logo?: ReactNode }; userName: string; role: "owner" | "staff"; activePath?: string; pageTitle: string; };

export function AdminShell({ children, shop, userName, role, activePath, pageTitle }: Props) {
  const [isOpen, setOpen] = useState(false); const pathname = usePathname(); const items = adminNavigation.filter(item => role === "owner" || !item.ownerOnly); const base = `/admin/${shop.slug}`; const activeItem = items.find(item => pathname === `${base}${item.href}` || (activePath !== undefined && activePath === item.href)); const title = activeItem?.label ?? pageTitle;
  return <div className="admin-shell"><button className="admin-menu-button" type="button" aria-label="Open navigation" aria-expanded={isOpen} onClick={() => setOpen(true)}>☰</button>
    <aside className={`admin-sidebar ${isOpen ? "is-open" : ""}`} aria-label="Admin navigation"><div className="admin-sidebar__top"><a className="admin-brand" href={base}>{shop.logo ?? <span className="admin-logo" aria-hidden="true">Q</span>}<span>{shop.name}</span></a><button className="admin-close-button" aria-label="Close navigation" onClick={() => setOpen(false)}>×</button></div>
      <nav><ul>{items.map(item => { const isActive = pathname === `${base}${item.href}` || (activePath !== undefined && activePath === item.href); return <li key={item.label}><a href={`${base}${item.href}`} className={isActive ? "is-active" : ""} aria-current={isActive ? "page" : undefined}><span aria-hidden="true">{item.icon}</span>{item.label}</a></li>; })}</ul></nav>
      <div className="admin-sidebar__footer"><span className="admin-user">{userName}</span><form action="/api/auth/signout" method="post"><button className="admin-sign-out" type="submit">Sign out</button></form></div>
    </aside><main className="admin-main"><header className="admin-topbar"><span className="admin-topbar__crumb">{shop.name} / {title}</span><strong>{title}</strong></header><div className="admin-content">{children}</div></main>
  </div>;
}
