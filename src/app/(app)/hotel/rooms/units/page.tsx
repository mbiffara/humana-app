/** Hotel workspace — individual room (unit) management.
 *  Rooms grouped by room type: rename/number each room, set its status,
 *  add new rooms, or remove them. total_rooms stays in sync server-side. */
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useLocale } from "@/i18n/LocaleProvider";
import { hotelApi, type Room, type RoomStatus, type RoomType } from "@/lib/api/hotel";

const STATUS_ORDER: RoomStatus[] = ["available", "out_of_service"];

const STATUS_STYLES: Record<RoomStatus, string> = {
  available: "bg-humana-gold-light text-humana-ink",
  out_of_service: "bg-humana-stone text-humana-subtle",
};

export default function HotelRoomsPage() {
  const { t } = useLocale();
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Room type id whose ⋮ actions menu is open
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  // Room type ids with their unit list expanded (collapsed by default)
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  function toggleExpanded(roomTypeId: number) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(roomTypeId)) next.delete(roomTypeId);
      else next.add(roomTypeId);
      return next;
    });
  }
  // In-progress room renames, keyed by room id. Cleared after save so the
  // input falls back to the server value — a rejected rename (e.g. duplicate
  // number) visibly reverts instead of lingering as if it were saved.
  const [drafts, setDrafts] = useState<Record<number, string>>({});
  // Room id pending delete confirmation (two-step, no browser dialog)
  const [pendingDelete, setPendingDelete] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [typesRes, roomsRes] = await Promise.all([
        hotelApi.listRoomTypes(),
        hotelApi.listRooms(),
      ]);
      setRoomTypes(typesRes.room_types);
      setRooms(roomsRes.rooms);
      setError(null);
    } catch {
      setError("API");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function renameRoom(room: Room, number: string) {
    const trimmed = number.trim();
    try {
      if (trimmed && trimmed !== room.number) {
        const res = await hotelApi.updateRoom(room.id, { number: trimmed });
        setRooms((prev) => prev.map((r) => (r.id === room.id ? res.room : r)));
      }
    } catch {
      // rejected (e.g. duplicate number) — dropping the draft below reverts
      // the input to the server value
    } finally {
      setDrafts((prev) => {
        const next = { ...prev };
        delete next[room.id];
        return next;
      });
    }
  }

  async function setStatus(room: Room, status: RoomStatus) {
    if (status === room.status) return;
    try {
      const res = await hotelApi.updateRoom(room.id, { status });
      setRooms((prev) => prev.map((r) => (r.id === room.id ? res.room : r)));
    } catch {
      fetchData();
    }
  }

  // Same "{Type name} {seq}" pattern the server uses for placeholder rooms;
  // numbers are unique hotel-wide, and the full room list is already loaded.
  function nextRoomNumber(roomType: RoomType): string {
    const taken = new Set(rooms.map((r) => r.number.toLowerCase()));
    let seq = 1;
    while (taken.has(`${roomType.name} ${seq}`.toLowerCase())) seq += 1;
    return `${roomType.name} ${seq}`;
  }

  async function addRoom(roomType: RoomType) {
    try {
      const res = await hotelApi.createRoom({
        room_type_id: roomType.id,
        number: nextRoomNumber(roomType),
      });
      setRooms((prev) => [...prev, res.room]);
      // Reveal the list so the new room is visible
      setExpanded((prev) => new Set(prev).add(roomType.id));
    } catch {
      // duplicate number race or validation error — refetch to resync
      fetchData();
    } finally {
      setOpenMenu(null);
    }
  }

  async function deleteRoom(room: Room) {
    try {
      await hotelApi.deleteRoom(room.id);
      setRooms((prev) => prev.filter((r) => r.id !== room.id));
    } finally {
      setPendingDelete(null);
    }
  }

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-humana-line border-t-humana-gold" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-10 py-10">
      {/* Header */}
      <div className="mb-10">
        <Link
          href="/hotel/rooms"
          className="text-[12px] font-medium text-humana-gold transition-opacity hover:opacity-75"
        >
          ← {t.hotelWs.roomTypes.title}
        </Link>
        <h1 className="mt-3 text-[32px] font-bold text-humana-ink">{t.hotelWs.rooms.title}</h1>
        <p className="mt-1 text-[14px] text-humana-muted">{t.hotelWs.rooms.subtitle}</p>
      </div>

      {roomTypes.length === 0 || error ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-humana-line bg-white py-24 text-center">
          <p className="text-[18px] font-medium text-humana-ink">{t.hotelWs.rooms.empty}</p>
          <p className="mt-2 max-w-md text-[14px] text-humana-muted">{t.hotelWs.rooms.emptyHint}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-8 stagger-children">
          {roomTypes.map((roomType) => {
            const typeRooms = rooms.filter((r) => r.room_type_id === roomType.id);
            return (
              <section
                key={roomType.id}
                className="overflow-hidden rounded-xl border border-humana-line bg-white"
              >
                {/* Room type header — click to expand/collapse the unit list */}
                <div
                  onClick={() => toggleExpanded(roomType.id)}
                  className={`flex cursor-pointer items-center justify-between px-7 py-5 transition-colors hover:bg-humana-stone/40 ${
                    expanded.has(roomType.id) ? "border-b border-humana-line" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`shrink-0 text-humana-muted transition-transform duration-200 ${
                        expanded.has(roomType.id) ? "rotate-90" : ""
                      }`}
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  <div>
                    <h2 className="text-[18px] font-semibold text-humana-ink">{roomType.name}</h2>
                    <p className="mt-0.5 text-[12px] text-humana-muted">
                      {typeRooms.length} {t.hotelWs.calendar.roomsLabel} ·{" "}
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: roomType.currency,
                        minimumFractionDigits: 0,
                      }).format(roomType.price_per_night_cents / 100)}{" "}
                      {t.hotelWs.calendar.perNight}
                    </p>
                  </div>
                  </div>

                  {/* Actions menu — clicks must not toggle the collapse */}
                  <div className="relative" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setOpenMenu((prev) => (prev === roomType.id ? null : roomType.id))}
                      aria-label={t.hotelWs.rooms.addRoom}
                      className="cursor-pointer rounded-lg p-2 text-humana-muted transition-colors hover:bg-humana-stone hover:text-humana-ink"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="12" cy="5" r="1.8" />
                        <circle cx="12" cy="12" r="1.8" />
                        <circle cx="12" cy="19" r="1.8" />
                      </svg>
                    </button>
                    {openMenu === roomType.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setOpenMenu(null)} />
                        <div className="absolute right-0 top-full z-20 mt-1 min-w-[220px] rounded-lg border border-humana-line bg-white py-1.5 shadow-lg animate-fade-in-scale">
                          <button
                            onClick={() => addRoom(roomType)}
                            className="flex w-full cursor-pointer items-center gap-2.5 px-4 py-2.5 text-left text-[13px] text-humana-ink transition-colors hover:bg-humana-stone"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                              <path d="M12 5v14M5 12h14" />
                            </svg>
                            {t.hotelWs.rooms.addRoom}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Rooms list */}
                {expanded.has(roomType.id) && (
                <div className="px-7 py-3">
                  {typeRooms.map((room) => (
                    <div
                      key={room.id}
                      className="flex items-center gap-4 border-b border-humana-line/60 py-3 last:border-b-0"
                    >
                      {/* Editable number */}
                      <input
                        value={drafts[room.id] ?? room.number}
                        onChange={(e) =>
                          setDrafts((prev) => ({ ...prev, [room.id]: e.target.value }))
                        }
                        onBlur={(e) => renameRoom(room, e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
                        className="min-w-[160px] flex-1 rounded-md border border-transparent bg-transparent px-2 py-1.5 text-[14px] text-humana-ink outline-none transition-colors hover:border-humana-line focus:border-humana-gold focus:bg-white"
                      />
                      {/* Status pills */}
                      <div className="flex items-center gap-1">
                        {STATUS_ORDER.map((status) => (
                          <button
                            key={status}
                            onClick={() => setStatus(room, status)}
                            className={`cursor-pointer rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider transition-all ${
                              room.status === status
                                ? STATUS_STYLES[status]
                                : "text-humana-subtle/60 hover:text-humana-muted"
                            }`}
                          >
                            {t.hotelWs.rooms.statuses[status]}
                          </button>
                        ))}
                      </div>

                      {/* Delete (two-step confirm) */}
                      {pendingDelete === room.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => deleteRoom(room)}
                            title={t.hotelWs.rooms.confirmDelete}
                            className="cursor-pointer rounded-md bg-red-600 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-white"
                          >
                            ✓
                          </button>
                          <button
                            onClick={() => setPendingDelete(null)}
                            className="cursor-pointer rounded-md border border-humana-line px-2 py-1 text-[10px] text-humana-muted"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setPendingDelete(room.id)}
                          className="cursor-pointer p-1 text-humana-subtle/60 transition-colors hover:text-red-600"
                          aria-label="Delete room"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                            <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                )}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
