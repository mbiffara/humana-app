/** Quick action CTA card with hover animation. */
"use client";

import Link from "next/link";

interface QuickActionCardProps {
  label: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

export function QuickActionCard({ label, description, href, icon, onClick }: QuickActionCardProps) {
  const content = (
    <div className="group flex items-center gap-5 rounded-[6px] border border-humana-line bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-humana-gold/5 hover:border-humana-gold/30 cursor-pointer">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-humana-gold/10 text-humana-gold transition-all duration-300 group-hover:bg-humana-gold group-hover:text-white group-hover:scale-105">
        {icon}
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-[14px] font-medium text-humana-ink">{label}</span>
        <span className="text-[12px] text-humana-muted">{description}</span>
      </div>
      <svg
        className="ml-auto h-4 w-4 text-humana-muted transition-all duration-200 group-hover:translate-x-1 group-hover:text-humana-gold"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
      </svg>
    </div>
  );

  if (onClick) {
    return <button type="button" onClick={onClick} className="w-full text-left">{content}</button>;
  }

  return <Link href={href}>{content}</Link>;
}
