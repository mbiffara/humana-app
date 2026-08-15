/** Agency workspace — client management.
 *  Client list with search, expandable booking history, add/edit modal, and delete confirmation. */
"use client";

import { useCallback, useEffect, useState } from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import { agencyApi, type ApiClient, type ApiBooking, type BillingSale } from "@/lib/api/agency";

export default function AgencyClientsPage() {
  const { t, locale } = useLocale();
  const tc = t.agencyWs.clients;
  const localeTag = locale === "es" ? "es-ES" : locale === "pt" ? "pt-PT" : "en-US";

  const [clients, setClients] = useState<ApiClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingClient, setEditingClient] = useState<ApiClient | null>(null);
  const [deletingClient, setDeletingClient] = useState<ApiClient | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [bookingsCache, setBookingsCache] = useState<Record<number, ApiBooking[]>>({});
  const [bookingsLoading, setBookingsLoading] = useState<Record<number, boolean>>({});
  const [buyingAgencies, setBuyingAgencies] = useState<{ name: string; bookings: number; revenue: number }[]>([]);

  const fetchClients = useCallback(async () => {
    setLoading(true);
    try {
      const res = await agencyApi.listClients({ per_page: 100 });
      setClients(res.clients);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
    // Fetch buying agencies (other agencies that purchased our retreats)
    agencyApi.getBilling({ per_page: 100 }).then((res) => {
      const agencyMap = new Map<string, { bookings: number; revenue: number }>();
      for (const sale of res.sales) {
        if (!sale.buying_agency) continue;
        const existing = agencyMap.get(sale.buying_agency);
        if (existing) {
          existing.bookings++;
          existing.revenue += sale.amount_cents;
        } else {
          agencyMap.set(sale.buying_agency, { bookings: 1, revenue: sale.amount_cents });
        }
      }
      setBuyingAgencies(
        Array.from(agencyMap.entries()).map(([name, data]) => ({ name, ...data }))
      );
    }).catch(() => {});
  }, [fetchClients]);

  const filtered = clients.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q)
    );
  });

  function formatDate(iso: string): string {
    const d = new Date(iso);
    return new Intl.DateTimeFormat(localeTag, {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(d);
  }

  function formatShort(iso: string): string {
    const d = new Date(iso + "T00:00:00");
    return new Intl.DateTimeFormat(localeTag, { day: "numeric", month: "short" }).format(d);
  }

  const fmt = (cents: number) =>
    new Intl.NumberFormat(localeTag, { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(cents / 100);

  async function handleDelete() {
    if (!deletingClient) return;
    try {
      await agencyApi.deleteClient(deletingClient.id);
      setDeletingClient(null);
      fetchClients();
    } catch {
      // ignore
    }
  }

  async function toggleExpand(clientId: number) {
    if (expandedId === clientId) {
      setExpandedId(null);
      return;
    }
    setExpandedId(clientId);

    // Load bookings if not cached
    if (!bookingsCache[clientId]) {
      setBookingsLoading((prev) => ({ ...prev, [clientId]: true }));
      try {
        const res = await agencyApi.listBookings({ client_id: clientId, per_page: 50 });
        setBookingsCache((prev) => ({ ...prev, [clientId]: res.bookings }));
      } catch {
        setBookingsCache((prev) => ({ ...prev, [clientId]: [] }));
      } finally {
        setBookingsLoading((prev) => ({ ...prev, [clientId]: false }));
      }
    }
  }

  return (
    <div className="mx-auto max-w-[1400px] px-10 py-10">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between animate-fade-in-up">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
            {tc.eyebrow}
          </p>
          <h1 className="mt-2 text-[32px] font-bold text-humana-ink">
            {tc.title}
          </h1>
          <p className="mt-1 text-[14px] text-humana-muted">{tc.subtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-humana-subtle"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={tc.searchPlaceholder}
              className="w-[232px] rounded-lg border border-humana-line bg-white py-2.5 pl-9 pr-4 text-[13px] text-humana-ink outline-none placeholder:text-humana-subtle focus:border-humana-gold"
            />
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="cursor-pointer rounded-lg bg-humana-ink px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.18em] text-white transition-opacity hover:opacity-85"
          >
            {tc.addClient}
          </button>
        </div>
      </div>

      {/* Client list */}
      {loading ? (
        <div className="flex h-64 items-center justify-center rounded-xl border border-humana-line bg-white">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-humana-line border-t-humana-gold" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-humana-line bg-white py-24 text-center">
          <p className="text-[18px] font-medium text-humana-ink">{tc.empty}</p>
          <p className="mt-2 max-w-md text-[14px] text-humana-muted">
            {tc.emptyHint}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          {/* Column headers */}
          <div className="flex items-center px-5 py-1.5">
            <div className="mr-2.5 w-4 shrink-0" />
            <div className="w-[232px] shrink-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-humana-subtle">{tc.columns.name}</p>
            </div>
            <div className="min-w-0 flex-1 px-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-humana-subtle">{tc.columns.email}</p>
            </div>
            <div className="w-[172px] shrink-0 px-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-humana-subtle">{tc.columns.phone}</p>
            </div>
            <div className="w-[212px] shrink-0 px-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-humana-subtle">{tc.columns.notes}</p>
            </div>
            <div className="w-[132px] shrink-0 px-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-humana-subtle">{tc.columns.created}</p>
            </div>
            <div className="w-[64px] shrink-0" />
          </div>

          {filtered.map((client) => {
            const isExpanded = expandedId === client.id;
            const clientBookings = bookingsCache[client.id];
            const isLoadingBookings = bookingsLoading[client.id];

            return (
              <article
                key={client.id}
                className="overflow-hidden rounded-xl border border-humana-line bg-white transition-all duration-200 hover:shadow-md"
              >
                {/* Collapsed row */}
                <div
                  className="flex cursor-pointer items-center px-5 py-2.5 transition-colors hover:bg-humana-stone/30"
                  onClick={() => toggleExpand(client.id)}
                >
                  {/* Chevron */}
                  <div className="mr-2.5 flex w-4 shrink-0 items-center justify-center">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`text-humana-subtle transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </div>

                  {/* Name */}
                  <div className="w-[232px] shrink-0">
                    <p className="truncate text-[14px] font-medium text-humana-ink">
                      {client.name}
                    </p>
                  </div>

                  {/* Email */}
                  <div className="min-w-0 flex-1 px-3">
                    <p className="truncate text-[13px] text-humana-muted">
                      {client.email}
                    </p>
                  </div>

                  {/* Phone */}
                  <div className="w-[172px] shrink-0 px-3">
                    <p className="truncate text-[13px] text-humana-ink">
                      {client.phone ?? "\u2014"}
                    </p>
                  </div>

                  {/* Notes */}
                  <div className="w-[212px] shrink-0 px-3">
                    <p className="truncate text-[13px] text-humana-muted">
                      {client.notes ?? "\u2014"}
                    </p>
                  </div>

                  {/* Created */}
                  <div className="w-[132px] shrink-0 px-3">
                    <p className="text-[13px] text-humana-muted">
                      {formatDate(client.created_at)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex w-[64px] shrink-0 items-center justify-end gap-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); setEditingClient(client); }}
                      title={tc.columns.actions}
                      className="cursor-pointer flex h-7 w-7 items-center justify-center rounded-full border border-humana-line text-humana-subtle transition-colors hover:border-humana-ink hover:text-humana-ink"
                    >
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                        <path d="m15 5 4 4" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setDeletingClient(client); }}
                      title={tc.deleteTitle}
                      className="cursor-pointer flex h-7 w-7 items-center justify-center rounded-full border border-humana-line text-humana-subtle transition-colors hover:border-red-400 hover:text-red-400"
                    >
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Expanded booking details */}
                {isExpanded && (
                  <div className="border-t border-humana-line bg-[#fafaf7] px-6 py-5 animate-[fade-in-up_0.2s_ease]">
                    {isLoadingBookings ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-humana-line border-t-humana-gold" />
                      </div>
                    ) : !clientBookings || clientBookings.length === 0 ? (
                      <p className="py-6 text-center text-[14px] text-humana-muted">
                        {tc.noBookings}
                      </p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px]">
                          <thead>
                            <tr className="border-b border-humana-line/60">
                              <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-[0.18em] text-humana-subtle">{t.agencyWs.bookings.columns.type}</th>
                              <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-[0.18em] text-humana-subtle">{t.agencyWs.bookings.columns.reference}</th>
                              <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-[0.18em] text-humana-subtle">{t.agencyWs.bookings.columns.hotel}</th>
                              <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-[0.18em] text-humana-subtle">{t.agencyWs.bookings.columns.experience}</th>
                              <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-[0.18em] text-humana-subtle">{t.agencyWs.bookings.columns.dates}</th>
                              <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-[0.18em] text-humana-subtle">{t.agencyWs.bookings.columns.guests}</th>
                              <th className="px-3 py-2 text-right text-[10px] font-bold uppercase tracking-[0.18em] text-humana-subtle">{t.agencyWs.bookings.columns.amount}</th>
                              <th className="px-3 py-2 text-right text-[10px] font-bold uppercase tracking-[0.18em] text-humana-subtle">{t.agencyWs.bookings.columns.commission}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {clientBookings.map((booking, idx) => {
                              const isRetreat = !!booking.experience;
                              return (
                                <tr
                                  key={booking.id}
                                  className={`border-b border-humana-line/40 ${idx % 2 === 1 ? "bg-white/50" : ""}`}
                                >
                                  <td className="px-3 py-2.5">
                                    <span className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] ${isRetreat ? "border-indigo-200 bg-indigo-50 text-indigo-600" : "border-teal-200 bg-teal-50 text-teal-600"}`}>
                                      {isRetreat ? tc.bookingType.retreat : tc.bookingType.lodging}
                                    </span>
                                  </td>
                                  <td className="px-3 py-2.5">
                                    <span className="text-[12px] font-semibold tracking-wide text-humana-ink">{booking.reference}</span>
                                  </td>
                                  <td className="px-3 py-2.5">
                                    <span className="text-[12px] text-humana-ink">{booking.hotel?.name ?? booking.experience?.hotel?.name ?? "\u2014"}</span>
                                  </td>
                                  <td className="px-3 py-2.5">
                                    <span className="text-[12px] text-humana-ink">
                                      {isRetreat ? (booking.experience?.title ?? "\u2014") : (booking.room_type?.name ?? "\u2014")}
                                    </span>
                                  </td>
                                  <td className="px-3 py-2.5">
                                    <span className="whitespace-nowrap text-[12px] text-humana-ink">
                                      {formatShort(booking.starts_on)} &ndash; {formatShort(booking.ends_on)}
                                    </span>
                                  </td>
                                  <td className="px-3 py-2.5">
                                    <span className="text-[12px] text-humana-ink">{booking.guests}</span>
                                  </td>
                                  <td className="px-3 py-2.5 text-right">
                                    <span className="whitespace-nowrap text-[12px] font-semibold text-humana-ink">{fmt(booking.amount_cents)}</span>
                                  </td>
                                  <td className="px-3 py-2.5 text-right">
                                    <span className="whitespace-nowrap text-[12px] font-semibold text-humana-gold">{fmt(booking.commission_cents)}</span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      {/* Buying agencies section */}
      {buyingAgencies.length > 0 && (
        <div className="mt-10">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
            {tc.buyingAgencies}
          </p>
          <div className="flex flex-col gap-1.5">
            {buyingAgencies.map((agency) => (
              <div key={agency.name} className="flex items-center rounded-xl border border-humana-line bg-white px-5 py-2.5">
                <div className="mr-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-humana-gold/10">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 21h18M5 21V7l8-4v18M13 21V3l6 3v15" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-medium text-humana-ink">{agency.name}</p>
                </div>
                <div className="px-3 text-center">
                  <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-humana-gold/10 px-1.5 text-[11px] font-bold text-humana-gold">
                    {agency.bookings}
                  </span>
                </div>
                <div className="w-[132px] shrink-0 text-right">
                  <span className="text-[13px] font-semibold text-humana-ink">{fmt(agency.revenue)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {(showAddModal || editingClient) && (
        <ClientModal
          client={editingClient}
          tc={tc}
          onClose={() => {
            setShowAddModal(false);
            setEditingClient(null);
          }}
          onSaved={() => {
            setShowAddModal(false);
            setEditingClient(null);
            fetchClients();
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-[400px] rounded-2xl bg-white p-8 shadow-xl animate-[fade-in-scale_0.25s_ease]">
            {/* Warning icon */}
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-red-500"
              >
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <h3 className="text-center text-[18px] font-semibold text-humana-ink">
              {tc.deleteTitle}
            </h3>
            <p className="mt-2 text-center text-[14px] text-humana-muted">
              {tc.deleteMessage}
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeletingClient(null)}
                className="cursor-pointer flex-1 rounded-lg border border-humana-line py-2.5 text-[13px] font-semibold uppercase tracking-[0.22em] text-humana-ink transition-colors hover:bg-humana-stone"
              >
                {tc.deleteCancel}
              </button>
              <button
                onClick={handleDelete}
                className="cursor-pointer flex-1 rounded-lg bg-red-500 py-2.5 text-[13px] font-semibold uppercase tracking-[0.22em] text-white transition-opacity hover:opacity-85"
              >
                {tc.deleteConfirm}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* --- Add / Edit Client Modal --- */

function ClientModal({
  client,
  tc,
  onClose,
  onSaved,
}: {
  client: ApiClient | null;
  tc: {
    modal: {
      addTitle: string;
      editTitle: string;
      namePlaceholder: string;
      emailPlaceholder: string;
      phonePlaceholder: string;
      notesPlaceholder: string;
      save: string;
      saving: string;
      cancel: string;
    };
    columns: { name: string; email: string; phone: string; notes: string };
  };
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!client;
  const [name, setName] = useState(client?.name ?? "");
  const [email, setEmail] = useState(client?.email ?? "");
  const [phone, setPhone] = useState(client?.phone ?? "");
  const [notes, setNotes] = useState(client?.notes ?? "");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setSaving(true);
    try {
      if (isEdit && client) {
        await agencyApi.updateClient(client.id, {
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          notes: notes.trim() || undefined,
        } as { name: string; email: string; phone: string; notes: string });
      } else {
        await agencyApi.createClient({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          notes: notes.trim() || undefined,
        });
      }
      onSaved();
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-[480px] rounded-2xl bg-white p-8 shadow-xl animate-[fade-in-scale_0.25s_ease]">
        <h3 className="text-[20px] font-semibold text-humana-ink">
          {isEdit ? tc.modal.editTitle : tc.modal.addTitle}
        </h3>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          {/* Name */}
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-subtle">
              {tc.columns.name} *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={tc.modal.namePlaceholder}
              className="w-full rounded-lg border border-humana-line bg-white px-4 py-2.5 text-[14px] text-humana-ink outline-none placeholder:text-humana-subtle focus:border-humana-gold"
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-subtle">
              {tc.columns.email} *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={tc.modal.emailPlaceholder}
              className="w-full rounded-lg border border-humana-line bg-white px-4 py-2.5 text-[14px] text-humana-ink outline-none placeholder:text-humana-subtle focus:border-humana-gold"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-subtle">
              {tc.columns.phone}
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={tc.modal.phonePlaceholder}
              className="w-full rounded-lg border border-humana-line bg-white px-4 py-2.5 text-[14px] text-humana-ink outline-none placeholder:text-humana-subtle focus:border-humana-gold"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-subtle">
              {tc.columns.notes}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={tc.modal.notesPlaceholder}
              rows={3}
              className="w-full resize-none rounded-lg border border-humana-line bg-white px-4 py-2.5 text-[14px] text-humana-ink outline-none placeholder:text-humana-subtle focus:border-humana-gold"
            />
          </div>

          {/* Actions */}
          <div className="mt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer flex-1 rounded-lg border border-humana-line py-2.5 text-[13px] font-semibold uppercase tracking-[0.22em] text-humana-ink transition-colors hover:bg-humana-stone"
            >
              {tc.modal.cancel}
            </button>
            <button
              type="submit"
              disabled={saving}
              className="cursor-pointer flex-1 rounded-lg bg-humana-ink py-2.5 text-[13px] font-semibold uppercase tracking-[0.22em] text-white transition-opacity hover:opacity-85 disabled:opacity-50"
            >
              {saving ? tc.modal.saving : tc.modal.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
