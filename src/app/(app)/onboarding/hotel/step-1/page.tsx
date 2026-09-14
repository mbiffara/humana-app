"use client";

import { useCallback } from "react";
import { useHotelWizard } from "@/contexts/HotelWizardContext";
import { useLocale } from "@/i18n/LocaleProvider";
import PlacesAutocomplete, { type PlaceResult } from "@/components/PlacesAutocomplete";
import {
  EnvironmentBlock,
  GroupCapacityBlock,
  LocationBlock,
  PetPolicyBlock,
  PropertyTypeBlock,
  ScheduleBlock,
} from "@/components/hotel/PropertyFormBlocks";
import { placeToPropertyForm } from "@/lib/property-form";

/* ─── Reusable white input class ─── */
const INPUT =
  "w-full bg-white rounded-[6px] border border-humana-line px-4 py-3 text-[15px] text-humana-ink outline-none transition-all duration-200 placeholder:text-humana-subtle/50 focus:border-humana-gold focus:ring-1 focus:ring-humana-gold/20";

const LABEL = "text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-muted";

export default function HotelWizardStep1() {
  const { state, set } = useHotelWizard();
  const { t } = useLocale();
  const h = t.onboarding.hotel;
  const p = t.propertyForm;

  const handlePlaceSelect = useCallback(
    (place: PlaceResult) => {
      set({ address: place.address, ...placeToPropertyForm(place) });
    },
    [set],
  );

  return (
    <div className="flex justify-center px-16 py-16 animate-fade-in-up">
      <div className="w-full max-w-[700px]">
        {/* Eyebrow */}
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
          {h.step1Eyebrow}
        </span>

        {/* Title */}
        <h1 className="mt-3 text-[32px] font-light leading-[1.2] tracking-[-0.02em] text-humana-ink">
          {h.step1Title}
        </h1>

        {/* Subtitle */}
        <p className="mt-2 text-[15px] leading-[22px] text-humana-muted">
          {h.step1Subtitle}
        </p>

        {/* ─── Personal Data Section ─── */}
        <div className="mt-10">
          <h3 className={LABEL}>{h.personalSection}</h3>

          <div className="mt-4 grid grid-cols-2 gap-4">
            {/* First Name */}
            <div className="flex flex-col gap-2">
              <label className={LABEL}>{h.firstName}</label>
              <input
                type="text"
                value={state.ownerFirstName}
                onChange={(e) => set({ ownerFirstName: e.target.value })}
                placeholder="John"
                className={INPUT}
              />
            </div>

            {/* Last Name */}
            <div className="flex flex-col gap-2">
              <label className={LABEL}>{h.lastName}</label>
              <input
                type="text"
                value={state.ownerLastName}
                onChange={(e) => set({ ownerLastName: e.target.value })}
                placeholder="Smith"
                className={INPUT}
              />
            </div>

            {/* Phone */}
            <div className="col-span-2 flex flex-col gap-2">
              <label className={LABEL}>{h.ownerPhone}</label>
              <input
                type="tel"
                value={state.ownerPhone}
                onChange={(e) => set({ ownerPhone: e.target.value })}
                placeholder="+1 555 123 4567"
                className={INPUT}
              />
            </div>
          </div>
        </div>

        {/* ─── Divider ─── */}
        <div className="mt-10 mb-8 border-t border-humana-line" />

        {/* ─── 1. Property type ─── */}
        <PropertyTypeBlock values={state} onChange={set} />

        {/* ─── 2. Basic details ─── */}
        <div className="mt-10">
          <h3 className={LABEL}>{p.basicsSection}</h3>

          <div className="mt-4 grid grid-cols-2 gap-4">
            {/* Hotel Name */}
            <div className="flex flex-col gap-2">
              <label htmlFor="hotel-name" className={LABEL}>
                {h.hotelName}
              </label>
              <input
                id="hotel-name"
                type="text"
                value={state.hotelName}
                onChange={(e) => set({ hotelName: e.target.value })}
                placeholder={h.hotelNamePlaceholder}
                className={INPUT}
              />
              <span className="text-[12px] text-humana-subtle">{h.hotelNameHint}</span>
            </div>

            {/* Physical Address — PlacesAutocomplete */}
            <div className="flex flex-col gap-2">
              <label className={LABEL}>{h.addressLabel}</label>
              <PlacesAutocomplete
                value={state.address}
                onChange={(val) => set({ address: val })}
                onPlaceSelect={handlePlaceSelect}
                placeholder={h.addressPlaceholder}
              />
            </div>

            {/* Description — full width */}
            <div className="col-span-2 flex flex-col gap-2">
              <label className={LABEL}>{h.descriptionLabel}</label>
              <textarea
                value={state.description}
                onChange={(e) => set({ description: e.target.value })}
                placeholder={h.descriptionPlaceholder}
                rows={3}
                className={`${INPUT} resize-none`}
              />
            </div>

            {/* Hotel Phone */}
            <div className="flex flex-col gap-2">
              <label className={LABEL}>{h.hotelPhoneLabel}</label>
              <input
                type="tel"
                value={state.phone}
                onChange={(e) => set({ phone: e.target.value })}
                placeholder="+34 912 345 678"
                className={INPUT}
              />
            </div>

            {/* Contact email */}
            <div className="flex flex-col gap-2">
              <label className={LABEL}>{p.emailLabel}</label>
              <input
                type="email"
                value={state.contactEmail}
                onChange={(e) => set({ contactEmail: e.target.value })}
                placeholder="hola@casadelfaro.com"
                className={INPUT}
              />
            </div>
          </div>
        </div>

        {/* ─── 3. Location ─── */}
        <div className="mt-10">
          <LocationBlock values={state} onChange={set} />
        </div>

        {/* ─── 4. Environment ─── */}
        <div className="mt-10">
          <EnvironmentBlock values={state} onChange={set} />
        </div>

        {/* ─── 5. Check-in / check-out ─── */}
        <div className="mt-10">
          <ScheduleBlock values={state} onChange={set} />
        </div>

        {/* ─── 6. Policies & services ─── */}
        <div className="mt-10">
          <PetPolicyBlock values={state} onChange={set} />
        </div>

        {/* ─── 7. Group capacity ─── */}
        <div className="mt-10">
          <GroupCapacityBlock values={state} onChange={set} />
        </div>
      </div>
    </div>
  );
}
