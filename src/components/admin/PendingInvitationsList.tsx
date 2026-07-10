/** List of sent invitations not yet accepted, shown on the admin dashboard. */
"use client";

import type { Invitation } from "@/lib/types";
import { useLocale } from "@/i18n/LocaleProvider";

interface PendingInvitationsListProps {
  invitations: Invitation[];
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

function timeAgo(dateStr: string | null | undefined, locale: string): string {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const labels = {
    en: { just: "Just now", h: (n: number) => `${n}h ago`, d: (n: number) => `${n}d ago` },
    es: { just: "Ahora", h: (n: number) => `Hace ${n}h`, d: (n: number) => `Hace ${n}d` },
    pt: { just: "Agora", h: (n: number) => `Há ${n}h`, d: (n: number) => `Há ${n}d` },
  };
  const l = labels[locale as keyof typeof labels] || labels.en;
  if (hours < 1) return l.just;
  if (hours < 24) return l.h(hours);
  const days = Math.floor(hours / 24);
  return l.d(days);
}

export function PendingInvitationsList({ invitations }: PendingInvitationsListProps) {
  const { t, locale } = useLocale();

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

  return (
    <div className="flex flex-col divide-y divide-humana-line">
      {invitations.map((inv, i) => {
        const emailName = inv.email.split("@")[0].replace(/[._-]/g, " ");
        const initials = emailName
          .split(" ")
          .map((w) => w[0])
          .join("")
          .slice(0, 2)
          .toUpperCase() || "?";

        const kind = kindLabel(inv.organization?.kind, locale);
        const city = inv.organization?.city;
        const isExpired = inv.expired;
        const statusLabel = isExpired
          ? (locale === "es" ? "Expirada" : locale === "pt" ? "Expirado" : "Expired")
          : (locale === "es" ? "Pendiente" : locale === "pt" ? "Pendente" : "Pending");

        return (
          <div
            key={inv.id}
            className="flex items-center gap-3 py-3.5 animate-[fade-in-up_0.3s_ease-out_both]"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            {/* Initials avatar */}
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-humana-gold-light text-[11px] font-semibold text-humana-gold">
              {inv.organization?.onboarding_completed ? initials : "–"}
            </div>

            {/* Email + org info */}
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <p className="truncate text-[13px] font-medium text-humana-ink">
                {inv.email}
                {kind && (
                  <span className="font-normal text-humana-muted"> &middot; {kind}</span>
                )}
              </p>
              <p className="truncate text-[11px] text-humana-muted">
                {inv.organization?.onboarding_completed ? (inv.organization?.name || "–") : "–"}
                {inv.organization?.onboarding_completed && city && <span> &middot; {city}</span>}
              </p>
            </div>

            {/* Time ago */}
            <span className="shrink-0 text-[11px] text-humana-subtle">
              {timeAgo(inv.created_at, locale)}
            </span>

            {/* Status badge */}
            <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.06em] leading-none ${
              isExpired
                ? "bg-red-50 text-red-500"
                : "bg-humana-stone text-humana-muted"
            }`}>
              {statusLabel}
            </span>
          </div>
        );
      })}
    </div>
  );
}
