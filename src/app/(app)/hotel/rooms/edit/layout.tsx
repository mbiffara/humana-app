/** Shared shell for the room type editor (HT-03b–e, 5 steps).
 *  Header + step indicator + preview sidebar; NEXT persists the active
 *  step (create-or-update), SAVE on the last step syncs pricing/tiers. */
"use client";

import { Suspense, useCallback, useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "@/i18n/LocaleProvider";
import { StepIndicator } from "@/components/StepIndicator";
import { RoomTypeEditorProvider, useRoomTypeEditor } from "@/contexts/RoomTypeEditorContext";
import { hotelApi } from "@/lib/api/hotel";

const STEP_PATHS = [
  "/hotel/rooms/edit/step-1",
  "/hotel/rooms/edit/step-2",
  "/hotel/rooms/edit/step-3",
  "/hotel/rooms/edit/step-4",
  "/hotel/rooms/edit/step-5",
];

function toCents(price: string): number {
  const parsed = parseFloat(price);
  return Number.isFinite(parsed) && parsed >= 0 ? Math.round(parsed * 100) : 0;
}

function WizardShell({ children }: { children: ReactNode }) {
  const { t } = useLocale();
  const te = t.hotelWs.roomEditor;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { state, set, reset, hydrated, loadRoomType, loadingRoomType, isUploading } =
    useRoomTypeEditor();
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);

  const activeIndex = STEP_PATHS.findIndex((p) => pathname.startsWith(p));
  const isLastStep = activeIndex === STEP_PATHS.length - 1;

  // Deep link into an existing room type: /hotel/rooms/edit/step-N?id=123
  const editId = searchParams.get("id");
  useEffect(() => {
    if (!hydrated || !editId) return;
    const id = Number(editId);
    if (Number.isFinite(id) && id > 0 && state.roomTypeId !== id) {
      loadRoomType(id).catch(() => setSaveError(true));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, editId]);

  const saveDetails = useCallback(async () => {
    const payload = {
      name: state.name.trim(),
      description: state.description,
      capacity: state.capacity,
      total_rooms: state.totalRooms,
      bed_type: state.bedType,
      area_sqm: state.areaSqm ? parseFloat(state.areaSqm) : null,
      status: state.status,
      price_per_night_cents: toCents(state.baseRate),
    };
    if (state.roomTypeId) {
      await hotelApi.updateRoomType(state.roomTypeId, payload);
    } else {
      const res = await hotelApi.createRoomType(payload);
      set({ roomTypeId: res.room_type.id });
    }
  }, [state, set]);

  const saveAmenities = useCallback(async () => {
    if (!state.roomTypeId) return;
    await hotelApi.updateRoomType(state.roomTypeId, { amenities: state.amenities });
  }, [state]);

  const savePhotos = useCallback(async () => {
    if (!state.roomTypeId) return;
    const urls = state.photos.filter((url) => url.startsWith("http"));
    await hotelApi.batchRoomTypeImages(
      state.roomTypeId,
      urls.map((url) => ({ image_url: url })),
    );
  }, [state]);

  const savePricing = useCallback(async () => {
    const roomTypeId = state.roomTypeId;
    if (!roomTypeId) return;
    await hotelApi.updateRoomType(roomTypeId, {
      price_per_night_cents: toCents(state.baseRate),
    });

    for (const tierId of state.removedTierIds) {
      await hotelApi.deleteRateTier(roomTypeId, tierId);
    }
    const validTiers = state.tiers.filter(
      (tier) => parseInt(tier.minRooms, 10) > 1 && toCents(tier.price) > 0,
    );
    for (const tier of validTiers) {
      const payload = {
        min_rooms: parseInt(tier.minRooms, 10),
        starts_on: tier.startsOn || null,
        ends_on: tier.endsOn || null,
        price_per_night_cents: toCents(tier.price),
      };
      if (tier.id) {
        await hotelApi.updateRateTier(roomTypeId, tier.id, payload);
      } else {
        await hotelApi.createRateTier(roomTypeId, payload);
      }
    }
  }, [state]);

  const canProceed = (() => {
    switch (activeIndex) {
      case 0:
        return Boolean(state.name.trim() && state.capacity > 0 && state.totalRooms > 0);
      case 2:
        return state.failedUploads.length === 0 && !isUploading;
      case 4:
        return toCents(state.baseRate) > 0;
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
          await saveDetails();
          break;
        case 1:
          await saveAmenities();
          break;
        case 2:
          await savePhotos();
          break;
        case 3:
          break; // availability blocks are saved as they're created
        case 4: {
          await savePricing();
          reset();
          router.push("/hotel/rooms");
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

  if (!hydrated || loadingRoomType) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-humana-line border-t-humana-gold" />
      </div>
    );
  }

  const previewRows: { label: string; value: string | null }[] = [
    { label: te.preview.capacity, value: state.capacity > 0 ? te.preview.guests(state.capacity) : null },
    { label: te.preview.units, value: state.totalRooms > 0 ? te.preview.rooms(state.totalRooms) : null },
    {
      label: te.preview.bed,
      value: te.details.bedTypes[state.bedType as keyof typeof te.details.bedTypes] ?? state.bedType,
    },
    {
      label: te.preview.rate,
      value: toCents(state.baseRate)
        ? `U$D ${Math.round(toCents(state.baseRate) / 100)} ${t.hotelWs.roomTypes.perNight}`
        : null,
    },
    {
      label: te.preview.amenities,
      value: state.amenities.length ? te.preview.configured(state.amenities.length) : null,
    },
  ];
  const progressPct = Math.round(((activeIndex + 1) / STEP_PATHS.length) * 100);

  return (
    <div className="mx-auto max-w-[1480px] px-10 py-10">
      {/* Header */}
      <div className="mb-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
          {state.roomTypeId ? te.editEyebrow : te.createEyebrow}
        </p>
        <h1 className="mt-2 text-[32px] font-bold text-humana-ink">
          {state.name.trim() || te.details.title}
        </h1>
      </div>

      <StepIndicator
        steps={[te.steps.details, te.steps.amenities, te.steps.photos, te.steps.availability, te.steps.pricing]}
        currentStep={activeIndex}
        routes={STEP_PATHS}
        className="mb-8 flex items-center gap-0"
      />

      <div className="flex items-start gap-10">
        <div className="min-w-0 flex-1">{children}</div>

        {/* Preview sidebar */}
        <aside className="sticky top-[108px] w-[320px] shrink-0">
          <div className="overflow-hidden rounded-xl border border-humana-line bg-white">
            {state.photos[0] && (
              <div className="relative h-[150px] w-full">
                <Image src={state.photos[0]} alt="" fill unoptimized className="object-cover" />
              </div>
            )}
            <div className="p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
                {te.preview.title}
              </p>
              <h3 className="mt-1 text-[18px] font-bold text-humana-ink">
                {state.name.trim() || "—"}
              </h3>
              <div className="mt-3 flex flex-col divide-y divide-humana-line">
                {previewRows.map((row) => (
                  <div key={row.label} className="flex items-center justify-between py-2">
                    <span className="text-[12px] text-humana-muted">{row.label}</span>
                    <span
                      className={`text-right text-[13px] font-medium ${
                        row.value ? "text-humana-ink" : "text-humana-subtle italic"
                      }`}
                    >
                      {row.value ?? te.preview.pending}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Progress only makes sense while creating — editing is not linear */}
          {!state.roomTypeId && (
            <div className="mt-4 rounded-xl border border-humana-line bg-white p-6">
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-humana-muted">{te.preview.progress}</span>
                <span className="text-[13px] font-semibold text-humana-gold">{progressPct}%</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-humana-stone">
                <div
                  className="h-full rounded-full bg-humana-gold transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          )}

          {saveError && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
              {te.saveError}
            </div>
          )}

          <div className="mt-4 flex gap-3">
            {activeIndex > 0 ? (
              <Link
                href={STEP_PATHS[activeIndex - 1]}
                className="flex-1 border border-humana-line bg-white py-3.5 text-center text-[13px] font-semibold uppercase tracking-[0.22em] text-humana-ink transition-colors hover:border-humana-ink"
              >
                {te.back}
              </Link>
            ) : (
              <Link
                href="/hotel/rooms"
                onClick={() => {
                  if (!state.roomTypeId) reset();
                }}
                className="flex-1 border border-humana-line bg-white py-3.5 text-center text-[13px] font-semibold uppercase tracking-[0.22em] text-humana-ink transition-colors hover:border-humana-ink"
              >
                {te.cancel}
              </Link>
            )}
            <button
              onClick={handleNext}
              disabled={saving || !canProceed}
              className={`flex-1 cursor-pointer bg-humana-ink py-3.5 text-[13px] font-semibold uppercase tracking-[0.22em] text-white transition-opacity ${
                saving || !canProceed ? "cursor-not-allowed opacity-40" : "hover:opacity-85"
              }`}
            >
              {saving ? te.saving : isLastStep ? te.save : te.next}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default function RoomTypeEditorLayout({ children }: { children: ReactNode }) {
  return (
    <RoomTypeEditorProvider>
      <Suspense fallback={null}>
        <WizardShell>{children}</WizardShell>
      </Suspense>
    </RoomTypeEditorProvider>
  );
}
