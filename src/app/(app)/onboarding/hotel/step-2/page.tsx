"use client";

import { useState } from "react";
import { useHotelWizard, type RoomTypeEntry } from "@/contexts/HotelWizardContext";

/* ─── Bed type options ─── */
const BED_TYPES = ["King", "Queen", "Twin", "Single"];

/* ─── Add / Edit Room Form ─── */
function RoomTypeForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: RoomTypeEntry;
  onSave: (data: Omit<RoomTypeEntry, "id">) => void;
  onCancel: () => void;
}) {
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
    <div className="animate-fade-in-up">
      {/* Eyebrow */}
      <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
        Step 2 of 4 &middot; {initial ? "Edit Room Type" : "Add Room Type"}
      </span>

      {/* Title */}
      <h2 className="mt-3 text-[28px] font-light leading-[1.2] tracking-[-0.02em] text-humana-ink">
        Describe this room.
      </h2>

      {/* Subtitle */}
      <p className="mt-2 text-[15px] leading-[22px] text-humana-muted">
        Fill in the basic details for this room type.
      </p>

      {/* Fields */}
      <div className="mt-10 flex flex-col gap-8">
        {/* Room Name */}
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-muted">
            Room Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Ocean Suite"
            className="border-b border-humana-line bg-transparent py-3 text-[17px] text-humana-ink outline-none transition-colors placeholder:text-humana-subtle/50 focus:border-humana-gold"
          />
        </div>

        {/* Short Description */}
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-muted">
            Short Description
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Sea-facing, 60 m²"
            className="border-b border-humana-line bg-transparent py-3 text-[15px] text-humana-ink outline-none transition-colors placeholder:text-humana-subtle/50 focus:border-humana-gold"
          />
        </div>

        {/* Row of 3: Max Guests, Total Units, Base Rate */}
        <div className="grid grid-cols-3 gap-6">
          {/* Max Guests Counter */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-muted">
              Max Guests
            </label>
            <div className="flex items-center gap-3 border-b border-humana-line py-2">
              <button
                type="button"
                onClick={() => setMaxGuests(Math.max(1, maxGuests - 1))}
                disabled={maxGuests <= 1}
                className="cursor-pointer flex h-8 w-8 items-center justify-center border border-humana-line text-humana-ink transition-all duration-150 hover:border-humana-ink active:scale-[0.96] disabled:opacity-30"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M5 12h14" />
                </svg>
              </button>
              <span className="flex-1 text-center text-[17px] font-medium text-humana-ink">
                {maxGuests}
              </span>
              <button
                type="button"
                onClick={() => setMaxGuests(Math.min(10, maxGuests + 1))}
                disabled={maxGuests >= 10}
                className="cursor-pointer flex h-8 w-8 items-center justify-center border border-humana-line text-humana-ink transition-all duration-150 hover:border-humana-ink active:scale-[0.96] disabled:opacity-30"
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
              Total Units
            </label>
            <div className="flex items-center gap-3 border-b border-humana-line py-2">
              <button
                type="button"
                onClick={() => setTotalUnits(Math.max(1, totalUnits - 1))}
                disabled={totalUnits <= 1}
                className="cursor-pointer flex h-8 w-8 items-center justify-center border border-humana-line text-humana-ink transition-all duration-150 hover:border-humana-ink active:scale-[0.96] disabled:opacity-30"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M5 12h14" />
                </svg>
              </button>
              <span className="flex-1 text-center text-[17px] font-medium text-humana-ink">
                {totalUnits}
              </span>
              <button
                type="button"
                onClick={() => setTotalUnits(Math.min(99, totalUnits + 1))}
                disabled={totalUnits >= 99}
                className="cursor-pointer flex h-8 w-8 items-center justify-center border border-humana-line text-humana-ink transition-all duration-150 hover:border-humana-ink active:scale-[0.96] disabled:opacity-30"
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
              Base Rate
            </label>
            <div className="flex items-center gap-2 border-b border-humana-line py-2">
              <span className="text-[14px] text-humana-subtle">USD</span>
              <input
                type="number"
                min={0}
                value={baseRate || ""}
                onChange={(e) => setBaseRate(Number(e.target.value))}
                placeholder="0"
                className="w-full bg-transparent text-[17px] font-medium text-humana-ink outline-none placeholder:text-humana-subtle/50"
              />
              <span className="text-[13px] text-humana-subtle whitespace-nowrap">/night</span>
            </div>
          </div>
        </div>

        {/* Row of 2: Room Size, Bed Type */}
        <div className="grid grid-cols-2 gap-6">
          {/* Room Size */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-muted">
              Room Size
            </label>
            <div className="flex items-center gap-2 border-b border-humana-line py-3">
              <input
                type="number"
                min={0}
                value={roomSize || ""}
                onChange={(e) => setRoomSize(Number(e.target.value))}
                placeholder="0"
                className="w-full bg-transparent text-[17px] text-humana-ink outline-none placeholder:text-humana-subtle/50"
              />
              <span className="text-[13px] text-humana-subtle">m&sup2;</span>
            </div>
          </div>

          {/* Bed Type */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-muted">
              Bed Type
            </label>
            <select
              value={bedType}
              onChange={(e) => setBedType(e.target.value)}
              className="border-b border-humana-line bg-transparent py-3 text-[15px] text-humana-ink outline-none transition-colors focus:border-humana-gold"
            >
              {BED_TYPES.map((bt) => (
                <option key={bt} value={bt}>
                  {bt}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-12 flex items-center justify-between">
        <button
          type="button"
          onClick={onCancel}
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
          Back to rooms
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSave}
          className="cursor-pointer flex items-center gap-2 bg-humana-ink px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.22em] text-white transition-all hover:bg-black active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none"
        >
          {initial ? "Save Changes" : "Add Room Type"}
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
            <path d="M5 12h14" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/* ─── Room Type Card ─── */
function RoomTypeCard({
  room,
  onEdit,
  onDelete,
}: {
  room: RoomTypeEntry;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="group flex items-center justify-between border border-humana-line bg-white p-5 transition-all duration-200 hover:border-humana-gold/30 hover:shadow-sm">
      <div className="flex flex-col gap-2">
        {/* Name + badge */}
        <div className="flex items-center gap-2.5">
          <span className="text-[16px] font-medium text-humana-ink">{room.name}</span>
          <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-600">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Active
          </span>
        </div>

        {/* Description */}
        {room.description && (
          <span className="text-[13px] text-humana-muted">{room.description}</span>
        )}

        {/* Stats row */}
        <div className="flex items-center gap-4 mt-1">
          {/* Guests */}
          <span className="flex items-center gap-1.5 text-[12px] text-humana-subtle">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            {room.maxGuests} guests
          </span>

          {/* Units */}
          <span className="flex items-center gap-1.5 text-[12px] text-humana-subtle">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            {room.totalUnits} units
          </span>

          {/* Price */}
          <span className="flex items-center gap-1.5 text-[12px] text-humana-subtle">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            U$D {room.baseRate} / night
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          type="button"
          onClick={onEdit}
          className="cursor-pointer flex items-center gap-1.5 border border-humana-line px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-ink transition-colors hover:border-humana-ink"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="cursor-pointer flex h-8 w-8 items-center justify-center text-humana-subtle transition-colors hover:text-red-500"
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

/* ─── Main Step 2 Page ─── */
export default function HotelWizardStep2() {
  const { state, addRoomType, updateRoomType, removeRoomType } = useHotelWizard();
  const [view, setView] = useState<"list" | "add" | "edit">("list");
  const [editingId, setEditingId] = useState<string | null>(null);

  function handleAdd(data: Omit<RoomTypeEntry, "id">) {
    addRoomType(data);
    setView("list");
  }

  function handleEdit(data: Omit<RoomTypeEntry, "id">) {
    if (editingId) {
      updateRoomType(editingId, data);
    }
    setEditingId(null);
    setView("list");
  }

  function startEdit(id: string) {
    setEditingId(id);
    setView("edit");
  }

  const editingRoom = editingId
    ? state.roomTypes.find((rt) => rt.id === editingId)
    : undefined;

  if (view === "add") {
    return (
      <div className="flex justify-center px-16 py-16">
        <div className="w-full max-w-[640px]">
          <RoomTypeForm
            onSave={handleAdd}
            onCancel={() => setView("list")}
          />
        </div>
      </div>
    );
  }

  if (view === "edit" && editingRoom) {
    return (
      <div className="flex justify-center px-16 py-16">
        <div className="w-full max-w-[640px]">
          <RoomTypeForm
            initial={editingRoom}
            onSave={handleEdit}
            onCancel={() => {
              setEditingId(null);
              setView("list");
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center px-16 py-16 animate-fade-in-up">
      <div className="w-full max-w-[640px]">
        {/* Eyebrow */}
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
          Step 2 of 4 &middot; Room Inventory
        </span>

        {/* Title */}
        <h1 className="mt-3 text-[32px] font-light leading-[1.2] tracking-[-0.02em] text-humana-ink">
          Configure your room types.
        </h1>

        {/* Subtitle */}
        <p className="mt-2 max-w-[520px] text-[15px] leading-[22px] text-humana-muted">
          Add each room category you offer along with the total number of units
          available.
        </p>

        {/* Counter */}
        {state.roomTypes.length > 0 && (
          <div className="mt-8 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-[13px] font-medium text-humana-ink">
              {state.roomTypes.length} room type{state.roomTypes.length !== 1 ? "s" : ""}{" "}
              configured
            </span>
          </div>
        )}

        {/* Room type cards */}
        <div className="mt-6 flex flex-col gap-3 stagger-children">
          {state.roomTypes.map((room) => (
            <RoomTypeCard
              key={room.id}
              room={room}
              onEdit={() => startEdit(room.id)}
              onDelete={() => removeRoomType(room.id)}
            />
          ))}
        </div>

        {/* Add button */}
        <button
          type="button"
          onClick={() => setView("add")}
          className="cursor-pointer mt-6 flex w-full items-center justify-center gap-2 border-2 border-dashed border-humana-gold/40 bg-transparent py-4 text-[13px] font-semibold uppercase tracking-[0.22em] text-humana-gold transition-all duration-200 hover:border-humana-gold hover:bg-humana-gold-light/30"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add Room Type
        </button>

        {/* Empty state hint */}
        {state.roomTypes.length === 0 && (
          <div className="mt-8 flex items-center gap-3 rounded-lg border border-humana-line/60 bg-white p-5 animate-fade-in-up-delay-1">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-humana-gold-light">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#d4af37"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[13px] font-medium text-humana-ink">
                No rooms added yet
              </span>
              <span className="text-[12px] leading-relaxed text-humana-muted">
                Add at least one room type with pricing and capacity to continue.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
