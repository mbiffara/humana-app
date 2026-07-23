/** Hotel workspace — availability calendar.
 *  Tape-chart grid: room types as rows, days of the month as columns; each
 *  cell shows how many rooms of that type remain available that night.
 *  Click two days in a row to block a date range; blocks are listed below
 *  the grid and can be removed there. */
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useLocale } from "@/i18n/LocaleProvider";
import {
  hotelApi,
  type ApiAvailabilityBlock,
  type CalendarResponse,
} from "@/lib/api/hotel";

const LOCALE_TAGS: Record<string, string> = { en: "en-US", es: "es-ES", pt: "pt-PT" };

/** Local-timezone-safe YYYY-MM-DD. */
function iso(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function HotelCalendarPage() {
  const { t, locale } = useLocale();
  const tag = LOCALE_TAGS[locale] ?? "en-US";

  const [month, setMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [data, setData] = useState<CalendarResponse | null>(null);
  const [blocks, setBlocks] = useState<ApiAvailabilityBlock[]>([]);
  const [loading, setLoading] = useState(true);

  // Range selection for creating a block: first click sets start, second
  // click in the same row sets end; the block panel then submits it.
  const [sel, setSel] = useState<{ roomTypeId: number; start: string; end: string | null } | null>(null);
  const [unitsToBlock, setUnitsToBlock] = useState<number | null>(null); // null = all units
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);

  const days = useMemo(() => {
    const list: Date[] = [];
    const cursor = new Date(month);
    while (cursor.getMonth() === month.getMonth()) {
      list.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
    return list;
  }, [month]);

  // Guards against out-of-order responses: only the latest request may
  // apply its results (e.g. fast month switching).
  const requestIdRef = useRef(0);

  const fetchCalendar = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    setLoading(true);
    try {
      const from = iso(month);
      const to = iso(new Date(month.getFullYear(), month.getMonth() + 1, 0));
      const [cal, blk] = await Promise.all([
        hotelApi.getCalendar(from, to),
        hotelApi.listAvailabilityBlocks(),
      ]);
      if (requestId !== requestIdRef.current) return;
      setData(cal);
      setBlocks(blk.availability_blocks);
    } catch {
      if (requestId === requestIdRef.current) setData(null);
    } finally {
      if (requestId === requestIdRef.current) setLoading(false);
    }
  }, [month]);

  useEffect(() => {
    fetchCalendar();
  }, [fetchCalendar]);

  function handleCellClick(roomTypeId: number, date: string) {
    if (!sel || sel.roomTypeId !== roomTypeId || sel.end) {
      setSel({ roomTypeId, start: date, end: null });
      setUnitsToBlock(null);
      return;
    }
    const [start, end] = date < sel.start ? [date, sel.start] : [sel.start, date];
    setSel({ roomTypeId, start, end });
  }

  async function submitBlock() {
    if (!sel || saving) return;
    const entry = data?.room_types.find((rt) => rt.room_type.id === sel.roomTypeId);
    setSaving(true);
    try {
      await hotelApi.createAvailabilityBlock({
        room_type_id: sel.roomTypeId,
        starts_on: sel.start,
        ends_on: sel.end ?? sel.start,
        // Blocking every unit is stored as a whole-type block (units: null)
        // so it stays a full closure even if the room count changes later.
        units:
          unitsToBlock !== null && unitsToBlock < (entry?.rooms_operational ?? 1)
            ? unitsToBlock
            : undefined,
        reason: reason.trim() || undefined,
      });
      setSel(null);
      setReason("");
      setUnitsToBlock(null);
      fetchCalendar();
    } finally {
      setSaving(false);
    }
  }

  async function removeBlock(id: number) {
    await hotelApi.deleteAvailabilityBlock(id);
    fetchCalendar();
  }

  const todayIso = iso(new Date());
  const monthTitle = new Intl.DateTimeFormat(tag, { month: "long", year: "numeric" }).format(month);
  const showUnassigned = (data?.unassigned_bookings ?? []).some((d) => d.count > 0);

  const selEntry = sel ? data?.room_types.find((rt) => rt.room_type.id === sel.roomTypeId) : null;
  const selMax = Math.max(1, selEntry?.rooms_operational ?? 1);
  const selUnits = unitsToBlock ?? selMax;

  const fmtDay = (dateStr: string) =>
    new Intl.DateTimeFormat(tag, { day: "numeric", month: "short", year: "numeric" }).format(
      new Date(`${dateStr}T00:00:00`),
    );

  const monthBlocks = blocks.filter(
    (b) =>
      b.starts_on <= iso(new Date(month.getFullYear(), month.getMonth() + 1, 0)) &&
      b.ends_on >= iso(month),
  );
  const roomTypeName = (id: number) =>
    data?.room_types.find((rt) => rt.room_type.id === id)?.room_type.name ?? "—";

  /** Cell tone by remaining availability. */
  function cellClass(available: number, operational: number): string {
    if (operational === 0) return "bg-humana-stone text-humana-subtle";
    if (available === 0) return "bg-humana-ink text-white";
    if (available / operational <= 0.34) return "bg-humana-gold-light text-humana-ink";
    return "bg-white text-humana-ink";
  }

  return (
    <div className="mx-auto max-w-[1480px] px-10 py-10">
      {/* Header */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
            {t.hotelWs.badge}
          </p>
          <h1 className="mt-2 text-[32px] font-bold text-humana-ink">
            {t.hotelWs.calendar.title}
          </h1>
          <p className="mt-1 text-[14px] text-humana-muted">
            {t.hotelWs.calendar.subtitle}
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-5 pb-1">
          {[
            { cls: "border border-humana-line bg-white", label: t.hotelWs.calendar.legendAvailable },
            { cls: "bg-humana-gold-light", label: t.hotelWs.calendar.legendLow },
            { cls: "bg-humana-ink", label: t.hotelWs.calendar.legendFull },
            {
              cls: "border border-humana-line bg-white [background-image:repeating-linear-gradient(135deg,transparent,transparent_3px,rgba(17,17,17,0.25)_3px,rgba(17,17,17,0.25)_4px)]",
              label: t.hotelWs.calendar.legendBlocked,
            },
          ].map((item) => (
            <span key={item.label} className="flex items-center gap-2 text-[12px] text-humana-muted">
              <span className={`h-3 w-3 rounded-[3px] ${item.cls}`} />
              {item.label}
            </span>
          ))}
        </div>
      </div>

      {/* Month navigation */}
      <div className="mb-5 flex items-center gap-4">
        <button
          onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-humana-line bg-white text-humana-ink transition-colors hover:border-humana-gold"
          aria-label="Previous month"
        >
          ‹
        </button>
        <span className="min-w-[190px] text-center text-[16px] font-medium capitalize text-humana-ink">
          {monthTitle}
        </span>
        <button
          onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-humana-line bg-white text-humana-ink transition-colors hover:border-humana-gold"
          aria-label="Next month"
        >
          ›
        </button>
        {!sel && (
          <span className="ml-4 text-[12px] text-humana-subtle">{t.hotelWs.calendar.selectHint}</span>
        )}
      </div>

      {/* Block creation panel */}
      {sel && selEntry && (
        <div className="mb-5 flex items-center gap-6 rounded-xl border border-humana-line bg-white px-6 py-4 animate-[fade-in-up_0.25s_ease-out]">
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
              {selEntry.room_type.name}
            </span>
            <span className="mt-1 text-[14px] font-medium text-humana-ink">
              {fmtDay(sel.start)} → {sel.end ? fmtDay(sel.end) : "…"}
            </span>
          </div>

          <span className="h-8 w-px bg-humana-line" />

          {/* Units counter */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-humana-muted">
              {t.hotelWs.calendar.unitsToBlock}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setUnitsToBlock(Math.max(1, selUnits - 1))}
                disabled={selUnits <= 1}
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded border border-humana-line text-humana-ink hover:border-humana-ink disabled:opacity-30"
              >
                −
              </button>
              <span className="min-w-[90px] text-center text-[13px] font-medium text-humana-ink">
                {selUnits === selMax ? t.hotelWs.calendar.allUnits : selUnits}
              </span>
              <button
                onClick={() => setUnitsToBlock(Math.min(selMax, selUnits + 1))}
                disabled={selUnits >= selMax}
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded border border-humana-line text-humana-ink hover:border-humana-ink disabled:opacity-30"
              >
                +
              </button>
            </div>
          </div>

          <input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={t.hotelWs.calendar.reasonPlaceholder}
            className="w-52 rounded-lg border border-humana-line bg-white px-4 py-2.5 text-[13px] text-humana-ink outline-none transition-colors placeholder:text-humana-subtle focus:border-humana-gold"
          />

          <div className="ml-auto flex items-center gap-3">
            <button
              onClick={() => {
                setSel(null);
                setReason("");
                setUnitsToBlock(null);
              }}
              className="cursor-pointer text-[12px] font-semibold uppercase tracking-[0.18em] text-humana-muted transition-colors hover:text-humana-ink"
            >
              {t.hotelWs.calendar.cancel}
            </button>
            <button
              onClick={submitBlock}
              disabled={saving}
              className="cursor-pointer rounded-lg bg-humana-ink px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.18em] text-white transition-opacity hover:opacity-85 disabled:opacity-40"
            >
              {t.hotelWs.calendar.blockAction}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex h-64 items-center justify-center rounded-xl border border-humana-line bg-white">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-humana-line border-t-humana-gold" />
        </div>
      ) : !data || data.room_types.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-humana-line bg-white py-24 text-center">
          <p className="text-[18px] font-medium text-humana-ink">{t.hotelWs.calendar.empty}</p>
          <p className="mt-2 max-w-md text-[14px] text-humana-muted">{t.hotelWs.calendar.emptyHint}</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-humana-line bg-white">
          <div
            className="grid min-w-fit"
            style={{ gridTemplateColumns: `230px repeat(${days.length}, minmax(38px, 1fr))` }}
          >
            {/* Header row */}
            <div className="sticky left-0 z-10 border-b border-humana-line bg-white" />
            {days.map((d) => {
              const isToday = iso(d) === todayIso;
              const isWeekend = d.getDay() === 0 || d.getDay() === 6;
              return (
                <div
                  key={`h-${iso(d)}`}
                  className={`flex flex-col items-center border-b border-humana-line py-2.5 ${
                    isWeekend ? "bg-humana-stone/60" : ""
                  }`}
                >
                  <span className="text-[9px] font-semibold uppercase tracking-wider text-humana-subtle">
                    {new Intl.DateTimeFormat(tag, { weekday: "narrow" }).format(d)}
                  </span>
                  <span
                    className={`mt-0.5 flex h-6 w-6 items-center justify-center rounded-full text-[12px] ${
                      isToday ? "bg-humana-gold font-semibold text-white" : "text-humana-ink"
                    }`}
                  >
                    {d.getDate()}
                  </span>
                </div>
              );
            })}

            {/* Room type rows */}
            {data.room_types.map((entry) => {
              const byDate = new Map(entry.days.map((d) => [d.date, d]));
              return (
                <div key={entry.room_type.id} className="contents">
                  <div className="sticky left-0 z-10 border-b border-humana-line bg-white px-5 py-3.5">
                    <p className="text-[14px] font-medium text-humana-ink">{entry.room_type.name}</p>
                    <p className="mt-0.5 text-[12px] text-humana-muted">
                      {new Intl.NumberFormat(tag, {
                        style: "currency",
                        currency: entry.room_type.currency,
                        minimumFractionDigits: 0,
                      }).format(entry.room_type.price_per_night_cents / 100)}{" "}
                      {t.hotelWs.calendar.perNight}
                    </p>
                    <p className="mt-0.5 text-[11px] text-humana-subtle">
                      {entry.rooms_operational}/{entry.rooms_total} {t.hotelWs.calendar.operationalLabel}
                    </p>
                  </div>
                  {days.map((d) => {
                    const dateStr = iso(d);
                    const day = byDate.get(dateStr);
                    const available = day?.available ?? entry.rooms_operational;
                    const blocked = day?.blocked ?? 0;
                    const tooltip =
                      blocked > 0
                        ? t.hotelWs.calendar.blockedCount(blocked)
                        : available === 0
                          ? t.hotelWs.calendar.soldOut
                          : undefined;
                    const isSelected =
                      sel?.roomTypeId === entry.room_type.id &&
                      dateStr >= sel.start &&
                      dateStr <= (sel.end ?? sel.start);
                    return (
                      <button
                        key={`${entry.room_type.id}-${dateStr}`}
                        type="button"
                        onClick={() => handleCellClick(entry.room_type.id, dateStr)}
                        title={tooltip}
                        className={`flex cursor-pointer items-center justify-center border-b border-l border-humana-line/60 py-3.5 text-[13px] font-medium transition-shadow ${cellClass(
                          available,
                          entry.rooms_operational,
                        )} ${
                          blocked > 0
                            ? "[background-image:repeating-linear-gradient(135deg,transparent,transparent_5px,rgba(17,17,17,0.08)_5px,rgba(17,17,17,0.08)_7px)]"
                            : ""
                        } ${isSelected ? "ring-2 ring-inset ring-humana-gold" : ""}`}
                      >
                        {available}
                      </button>
                    );
                  })}
                </div>
              );
            })}

            {/* Unassigned bookings row (only when present) */}
            {showUnassigned && (
              <div className="contents">
                <div className="sticky left-0 z-10 bg-white px-5 py-3.5">
                  <p className="text-[13px] font-medium text-humana-ink">
                    {t.hotelWs.calendar.unassigned}
                  </p>
                  <p className="mt-0.5 max-w-[190px] text-[11px] leading-snug text-humana-subtle">
                    {t.hotelWs.calendar.unassignedHint}
                  </p>
                </div>
                {days.map((d) => {
                  const count =
                    data.unassigned_bookings.find((u) => u.date === iso(d))?.count ?? 0;
                  return (
                    <div
                      key={`u-${iso(d)}`}
                      className={`flex items-center justify-center border-l border-humana-line/60 py-3.5 text-[13px] ${
                        count > 0 ? "font-medium text-humana-gold" : "text-humana-subtle/50"
                      }`}
                    >
                      {count > 0 ? count : "·"}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Blocked periods overlapping this month */}
      {!loading && data && data.room_types.length > 0 && (
        <div className="mt-6 rounded-xl border border-humana-line bg-white px-7 py-5">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-muted">
            {t.hotelWs.calendar.blockedPeriods}
          </h2>
          {monthBlocks.length === 0 ? (
            <p className="mt-3 text-[13px] text-humana-subtle">{t.hotelWs.calendar.noBlocks}</p>
          ) : (
            <div className="mt-4 flex flex-wrap gap-3">
              {monthBlocks.map((b) => (
                <div
                  key={b.id}
                  className="flex items-center gap-3 rounded-lg bg-red-50 px-4 py-2.5 text-[12px] text-red-700"
                >
                  <div className="flex flex-col">
                    <span className="font-semibold">{roomTypeName(b.room_type_id)}</span>
                    <span>
                      {fmtDay(b.starts_on)} → {fmtDay(b.ends_on)} ·{" "}
                      {b.units === null ? t.hotelWs.calendar.allUnits : b.units}
                      {b.reason ? ` · ${b.reason}` : ""}
                    </span>
                  </div>
                  <button
                    onClick={() => removeBlock(b.id)}
                    className="cursor-pointer opacity-50 transition-opacity hover:opacity-100"
                    aria-label="Remove block"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Footer link to rooms management */}
      {!loading && data && data.room_types.length > 0 && (
        <div className="mt-6 text-right">
          <Link
            href="/hotel/rooms"
            className="text-[13px] font-semibold uppercase tracking-[0.22em] text-humana-gold transition-opacity hover:opacity-70"
          >
            {t.hotelWs.rooms.title} →
          </Link>
        </div>
      )}
    </div>
  );
}
