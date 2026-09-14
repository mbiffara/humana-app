/** Step 5 — Review & Status. Summary of everything saved in steps 1–4 with
 *  per-section edit links, plus the verification status of the property. */
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useHotelWizard } from "@/contexts/HotelWizardContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/i18n/LocaleProvider";
import { AMENITY_CATALOG } from "@/lib/amenity-catalog";
import { formatCheckTime } from "@/components/TimePicker";
import { decimalOrNull, googleMapsUrl, integerOrNull } from "@/lib/property-catalog";
import {
  distanceAndTime,
  environmentLabels,
  groupCapacitySummary,
  petPolicySummary,
  propertyTypeLabel,
} from "@/lib/property-summary";

function SectionCard({
  title,
  editLabel,
  onEdit,
  children,
}: {
  title: string;
  editLabel: string;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[6px] border border-humana-line bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-[15px] font-medium text-humana-ink">{title}</h3>
        <button
          type="button"
          onClick={onEdit}
          className="cursor-pointer text-[12px] font-semibold uppercase tracking-[0.18em] text-humana-gold transition-opacity hover:opacity-70"
        >
          {editLabel}
        </button>
      </div>
      {children}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-subtle">{label}</p>
      <p className="mt-0.5 text-[14px] text-humana-ink">{value || "—"}</p>
    </div>
  );
}

/** Same as Field, but the whole row disappears when there is nothing to show —
 *  hotels saved before the property contract leave most of these empty. */
