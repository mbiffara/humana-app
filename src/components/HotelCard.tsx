"use client";

import Image from "next/image";
import Link from "next/link";
import type { Hotel } from "@/data/types";
import { countryIdToSlug } from "@/data/countries";

export function HotelCard({ hotel }: { hotel: Hotel }) {
  const minPrice = Math.min(...hotel.roomTypes.map((r) => r.pricePerNight));
  const countrySlug = countryIdToSlug[hotel.country] ?? hotel.country;
  return (
    <article className="flex flex-col overflow-hidden border border-humana-line bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      <Link href={`/select-country/${countrySlug}/hotels/${hotel.slug}`} className="relative h-64 w-full bg-humana-stone">
        <Image
          src={hotel.image}
          alt={hotel.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
        <div className="absolute left-4 top-4 bg-white px-3 py-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-ink">
            {hotel.amenities[0]}
          </span>
        </div>
        <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-white/90 px-2.5 py-1.5">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="#D4AF37" stroke="none">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <span className="text-[12px] font-semibold text-humana-ink">{hotel.rating}</span>
        </div>
      </Link>

      <div className="flex flex-col gap-4 p-7">
        <div className="flex items-center gap-2">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#8A8578" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span className="text-[12px] font-medium uppercase tracking-[0.16em] text-humana-muted">
            {hotel.location}
          </span>
        </div>

        <h3 className="text-[20px] font-normal leading-[26px] tracking-[-0.01em] text-humana-ink">
          {hotel.name}
        </h3>

        <p className="text-[14px] leading-[20px] text-humana-muted">
          {hotel.shortDescription}
        </p>

        <div className="h-px bg-humana-line" />

        <div className="flex items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-humana-subtle">
              Desde
            </span>
            <span className="text-[20px] font-light tracking-[-0.01em] text-humana-ink">
              $ {minPrice.toLocaleString()}
              <span className="text-[13px] font-normal text-humana-subtle"> / noche</span>
            </span>
          </div>
          <Link
            href={`/select-country/${countrySlug}/hotels/${hotel.slug}`}
            className="text-[13px] font-medium text-humana-ink transition-colors hover:text-humana-gold"
          >
            Ver detalles →
          </Link>
        </div>
      </div>
    </article>
  );
}
