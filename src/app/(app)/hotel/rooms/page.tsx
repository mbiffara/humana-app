/** Hotel workspace — room type management + availability calendar.
 *  Two tabs: Room Types (CRUD list) and Calendar (tape-chart availability).
 *  Unified under a single nav item. */
"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useLocale } from "@/i18n/LocaleProvider";
import { hotelApi, type CalendarResponse, type RoomType, type RoomTypeStatus } from "@/lib/api/hotel";
import { HotelCalendar } from "@/components/hotel/HotelCalendar";

const STATUS_STYLES: Record<RoomTypeStatus, { chip: string; dot: string }> = {
  active: { chip: "border-emerald-500 text-emerald-600", dot: "bg-emerald-500" },
  draft: { chip: "border-humana-gold text-humana-gold", dot: "bg-humana-gold" },
  inactive: { chip: "border-humana-line text-humana-subtle", dot: "bg-humana-subtle" },
};

const OCCUPANCY_WINDOW = 30;

type TypeStats = { available: number; occupancy: number };
type Tab = "rooms" | "calendar";

function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export default function RoomTypesPage() {
  const { t } = useLocale();
  const tr = t.hotelWs.roomTypes;
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "calendar" ? "calendar" : "rooms";
  const [tab, setTab] = useState<Tab>(initialTab);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [stats, setStats] = useState<Record<number, TypeStats>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const today = new Date();
      const to = new Date(today);
      to.setDate(to.getDate() + OCCUPANCY_WINDOW - 1);
      const [typesRes, calendarRes] = await Promise.all([
        hotelApi.listRoomTypes(),
        hotelApi.getCalendar(isoDate(today), isoDate(to)).catch(() => null),
      ]);
      setRoomTypes(typesRes.room_types);
      if (calendarRes) setStats(computeStats(calendarRes));
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function computeStats(calendar: CalendarResponse): Record<number, TypeStats> {
    const result: Record<number, TypeStats> = {};
    for (const entry of calendar.room_types) {
      const today = entry.days[0];
      const operationalNights = entry.rooms_operational * entry.days.length;
      const bookedNights = entry.days.reduce((sum, day) => sum + day.booked, 0);
      result[entry.room_type.id] = {
        available: today ? today.available : entry.rooms_operational,
        occupancy: operationalNights > 0 ? Math.round((bookedNights / operationalNights) * 100) : 0,
      };
    }
    return result;
  }

  async function deleteRoomType(id: number) {
    try {
      await hotelApi.deleteRoomType(id);
      setRoomTypes((prev) => prev.filter((rt) => rt.id !== id));
    } finally {
      setPendingDelete(null);
    }
  }

  const totalUnits = roomTypes.reduce((sum, rt) => sum + (rt.total_rooms ?? 0), 0);
  const totalAvailable = roomTypes.reduce((sum, rt) => sum + (stats[rt.id]?.available ?? 0), 0);

  const tabs: { key: Tab; label: string }[] = [
    { key: "rooms", label: tr.title },
    { key: "calendar", label: t.hotelWs.calendar.title },
  ];

  return (
    <div className={`mx-auto ${tab === "calendar" ? "max-w-[1480px]" : "max-w-[1400px]"} px-10 py-10`}>
      {/* Header */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
            {tr.eyebrow}
          </p>
          <h1 className="mt-2 text-[32px] font-bold text-humana-ink">
            {tab === "rooms" ? tr.title : t.hotelWs.calendar.title}
          </h1>
          <p className="mt-1 text-[14px] text-humana-muted">
            {tab === "rooms"
              ? roomTypes.length > 0
                ? tr.summary(roomTypes.length, totalUnits, totalAvailable)
                : tr.subtitle
              : t.hotelWs.calendar.subtitle}
          </p>
        </div>
        {tab === "rooms" && (
          <Link
            href="/hotel/rooms/edit/step-1"
            onClick={() => sessionStorage.removeItem("humana.room-editor")}
            className="bg-humana-ink px-6 py-3.5 text-[13px] font-semibold uppercase tracking-[0.22em] text-white transition-opacity hover:opacity-85"
          >
            + {tr.addRoomType}
          </Link>
        )}
      </div>

      {/* Tabs */}
      <div className="mb-8 flex gap-1 border-b border-humana-line">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`cursor-pointer px-5 pb-3 text-[14px] font-medium transition-colors ${
              tab === t.key
                ? "border-b-2 border-humana-gold text-humana-ink"
                : "text-humana-muted hover:text-humana-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "calendar" ? (
        <HotelCalendar />
      ) : loading ? (
        <div className="flex h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-humana-line border-t-humana-gold" />
        </div>
      ) : roomTypes.length === 0 || error ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-humana-line bg-white py-24 text-center">
          <p className="text-[18px] font-medium text-humana-ink">{tr.empty}</p>
          <p className="mt-2 max-w-md text-[14px] text-humana-muted">{tr.emptyHint}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-5 stagger-children">
          {roomTypes.map((roomType) => {
            const typeStats = stats[roomType.id];
            return (
              <article
                key={roomType.id}
                className="flex overflow-hidden rounded-xl border border-humana-line bg-white card-hover"
              >
                {/* Thumbnail */}
                <div className="relative w-[200px] shrink-0 bg-humana-stone">
                  {roomType.image_url ? (
                    <Image
                      src={roomType.image_url}
                      alt={roomType.name}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#c9c4b4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col justify-between px-7 py-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h2 className="text-[18px] font-semibold text-humana-ink">{roomType.name}</h2>
                      {roomType.description && (
                        <p className="mt-0.5 truncate text-[13px] text-humana-muted">
                          {roomType.description}
                        </p>
                      )}
                    </div>
                    <span
                      className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] ${STATUS_STYLES[roomType.status].chip}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${STATUS_STYLES[roomType.status].dot}`} />
                      {tr.statuses[roomType.status]}
                    </span>
                  </div>

                  {/* Stats row */}
                  <div className="mt-5 flex items-center gap-10">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-humana-subtle">
                        {tr.rate}
                      </p>
                      <p className="mt-1 text-[14px] font-medium text-humana-ink">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: roomType.currency || "USD",
                          minimumFractionDigits: 0,
                        }).format(roomType.price_per_night_cents / 100)}{" "}
                        {tr.perNight}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-humana-subtle">
                        {tr.units}
                      </p>
                      <p className="mt-1 text-[14px] font-medium text-humana-ink">
                        {roomType.total_rooms ?? 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-humana-subtle">
                        {tr.available}
                      </p>
                      <p className="mt-1 text-[14px] font-medium text-humana-gold">
                        {typeStats?.available ?? "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-humana-subtle">
                        {tr.maxGuests}
                      </p>
                      <p className="mt-1 text-[14px] font-medium text-humana-ink">
                        {roomType.capacity}
                      </p>
                    </div>
                    <div className="min-w-[140px]">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-humana-subtle">
                        {tr.occupancy}
                      </p>
                      <div className="mt-2 flex items-center gap-2.5">
                        <div className="h-1.5 w-[90px] overflow-hidden rounded-full bg-humana-stone">
                          <div
                            className="h-full rounded-full bg-humana-gold"
                            style={{ width: `${typeStats?.occupancy ?? 0}%` }}
                          />
                        </div>
                        <span className="text-[13px] font-medium text-humana-ink">
                          {typeStats ? `${typeStats.occupancy}%` : "—"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-5 flex items-center gap-6 border-t border-humana-line pt-4">
                    <Link
                      href={`/hotel/rooms/edit/step-1?id=${roomType.id}`}
                      className="text-[13px] font-medium text-humana-gold transition-opacity hover:opacity-75"
                    >
                      {tr.editDetails}
                    </Link>
                    <Link
                      href="/hotel/rooms/units"
                      className="text-[13px] text-humana-muted transition-colors hover:text-humana-ink"
                    >
                      {tr.manageUnits}
                    </Link>
                    {pendingDelete === roomType.id ? (
                      <span className="ml-auto flex items-center gap-3 text-[13px]">
                        <span className="text-humana-muted">{tr.confirmDelete}</span>
                        <button
                          onClick={() => deleteRoomType(roomType.id)}
                          className="cursor-pointer font-medium text-red-600 hover:opacity-75"
                        >
                          {tr.delete}
                        </button>
                        <button
                          onClick={() => setPendingDelete(null)}
                          className="cursor-pointer text-humana-muted hover:text-humana-ink"
                        >
                          ✕
                        </button>
                      </span>
                    ) : (
                      <button
                        onClick={() => setPendingDelete(roomType.id)}
                        className="ml-auto cursor-pointer text-[13px] text-humana-muted transition-colors hover:text-red-600"
                      >
                        {tr.delete}
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
