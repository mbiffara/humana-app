"use client";

import Link from "next/link";
import { useWizard } from "@/contexts/WizardContext";
import { hotels } from "@/data/hotels";

const MONTHS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

function formatDate(iso: string) {
  const d = new Date(iso + "T12:00:00");
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

function formatRange(start: string, end: string) {
  const e = new Date(end + "T12:00:00");
  return `${formatDate(start)} – ${formatDate(end)} ${e.getFullYear()}`;
}

type Props = {
  currentStep: number; // 1-6
  onNext?: () => void;
  canProceed?: boolean;
  /** Live pricing from step 4 local state */
  localPricing?: { roomTypeId: string; retailPrice: number }[];
};

export function WizardVistaPrevia({ currentStep, onNext, canProceed = true, localPricing }: Props) {
  const { state } = useWizard();
  const hotel = hotels.find((h) => h.id === state.hotelId);
  const typeLabel = state.type === "retreat" ? "Retiro" : state.type === "masterclass" ? "Masterclass" : "Corporativo";

  const activePricing = localPricing ?? state.pricing;
  const validPrices = activePricing.filter((p) => p.retailPrice > 0);
  const minSalePrice = validPrices.length > 0
    ? Math.min(...validPrices.map((p) => p.retailPrice))
    : 0;

  const pct = Math.round((currentStep / 6) * 100);

  const backHrefs = [null, "/create-retreat/step-1", "/create-retreat/step-2", "/create-retreat/step-3", "/create-retreat/step-4", "/create-retreat/step-5"];
  const nextHrefs = ["/create-retreat/step-2", "/create-retreat/step-3", "/create-retreat/step-4", "/create-retreat/step-5", "/create-retreat/step-6", null];

  const backHref = backHrefs[currentStep - 1];
  const nextHref = nextHrefs[currentStep - 1];

  return (
    <div className="w-[340px] shrink-0">
      <div className="sticky top-[108px] flex flex-col gap-4">
        {/* Preview card */}
        <div className="border border-humana-line bg-white p-8 shadow-sm">
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
            Vista previa del retiro
          </span>
          <h3 className="mt-3 text-[20px] font-medium leading-[26px] text-humana-ink">
            {state.name || "Sin nombre"}
          </h3>

          <div className="mt-6 flex flex-col gap-3.5">
            <div className="flex items-center justify-between border-b border-humana-line pb-3.5">
              <span className="text-[13px] text-humana-muted">Hotel</span>
              <span className={`text-[13px] ${hotel ? "font-medium text-humana-ink" : "text-humana-subtle"}`}>
                {hotel?.name ?? "Pendiente"}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-humana-line pb-3.5">
              <span className="text-[13px] text-humana-muted">Tipo</span>
              <span className={`text-[13px] ${state.name ? "font-medium text-humana-ink" : "text-humana-subtle"}`}>
                {state.name ? `${typeLabel} · ${state.nights} noches` : "Pendiente"}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-humana-line pb-3.5">
              <span className="text-[13px] text-humana-muted">Fechas</span>
              <span className={`text-[13px] ${state.startDate ? "font-medium text-humana-ink" : "text-humana-subtle"}`}>
                {state.startDate && state.endDate ? formatRange(state.startDate, state.endDate) : "Pendiente"}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-humana-line pb-3.5">
              <span className="text-[13px] text-humana-muted">Capacidad</span>
              <span className={`text-[13px] ${state.capacity > 0 ? "font-medium text-humana-ink" : "text-humana-subtle"}`}>
                {state.capacity > 0 ? `${state.capacity} personas` : "Pendiente"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-humana-muted">Precio base</span>
              <span className={`text-[13px] ${minSalePrice > 0 ? "font-semibold text-humana-gold" : "text-humana-subtle"}`}>
                {minSalePrice > 0 ? `$${minSalePrice.toLocaleString("en-US")} USD` : "Pendiente"}
              </span>
            </div>
          </div>
        </div>

        {/* Progress card */}
        <div className="border border-humana-line bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-humana-muted">Progreso</span>
            <span className="text-[13px] font-semibold text-humana-gold">{pct}%</span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-humana-stone">
            <div
              className="h-full rounded-full bg-humana-gold transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex">
          {backHref ? (
            <Link
              href={backHref}
              className="flex flex-1 items-center justify-center border border-humana-line bg-white py-4 text-[13px] font-semibold uppercase tracking-[0.18em] text-humana-ink transition-colors hover:border-humana-ink"
            >
              Atrás
            </Link>
          ) : null}
          {nextHref ? (
            <Link
              href={nextHref}
              onClick={onNext}
              className={`flex items-center justify-center gap-3 py-4 text-[13px] font-semibold uppercase tracking-[0.22em] transition-all duration-150 active:scale-[0.98] ${
                backHref ? "flex-[1.5]" : "flex-1"
              } ${
                canProceed
                  ? "bg-humana-ink text-white hover:bg-black"
                  : "pointer-events-none bg-humana-line text-humana-subtle"
              }`}
            >
              Siguiente
              <svg width="14" height="9" viewBox="0 0 16 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 5h14M10 1l4 4-4 4" />
              </svg>
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
