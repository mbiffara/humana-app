"use client";

import { useCallback, useEffect, useState } from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import { agencyApi, type ApiBooking, type ApiClient } from "@/lib/api/agency";

interface Props {
  booking: ApiBooking | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function ClientAssignModal({ booking, onClose, onSuccess }: Props) {
  const { t } = useLocale();
  const cm = t.agencyWs.bookings.clientModal;

  const [clients, setClients] = useState<ApiClient[]>([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");

  const fetchClients = useCallback(async () => {
    setLoadingClients(true);
    try {
      const res = await agencyApi.listClients({ per_page: 100 });
      setClients(res.clients);
    } catch {
      // ignore
    } finally {
      setLoadingClients(false);
    }
  }, []);

  useEffect(() => {
    if (booking) {
      fetchClients();
      setSelectedId(booking.client?.id ?? null);
      setSearch("");
      setShowNewForm(false);
      setNewName("");
      setNewEmail("");
      setNewPhone("");
    }
  }, [booking, fetchClients]);

  if (!booking) return null;

  const isChange = !!booking.client;
  const title = isChange ? cm.changeTitle : cm.assignTitle;

  const q = search.toLowerCase();
  const filtered = clients.filter(
    (c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q),
  );

  async function handleAssign() {
    if (!selectedId || !booking) return;
    setSaving(true);
    try {
      await agencyApi.updateBooking(booking.id, { client_id: selectedId });
      onSuccess();
      onClose();
    } finally {
      setSaving(false);
    }
  }

  async function handleUnassign() {
    if (!booking) return;
    setSaving(true);
    try {
      await agencyApi.updateBooking(booking.id, { client_id: null });
      onSuccess();
      onClose();
    } finally {
      setSaving(false);
    }
  }

  async function handleCreateAndAssign() {
    if (!newName.trim() || !newEmail.trim() || !booking) return;
    setSaving(true);
    try {
      const res = await agencyApi.createClient({
        name: newName.trim(),
        email: newEmail.trim(),
        phone: newPhone.trim() || undefined,
      });
      await agencyApi.updateBooking(booking.id, { client_id: res.client.id });
      onSuccess();
      onClose();
    } finally {
      setSaving(false);
    }
  }

  function initials(name: string) {
    return name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-[backdrop-fade-in_0.15s_ease-out]"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-[520px] rounded-2xl bg-white shadow-2xl animate-[fade-in-scale_0.25s_ease-out]">
        {/* Header */}
        <div className="flex items-center justify-between px-7 pt-7 pb-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-humana-gold/15">
              <svg className="h-5 w-5 text-humana-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
            <div>
              <h3 className="text-[18px] font-semibold text-humana-ink">{title}</h3>
              <span className="text-[12px] font-semibold tracking-wide text-humana-subtle">{booking.reference}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-humana-muted transition-colors hover:bg-humana-stone"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="mx-7 mt-5">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-humana-subtle" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={cm.searchPlaceholder}
              className="w-full rounded-lg border border-humana-line bg-white py-2.5 pl-10 pr-4 text-[13px] text-humana-ink outline-none transition-colors placeholder:text-humana-subtle focus:border-humana-gold"
            />
          </div>
        </div>

        {/* Client list */}
        <div className="mx-7 mt-3 max-h-[280px] overflow-y-auto rounded-lg border border-humana-line">
          {loadingClients ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-humana-line border-t-humana-gold" />
            </div>
          ) : clients.length === 0 ? (
            <p className="px-4 py-6 text-center text-[13px] text-humana-muted">{cm.noClients}</p>
          ) : filtered.length === 0 ? (
            <p className="px-4 py-6 text-center text-[13px] text-humana-muted">{cm.noResults}</p>
          ) : (
            filtered.map((client) => {
              const selected = selectedId === client.id;
              return (
                <button
                  key={client.id}
                  onClick={() => setSelectedId(selected ? null : client.id)}
                  className={`flex w-full items-center gap-3 border-b border-humana-line/60 px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-humana-stone/40 ${
                    selected ? "bg-humana-gold/5 ring-1 ring-inset ring-humana-gold/40" : ""
                  }`}
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-humana-gold/15 text-[11px] font-semibold text-humana-gold">
                    {initials(client.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium text-humana-ink">{client.name}</p>
                    <p className="truncate text-[11px] text-humana-subtle">{client.email}</p>
                  </div>
                  {selected && (
                    <svg className="h-4 w-4 shrink-0 text-humana-gold" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* New client section */}
        <div className="mx-7 mt-3">
          <button
            onClick={() => setShowNewForm(!showNewForm)}
            className="flex items-center gap-1.5 text-[12px] font-semibold text-humana-gold transition-colors hover:text-humana-gold/80"
          >
            <svg className={`h-3.5 w-3.5 transition-transform ${showNewForm ? "rotate-90" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
            {cm.newClient}
          </button>
          {showNewForm && (
            <div className="mt-3 space-y-2.5 rounded-lg border border-humana-line bg-humana-stone/30 p-4">
              <div>
                <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-subtle">{cm.nameLabel}</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full rounded-lg border border-humana-line bg-white px-3 py-2 text-[13px] text-humana-ink outline-none transition-colors placeholder:text-humana-subtle focus:border-humana-gold"
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-subtle">{cm.emailLabel}</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full rounded-lg border border-humana-line bg-white px-3 py-2 text-[13px] text-humana-ink outline-none transition-colors placeholder:text-humana-subtle focus:border-humana-gold"
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-subtle">{cm.phoneLabel}</label>
                <input
                  type="tel"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full rounded-lg border border-humana-line bg-white px-3 py-2 text-[13px] text-humana-ink outline-none transition-colors placeholder:text-humana-subtle focus:border-humana-gold"
                />
              </div>
              <button
                onClick={handleCreateAndAssign}
                disabled={saving || !newName.trim() || !newEmail.trim()}
                className="w-full rounded-lg bg-humana-gold py-2.5 text-[12px] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-humana-gold/90 disabled:opacity-50"
              >
                {saving ? cm.saving : cm.createAndAssign}
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center px-7 pt-5 pb-7">
          {isChange && (
            <button
              onClick={handleUnassign}
              disabled={saving}
              className="text-[13px] font-medium text-red-600 transition-colors hover:text-red-700 disabled:opacity-50"
            >
              {cm.unassignBtn}
            </button>
          )}
          <div className="flex-1" />
          <button
            onClick={handleAssign}
            disabled={saving || !selectedId || selectedId === booking.client?.id}
            className="rounded-lg bg-humana-gold px-6 py-2.5 text-[12px] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-humana-gold/90 disabled:opacity-50"
          >
            {saving ? cm.saving : cm.assignBtn}
          </button>
        </div>
      </div>
    </div>
  );
}
