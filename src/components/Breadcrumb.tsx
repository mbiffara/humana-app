"use client";

import Link from "next/link";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="flex items-center gap-2 text-[12px]">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && <span className="text-humana-subtle">/</span>}
          {item.href ? (
            <Link
              href={item.href}
              className="font-medium text-humana-muted transition-colors hover:text-humana-ink"
            >
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-humana-ink">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
