"use client";

import Image from "next/image";
import Link from "next/link";
import type { RetreatData } from "@/data/types";
import { useLocale } from "@/i18n/LocaleProvider";

export function RetreatCard({ retreat }: { retreat: RetreatData }) {
  const { t } = useLocale();
  return (
    <article className="flex flex-col overflow-hidden border border-humana-line bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      <Link href={`/retreats/${retreat.slug}`} className="relative h-64 w-full bg-humana-stone">
        <Image
          src={retreat.image}
          alt={retreat.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
        <div className="absolute left-4 top-4 bg-white px-3 py-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-ink">
            {retreat.tag}
          </span>
        </div>
      </Link>

      <div className="flex flex-col gap-5 p-7">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#8A8578" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span className="text-[12px] font-medium uppercase tracking-[0.16em] text-humana-muted">
              {retreat.location}
            </span>
          </div>
          <span className="text-[12px] font-medium text-[#4A463E]">
            {retreat.startDate.slice(5)} — {retreat.endDate.slice(5)}
          </span>
        </div>

        <h3 className="text-[20px] font-normal leading-[26px] tracking-[-0.01em] text-humana-ink">
          {retreat.name}
          <br />
          <span className="text-humana-muted">{retreat.hotelName}</span>
        </h3>

        <p className="text-[14px] leading-[20px] text-humana-muted">
          {retreat.description}
        </p>

        <div className="h-px bg-humana-line" />

        <div className="flex items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-humana-subtle">
              {t.retreatDetail?.startingFrom ?? "Desde"}
            </span>
            <span className="text-[20px] font-light tracking-[-0.01em] text-humana-ink">
              $ {retreat.price.toLocaleString()}
              <span className="text-[13px] font-normal text-humana-subtle">
                {" "}/ {t.retreatDetail?.perGuest ?? "huésped"}
              </span>
            </span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-humana-gold">
              {t.retreatDetail?.commission ?? "Comisión"} {retreat.commission}%
            </span>
            <Link
              href={`/retreats/${retreat.slug}`}
              className="text-[13px] font-medium text-humana-ink transition-colors hover:text-humana-gold"
            >
              {t.retreats?.seeAll ? "Ver disponibilidad →" : "View availability →"}
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
