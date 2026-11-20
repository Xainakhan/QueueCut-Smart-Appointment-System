import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
};

export function PageHeader({ title, description, action, breadcrumbs }: PageHeaderProps) {
  return <header className="page-header">
    {breadcrumbs?.length ? <nav aria-label="Breadcrumb"><ol className="breadcrumbs">
      {breadcrumbs.map((item, index) => <li key={`${item.label}-${index}`}>
        {item.href ? <a href={item.href}>{item.label}</a> : <span aria-current="page">{item.label}</span>}
      </li>)}
    </ol></nav> : null}
    <div className="page-header__content"><div><h1>{title}</h1>{description ? <p>{description}</p> : null}</div>{action ? <div className="page-header__action">{action}</div> : null}</div>
  </header>;
}
