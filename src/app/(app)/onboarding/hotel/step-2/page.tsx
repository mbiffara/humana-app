"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import {
  useHotelWizard,
  type RoomTypeEntry,
  type AvailabilityBlock,
} from "@/contexts/HotelWizardContext";
import { useLocale } from "@/i18n/LocaleProvider";
import { createPreviewUrl } from "@/lib/upload";

/* ─── Shared ─── */
const INPUT =
  "w-full bg-white rounded-[6px] border border-humana-line px-4 py-3 text-[15px] text-humana-ink outline-none transition-all duration-200 placeholder:text-humana-subtle/50 focus:border-humana-gold focus:ring-1 focus:ring-humana-gold/20";

const BED_TYPES = ["King", "Queen", "Twin", "Single"];


/* ─── Calendar helpers ─── */
function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function formatDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function parseDate(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function isDateInRange(date: string, start: string, end: string): boolean {
  return date >= start && date <= end;
}

function getMonthName(year: number, month: number, locale: string): string {
  const localeMap: Record<string, string> = { en: "en-US", es: "es-ES", pt: "pt-BR" };
  return new Date(year, month, 1).toLocaleDateString(localeMap[locale] || "en-US", { month: "long" });
}

function formatDateHuman(dateStr: string, locale: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const localeMap: Record<string, string> = { en: "en-US", es: "es-ES", pt: "pt-BR" };
  const date = new Date(y, m - 1, d);
  if (locale === "en") {
    return date.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
  }
  const day = d;
  const month = date.toLocaleDateString(localeMap[locale] || "es-ES", { month: "long" });
  return `${day} de ${month.charAt(0).toUpperCase() + month.slice(1)} ${y}`;
}

function getDayHeaders(locale: string): string[] {
  const localeMap: Record<string, string> = { en: "en-US", es: "es-ES", pt: "pt-BR" };
  const base = new Date(2024, 0, 7); // Sunday
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(base);
    d.setDate(d.getDate() + i);
    return d.toLocaleDateString(localeMap[locale] || "en-US", { weekday: "short" }).slice(0, 2);
  });
}

/* ═══════════════════════════════════════════════════════════════
   Room Details Form
   ═══════════════════════════════════════════════════════════════ */
