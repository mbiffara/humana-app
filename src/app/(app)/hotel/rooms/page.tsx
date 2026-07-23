/** Hotel workspace — rooms management.
 *  Rooms grouped by room type: rename/number each room, set its status,
 *  add new rooms, or remove them. total_rooms stays in sync server-side. */
"use client";

import { useCallback, useEffect, useState } from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import { hotelApi, type Room, type RoomStatus, type RoomType } from "@/lib/api/hotel";

const STATUS_ORDER: RoomStatus[] = ["available", "maintenance", "out_of_service"];

const STATUS_STYLES: Record<RoomStatus, string> = {
  available: "bg-humana-gold-light text-humana-ink",
  maintenance: "bg-amber-100 text-amber-900",
  out_of_service: "bg-humana-stone text-humana-subtle",
};

export default function HotelRoomsPage() {
  const { t } = useLocale();
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Per-room-type "add room" input value
  const [newRoomNames, setNewRoomNames] = useState<Record<number, string>>({});
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

  async function addRoom(roomType: RoomType) {
    const number = (newRoomNames[roomType.id] ?? "").trim();
    if (!number) return;
    try {
      const res = await hotelApi.createRoom({ room_type_id: roomType.id, number });
      setRooms((prev) => [...prev, res.room]);
      setNewRoomNames((prev) => ({ ...prev, [roomType.id]: "" }));
    } catch {
      // duplicate number or validation error — keep the input for correction
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
    <div className="mx-auto max-w-[1100px] px-10 py-10">
      {/* Header */}
      <div className="mb-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
          {t.hotelWs.badge}
        </p>
        <h1 className="mt-2 text-[32px] font-bold text-humana-ink">{t.hotelWs.rooms.title}</h1>
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
                {/* Room type header */}
                <div className="flex items-center justify-between border-b border-humana-line px-7 py-5">
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

                  {/* Add room */}
                  <div className="flex items-center gap-3">
                    <input
                      value={newRoomNames[roomType.id] ?? ""}
                      onChange={(e) =>
                        setNewRoomNames((prev) => ({ ...prev, [roomType.id]: e.target.value }))
                      }
                      onKeyDown={(e) => e.key === "Enter" && addRoom(roomType)}
                      placeholder={t.hotelWs.rooms.numberPlaceholder}
                      className="w-56 rounded-lg border border-humana-line bg-white px-4 py-2.5 text-[13px] text-humana-ink outline-none transition-colors placeholder:text-humana-subtle focus:border-humana-gold"
                    />
                    <button
                      onClick={() => addRoom(roomType)}
                      className="cursor-pointer rounded-lg bg-humana-ink px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.18em] text-white transition-opacity hover:opacity-85"
                    >
                      {t.hotelWs.rooms.addRoom}
                    </button>
                  </div>
                </div>

                {/* Rooms list */}
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
                      {room.auto_generated && (
                        <span
                          className="text-[10px] uppercase tracking-wider text-humana-subtle"
                          title={t.hotelWs.rooms.autoLabel}
                        >
                          {t.hotelWs.rooms.autoLabel}
                        </span>
                      )}

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
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
