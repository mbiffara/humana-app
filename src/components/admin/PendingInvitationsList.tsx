/** List of pending invitations shown on the admin dashboard.
 *  Matches Paper design: initials avatar + "Name · Type" + email · city + time ago + RESEND button */
"use client";

import { useState } from "react";
import type { Invitation } from "@/lib/types";
import { useLocale } from "@/i18n/LocaleProvider";

interface PendingInvitationsListProps {
  invitations: Invitation[];
  onResend?: (invitation: Invitation) => Promise<void>;
}

function timeAgo(dateStr: string | undefined, locale: string): string {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const labels = {
    en: { just: "Sent just now", h: (n: number) => `Sent ${n}h ago`, d: (n: number) => `Sent ${n}d ago`, m: (n: number) => `Sent ${n}mo ago` },
    es: { just: "Enviado ahora", h: (n: number) => `Hace ${n}h`, d: (n: number) => `Hace ${n}d`, m: (n: number) => `Hace ${n}m` },
    pt: { just: "Enviado agora", h: (n: number) => `Há ${n}h`, d: (n: number) => `Há ${n}d`, m: (n: number) => `Há ${n}m` },
  };
  const l = labels[locale as keyof typeof labels] || labels.en;
  if (hours < 1) return l.just;
  if (hours < 24) return l.h(hours);
  const days = Math.floor(hours / 24);
  if (days < 30) return l.d(days);
  return l.m(Math.floor(days / 30));
}

function kindLabel(kind?: string, locale?: string): string {
  const map: Record<string, Record<string, string>> = {
    agency: { en: "Agency", es: "Agencia", pt: "Agência" },
    hotel: { en: "Hotel", es: "Hotel", pt: "Hotel" },
    office: { en: "Office", es: "Oficina", pt: "Escritório" },
  };
  if (!kind || !map[kind]) return "";
  return map[kind][locale || "en"] || map[kind].en;
}

export function PendingInvitationsList({ invitations, onResend }: PendingInvitationsListProps) {
  const { t, locale } = useLocale();
  const [resending, setResending] = useState<number | null>(null);

  if (invitations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-humana-stone">
          <svg className="h-5 w-5 text-humana-muted" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-[13px] text-humana-muted">{t.admin.dashboard.noPending}</p>
      </div>
    );
  }

  async function handleResend(inv: Invitation) {
    if (!onResend) return;
    setResending(inv.id);
    try {
      await onResend(inv);
    } finally {
      setResending(null);
    }
  }

  return (
    <div className="flex flex-col divide-y divide-humana-line">
      {invitations.map((inv, i) => {
        const name = inv.email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, c => c.toUpperCase());
        const initials = name
          .split(" ")
          .map((w) => w[0])
          .join("")
          .slice(0, 2)
          .toUpperCase();

        const kind = kindLabel(inv.organization?.kind, locale);
        const city = inv.organization?.city;

        return (
          <div
            key={inv.id}
            className="flex items-center gap-3 py-3.5 animate-[fade-in-up_0.3s_ease-out_both]"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            {/* Initials avatar */}
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-humana-gold-light text-[11px] font-semibold text-humana-gold">
              {initials}
            </div>

            {/* Name + email info */}
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <p className="truncate text-[13px] font-medium text-humana-ink">
                {name}
                {kind && (
                  <span className="font-normal text-humana-muted"> &middot; {kind}</span>
                )}
              </p>
              <p className="truncate text-[11px] text-humana-muted">
                {inv.email}
                {city && <span> &middot; {city}</span>}
                {inv.invited_by && (
                  <span className="text-humana-subtle"> &middot; {locale === "es" ? "por" : locale === "pt" ? "por" : "by"} {inv.invited_by}</span>
                )}
              </p>
            </div>

            {/* Time ago */}
            <span className="shrink-0 text-[11px] text-humana-subtle">
              {timeAgo(inv.created_at, locale)}
            </span>

            {/* Resend button */}
            {onResend && (
              <button
                onClick={() => handleResend(inv)}
                disabled={resending === inv.id}
                className="cursor-pointer shrink-0 rounded-full border border-humana-gold px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-humana-gold transition-all duration-200 hover:bg-humana-gold hover:text-white disabled:opacity-50"
              >
                {resending === inv.id ? "..." : "Resend"}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
