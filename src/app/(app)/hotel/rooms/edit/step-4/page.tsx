/** Room type editor step 4 — availability (HT-03e availability artboard).
 *  Month calendar for this room type with per-day availability, plus
 *  date-ranged blocks (created/removed immediately via the API). */
"use client";

import { useCallback, useEffect, useState } from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import { useRoomTypeEditor } from "@/contexts/RoomTypeEditorContext";
import {
  hotelApi,
  type ApiAvailabilityBlock,
  type CalendarRoomType,
} from "@/lib/api/hotel";

function isoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const inputClass =
  "border border-humana-line bg-white px-3 py-2 text-[13px] text-humana-ink outline-none transition-colors focus:border-humana-gold";

export default function RoomAvailabilityStep() {
  const { t, locale } = useLocale();
  const te = t.hotelWs.roomEditor;
  const { state } = useRoomTypeEditor();
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [entry, setEntry] = useState<CalendarRoomType | null>(null);
  const [blocks, setBlocks] = useState<ApiAvailabilityBlock[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ from: "", to: "", units: "", reason: "" });
  const [loading, setLoading] = useState(true);

  const roomTypeId = state.roomTypeId;

  const fetchData = useCallback(async () => {
    if (!roomTypeId) return;
    setLoading(true);
    try {
      const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);
      const [calendarRes, blocksRes] = await Promise.all([
        hotelApi.getCalendar(isoDate(month), isoDate(monthEnd)),
        hotelApi.listAvailabilityBlocks(roomTypeId),
      ]);
      setEntry(calendarRes.room_types.find((rt) => rt.room_type.id === roomTypeId) ?? null);
      setBlocks(blocksRes.availability_blocks);
    } catch {
      /* keep previous state */
    } finally {
      setLoading(false);
    }
  }, [roomTypeId, month]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function createBlock() {
    if (!roomTypeId || !form.from || !form.to) return;
    try {
      await hotelApi.createAvailabilityBlock({
        room_type_id: roomTypeId,
        starts_on: form.from,
        ends_on: form.to,
        units: form.units ? parseInt(form.units, 10) : undefined,
        reason: form.reason || undefined,
      });
      setForm({ from: "", to: "", units: "", reason: "" });
      setShowForm(false);
      fetchData();
    } catch {
      /* validation error — leave the form open for correction */
    }
  }

  async function removeBlock(id: number) {
    await hotelApi.deleteAvailabilityBlock(id);
    fetchData();
  }

  const monthLabel = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(month);
  const total = entry?.rooms_operational ?? state.totalRooms;
  // Leading blanks so day 1 lands on its weekday column (Monday-first)
  const leadingBlanks = (month.getDay() + 6) % 7;

  return (
    <section className="rounded-xl border border-humana-line bg-white p-8 animate-fade-in-up">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
        {te.stepOf(4, 5)}
      </p>
      <h2 className="mt-2 text-[24px] font-bold text-humana-ink">{te.availability.title}</h2>
      <p className="mt-1 text-[13px] text-humana-muted">{te.availability.subtitle}</p>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-[14px] font-semibold text-humana-ink">{state.name}</span>
          <span className="text-[12px] text-humana-muted">
            {te.availability.totalUnits(state.totalRooms)}
          </span>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-humana-muted">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400" /> {te.availability.legendAvailable}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-red-400" /> {te.availability.legendBlocked}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-humana-gold" /> {te.availability.legendBooked}
          </span>
        </div>
      </div>

      {/* Month header */}
      <div className="mt-4 flex items-center justify-between rounded-t-lg border border-humana-line bg-humana-gold-light/40 px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-humana-line bg-white text-humana-muted transition-colors hover:text-humana-ink"
          >
            ‹
          </button>
          <span className="min-w-[140px] text-center text-[14px] font-semibold capitalize text-humana-ink">
            {monthLabel}
          </span>
          <button
            onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-humana-line bg-white text-humana-muted transition-colors hover:text-humana-ink"
          >
            ›
          </button>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="cursor-pointer bg-humana-ink px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition-opacity hover:opacity-85"
        >
          + {te.availability.blockDates}
        </button>
      </div>

      {/* Block form */}
      {showForm && (
        <div className="flex flex-wrap items-end gap-3 border-x border-humana-line bg-humana-stone/40 px-4 py-4">
          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.16em] text-humana-muted">
              {te.availability.from}
            </label>
            <input
              type="date"
              value={form.from}
              onChange={(e) => setForm((f) => ({ ...f, from: e.target.value }))}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.16em] text-humana-muted">
              {te.availability.to}
            </label>
            <input
              type="date"
              value={form.to}
              onChange={(e) => setForm((f) => ({ ...f, to: e.target.value }))}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.16em] text-humana-muted">
              {te.availability.unitsLabel}
            </label>
            <input
              type="number"
              min={1}
              max={state.totalRooms}
              value={form.units}
              onChange={(e) => setForm((f) => ({ ...f, units: e.target.value }))}
              placeholder={te.availability.allUnits}
              className={`${inputClass} w-[120px]`}
            />
          </div>
          <input
            type="text"
            value={form.reason}
            onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
            placeholder={te.availability.reasonPlaceholder}
            className={`${inputClass} flex-1`}
          />
          <button
            onClick={createBlock}
            disabled={!form.from || !form.to}
            className={`cursor-pointer bg-humana-ink px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition-opacity ${
              !form.from || !form.to ? "cursor-not-allowed opacity-40" : "hover:opacity-85"
            }`}
          >
            {te.availability.add}
          </button>
        </div>
      )}

      {/* Calendar grid */}
      <div className="rounded-b-lg border border-t-0 border-humana-line p-4">
        {loading ? (
          <div className="flex h-[240px] items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-humana-line border-t-humana-gold" />
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-1.5">
            {Array.from({ length: leadingBlanks }).map((_, i) => (
              <div key={`blank-${i}`} />
            ))}
            {(entry?.days ?? []).map((day) => {
              const date = new Date(`${day.date}T00:00:00`);
              const soldOut = day.available <= 0;
              const hasBlocked = day.blocked > 0;
              return (
                <div
                  key={day.date}
                  className={`flex flex-col items-center rounded-md border px-1 py-2 text-center ${
                    soldOut
                      ? "border-humana-ink bg-humana-ink text-white"
                      : hasBlocked
                        ? "border-red-200 bg-red-50"
                        : day.booked > 0
                          ? "border-humana-gold/40 bg-humana-gold-light/40"
                          : "border-humana-line bg-white"
                  }`}
                >
                  <span className={`text-[13px] font-semibold ${soldOut ? "text-white" : "text-humana-ink"}`}>
                    {date.getDate()}
                  </span>
                  <span className={`text-[10px] ${soldOut ? "text-white/70" : hasBlocked ? "text-red-500" : "text-humana-subtle"}`}>
                    {day.available}/{total}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Blocked dates list */}
      <div className="mt-6">
        <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-humana-muted">
          {te.availability.blockedDates}
        </p>
        {blocks.length === 0 ? (
          <p className="mt-3 text-[13px] text-humana-subtle">{te.availability.noBlocks}</p>
        ) : (
          <div className="mt-3 flex flex-col gap-2">
            {blocks.map((block) => {
              const fmt = new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric" });
              return (
                <div
                  key={block.id}
                  className="flex items-center justify-between rounded-lg border border-humana-line px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-red-400" />
                    <div>
                      <p className="text-[13px] font-medium text-humana-ink">
                        {fmt.format(new Date(`${block.starts_on}T00:00:00`))} —{" "}
                        {fmt.format(new Date(`${block.ends_on}T00:00:00`))}
                      </p>
                      <p className="text-[12px] text-humana-muted">
                        {te.availability.unitsBlocked(block.units ?? state.totalRooms, state.totalRooms)}
                        {block.reason ? ` · ${block.reason}` : ""}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeBlock(block.id)}
                    className="cursor-pointer text-[13px] text-humana-muted transition-colors hover:text-red-600"
                  >
                    {te.availability.remove}
                  </button>
                </div>
              );
            })}
          </div>
        )}
        <p className="mt-3 text-[12px] text-humana-subtle">{te.availability.hint}</p>
      </div>
    </section>
  );
}
