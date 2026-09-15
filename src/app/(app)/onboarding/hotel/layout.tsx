"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { HotelWizardProvider, useHotelWizard } from "@/contexts/HotelWizardContext";
import { hotelApi } from "@/lib/api/hotel";
import { api, apiErrorMessage } from "@/lib/api";
import { useLocale } from "@/i18n/LocaleProvider";
import { useAuth } from "@/contexts/AuthContext";
import { AMENITY_CATALOG } from "@/lib/amenity-catalog";
import { groupRangeInvalid, propertyFormPayload } from "@/lib/property-form";
import { videoEmbed } from "@/lib/property-catalog";
import { draftToPayload, galleryUnchanged, persistablePhotos } from "@/lib/space-catalog";
import type { HotelProfileUpdate } from "@/lib/api/hotel";

const STEP_PATHS = [
  "/onboarding/hotel/step-1",
  "/onboarding/hotel/step-2",
  "/onboarding/hotel/step-3",
  "/onboarding/hotel/step-4",
  "/onboarding/hotel/step-5",
  "/onboarding/hotel/step-6",
];

function StepProgressBar() {
  const pathname = usePathname();
  const { t } = useLocale();
  const stepLabels = t.onboarding.hotel.steps;

  const currentStepIndex = STEP_PATHS.findIndex((p) => pathname === p);
  const activeIndex = currentStepIndex >= 0 ? currentStepIndex : 0;

  return (
    <div className="flex items-center gap-0">
      {STEP_PATHS.map((_, i) => {
        const isCompleted = i < activeIndex;
        const isActive = i === activeIndex;

        return (
          <div key={i} className="flex items-center">
            {i > 0 && (
              <div
                className={`mx-2 h-px w-10 transition-colors duration-300 ${
                  i <= activeIndex ? "bg-humana-gold" : "bg-humana-line"
                }`}
              />
            )}
            <div className="flex items-center gap-2">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold transition-all duration-300 ${
                  isCompleted
                    ? "bg-humana-gold text-white"
                    : isActive
                      ? "border-2 border-humana-gold bg-transparent text-humana-gold"
                      : "border border-humana-line bg-transparent text-humana-muted"
                }`}
              >
                {isCompleted ? (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span
                className={`text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors duration-300 ${
                  isCompleted
                    ? "text-humana-gold"
                    : isActive
                      ? "text-humana-ink"
                      : "text-humana-muted/50"
                }`}
              >
                {stepLabels[i]}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function BottomBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLocale();
  const { user, setUser, refreshAuth } = useAuth();
  const {
    state,
    updateCommonSpace,
    commonSpacesLoaded,
    hideBottomBar,
    isUploading,
    isUploadingLogo,
    profileLoaded,
    videoTouched,
  } = useHotelWizard();

  const org = user?.organization;
  const alreadySubmitted = !!org?.onboarding_completed;
  // Submitted hotels with unpublished edits or admin feedback can republish
  const hasSomethingToPublish = !alreadySubmitted || !!org?.pending_changes || !!org?.review_feedback;
  const [submitting, setSubmitting] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const currentStepIndex = STEP_PATHS.findIndex((p) => pathname === p);
  const activeIndex = currentStepIndex >= 0 ? currentStepIndex : 0;
  const isLastStep = activeIndex === STEP_PATHS.length - 1;
  const isFirstStep = activeIndex === 0;

  // Hide bottom bar on under-review page or when step sub-views have own nav
  if (pathname.includes("under-review")) return null;
  if (hideBottomBar) return null;

  function handleBack() {
    if (activeIndex > 0) {
      router.push(STEP_PATHS[activeIndex - 1]);
    }
  }

  async function saveStep1() {
    const fullName = `${state.ownerFirstName.trim()} ${state.ownerLastName.trim()}`.trim();
    // Save hotel profile + user name/phone in a single PATCH
    const payload: Record<string, unknown> = {
      hotel: {
        ...propertyFormPayload(state),
        name: state.hotelName.trim(),
        address: state.address.trim(),
        description: state.description.trim(),
        phone: state.phone.trim(),
        contact_email: state.contactEmail.trim() || user?.email || "",
      },
    };
    if (fullName) payload.user_name = fullName;
    if (state.ownerPhone) payload.user_phone = state.ownerPhone.trim();
    await api.patch("/hotel/profile", payload);
  }

  async function saveStep2() {
    // Delete all existing room types first to avoid unique-name conflicts
    try {
      const existing = await hotelApi.listRoomTypes();
      for (const rt of existing.room_types) {
        await hotelApi.deleteRoomType(rt.id);
      }
    } catch {
      // Continue even if cleanup fails
    }

    // Create fresh room types from wizard state
    for (const room of state.roomTypes) {
      const payload = {
        name: room.name,
        category: "standard" as string,
        capacity: room.maxGuests,
        price_per_night_cents: Math.round(room.baseRate * 100),
        area_sqm: room.roomSize || undefined,
        total_rooms: room.totalUnits,
        description: room.description || undefined,
        bed_type: room.bedType.toLowerCase(),
        beds_count: room.bedsCount,
        amenities: room.amenities,
      };
      const created = await hotelApi.createRoomType(payload);

      // Persist this room's gallery (skip blob: preview URLs that never
      // finished uploading; the first server URL becomes the thumbnail).
      const serverPhotos = room.photos.filter((url) => url.startsWith("http"));
      if (serverPhotos.length > 0) {
        await hotelApi.batchRoomTypeImages(
          created.room_type.id,
          serverPhotos.map((url) => ({ image_url: url })),
        );
      }

      // Persist blocked date ranges (all other dates are open by default).
      for (const block of room.availability) {
        if (!block.blocked) continue;
        await hotelApi.createAvailabilityBlock({
          room_type_id: created.room_type.id,
          starts_on: block.startDate,
          ends_on: block.endDate,
          // Partial closures carry a unit count; a full closure (or legacy
          // blocks saved with units 0) closes the whole room type.
          units:
            block.units > 0 && block.units < room.totalUnits ? block.units : undefined,
        });
      }
    }
    // Compute total rooms from all room types and update hotel profile
    const totalRooms = state.roomTypes.reduce((sum, rt) => sum + rt.totalUnits, 0);
    if (totalRooms > 0) {
      await api.patch("/hotel/profile", { hotel: { total_rooms: totalRooms } });
    }
  }

  /** Sync the wizard's spaces with the API: drop what the owner removed,
   *  create or update the rest, then replace the galleries that changed.
   *  Sequential — a create has to answer with an id before its images go out.
   *
   *  Deleting is only safe against a list we know mirrors the server. If the
   *  profile fetch never landed, the wizard's list may be a stale session that
   *  hydration never corrected, so the step creates and updates but deletes
   *  nothing — a failed load must not wipe saved spaces. */
  async function saveStep3() {
    let existing: number[] | null = null;
    if (commonSpacesLoaded) {
      try {
        const res = await hotelApi.listCommonSpaces();
        existing = res.common_spaces.map((cs) => cs.id);
      } catch {
        // Could not read what is saved — never delete on a guess
      }
    }

    if (existing) {
      const kept = new Set(state.commonSpaces.map((cs) => cs.id).filter((id) => id != null));
      for (const id of existing) {
        if (!kept.has(id)) await hotelApi.deleteCommonSpace(id);
      }
    }

    for (const draft of state.commonSpaces) {
      const payload = draftToPayload(draft);
      // An id the list says is gone (deleted elsewhere) is recreated
      let id = draft.id && (existing === null || existing.includes(draft.id)) ? draft.id : undefined;
      let saved = draft.savedPhotos;
      if (id) {
        await hotelApi.updateCommonSpace(id, payload);
      } else {
        const created = await hotelApi.createCommonSpace(payload);
        id = created.common_space.id;
        saved = [];
        updateCommonSpace(draft.localId, { id, savedPhotos: [] });
      }
      // Replace the gallery, empty list included, so removals stick — but only
      // when it differs from what the API holds: re-sending an untouched
      // gallery regenerates every image id and marks the hotel as changed.
      const photos = persistablePhotos(draft);
      if (!galleryUnchanged(draft, saved)) {
        await hotelApi.batchCommonSpaceImages(
          id,
          photos.map((url) => ({ image_url: url })),
        );
        updateCommonSpace(draft.localId, { savedPhotos: photos });
      }
    }
  }

  async function saveStep4() {
    const allAmenities = [
      ...state.amenities.map((id) => {
        const entry = AMENITY_CATALOG[id];
        return entry
          ? { name: entry.name, category: entry.category, featured: entry.featured }
          : { name: id, category: "general", featured: false };
      }),
      ...state.customAmenities.map((name) => ({ name, category: "general", featured: false })),
    ];
    if (allAmenities.length > 0) {
      await hotelApi.batchAmenities(allAmenities);
    }
  }

  async function saveStep5() {
    // Only send real server URLs (skip blob:// preview URLs). The batch
    // replaces the whole gallery and the first entry carries the cover flag,
    // which is why the grid keeps the cover in first position.
    const serverPhotos = state.photos.filter((p) => p.url.startsWith("http"));
    if (serverPhotos.length > 0) {
      await hotelApi.batchImages(
        serverPhotos.map((photo, i) => ({
          image_url: photo.url,
          category: photo.category,
          is_cover: i === 0,
        })),
      );
    }

    // Logo and video live on the hotel profile, not the gallery. The video is
    // only written back once the saved profile has been read (or the owner
    // edited the field): otherwise a failed load would clear a saved link.
    const profile: Partial<HotelProfileUpdate> = {};
    if (profileLoaded || videoTouched) profile.video_url = state.videoUrl.trim();
    if (state.logoUrl.startsWith("http")) profile.logo_url = state.logoUrl;
    // With nothing to send, skip the PATCH entirely — opening step 5 by URL
    // before the hotel exists would answer "Name can't be blank".
    if (Object.keys(profile).length > 0) {
      await hotelApi.updateProfile(profile);
    }
  }

  async function saveStep6() {
    const res = await hotelApi.submitForReview();
    // Refresh user state so app layout sees onboarding_completed = true
    setUser(res.user);
    // Clear wizard sessionStorage after successful submission
    try {
      sessionStorage.removeItem("humana.hotel-wizard");
    } catch {
      // Ignore
    }
  }

  function handleNext() {
    if (isLastStep) {
      setShowConfirmModal(true);
      return;
    }
    doSaveAndNavigate();
  }

  async function doSaveAndNavigate() {
    setSubmitting(true);
    setSaveError(null);
    try {
      switch (activeIndex) {
        case 0:
          await saveStep1();
          break;
        case 1:
          await saveStep2();
          break;
        case 2:
          await saveStep3();
          break;
        case 3:
          await saveStep4();
          break;
        case 4:
          await saveStep5();
          break;
        case 5:
          await saveStep6();
          break;
      }
    } catch (err) {
      console.error("Save error:", err);
      setSaveError(apiErrorMessage(err, "Could not save. Please try again."));
      setSubmitting(false);
      setShowConfirmModal(false);
      return;
    }

    // Editing after submission withdraws the review server-side — refresh the
    // user so the UI picks up pending_changes and offers "Publish changes".
    if (alreadySubmitted && !isLastStep) {
      try {
        await refreshAuth();
      } catch {
        // best-effort
      }
    }

    setSubmitting(false);
    setShowConfirmModal(false);

    if (isLastStep) {
      router.push("/onboarding/hotel/under-review");
    } else {
      router.push(STEP_PATHS[activeIndex + 1]);
    }
  }

  // Validation per step — all fields required
  function canProceed(): boolean {
    switch (activeIndex) {
      case 0:
        return (
          state.ownerFirstName.trim().length > 0 &&
          state.ownerLastName.trim().length > 0 &&
          state.hotelName.trim().length > 0 &&
          state.address.trim().length > 0 &&
          state.description.trim().length > 0 &&
          state.propertyType.length > 0 &&
          (state.propertyType !== "other" || state.propertyTypeOther.trim().length > 0) &&
          state.phone.trim().length > 0 &&
          state.checkInTime.length > 0 &&
          state.checkOutTime.length > 0 &&
          !groupRangeInvalid(state)
        );
      case 1:
        return state.roomTypes.length > 0;
      case 2:
        // Common spaces are optional — the step can be left empty
        return true;
      case 3:
        return state.amenities.length > 0 || state.customAmenities.length > 0;
      case 4:
        // A video is optional, but a link we cannot embed is a 422 waiting to
        // happen — the same hosts the API accepts.
        return (
          !isUploading &&
          !isUploadingLogo &&
          (state.videoUrl.trim().length === 0 || videoEmbed(state.videoUrl) !== null)
        );
      default:
        return true;
    }
  }

  const h = t.onboarding.hotel;
  const p = t.propertyForm;

  function getMissingFields(): string[] {
    const missing: string[] = [];
    switch (activeIndex) {
      case 0:
        if (!state.ownerFirstName.trim()) missing.push(h.firstName);
        if (!state.ownerLastName.trim()) missing.push(h.lastName);
        if (!state.hotelName.trim()) missing.push(h.hotelName);
        if (!state.address.trim()) missing.push(h.addressLabel);
        if (!state.description.trim()) missing.push(h.descriptionLabel);
        if (!state.propertyType) missing.push(p.typeLabel);
        else if (state.propertyType === "other" && !state.propertyTypeOther.trim())
          missing.push(p.typeOtherLabel);
        if (!state.phone.trim()) missing.push(h.hotelPhoneLabel);
        if (!state.checkInTime) missing.push(p.checkInLabel);
        if (!state.checkOutTime) missing.push(p.checkOutLabel);
        if (groupRangeInvalid(state)) missing.push(p.groupRangeError);
        break;
      case 1:
        if (state.roomTypes.length === 0) {
          missing.push(h.addAtLeastOneRoom);
        }
        break;
      case 3:
        if (state.amenities.length === 0 && state.customAmenities.length === 0) {
          missing.push(h.addAtLeastOneAmenity);
        }
        break;
      case 4:
        if (state.videoUrl.trim().length > 0 && videoEmbed(state.videoUrl) === null) {
          missing.push(t.visualInfo.videoInvalid);
        }
        break;
    }
    return missing;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-humana-line bg-white px-16 py-4">
      {/* Error banner */}
      {saveError && (
        <div className="mb-3 flex items-center gap-2 rounded-[6px] bg-red-50 px-4 py-2.5 text-[13px] text-red-700 animate-fade-in-up">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {saveError}
        </div>
      )}
      <div className="flex items-center justify-between">
      {/* Back */}
      <div className="w-[160px]">
        {!isFirstStep && (
          <button
            type="button"
            onClick={handleBack}
            className="cursor-pointer flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.22em] text-humana-muted transition-colors hover:text-humana-ink"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            {t.onboarding.back}
          </button>
        )}
      </div>

      {/* Step dots */}
      <div className="flex items-center gap-2">
        {STEP_PATHS.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === activeIndex
                ? "w-6 bg-humana-gold"
                : i < activeIndex
                  ? "w-1.5 bg-humana-gold/50"
                  : "w-1.5 bg-humana-line"
            }`}
          />
        ))}
      </div>

      {/* Next / Submit for review */}
      <div className="group/next relative flex w-[200px] justify-end">
        {isLastStep && !hasSomethingToPublish ? (
          <span className="flex items-center gap-2 px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {h.reviewStatusPendingTitle}
          </span>
        ) : (
        <>
        <button
          type="button"
          onClick={handleNext}
          disabled={!canProceed() || submitting}
          className="cursor-pointer flex items-center gap-2 px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.22em] bg-humana-ink text-white hover:bg-black transition-all duration-200 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : isLastStep ? (alreadySubmitted ? h.publishChangesCta : h.submitForReviewCta) : t.onboarding.next}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke={isLastStep ? "#d4af37" : "currentColor"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
        {!canProceed() && !submitting && (
          <div className="pointer-events-none absolute bottom-full right-0 mb-3 hidden w-max max-w-[280px] rounded-lg bg-humana-ink px-4 py-3 shadow-lg group-hover/next:block animate-fade-in-up">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-humana-gold mb-1.5">
              {h.completeFields}
            </div>
            <ul className="space-y-0.5 text-[12px] text-white/80">
              {getMissingFields().map((f) => (
                <li key={f}>• {f}</li>
              ))}
            </ul>
            <div className="absolute -bottom-1 right-8 h-2 w-2 rotate-45 bg-humana-ink" />
          </div>
        )}
        </>
        )}
      </div>
      </div>

      {/* ─── Verification Confirmation Modal ─── */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-[460px] rounded-xl bg-white p-8 shadow-2xl animate-fade-in-scale">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-humana-gold-light">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
              </div>
            </div>

            {/* Title */}
            <h2 className="mt-4 text-center text-[20px] font-medium text-humana-ink">
              {h.verificationTitle}
            </h2>

            {/* Description */}
            <p className="mt-2 text-center text-[14px] leading-relaxed text-humana-muted">
              {h.verificationDescription}
            </p>

            {/* Error banner */}
            {saveError && (
              <div className="mt-4 flex items-center gap-2 rounded-[6px] bg-red-50 px-4 py-2.5 text-[13px] text-red-700">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {saveError}
              </div>
            )}

            {/* Buttons */}
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => { setShowConfirmModal(false); setSaveError(null); }}
                disabled={submitting}
                className="cursor-pointer flex-1 rounded-[6px] border border-humana-line px-4 py-3 text-[13px] font-semibold uppercase tracking-[0.18em] text-humana-muted transition-all hover:border-humana-ink hover:text-humana-ink disabled:opacity-40"
              >
                {t.onboarding.back}
              </button>
              <button
                type="button"
                onClick={doSaveAndNavigate}
                disabled={submitting}
                className="cursor-pointer flex-1 flex items-center justify-center gap-2 rounded-[6px] bg-humana-ink px-4 py-3 text-[13px] font-semibold uppercase tracking-[0.18em] text-white transition-all hover:bg-black disabled:opacity-40"
              >
                {submitting ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  h.publish
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function HotelWizardLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Hide wizard chrome on under-review page
  const isUnderReview = pathname.includes("under-review");

  return (
    <div className="flex min-h-screen flex-col bg-humana-stone">
      {/* ─── Top Bar ─── */}
      <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-humana-line bg-white/95 px-16 py-4 backdrop-blur-sm animate-[fade-in-down_0.4s_ease-out]">
        {/* Left: Logo */}
        <Link
          href="/dashboard"
          className="cursor-pointer flex items-center gap-3 transition-opacity hover:opacity-80"
        >
          <Image
            src="/brand/isotipo.png"
            alt="HUMANA"
            width={32}
            height={32}
            priority
          />
          <Image
            src="/brand/humana-text.svg"
            alt=""
            width={140}
            height={44}
            className="h-[28px] w-auto"
            priority
          />
          <span className="ml-1 rounded bg-humana-ink px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-400">
            Hotel
          </span>
        </Link>

        {/* Center: Step progress */}
        {!isUnderReview && <StepProgressBar />}

        {/* Right spacer for layout balance */}
        <div className="w-[160px]" />
      </nav>

      {/* ─── Content ─── */}
      <main className="flex-1 pb-20">{children}</main>

      {/* ─── Bottom Bar ─── */}
      {!isUnderReview && <BottomBar />}
    </div>
  );
}

export default function HotelWizardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <HotelWizardProvider>
      <HotelWizardLayoutInner>{children}</HotelWizardLayoutInner>
    </HotelWizardProvider>
  );
}