function OptionalField({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return <Field label={label} value={value} />;
}

export default function HotelWizardStep5() {
  const { state } = useHotelWizard();
  const { user } = useAuth();
  const { t } = useLocale();
  const router = useRouter();
  const h = t.onboarding.hotel;
  const p = t.propertyForm;

  const latitude = decimalOrNull(state.latitude, 6);
  const longitude = decimalOrNull(state.longitude, 6);
  const mapsUrl = googleMapsUrl(latitude, longitude);
  const typeLabel = propertyTypeLabel(p, state.propertyType || null, state.propertyTypeOther);
  const environments = environmentLabels(p, state.environments);
  const airportDistance = distanceAndTime(
    p,
    decimalOrNull(state.airportDistanceKm, 1),
    integerOrNull(state.airportTimeMin),
  );
  const transferLabel = state.airportTransfer ? p.transfers[state.airportTransfer] : null;
  const centreDistance = decimalOrNull(state.distanceToCenterKm, 1);
  const petSummary = petPolicySummary(p, {
    pet_friendly: state.petFriendly,
    pet_dogs: state.petDogs,
    pet_cats: state.petCats,
    pet_size_restriction: state.petSizeRestriction,
    pet_extra_cost: state.petExtraCost,
    pet_common_areas: state.petCommonAreas,
    pet_specific_rooms: state.petSpecificRooms,
  });
  const groupsSummary = groupCapacitySummary(
    p,
    integerOrNull(state.groupMinGuests),
    integerOrNull(state.groupMaxGuests),
  );

  const editStep = (step: number) => () => router.push(`/onboarding/hotel/step-${step}`);

  const org = user?.organization;
  const submitted = !!org?.onboarding_completed;
  const approved = org?.status === "verified";
  const hasFeedback = !!org?.review_feedback;
  const hasUnpublished = !!org?.pending_changes;

  // Approved hotels have no business on the review step — their workspace is ready.
  useEffect(() => {
    if (approved && submitted) {
      router.replace("/hotel/dashboard");
    }
  }, [approved, submitted, router]);

  const status = approved
    ? "approved"
    : submitted && hasFeedback
      ? "feedback"
      : submitted && hasUnpublished
        ? "changes"
        : submitted
          ? "pending"
          : "draft";

  const statusStyles = {
    draft: "border-humana-line bg-white",
    pending: "border-humana-gold bg-humana-gold-light",
    changes: "border-humana-gold bg-humana-gold-light",
    feedback: "border-amber-300 bg-amber-50",
    approved: "border-emerald-300 bg-emerald-50",
  }[status];

  const statusTitle = {
    draft: h.reviewStatusDraftTitle,
    pending: h.reviewStatusPendingTitle,
    changes: h.reviewStatusChangesTitle,
    feedback: h.reviewStatusFeedbackTitle,
    approved: h.reviewStatusApprovedTitle,
  }[status];

  const statusBody = {
    draft: h.reviewStatusDraftBody,
    pending: h.reviewStatusPendingBody,
    changes: h.reviewStatusChangesBody,
    feedback: h.reviewStatusFeedbackBody,
    approved: h.reviewStatusApprovedBody,
  }[status];

  return (
    <div className="flex justify-center px-16 py-16 pb-28 animate-fade-in-up">
      <div className="w-full max-w-[700px]">
      <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
        {h.step5Eyebrow}
      </span>
      <h2 className="mt-3 text-[28px] font-light leading-[1.2] tracking-[-0.02em] text-humana-ink">
        {h.step5Title}
      </h2>
      <p className="mt-2 text-[15px] leading-[22px] text-humana-muted">{h.step5Sub}</p>

      {/* Status banner */}
      <div className={`mt-8 flex items-start gap-4 rounded-[6px] border p-6 ${statusStyles}`}>
        <div className="mt-0.5 shrink-0">
          {status === "approved" ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="8 12 11 15 16 9" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={status === "feedback" ? "#d97706" : "#d4af37"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          )}
        </div>
        <div>
          <p className={`text-[13px] font-semibold uppercase tracking-[0.22em] ${status === "approved" ? "text-emerald-700" : status === "feedback" ? "text-amber-600" : "text-humana-gold"}`}>
            {statusTitle}
          </p>
          <p className="mt-1 text-[14px] leading-relaxed text-humana-ink">{statusBody}</p>
          {status === "feedback" && org?.review_feedback && (
            <p className="mt-3 whitespace-pre-line rounded-[6px] border border-amber-200 bg-white px-4 py-3 text-[14px] italic leading-relaxed text-humana-ink">
              &ldquo;{org.review_feedback}&rdquo;
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-5">
        {/* Property information */}
        <SectionCard title={h.reviewHotelInfo} editLabel={h.reviewEdit} onEdit={editStep(1)}>
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <Field label={h.hotelName} value={state.hotelName} />
            <OptionalField label={p.typeLabel} value={typeLabel} />
            <Field label={h.addressLabel} value={state.address} />
            <OptionalField label={p.stateRegionLabel} value={state.stateRegion} />
            <Field label={h.hotelPhoneLabel} value={state.phone} />
            <OptionalField label={p.emailLabel} value={state.contactEmail} />
            <OptionalField label={p.websiteLabel} value={state.website} />
            <OptionalField label={p.instagramLabel} value={state.instagram} />
            <OptionalField label={p.nearestAirportLabel} value={state.nearestAirport} />
            <OptionalField label={p.airportDistanceLabel} value={airportDistance} />
            <OptionalField label={p.airportTransferLabel} value={transferLabel} />
            <OptionalField
              label={p.distanceToCenterLabel}
              value={centreDistance != null ? `${centreDistance} ${p.kmSuffix}` : null}
            />
            <Field label={p.checkInLabel} value={formatCheckTime(state.checkInTime, p.flexible)} />
            <Field label={p.checkOutLabel} value={formatCheckTime(state.checkOutTime, p.flexible)} />
            <OptionalField label={p.policiesSection} value={petSummary} />
            <OptionalField label={p.groupsSection} value={groupsSummary} />
            {mapsUrl && (
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-subtle">
                  {p.latitudeLabel} / {p.longitudeLabel}
                </p>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-0.5 block text-[14px] text-humana-gold hover:underline"
                >
                  {latitude}, {longitude} — {p.viewOnMaps}
                </a>
              </div>
            )}
          </div>
          {environments.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2 border-t border-humana-line pt-4">
              {environments.map((label) => (
                <span
                  key={label}
                  className="rounded-full border border-humana-line bg-humana-stone px-3 py-1.5 text-[13px] text-humana-ink"
                >
                  {label}
                </span>
              ))}
            </div>
          )}
          {state.description && (
            <p className="mt-4 border-t border-humana-line pt-4 text-[14px] leading-relaxed text-humana-muted">
              {state.description}
            </p>
          )}
        </SectionCard>

        {/* Rooms */}
        <SectionCard title={h.reviewRooms} editLabel={h.reviewEdit} onEdit={editStep(2)}>
          <div className="flex flex-col gap-3">
            {state.roomTypes.map((room) => (
              <div key={room.id} className="flex items-center gap-4 rounded-[6px] border border-humana-line/70 p-3">
                {room.photos[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={room.photos[0]} alt={room.name} className="h-14 w-20 shrink-0 rounded object-cover" />
                ) : (
                  <div className="flex h-14 w-20 shrink-0 items-center justify-center rounded bg-humana-stone">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8a8578" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="M21 15l-5-5L5 21" />
                    </svg>
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-medium text-humana-ink">{room.name}</p>
                  <p className="mt-0.5 text-[12px] text-humana-muted">
                    {room.totalUnits} {h.reviewUnits} · {room.maxGuests} {h.reviewGuests} · {room.bedType}
                  </p>
                </div>
                <p className="shrink-0 text-[14px] font-medium text-humana-ink">
                  ${room.baseRate.toLocaleString()} <span className="text-[12px] font-normal text-humana-muted">{h.reviewPerNight}</span>
                </p>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Amenities */}
        <SectionCard title={h.reviewAmenities} editLabel={h.reviewEdit} onEdit={editStep(3)}>
          <div className="flex flex-wrap gap-2">
            {state.amenities.map((id) => (
              <span key={id} className="rounded-full border border-humana-line bg-humana-stone px-3 py-1.5 text-[13px] text-humana-ink">
                {h.amenityNames[id] || AMENITY_CATALOG[id]?.name || id}
              </span>
            ))}
            {state.customAmenities.map((name) => (
              <span key={name} className="rounded-full border border-humana-gold/40 bg-humana-gold-light px-3 py-1.5 text-[13px] text-humana-ink">
                {name}
              </span>
            ))}
          </div>
        </SectionCard>

        {/* Photos */}
        <SectionCard title={h.reviewPhotos} editLabel={h.reviewEdit} onEdit={editStep(4)}>
          {state.photos.length > 0 ? (
            <div className="grid grid-cols-5 gap-3">
              {state.photos.map((url, i) => (
                <div key={`${url}-${i}`} className="relative aspect-[4/3] overflow-hidden rounded-[6px] bg-humana-stone">
                  <Image src={url} alt={`${state.hotelName} ${i + 1}`} fill unoptimized className="object-cover" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[14px] text-humana-muted">{h.reviewNoPhotos}</p>
          )}
        </SectionCard>
      </div>
      </div>
    </div>
  );
}
