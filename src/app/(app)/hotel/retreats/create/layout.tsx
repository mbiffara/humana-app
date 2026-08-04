/** Shared shell for the hotel retreat wizard (HT-05, 5 steps).
 *  Renders the header, step indicator, and preview sidebar; NEXT persists
 *  the active step to the API before navigating (create-or-update). */
"use client";

import { Suspense, useCallback, useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "@/i18n/LocaleProvider";
import { StepIndicator } from "@/components/StepIndicator";
import {
  RetreatWizardProvider,
  computeEndDate,
  useRetreatWizard,
} from "@/contexts/RetreatWizardContext";
import { hotelApi, type HotelProfile } from "@/lib/api/hotel";

const STEP_PATHS = [
  "/hotel/retreats/create/step-1",
  "/hotel/retreats/create/step-2",
  "/hotel/retreats/create/step-3",
  "/hotel/retreats/create/step-4",
  "/hotel/retreats/create/step-5",
];

function toCents(price: string): number {
  const parsed = parseFloat(price);
  return Number.isFinite(parsed) && parsed > 0 ? Math.round(parsed * 100) : 0;
}

function formatMoney(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(cents / 100);
}

function WizardShell({ children }: { children: ReactNode }) {
  const { t, locale } = useLocale();
  const tw = t.hotelWs.retreats.wizard;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { state, set, reset, hydrated, loadRetreat, loadingRetreat, isUploading } =
    useRetreatWizard();
  const [hotel, setHotel] = useState<HotelProfile | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);

  const activeIndex = STEP_PATHS.findIndex((p) => pathname.startsWith(p));
  const isConfirmation = pathname.includes("/confirmation");

  // Deep link into an existing retreat: /hotel/retreats/create/step-N?id=123
  const editId = searchParams.get("id");
  useEffect(() => {
    if (!hydrated || !editId) return;
    const id = Number(editId);
    if (Number.isFinite(id) && id > 0 && state.retreatId !== id) {
      loadRetreat(id).catch(() => setSaveError(true));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, editId]);

  useEffect(() => {
    hotelApi
      .getProfile()
      .then((res) => setHotel(res.hotel))
      .catch(() => {});
  }, []);

  const saveBasicInfo = useCallback(async () => {
    const payload = {
      name: state.name.trim(),
      retreat_type: state.retreatType,
      duration_nights: state.nights,
      starts_on: state.startDate,
      ends_on: computeEndDate(state.startDate, state.nights),
      capacity: state.capacity,
      language: state.language,
      description: state.description,
      location: hotel ? [hotel.city, hotel.country].filter(Boolean).join(", ") : undefined,
      country: hotel?.country || undefined,
      country_code: hotel?.country_code || undefined,
      currency: "USD",
    };
    if (state.retreatId) {
      await hotelApi.updateRetreat(state.retreatId, payload);
    } else {
      const res = await hotelApi.createRetreat(payload);
      set({ retreatId: res.retreat.id });
    }
  }, [state, set, hotel]);

  const saveProgram = useCallback(async () => {
    const retreatId = state.retreatId;
    if (!retreatId) return;
    // Single transactional replace — a mid-save failure can never leave the
    // server with a half-rebuilt program (the API rolls back atomically)
    await hotelApi.replaceRetreatProgram(retreatId, {
      days: state.days.map((day, i) => ({
        day_number: i + 1,
        title: day.title.trim() || undefined,
        activities: day.activities
          .filter((a) => a.name.trim())
          .map((activity, j) => ({
            name: activity.name.trim(),
            time: activity.time || undefined,
            position: j,
          })),
      })),
      facilitators: state.facilitators
        .filter((f) => f.name.trim())
        .map((facilitator, i) => ({
          name: facilitator.name.trim(),
          role: facilitator.role,
          specialty: facilitator.specialty.trim() || undefined,
          position: i,
        })),
      inclusions: state.inclusions
        .filter((name) => name.trim())
        .map((name, i) => ({ name: name.trim(), position: i })),
    });
  }, [state]);

  const savePricing = useCallback(async () => {
    const retreatId = state.retreatId;
    if (!retreatId) return;
    const { retreat } = await hotelApi.getRetreat(retreatId);
    const existing = new Map(retreat.pricing.map((p) => [p.room_type.id, p.id]));

    for (const entry of state.pricing) {
      // Excluded rooms are not offered — their pricing rows are removed
      const cents = entry.included === false ? 0 : toCents(entry.price);
      const existingId = existing.get(entry.roomTypeId);
      if (cents > 0) {
        if (existingId) {
          await hotelApi.updateRetreatPricing(retreatId, existingId, {
            price_per_guest_cents: cents,
          });
        } else {
          await hotelApi.createRetreatPricing(retreatId, {
            room_type_id: entry.roomTypeId,
            price_per_guest_cents: cents,
          });
        }
      } else if (existingId) {
        await hotelApi.deleteRetreatPricing(retreatId, existingId);
      }
    }
  }, [state]);

  const saveGallery = useCallback(async () => {
    const retreatId = state.retreatId;
    if (!retreatId) return;
    const urls = state.photos.filter((url) => url.startsWith("http"));
    await hotelApi.batchRetreatImages(
      retreatId,
      urls.map((url) => ({ image_url: url })),
    );
  }, [state]);

  const canProceed = (() => {
    switch (activeIndex) {
      case 0:
        return Boolean(state.name.trim() && state.nights > 0 && state.startDate && state.capacity > 0);
      case 2:
        return (
          state.pricing.some((p) => p.included !== false && toCents(p.price) > 0) &&
          // Selected rooms must be able to host the retreat's maximum capacity
          (state.capacityCovered == null || state.capacityCovered >= state.capacity)
        );
      case 3:
        // Only persisted uploads count — blob previews are filtered at save,
        // and failed uploads must be retried or removed before advancing
        return (
          state.photos.filter((url) => url.startsWith("http")).length >= 3 &&
          state.failedUploads.length === 0 &&
          !isUploading
        );
      default:
        return true;
    }
  })();

  async function handleNext() {
    if (saving || !canProceed) return;
    setSaving(true);
    setSaveError(false);
    try {
      switch (activeIndex) {
        case 0:
          await saveBasicInfo();
          break;
        case 1:
          await saveProgram();
          break;
        case 2:
          await savePricing();
          break;
        case 3:
          await saveGallery();
          break;
        case 4: {
          if (state.retreatId) await hotelApi.publishRetreat(state.retreatId);
          router.push("/hotel/retreats/create/confirmation");
          return;
        }
      }
      router.push(STEP_PATHS[activeIndex + 1]);
    } catch {
      setSaveError(true);
    } finally {
      setSaving(false);
    }
  }

  if (isConfirmation) {
    return <>{children}</>;
  }

  if (!hydrated || loadingRetreat) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-humana-line border-t-humana-gold" />
      </div>
    );
  }

  const endDate = computeEndDate(state.startDate, state.nights);
  const dateFmt = new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric" });
  const datesLabel =
    state.startDate && endDate
      ? `${new Intl.DateTimeFormat(locale, { day: "numeric", month: "short" }).format(new Date(`${state.startDate}T00:00:00`))} – ${dateFmt.format(new Date(`${endDate}T00:00:00`))}`
      : null;
  const minPriceCents = state.pricing.reduce((min, p) => {
    const cents = p.included === false ? 0 : toCents(p.price);
    return cents > 0 && (min === 0 || cents < min) ? cents : min;
  }, 0);
  const progressPct = Math.round(((activeIndex + 1) / STEP_PATHS.length) * 100);
  const isLastStep = activeIndex === STEP_PATHS.length - 1;

  const previewRows: { label: string; value: string | null }[] = [
    { label: tw.preview.hotel, value: hotel?.name ?? null },
    { label: tw.preview.nameLabel, value: state.name.trim() || null },
    {
      label: tw.preview.type,
      value: state.name.trim()
        ? `${tw.types[state.retreatType]} · ${t.hotelWs.retreats.nights(state.nights)}`
        : null,
    },
    { label: tw.preview.dates, value: datesLabel },
    { label: tw.preview.capacity, value: state.capacity > 0 ? tw.preview.guests(state.capacity) : null },
    { label: tw.preview.program, value: state.days.length ? tw.preview.daysCount(state.days.length) : null },
    { label: tw.preview.basePrice, value: minPriceCents ? `${formatMoney(minPriceCents)} USD` : null },
    { label: tw.preview.gallery, value: state.photos.length ? tw.preview.imagesCount(state.photos.length) : null },
  ];

  return (
    <div className="mx-auto max-w-[1480px] px-10 py-10">
      {/* Header */}
      <div className="mb-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
          {state.retreatId ? tw.editEyebrow : tw.eyebrow}
        </p>
        <h1 className="mt-2 text-[32px] font-light leading-[40px] tracking-[-0.01em] text-humana-ink">{tw.title}</h1>
        <p className="mt-1 text-[14px] text-humana-muted">{tw.subtitle}</p>
      </div>

      <StepIndicator
        steps={[tw.steps.info, tw.steps.program, tw.steps.pricing, tw.steps.gallery, tw.steps.review]}
        currentStep={activeIndex}
        routes={STEP_PATHS}
        className="mb-8 flex items-center gap-0"
      />

      <div className="flex items-start gap-10">
        {/* Step content */}
        <div className="min-w-0 flex-1">{children}</div>

        {/* Preview sidebar */}
        <aside className="sticky top-[108px] w-[340px] shrink-0">
          <div className="rounded-xl border border-humana-line bg-white p-6 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
              {tw.preview.title}
            </p>
            <div className="mt-4 flex flex-col divide-y divide-humana-line">
              {previewRows.map((row) => (
                <div key={row.label} className="flex items-center justify-between py-2.5">
                  <span className="text-[12px] text-humana-muted">{row.label}</span>
                  <span
                    className={`max-w-[180px] truncate text-right text-[13px] font-medium ${
                      row.value ? "text-humana-ink" : "text-humana-subtle italic"
                    }`}
                  >
                    {row.value ?? tw.preview.pending}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-humana-line bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-humana-muted">{tw.preview.progress}</span>
              <span className="text-[13px] font-semibold text-humana-gold">{progressPct}%</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-humana-stone">
              <div
                className="h-full rounded-full bg-humana-gold transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            {isLastStep && (
              <p className="mt-2 text-[12px] text-humana-muted">{tw.preview.readyToPublish}</p>
            )}
          </div>

          {saveError && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
              {tw.saveError}
            </div>
          )}

          <div className="mt-4 flex gap-3">
            {activeIndex > 0 ? (
              <Link
                href={STEP_PATHS[activeIndex - 1]}
                className="shrink-0 border border-humana-line bg-white px-6 py-3.5 text-center text-[13px] font-semibold uppercase tracking-[0.22em] text-humana-ink transition-colors hover:border-humana-ink"
              >
                {tw.back}
              </Link>
            ) : (
              <Link
                href="/hotel/retreats"
                onClick={() => {
                  if (!state.retreatId) reset();
                }}
                className="shrink-0 border border-humana-line bg-white px-6 py-3.5 text-center text-[13px] font-semibold uppercase tracking-[0.22em] text-humana-ink transition-colors hover:border-humana-ink"
              >
                {tw.back}
              </Link>
            )}
            <button
              onClick={handleNext}
              disabled={saving || !canProceed}
              className={`flex-1 py-3.5 text-[13px] font-semibold uppercase tracking-[0.22em] text-white transition-opacity ${
                isLastStep ? "bg-humana-gold" : "bg-humana-ink"
              } ${saving || !canProceed ? "cursor-not-allowed opacity-40" : "cursor-pointer hover:opacity-85"}`}
            >
              {saving
                ? isLastStep
                  ? tw.review.publishing
                  : tw.saving
                : isLastStep
                  ? tw.review.publish
                  : tw.next}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default function RetreatWizardLayout({ children }: { children: ReactNode }) {
  return (
    <RetreatWizardProvider>
      <Suspense fallback={null}>
        <WizardShell>{children}</WizardShell>
      </Suspense>
    </RetreatWizardProvider>
  );
}