function RoomTypeForm({
  initial,
  onSave,
  onCancel,
  isNew,
}: {
  initial?: RoomTypeEntry;
  onSave: (data: Omit<RoomTypeEntry, "id" | "photos" | "availability">) => void;
  onCancel: (data: Omit<RoomTypeEntry, "id" | "photos" | "availability">) => void;
  isNew: boolean;
}) {
  const { t } = useLocale();
  const h = t.onboarding.hotel;

  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [maxGuests, setMaxGuests] = useState(initial?.maxGuests ?? 2);
  const [totalUnits, setTotalUnits] = useState(initial?.totalUnits ?? 1);
  const [baseRate, setBaseRate] = useState(initial?.baseRate ?? 0);
  const [roomSize, setRoomSize] = useState(initial?.roomSize ?? 0);
  const [bedType, setBedType] = useState(initial?.bedType ?? "King");

  const canSave = name.trim().length > 0 && baseRate > 0;

  function handleSubmit() {
    if (!canSave) return;
    onSave({ name, description, maxGuests, totalUnits, baseRate, roomSize, bedType });
  }

  return (
    <>
      <div className="animate-fade-in-up">
        {/* Eyebrow */}
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
          {h.step2Eyebrow} &middot; {initial ? h.editRoomType : h.addRoomType}
        </span>

        {/* Title */}
        <h2 className="mt-3 text-[28px] font-light leading-[1.2] tracking-[-0.02em] text-humana-ink">
          {h.describeRoom}
        </h2>

        {/* Subtitle */}
        <p className="mt-2 text-[15px] leading-[22px] text-humana-muted">
          {h.describeRoomSub}
        </p>

        {/* Fields */}
        <div className="mt-10 flex flex-col gap-6">
          {/* Room Name */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-muted">
              {h.roomName}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={h.roomNamePlaceholder}
              className={INPUT}
            />
          </div>

          {/* Short Description */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-muted">
              {h.roomDescription}
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={h.roomDescriptionPlaceholder}
              className={INPUT}
            />
          </div>

          {/* Row of 3: Max Guests, Total Units, Base Rate */}
          <div className="grid grid-cols-3 gap-4">
            {/* Max Guests Counter */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-muted">
                {h.maxGuests}
              </label>
              <div className="flex items-center gap-2 rounded-[6px] border border-humana-line bg-white px-3 py-2">
                <button
                  type="button"
                  onClick={() => setMaxGuests(Math.max(1, maxGuests - 1))}
                  disabled={maxGuests <= 1}
                  className="cursor-pointer flex h-7 w-7 items-center justify-center rounded border border-humana-line text-humana-ink transition-all duration-150 hover:border-humana-ink active:scale-[0.96] disabled:opacity-30"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M5 12h14" />
                  </svg>
                </button>
                <span className="flex-1 text-center text-[16px] font-medium text-humana-ink">
                  {maxGuests}
                </span>
                <button
                  type="button"
                  onClick={() => setMaxGuests(Math.min(10, maxGuests + 1))}
                  disabled={maxGuests >= 10}
                  className="cursor-pointer flex h-7 w-7 items-center justify-center rounded border border-humana-line text-humana-ink transition-all duration-150 hover:border-humana-ink active:scale-[0.96] disabled:opacity-30"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Total Units Counter */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-muted">
                {h.totalUnits}
              </label>
              <div className="flex items-center gap-2 rounded-[6px] border border-humana-line bg-white px-3 py-2">
                <button
                  type="button"
                  onClick={() => setTotalUnits(Math.max(1, totalUnits - 1))}
                  disabled={totalUnits <= 1}
                  className="cursor-pointer flex h-7 w-7 items-center justify-center rounded border border-humana-line text-humana-ink transition-all duration-150 hover:border-humana-ink active:scale-[0.96] disabled:opacity-30"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M5 12h14" />
                  </svg>
                </button>
                <span className="flex-1 text-center text-[16px] font-medium text-humana-ink">
                  {totalUnits}
                </span>
                <button
                  type="button"
                  onClick={() => setTotalUnits(Math.min(99, totalUnits + 1))}
                  disabled={totalUnits >= 99}
                  className="cursor-pointer flex h-7 w-7 items-center justify-center rounded border border-humana-line text-humana-ink transition-all duration-150 hover:border-humana-ink active:scale-[0.96] disabled:opacity-30"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Base Rate */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-muted">
                {h.baseRate}
              </label>
              <div className="flex items-center gap-2 rounded-[6px] border border-humana-line bg-white px-3 py-2">
                <span className="text-[13px] text-humana-subtle">USD</span>
                <input
                  type="number"
                  min={0}
                  value={baseRate || ""}
                  onChange={(e) => setBaseRate(Number(e.target.value))}
                  placeholder="0"
                  className="w-full bg-transparent text-[16px] font-medium text-humana-ink outline-none placeholder:text-humana-subtle/50"
                />
                <span className="text-[12px] text-humana-subtle whitespace-nowrap">{h.perNight}</span>
              </div>
            </div>
          </div>

          {/* Row of 2: Room Size, Bed Type */}
          <div className="grid grid-cols-2 gap-4">
            {/* Room Size */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-muted">
                {h.roomSize}
              </label>
              <div className="flex items-center gap-2 rounded-[6px] border border-humana-line bg-white px-4 py-3">
                <input
                  type="number"
                  min={0}
                  value={roomSize || ""}
                  onChange={(e) => setRoomSize(Number(e.target.value))}
                  placeholder="0"
                  className="w-full bg-transparent text-[15px] text-humana-ink outline-none placeholder:text-humana-subtle/50"
                />
                <span className="text-[13px] text-humana-subtle">m&sup2;</span>
              </div>
            </div>

            {/* Bed Type */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-muted">
                {h.bedTypeLabel}
              </label>
              <select
                value={bedType}
                onChange={(e) => setBedType(e.target.value)}
                className={INPUT}
              >
                {BED_TYPES.map((bt) => (
                  <option key={bt} value={bt}>{bt}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed bottom bar — outside animate-fade-in-up to avoid transform containing block */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-humana-line bg-white px-8 py-4">
        <div className="flex items-center justify-between gap-8">
          <button
            type="button"
            onClick={() => onCancel({ name, description, maxGuests, totalUnits, baseRate, roomSize, bedType })}
            className="cursor-pointer flex items-center gap-2 whitespace-nowrap text-[13px] font-semibold uppercase tracking-[0.22em] text-humana-muted transition-colors hover:text-humana-ink"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            {h.backToRooms}
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSave}
            className="cursor-pointer flex items-center gap-2 whitespace-nowrap px-8 py-3 text-[13px] font-semibold uppercase tracking-[0.22em] bg-humana-ink text-white hover:bg-black transition-all duration-200 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {h.nextAvailability}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Availability Calendar
   ═══════════════════════════════════════════════════════════════ */
function AvailabilityCalendar({
  room,
  onBack,
  onNext,
}: {
  room: RoomTypeEntry;
  onBack: () => void;
  onNext: () => void;
}) {
  const { addAvailabilityBlock, removeAvailabilityBlock } = useHotelWizard();
  const { t, locale } = useLocale();
  const h = t.onboarding.hotel;

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selStart, setSelStart] = useState<string | null>(null);
  const [selEnd, setSelEnd] = useState<string | null>(null);
  const [units, setUnits] = useState(room.totalUnits);

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDow = getFirstDayOfWeek(viewYear, viewMonth);

  // Build blocked dates set
  const blockedDates = useMemo(() => {
    const set = new Set<string>();
    for (const block of room.availability) {
      if (!block.blocked) continue;
      const start = parseDate(block.startDate);
      const end = parseDate(block.endDate);
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        set.add(formatDate(d));
      }
    }
    return set;
  }, [room.availability]);

  const availableDates = useMemo(() => {
    const set = new Set<string>();
    for (const block of room.availability) {
      if (block.blocked) continue;
      const start = parseDate(block.startDate);
      const end = parseDate(block.endDate);
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        set.add(formatDate(d));
      }
    }
    return set;
  }, [room.availability]);

  function handleDayClick(dateStr: string) {
    if (!selStart || (selStart && selEnd)) {
      setSelStart(dateStr);
      setSelEnd(null);
    } else {
      if (dateStr < selStart) {
        setSelEnd(selStart);
        setSelStart(dateStr);
      } else {
        setSelEnd(dateStr);
      }
    }
  }

  function handleApply(blocked: boolean) {
    if (!selStart || !selEnd) return;
    addAvailabilityBlock(room.id, {
      startDate: selStart,
      endDate: selEnd,
      units: blocked ? 0 : units,
      blocked,
    });
    setSelStart(null);
    setSelEnd(null);
  }

  function prevMonth() {
    if (viewMonth === 0) {
      setViewYear(viewYear - 1);
      setViewMonth(11);
    } else {
      setViewMonth(viewMonth - 1);
    }
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewYear(viewYear + 1);
      setViewMonth(0);
    } else {
      setViewMonth(viewMonth + 1);
    }
  }

  const dayHeaders = getDayHeaders(locale);

  return (
    <>
      <div className="animate-fade-in-up">
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
          {h.step2Eyebrow} &middot; {room.name}
        </span>
        <h2 className="mt-3 text-[28px] font-light leading-[1.2] tracking-[-0.02em] text-humana-ink">
          {h.availabilityTitle}
        </h2>
        <p className="mt-2 text-[15px] leading-[22px] text-humana-muted">
          {h.availabilitySub}
        </p>

        <div className="mt-8 grid grid-cols-[1fr_240px] gap-6">
        {/* Calendar */}
        <div className="rounded-[6px] border border-humana-line bg-white p-5">
          {/* Month nav */}
          <div className="flex items-center justify-between mb-4">
            <button type="button" onClick={prevMonth} className="cursor-pointer p-1 text-humana-muted hover:text-humana-ink transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <span className="text-[15px] font-medium text-humana-ink capitalize">
              {getMonthName(viewYear, viewMonth, locale)} {viewYear}
            </span>
            <button type="button" onClick={nextMonth} className="cursor-pointer p-1 text-humana-muted hover:text-humana-ink transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayHeaders.map((d) => (
              <div key={d} className="text-center text-[11px] font-semibold uppercase tracking-wider text-humana-subtle">
                {d}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for offset */}
            {Array.from({ length: firstDow }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = formatDate(new Date(viewYear, viewMonth, day));
              const isBlocked = blockedDates.has(dateStr);
              const isAvailable = availableDates.has(dateStr);
              const isInSelection =
                selStart && selEnd ? isDateInRange(dateStr, selStart, selEnd) : false;
              const isSelStart = dateStr === selStart;
              const isSelEnd = dateStr === selEnd;

              let bg = "bg-transparent hover:bg-humana-stone";
              if (isBlocked) bg = "bg-red-50 text-red-400";
              else if (isAvailable) bg = "bg-emerald-50 text-emerald-700";
              if (isInSelection || isSelStart || isSelEnd) bg = "bg-humana-gold-light text-humana-gold ring-1 ring-humana-gold/30";

              return (
                <button
                  key={dateStr}
                  type="button"
                  onClick={() => handleDayClick(dateStr)}
                  className={`cursor-pointer flex h-9 items-center justify-center rounded text-[13px] font-medium transition-all duration-150 ${bg}`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-4 flex items-center gap-4 border-t border-humana-line pt-4">
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded bg-emerald-100 border border-emerald-200" />
              <span className="text-[11px] text-humana-subtle">{h.legendAvailable}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded bg-humana-gold-light border border-humana-gold/30" />
              <span className="text-[11px] text-humana-subtle">{h.legendSelected}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded bg-red-50 border border-red-200" />
              <span className="text-[11px] text-humana-subtle">{h.legendBlocked}</span>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-4">
          {/* Selection info + actions */}
          {selStart && (
            <div className="rounded-[6px] border border-humana-line bg-white p-4 animate-fade-in-up">
              <div className="text-[12px] text-humana-muted mb-3">
                {formatDateHuman(selStart, locale)} {selEnd ? ` → ${formatDateHuman(selEnd, locale)}` : " → ..."}
              </div>

              {selEnd && (
                <>
                  {/* Units counter */}
                  <div className="flex flex-col gap-2 mb-3">
                    <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-muted">
                      {h.availableUnits}
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setUnits(Math.max(1, units - 1))}
                        disabled={units <= 1}
                        className="cursor-pointer flex h-7 w-7 items-center justify-center rounded border border-humana-line text-humana-ink hover:border-humana-ink disabled:opacity-30"
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14" /></svg>
                      </button>
                      <span className="flex-1 text-center text-[15px] font-medium text-humana-ink">{units}</span>
                      <button
                        type="button"
                        onClick={() => setUnits(Math.min(room.totalUnits, units + 1))}
                        disabled={units >= room.totalUnits}
                        className="cursor-pointer flex h-7 w-7 items-center justify-center rounded border border-humana-line text-humana-ink hover:border-humana-ink disabled:opacity-30"
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleApply(false)}
                      className="cursor-pointer flex-1 rounded bg-humana-ink py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition-all hover:bg-black active:scale-[0.98]"
                    >
                      {h.applyDates}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApply(true)}
                      className="cursor-pointer flex-1 rounded border border-red-200 bg-red-50 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-red-600 transition-all hover:bg-red-100 active:scale-[0.98]"
                    >
                      {h.blockDates}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Configured blocks */}
          <div className="rounded-[6px] border border-humana-line bg-white p-4">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-muted mb-3">
              {h.configuredBlocks}
            </h4>
            {room.availability.length === 0 ? (
              <p className="text-[12px] leading-relaxed text-humana-subtle">
                {h.noBlocksYet}
              </p>
            ) : (
              <div className="flex flex-col gap-2 max-h-[260px] overflow-y-auto">
                {room.availability.map((block) => (
                  <div
                    key={block.id}
                    className={`flex items-center justify-between rounded px-3 py-2 text-[12px] ${
                      block.blocked
                        ? "bg-red-50 text-red-600"
                        : "bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {formatDateHuman(block.startDate, locale)} → {formatDateHuman(block.endDate, locale)}
                      </span>
                      <span className="text-[11px] opacity-70">
                        {block.blocked ? h.blockedLabel : h.unitsCount(block.units)}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAvailabilityBlock(room.id, block.id)}
                      className="cursor-pointer text-current opacity-50 hover:opacity-100 transition-opacity"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      </div>

      {/* Fixed bottom bar — outside animate-fade-in-up to avoid transform containing block */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-humana-line bg-white px-8 py-4">
        <div className="flex items-center justify-between gap-8">
          <button
            type="button"
            onClick={onBack}
            className="cursor-pointer flex items-center gap-2 whitespace-nowrap text-[13px] font-semibold uppercase tracking-[0.22em] text-humana-muted transition-colors hover:text-humana-ink"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            {h.backToRooms}
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={room.availability.length === 0}
            className="cursor-pointer flex items-center gap-2 whitespace-nowrap px-8 py-3 text-[13px] font-semibold uppercase tracking-[0.22em] bg-humana-ink text-white hover:bg-black transition-all duration-200 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {h.nextPhotos}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Room Photos
   ═══════════════════════════════════════════════════════════════ */
function RoomPhotos({
  room,
  onBack,
  onDone,
}: {
  room: RoomTypeEntry;
  onBack: () => void;
  onDone: () => void;
}) {
  const { addRoomPhoto, removeRoomPhoto } = useHotelWizard();
  const { t } = useLocale();
  const h = t.onboarding.hotel;
  const [isDragOver, setIsDragOver] = useState(false);

  function handleFiles(files: FileList | File[]) {
    const fileArray = Array.from(files).slice(0, 4 - room.photos.length);
    for (const file of fileArray) {
      try {
        const url = createPreviewUrl(file);
        addRoomPhoto(room.id, url);
      } catch {
        // skip invalid files
      }
    }
  }

  const inputId = `room-photo-upload-${room.id}`;

  return (
    <>
      <div className="animate-fade-in-up">
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
          {h.step2Eyebrow} &middot; {room.name}
        </span>
        <h2 className="mt-3 text-[28px] font-light leading-[1.2] tracking-[-0.02em] text-humana-ink">
          {h.roomPhotosTitle}
        </h2>
        <p className="mt-2 text-[15px] leading-[22px] text-humana-muted">
          {h.roomPhotosSub}
        </p>

        {/* Hidden file input */}
        <input
          id={inputId}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="sr-only"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleFiles(e.target.files);
              e.target.value = "";
            }
          }}
        />

        {/* Upload zone — label triggers file input natively */}
        {room.photos.length < 4 && (
          <label
            htmlFor={inputId}
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={(e) => { e.preventDefault(); setIsDragOver(false); }}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragOver(false);
              if (e.dataTransfer.files.length > 0) handleFiles(e.dataTransfer.files);
            }}
            className={`mt-8 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed py-10 transition-all ${
              isDragOver
                ? "border-humana-gold bg-humana-gold-light/20"
                : "border-humana-line bg-white hover:border-humana-gold/40"
            }`}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-humana-gold-light">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-[14px] font-medium text-humana-ink">
                {h.roomPhotosDrag}{" "}
                <span className="text-humana-gold underline underline-offset-2">{h.roomPhotosBrowse}</span>
              </span>
              <span className="text-[12px] text-humana-subtle">
                {h.roomPhotosFormats} &middot; {h.roomPhotosMax}
              </span>
            </div>
          </label>
        )}

        {/* Photo grid */}
        {room.photos.length > 0 && (
          <div className="mt-6 grid grid-cols-4 gap-3 stagger-children">
            {room.photos.map((photo, index) => (
              <div
                key={`${photo}-${index}`}
                className="group relative aspect-square overflow-hidden rounded-[6px] bg-humana-stone"
              >
                <Image
                  src={photo}
                  alt={`Room photo ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  unoptimized
                />
                {/* Cover badge */}
                {index === 0 && (
                  <div className="absolute left-2 top-2 rounded bg-humana-gold px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.2em] text-white">
                    {h.roomPhotosCover}
                  </div>
                )}
                {/* Delete */}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removeRoomPhoto(room.id, index); }}
                  className="cursor-pointer absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-all duration-200 hover:bg-black/80 group-hover:opacity-100"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Counter */}
        <div className="mt-4 text-[13px] text-humana-muted">
          {h.photosCounter(room.photos.length, 4)}
        </div>
      </div>

      {/* Fixed bottom bar — outside animate-fade-in-up to avoid transform containing block */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-humana-line bg-white px-8 py-4">
        <div className="flex items-center justify-between gap-8">
          <button
            type="button"
            onClick={onBack}
            className="cursor-pointer flex items-center gap-2 whitespace-nowrap text-[13px] font-semibold uppercase tracking-[0.22em] text-humana-muted transition-colors hover:text-humana-ink"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            {h.backToRooms}
          </button>
          <button
            type="button"
            onClick={onDone}
            className="cursor-pointer flex items-center gap-2 whitespace-nowrap px-8 py-3 text-[13px] font-semibold uppercase tracking-[0.22em] bg-humana-ink text-white hover:bg-black transition-all duration-200 active:scale-[0.98]"
          >
            {h.doneWithRoom}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Room Type Card
   ═══════════════════════════════════════════════════════════════ */
function RoomTypeCard({
  room,
  onEdit,
  onDelete,
}: {
  room: RoomTypeEntry;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { t } = useLocale();
  const h = t.onboarding.hotel;

  const photoCount = room.photos.length;
  const blockCount = room.availability.length;

  return (
    <div className="group flex items-center justify-between rounded-[6px] border border-humana-line bg-white p-5 transition-all duration-200 hover:border-humana-gold/30 hover:shadow-sm">
      <div className="flex gap-4">
        {/* Thumbnail */}
        {photoCount > 0 ? (
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[4px] bg-humana-stone">
            <Image
              src={room.photos[0]}
              alt={room.name}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        ) : (
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[4px] bg-humana-stone text-humana-subtle">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          {/* Name + status badges */}
          <div className="flex items-center gap-2">
            <span className="text-[16px] font-medium text-humana-ink">{room.name}</span>
            {photoCount > 0 && (
              <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-600">
                {h.photosCounter(photoCount, 4)}
              </span>
            )}
            {blockCount > 0 && (
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
                {h.blocksCount(blockCount)}
              </span>
            )}
          </div>

          {room.description && (
            <span className="text-[13px] text-humana-muted">{room.description}</span>
          )}

          {/* Stats row */}
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[12px] text-humana-subtle">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              {room.maxGuests} {h.maxGuests.toLowerCase()}
            </span>
            <span className="flex items-center gap-1.5 text-[12px] text-humana-subtle">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              {h.unitsCount(room.totalUnits)}
            </span>
            <span className="flex items-center gap-1.5 text-[12px] text-humana-subtle">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
              USD {room.baseRate} {h.perNight}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          type="button"
          onClick={onEdit}
          className="cursor-pointer flex items-center gap-1.5 rounded border border-humana-line px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-ink transition-colors hover:border-humana-ink"
        >
          {h.editButton}
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="cursor-pointer flex h-8 w-8 items-center justify-center rounded text-humana-subtle transition-colors hover:text-red-500"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Main Step 2 Page
   ═══════════════════════════════════════════════════════════════ */
export default function HotelWizardStep2() {
  const { state, addRoomType, updateRoomType, removeRoomType, setHideBottomBar } = useHotelWizard();
  const { t } = useLocale();
  const h = t.onboarding.hotel;

  const [view, setView] = useState<"list" | "details" | "availability" | "photos">("list");
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [isNewRoom, setIsNewRoom] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<string | null>(null);
  const prevRoomCountRef = useRef(state.roomTypes.length);
  const pendingNewRoomNav = useRef(false);

  const activeRoom = activeRoomId ? state.roomTypes.find((rt) => rt.id === activeRoomId) : undefined;
  const roomToDeleteEntry = roomToDelete ? state.roomTypes.find((rt) => rt.id === roomToDelete) : undefined;

  // Hide layout BottomBar when in sub-views (details/availability/photos)
  useEffect(() => {
    setHideBottomBar(view !== "list");
    return () => setHideBottomBar(false);
  }, [view, setHideBottomBar]);

  // After a new room is added, detect the new entry and navigate to its availability
  useEffect(() => {
    if (pendingNewRoomNav.current && state.roomTypes.length > prevRoomCountRef.current) {
      const newRoom = state.roomTypes[state.roomTypes.length - 1];
      setActiveRoomId(newRoom.id);
      setIsNewRoom(false);
      setView("availability");
      pendingNewRoomNav.current = false;
    }
    prevRoomCountRef.current = state.roomTypes.length;
  }, [state.roomTypes]);

  function handleStartAdd() {
    setActiveRoomId(null);
    setIsNewRoom(true);
    setView("details");
  }

  function handleStartEdit(id: string) {
    setActiveRoomId(id);
    setIsNewRoom(false);
    setView("details");
  }

  function handleDetailsSave(data: Omit<RoomTypeEntry, "id" | "photos" | "availability">) {
    if (isNewRoom) {
      pendingNewRoomNav.current = true;
      addRoomType(data);
    } else if (activeRoomId) {
      updateRoomType(activeRoomId, data);
      // Continue through sub-steps: details → availability → photos
      setView("availability");
    }
  }

  function handleBackToList() {
    setView("list");
    setActiveRoomId(null);
    setIsNewRoom(false);
  }

  // Auto-save valid room data when going back to list from details form
  function handleDetailsBackToList(data: Omit<RoomTypeEntry, "id" | "photos" | "availability">) {
    if (data.name.trim().length > 0 && data.baseRate > 0) {
      if (isNewRoom) {
        addRoomType(data);
      } else if (activeRoomId) {
        updateRoomType(activeRoomId, data);
      }
    }
    handleBackToList();
  }

  function confirmDeleteRoom() {
    if (roomToDelete) {
      removeRoomType(roomToDelete);
      setRoomToDelete(null);
    }
  }

  // Render based on current view
  if (view === "details") {
    return (
      <div className="flex justify-center px-16 pt-16 pb-32">
        <div className="w-full max-w-[700px]">
          <RoomTypeForm
            initial={activeRoom}
            onSave={handleDetailsSave}
            onCancel={handleDetailsBackToList}
            isNew={isNewRoom}
          />
        </div>
      </div>
    );
  }

  if (view === "availability" && activeRoom) {
    return (
      <div className="flex justify-center px-16 pt-16 pb-36">
        <div className="w-full max-w-[840px]">
          <AvailabilityCalendar
            room={activeRoom}
            onBack={handleBackToList}
            onNext={() => setView("photos")}
          />
        </div>
      </div>
    );
  }

  if (view === "photos" && activeRoom) {
    return (
      <div className="flex justify-center px-16 pt-16 pb-32">
        <div className="w-full max-w-[700px]">
          <RoomPhotos
            room={activeRoom}
            onBack={() => setView("availability")}
            onDone={handleBackToList}
          />
        </div>
      </div>
    );
  }

  // ─── List view ───
  return (
    <>
      <div className="flex justify-center px-16 py-16 animate-fade-in-up">
        <div className="w-full max-w-[700px]">
          {/* Eyebrow */}
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
            {h.step2Eyebrow}
          </span>

          {/* Title */}
          <h1 className="mt-3 text-[32px] font-light leading-[1.2] tracking-[-0.02em] text-humana-ink">
            {h.step2Title}
          </h1>

          {/* Subtitle */}
          <p className="mt-2 text-[15px] leading-[22px] text-humana-muted">
            {h.step2Subtitle}
          </p>

          {/* Counter */}
          {state.roomTypes.length > 0 && (
            <div className="mt-8 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-[13px] font-medium text-humana-ink">
                {h.roomConfigured(state.roomTypes.length)}
              </span>
            </div>
          )}

          {/* Room type cards */}
          <div className="mt-6 flex flex-col gap-3 stagger-children">
            {state.roomTypes.map((room) => (
              <RoomTypeCard
                key={room.id}
                room={room}
                onEdit={() => handleStartEdit(room.id)}
                onDelete={() => setRoomToDelete(room.id)}
              />
            ))}
          </div>

          {/* Add button */}
          <button
            type="button"
            onClick={handleStartAdd}
            className="cursor-pointer mt-6 flex w-full items-center justify-center gap-2 rounded-[6px] border-2 border-dashed border-humana-gold/40 bg-transparent py-4 text-[13px] font-semibold uppercase tracking-[0.22em] text-humana-gold transition-all duration-200 hover:border-humana-gold hover:bg-humana-gold-light/30"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            {h.addRoomType}
          </button>

          {/* Empty state hint */}
          {state.roomTypes.length === 0 && (
            <div className="mt-8 flex items-center gap-3 rounded-lg border border-humana-line/60 bg-white p-5 animate-fade-in-up-delay-1">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-humana-gold-light">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[13px] font-medium text-humana-ink">
                  {h.noRoomsTitle}
                </span>
                <span className="text-[12px] leading-relaxed text-humana-muted">
                  {h.noRoomsDescription}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── Delete Confirmation Modal — outside animate-fade-in-up ─── */}
      {roomToDelete && roomToDeleteEntry && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in"
          onClick={() => setRoomToDelete(null)}
        >
          <div
            className="relative mx-4 w-full max-w-[400px] rounded-xl bg-white px-8 pb-8 pt-10 shadow-2xl animate-fade-in-scale"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              type="button"
              onClick={() => setRoomToDelete(null)}
              className="cursor-pointer absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-humana-subtle transition-colors hover:bg-humana-stone hover:text-humana-ink"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Icon */}
            <div className="flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </div>
            </div>

            <h2 className="mt-5 text-center text-[20px] font-medium text-humana-ink">
              {h.deleteRoomTitle}
            </h2>
            <p className="mt-2 text-center text-[14px] leading-relaxed text-humana-muted">
              {h.deleteRoomDescription(roomToDeleteEntry.name.trim())}
            </p>

            <div className="mt-8 flex gap-4">
              <button
                type="button"
                onClick={() => setRoomToDelete(null)}
                className="cursor-pointer flex-1 rounded-[6px] border border-humana-line/80 bg-white px-4 py-3 text-[13px] font-semibold uppercase tracking-[0.18em] text-humana-muted transition-all hover:border-humana-ink hover:text-humana-ink active:scale-[0.98]"
              >
                {t.onboarding.back}
              </button>
              <button
                type="button"
                onClick={confirmDeleteRoom}
                className="cursor-pointer flex-1 rounded-[6px] bg-red-600 px-4 py-3 text-[13px] font-semibold uppercase tracking-[0.18em] text-white transition-all hover:bg-red-700 active:scale-[0.98]"
              >
                {h.deleteRoomConfirm}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
