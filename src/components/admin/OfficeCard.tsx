/** Regional office summary card — matches Paper design (8I-0 / EJ-0). */
"use client";

import type { Organization } from "@/lib/types";

interface OfficeCardProps {
  office: Organization;
  delay?: number;
  /** e.g. "EU · CET" */
  region?: string;
  /** e.g. "Calle de Serrano 92 · Salamanca" */
  address?: string;
  /** e.g. { staff: 14, agencies: 62, properties: 21 } */
  stats?: { staff: number; agencies: number; properties: number };
  /** e.g. "Clara Beltran" */
  lead?: string;
}

export function OfficeCard({
  office,
  delay = 0,
  region,
  address,
  stats,
  lead,
}: OfficeCardProps) {
  const statusLabel = office.status === "verified" ? "Operational" : office.status;
  const isOperational = office.status === "verified";

  return (
    <div
      className="group flex flex-col rounded-xl border border-humana-line bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-humana-gold/5 hover:border-humana-gold/30 animate-[fade-in-up_0.5s_ease-out_both]"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Top: Status + Region */}
      <div className="flex items-center justify-between px-6 pt-5 pb-3">
        <span
          className={`inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] ${
            isOperational ? "text-emerald-600" : "text-amber-600"
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              isOperational ? "bg-emerald-500" : "bg-amber-500 animate-pulse"
            }`}
          />
          {statusLabel}
        </span>
        {region && (
          <span className="text-[11px] font-medium tracking-[0.08em] text-humana-muted">
            {region}
          </span>
        )}
      </div>

      {/* City + Address */}
      <div className="px-6 pb-4">
        <h3 className="text-[20px] font-semibold tracking-[-0.01em] text-humana-ink">
          {office.city || office.name}
        </h3>
        {address && (
          <p className="mt-0.5 text-[12px] text-humana-muted">{address}</p>
        )}
        {!address && office.country && (
          <p className="mt-0.5 text-[12px] text-humana-muted">{office.country}</p>
        )}
      </div>

      {/* Stats row */}
      {stats && (
        <div className="mx-6 flex items-center gap-0 border-t border-humana-line">
          <div className="flex flex-1 flex-col py-3">
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-humana-muted">
              Staff
            </span>
            <span className="text-[17px] font-light text-humana-ink">
              {stats.staff}
            </span>
          </div>
          <div className="h-8 w-px bg-humana-line" />
          <div className="flex flex-1 flex-col py-3 pl-4">
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-humana-muted">
              Agencies
            </span>
            <span className="text-[17px] font-light text-humana-ink">
              {stats.agencies}
            </span>
          </div>
          <div className="h-8 w-px bg-humana-line" />
          <div className="flex flex-1 flex-col py-3 pl-4">
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-humana-muted">
              Properties
            </span>
            <span className="text-[17px] font-light text-humana-ink">
              {stats.properties}
            </span>
          </div>
        </div>
      )}

      {/* If no stats, show simple members count */}
      {!stats && (
        <div className="mx-6 flex items-center border-t border-humana-line py-3">
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-humana-muted">
              Members
            </span>
            <span className="text-[17px] font-light text-humana-ink">
              {office.user_count || 0}
            </span>
          </div>
        </div>
      )}

      {/* Bottom: Lead + Manage link */}
      <div className="flex items-center justify-between border-t border-humana-line px-6 py-3.5">
        <span className="text-[12px] text-humana-muted">
          {lead ? `Lead: ${lead}` : "\u00A0"}
        </span>
        <button className="text-[12px] font-medium text-humana-ink transition-colors hover:text-humana-gold">
          Manage <span className="inline-block transition-transform group-hover:translate-x-0.5">&rarr;</span>
        </button>
      </div>
    </div>
  );
}
