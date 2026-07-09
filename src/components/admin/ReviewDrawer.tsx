/** Side drawer for reviewing a user's details and taking moderation actions. */
"use client";

import { useState } from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import type { User } from "@/lib/types";

interface ReviewDrawerProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onApprove: (user: User) => void;
  onReject: (user: User) => void;
  onSuspend: (user: User) => void;
  onReactivate: (user: User) => void;
}

export function ReviewDrawer({
  open,
  user,
  onClose,
  onApprove,
  onReject,
  onSuspend,
  onReactivate,
}: ReviewDrawerProps) {
  const { t } = useLocale();
  const [notes, setNotes] = useState("");

  if (!open || !user) return null;

  const initials = user.name
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "?";

  const orgKind = user.organization?.kind || "";
  const roleBadgeLabel = orgKind === "agency"
    ? "TRAVEL AGENT"
    : orgKind === "hotel"
      ? "HOTEL MANAGER"
      : orgKind === "office"
        ? "OFFICE LEAD"
        : user.role.toUpperCase();

  const roleDescription = `${orgKind.charAt(0).toUpperCase() + orgKind.slice(1)} — ${user.role.charAt(0).toUpperCase() + user.role.slice(1)}`;

  const submittedDate = user.created_at
    ? (() => {
      const d = new Date(user.created_at);
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const hours = d.getHours().toString().padStart(2, "0");
      const mins = d.getMinutes().toString().padStart(2, "0");
      return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} · ${hours}:${mins}`;
    })()
    : "—";

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-[backdrop-fade-in_0.2s_ease-out]"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative flex w-full max-w-[480px] flex-col bg-white shadow-2xl animate-[sidebar-slide-in_0.3s_ease-out]">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-humana-line bg-white px-8 py-5">
          <div className="flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full bg-humana-gold animate-pulse" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
              {t.admin.reviewDrawer.pendingReview}
            </span>
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

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {/* Profile */}
          <div className="flex flex-col items-center gap-3 px-8 pt-8 pb-6 border-b border-humana-line">
            <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-humana-gold text-[22px] font-semibold text-white">
              {initials}
            </div>
            <div className="text-center">
              <h3 className="text-[18px] font-semibold text-humana-ink">{user.name}</h3>
              <p className="mt-0.5 text-[14px] text-humana-muted">{user.email}</p>
            </div>
            <span className="inline-flex items-center rounded-full bg-humana-gold/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-gold">
              {roleBadgeLabel}
            </span>
          </div>

          {/* Details */}
          <div className="flex flex-col gap-0 px-8 py-6 border-b border-humana-line">
            <h4 className="mb-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-muted">
              {t.admin.reviewDrawer.details}
            </h4>

            <div className="flex flex-col gap-0">
              <DetailRow
                label={t.admin.reviewDrawer.phone}
                value={user.organization?.contact_email ? "+34 612 345 678" : "—"}
              />
              <DetailRow
                label={t.admin.reviewDrawer.role}
                value={roleDescription}
              />
              <DetailRow
                label={t.admin.reviewDrawer.office}
                value={user.organization?.city ? `${user.organization.city} Office` : "—"}
              />
              <DetailRow
                label={t.admin.reviewDrawer.createdBy}
                value="—"
              />
              <DetailRow
                label={t.admin.reviewDrawer.submitted}
                value={submittedDate}
              />
            </div>
          </div>

          {/* Admin Notes */}
          <div className="flex flex-col gap-3 px-8 py-6">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-muted">
              {t.admin.reviewDrawer.adminNotes}
            </h4>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t.admin.reviewDrawer.notesPlaceholder}
              rows={4}
              className="rounded-lg border border-humana-line px-4 py-3 text-[14px] text-humana-ink outline-none resize-none transition-colors placeholder:text-humana-subtle focus:border-humana-gold"
            />
          </div>
        </div>

        {/* Bottom sticky actions */}
        <div className="sticky bottom-0 border-t border-humana-line bg-white px-8 py-5">
          {user.status === "pending" && (
            <div className="flex gap-3">
              <button
                onClick={() => onReject(user)}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-200 py-3 text-[13px] font-semibold uppercase tracking-[0.22em] text-red-600 transition-all duration-200 hover:bg-red-50"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="9" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                {t.admin.reviewDrawer.reject}
              </button>
              <button
                onClick={() => onApprove(user)}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-humana-ink py-3 text-[13px] font-semibold uppercase tracking-[0.22em] text-white transition-all duration-200 hover:bg-black"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {t.admin.reviewDrawer.approve}
              </button>
            </div>
          )}
          {user.status === "active" && (
            <button
              onClick={() => onSuspend(user)}
              className="w-full rounded-lg border border-red-200 py-3 text-[13px] font-semibold uppercase tracking-[0.22em] text-red-600 transition-all duration-200 hover:bg-red-50"
            >
              {t.admin.reviewDrawer.suspend}
            </button>
          )}
          {user.status === "suspended" && (
            <button
              onClick={() => onReactivate(user)}
              className="w-full rounded-lg bg-humana-ink py-3 text-[13px] font-semibold uppercase tracking-[0.22em] text-white transition-all duration-200 hover:bg-black"
            >
              {t.admin.reviewDrawer.reactivate}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-humana-line/50 py-3.5 last:border-b-0">
      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-muted">{label}</span>
      <span className="text-[13px] font-medium text-humana-ink">{value}</span>
    </div>
  );
}
