/** Hotel workspace — retreat management (HT-05).
 *  Lists the property's retreats with status, key stats, and links into
 *  the creation wizard for editing specific sections. */
"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/i18n/LocaleProvider";
import { hotelApi, type ApiRetreat, type RetreatStatus } from "@/lib/api/hotel";

const STATUS_STYLES: Record<RetreatStatus, string> = {
  active: "border-emerald-500 text-emerald-600",
  upcoming: "border-humana-gold text-humana-gold",
  draft: "border-humana-line text-humana-muted",
  pending_review: "border-amber-400 text-amber-600",
  closed: "border-humana-line text-humana-subtle",
  cancelled: "border-red-300 text-red-500",
};

const DOT_STYLES: Record<RetreatStatus, string> = {
  active: "bg-emerald-500",
  upcoming: "bg-humana-gold",
  draft: "bg-humana-muted",
  pending_review: "bg-amber-400",
  closed: "bg-humana-subtle",
  cancelled: "bg-red-400",
};

export default function HotelRetreatsPage() {
  const { t, locale } = useLocale();
  const tr = t.hotelWs.retreats;
  const [retreats, setRetreats] = useState<ApiRetreat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  // Retreat id pending delete confirmation (two-step, no browser dialog)
  const [pendingDelete, setPendingDelete] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await hotelApi.listRetreats();
      setRetreats(res.retreats);
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function deleteRetreat(id: number) {
    try {
      await hotelApi.deleteRetreat(id);
      setRetreats((prev) => prev.filter((r) => r.id !== id));
    } finally {
      setPendingDelete(null);
    }
  }

  function formatDateRange(startsOn: string | null, endsOn: string | null) {
    if (!startsOn) return "—";
    const start = new Date(`${startsOn}T00:00:00`);
    const fmt = new Intl.DateTimeFormat(locale, { month: "short", day: "numeric" });
    if (!endsOn) return fmt.format(start);
    const end = new Date(`${endsOn}T00:00:00`);
    const endFmt =
      start.getMonth() === end.getMonth()
        ? new Intl.DateTimeFormat(locale, { day: "numeric" })
        : fmt;
    return `${fmt.format(start)} – ${endFmt.format(end)}`;
  }

  function formatPrice(retreat: ApiRetreat) {
    if (!retreat.min_price_cents) return "—";
    const amount = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: retreat.currency || "USD",
      minimumFractionDigits: 0,
    }).format(retreat.min_price_cents / 100);
    return `${amount} ${tr.perPerson}`;
  }

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-humana-line border-t-humana-gold" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-10 py-10">
      {/* Header */}
      <div className="mb-10 flex items-end justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
            {t.hotelWs.badge}
          </p>
          <h1 className="mt-2 text-[32px] font-light leading-[40px] tracking-[-0.01em] text-humana-ink">{tr.title}</h1>
          <p className="mt-1 text-[14px] text-humana-muted">{tr.subtitle}</p>
        </div>
        <Link
          href="/hotel/retreats/create/step-1"
          onClick={() => sessionStorage.removeItem("humana.retreat-wizard")}
          className="bg-humana-ink px-6 py-3.5 text-[13px] font-semibold uppercase tracking-[0.22em] text-white transition-opacity hover:opacity-85"
        >
          + {tr.create}
        </Link>
      </div>

      {retreats.length === 0 || error ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-humana-line bg-white py-24 text-center">
          <p className="text-[18px] font-medium text-humana-ink">{tr.empty}</p>
          <p className="mt-2 max-w-md text-[14px] text-humana-muted">{tr.emptyHint}</p>
          <Link
            href="/hotel/retreats/create/step-1"
          onClick={() => sessionStorage.removeItem("humana.retreat-wizard")}
            className="mt-8 bg-humana-ink px-6 py-3.5 text-[13px] font-semibold uppercase tracking-[0.22em] text-white transition-opacity hover:opacity-85"
          >
            + {tr.create}
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-5 stagger-children">
          {retreats.map((retreat) => (
            <article
              key={retreat.id}
              className="flex overflow-hidden rounded-xl border border-humana-line bg-white card-hover"
            >
              {/* Thumbnail */}
              <div className="relative w-[220px] shrink-0 bg-humana-stone">
                {retreat.cover_image_url ? (
                  <Image
                    src={retreat.cover_image_url}
                    alt={retreat.name}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#c9c4b4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="flex flex-1 flex-col justify-between px-7 py-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-[18px] font-semibold text-humana-ink">{retreat.name}</h2>
                    <p className="mt-0.5 text-[13px] text-humana-muted">
                      {retreat.hotel?.name}
                      {retreat.location ? ` · ${retreat.location}` : ""}
                    </p>
                  </div>
                  <span
                    className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] ${STATUS_STYLES[retreat.status]}`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${DOT_STYLES[retreat.status]}`} />
                    {tr.statuses[retreat.status]}
                  </span>
                </div>

                {/* Stats row */}
                <div className="mt-5 flex gap-12">
                  {[
                    { label: tr.stats.duration, value: tr.nights(retreat.duration_nights) },
                    {
                      label: tr.stats.capacity,
                      value: retreat.capacity ? tr.guestsMax(retreat.capacity) : "—",
                    },
                    { label: tr.stats.price, value: formatPrice(retreat) },
                    {
                      label: tr.stats.nextDate,
                      value: formatDateRange(retreat.starts_on, retreat.ends_on),
                    },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-humana-subtle">
                        {stat.label}
                      </p>
                      <p className="mt-1 text-[14px] font-medium text-humana-ink">{stat.value}</p>
                    </div>
                  ))}
                </div>

                {/* Action links */}
                <div className="mt-5 flex items-center gap-6 border-t border-humana-line pt-4">
                  <Link
                    href={`/hotel/retreats/create/step-1?id=${retreat.id}`}
                    className="text-[13px] font-medium text-humana-gold transition-opacity hover:opacity-75"
                  >
                    {tr.editDetails}
                  </Link>
                  <Link
                    href={`/hotel/retreats/create/step-2?id=${retreat.id}`}
                    className="text-[13px] text-humana-muted transition-colors hover:text-humana-ink"
                  >
                    {tr.viewProgram}
                  </Link>
                  <Link
                    href={`/hotel/retreats/create/step-4?id=${retreat.id}`}
                    className="text-[13px] text-humana-muted transition-colors hover:text-humana-ink"
                  >
                    {tr.viewGallery}
                  </Link>
                  {retreat.status === "draft" &&
                    (pendingDelete === retreat.id ? (
                      <span className="ml-auto flex items-center gap-3 text-[13px]">
                        <span className="text-humana-muted">{tr.confirmDelete}</span>
                        <button
                          onClick={() => deleteRetreat(retreat.id)}
                          className="cursor-pointer font-medium text-red-600 hover:opacity-75"
                        >
                          {tr.delete}
                        </button>
                        <button
                          onClick={() => setPendingDelete(null)}
                          className="cursor-pointer text-humana-muted hover:text-humana-ink"
                        >
                          ✕
                        </button>
                      </span>
                    ) : (
                      <button
                        onClick={() => setPendingDelete(retreat.id)}
                        className="ml-auto cursor-pointer text-[13px] text-humana-muted transition-colors hover:text-red-600"
                      >
                        {tr.delete}
                      </button>
                    ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
