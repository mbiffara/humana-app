/** Agency retreat wizard step 6 — review all sections before submitting.
 *  Each summary card links back to the step that edits it.
 *  "Submit for Review" sends the retreat for admin approval. */
"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/i18n/LocaleProvider";
import { computeEndDate, useAgencyRetreatWizard } from "@/contexts/AgencyRetreatWizardContext";
import { INCLUSION_CATALOG } from "@/lib/inclusion-catalog";

function formatMoney(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(cents / 100);
}

function toCents(price: string): number {
  const parsed = parseFloat(price);
  return Number.isFinite(parsed) && parsed > 0 ? Math.round(parsed * 100) : 0;
}

function ReviewCard({
  title,
  editHref,
  editLabel,
  children,
}: {
  title: string;
  editHref: string;
  editLabel: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-humana-line bg-white p-7 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-muted">
          {title}
        </p>
        <Link
          href={editHref}
          className="text-[13px] font-medium text-humana-gold transition-opacity hover:opacity-75"
        >
          {editLabel}
        </Link>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-[13px] text-humana-muted">{label}</span>
      <span className="text-[13px] font-medium text-humana-ink">{value}</span>
    </div>
  );
}

export default function AgencyRetreatReviewStep() {
  const { t, locale } = useLocale();
  const tw = t.agencyWs.retreats.wizard;
  const { state } = useAgencyRetreatWizard();

  const endDate = computeEndDate(state.startDate, state.nights);
  const dateRange =
    state.startDate && endDate
      ? `${new Intl.DateTimeFormat(locale, { day: "numeric", month: "short" }).format(new Date(`${state.startDate}T00:00:00`))} – ${new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${endDate}T00:00:00`))}`
      : "—";

  const pricedRooms = state.pricing
    .filter((entry) => entry.included !== false && toCents(entry.price) > 0);

  const languageLabel =
    { es: "Español", en: "English", pt: "Português" }[state.language] ?? state.language;

  return (
    <div className="flex flex-col gap-5 animate-fade-in-up">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
          {tw.stepOf(6, 6)}
        </p>
        <h2 className="mt-2 text-[32px] font-light leading-[40px] tracking-[-0.01em] text-humana-ink">{tw.review.title}</h2>
        <p className="mt-1 text-[15px] leading-[22px] text-humana-muted">{tw.review.subtitle}</p>
      </div>

      {/* Basic info */}
      <ReviewCard
        title={tw.review.basicInfo}
        editHref="/agency/retreats/create/step-1"
        editLabel={tw.review.edit}
      >
        <div className="flex flex-col divide-y divide-humana-line">
          <Row label={tw.review.nameLabel} value={state.name.trim() || "—"} />
          <Row label={tw.review.typeLabel} value={tw.types[state.retreatType]} />
          <Row
            label={tw.review.durationLabel}
            value={`${tw.preview.nightsCount(state.nights)} · ${dateRange}`}
          />
          <Row label={tw.review.capacityLabel} value={tw.preview.guests(state.capacity)} />
          <Row label={tw.review.languageLabel} value={languageLabel} />
        </div>
      </ReviewCard>

      {/* Hotel */}
      <ReviewCard
        title={tw.review.hotel}
        editHref="/agency/retreats/create/step-2"
        editLabel={tw.review.edit}
      >
        <p className="text-[14px] font-medium text-humana-ink">{state.hotelName || "—"}</p>
        {state.hotelCity && (
          <p className="mt-0.5 text-[13px] text-humana-muted">
            {[state.hotelCity, state.hotelCountry].filter(Boolean).join(", ")}
          </p>
        )}
      </ReviewCard>

      {/* Rooms & Pricing */}
      <ReviewCard
        title={tw.review.pricingRooms}
        editHref="/agency/retreats/create/step-3"
        editLabel={tw.review.edit}
      >
        <div className="flex flex-col divide-y divide-humana-line">
          {pricedRooms.map((entry) => (
            <div key={entry.inventoryBlockId} className="flex items-center justify-between py-2">
              <span className="text-[13px] text-humana-ink">
                Room type #{entry.roomTypeId}
                <span className="ml-2 text-[12px] text-humana-muted">
                  {tw.review.roomsCount(entry.availableRooms)}
                </span>
              </span>
              <span className="text-[13px] font-medium text-humana-ink">
                {formatMoney(toCents(entry.price))} {tw.review.perGuest}
              </span>
            </div>
          ))}
        </div>
      </ReviewCard>

      {/* Program */}
      {state.days.length > 0 && (
        <ReviewCard
          title={tw.review.program}
          editHref="/agency/retreats/create/step-4"
          editLabel={tw.review.edit}
        >
          <div className="flex flex-col gap-1.5">
            {state.days.map((day, i) => (
              <div key={day.id} className="flex items-baseline gap-3">
                <span className="w-12 shrink-0 text-[12px] text-humana-subtle">
                  {tw.program.dayLabel(i + 1)}
                </span>
                <span className="text-[13px] text-humana-ink">
                  {day.title.trim() || "—"}
                  {" · "}
                  <span className="text-humana-muted">
                    {tw.review.activitiesCount(day.activities.filter((a) => a.name.trim()).length)}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </ReviewCard>
      )}

      {/* Facilitators */}
      {state.facilitators.filter((f) => f.name.trim()).length > 0 && (
        <ReviewCard
          title={tw.review.facilitators}
          editHref="/agency/retreats/create/step-4"
          editLabel={tw.review.edit}
        >
          <div className="flex flex-col gap-3">
            {state.facilitators
              .filter((f) => f.name.trim())
              .map((facilitator) => (
                <div key={facilitator.id} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-humana-gold-light text-[11px] font-semibold text-humana-ink">
                    {facilitator.name
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <span className="text-[14px] font-medium text-humana-ink">
                    {facilitator.name}
                  </span>
                  <span
                    className={`rounded px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.16em] ${
                      facilitator.role === "lead"
                        ? "bg-humana-gold text-white"
                        : "bg-humana-stone text-humana-muted"
                    }`}
                  >
                    {facilitator.role === "lead" ? tw.program.lead : tw.program.assistant}
                  </span>
                  {facilitator.specialty.trim() && (
                    <span className="text-[12px] text-humana-muted">{facilitator.specialty}</span>
                  )}
                </div>
              ))}
          </div>
        </ReviewCard>
      )}

      {/* Inclusions */}
      {(state.inclusions.length > 0 || state.customInclusions.length > 0) && (
        <ReviewCard
          title={tw.review.included}
          editHref="/agency/retreats/create/step-4"
          editLabel={tw.review.edit}
        >
          <div className="flex flex-wrap gap-2">
            {state.inclusions.map((id) => (
              <span
                key={id}
                className="border border-humana-line px-3 py-1.5 text-[13px] text-humana-ink"
              >
                {t.inclusionNames[id] ?? INCLUSION_CATALOG[id]?.name ?? id}
              </span>
            ))}
            {state.customInclusions.map((name) => (
              <span
                key={name}
                className="border border-humana-line px-3 py-1.5 text-[13px] text-humana-ink"
              >
                {name}
              </span>
            ))}
          </div>
        </ReviewCard>
      )}

      {/* Gallery */}
      <ReviewCard
        title={tw.review.gallery}
        editHref="/agency/retreats/create/step-5"
        editLabel={tw.review.edit}
      >
        <div className="flex items-center gap-3">
          {state.photos.slice(0, 4).map((url, i) => (
            <div
              key={`${url}-${i}`}
              className="relative h-14 w-20 overflow-hidden rounded border border-humana-line"
            >
              <Image src={url} alt="" fill unoptimized className="object-cover" />
            </div>
          ))}
          <span className="text-[13px] text-humana-muted">
            {tw.review.imagesCount(state.photos.length)}
          </span>
        </div>
      </ReviewCard>
    </div>
  );
}
