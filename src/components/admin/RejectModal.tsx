/** Modal for rejecting a user with a required reason. */
"use client";

import { useState } from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import { adminApi } from "@/lib/api/admin";
import type { User } from "@/lib/types";

interface RejectModalProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function RejectModal({ open, user, onClose, onSuccess }: RejectModalProps) {
  const { t } = useLocale();
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleReject() {
    if (!user || !reason.trim()) return;
    setSubmitting(true);
    try {
      await adminApi.rejectUser(user.id, reason);
      onSuccess();
      onClose();
      setReason("");
    } finally {
      setSubmitting(false);
    }
  }

  if (!open || !user) return null;

  const initials = user.name
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "?";

  const orgKind = user.organization?.kind || "";
  const roleDescription = `${orgKind.charAt(0).toUpperCase() + orgKind.slice(1)} · ${user.role.charAt(0).toUpperCase() + user.role.slice(1)}${user.organization?.city ? ` · ${user.organization.city} Office` : ""}`;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-[backdrop-fade-in_0.15s_ease-out]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-[480px] rounded-2xl bg-white shadow-2xl animate-[fade-in-scale_0.25s_ease-out]">
        {/* Header */}
        <div className="flex items-center justify-between px-7 pt-7 pb-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-[18px] font-semibold text-humana-ink">{t.admin.reject.title}</h3>
          </div>
          <button
            onClick={() => { onClose(); setReason(""); }}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-humana-muted transition-colors hover:bg-humana-stone"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* User card */}
        <div className="mx-7 mt-5 flex items-center gap-3 rounded-xl bg-humana-stone px-4 py-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-humana-gold/15 text-[12px] font-semibold text-humana-gold">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-[14px] font-medium text-humana-ink truncate">{user.name}</p>
            <p className="text-[12px] text-humana-muted truncate">{roleDescription}</p>
          </div>
        </div>

        {/* Reason textarea */}
        <div className="mx-7 mt-5 flex flex-col gap-2">
          <label className="text-[13px] font-medium text-humana-ink">
            {t.admin.reject.reason} <span className="text-red-500">*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={t.admin.reject.reasonPlaceholder}
            required
            rows={4}
            className="rounded-lg border border-humana-line px-4 py-3 text-[14px] text-humana-ink outline-none resize-none transition-colors placeholder:text-humana-subtle focus:border-red-300"
          />
          <p className="text-[12px] text-humana-muted leading-relaxed">
            {t.admin.reject.notification}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-7 pt-6 pb-7">
          <button
            onClick={() => { onClose(); setReason(""); }}
            className="flex-1 rounded-lg border border-humana-line py-3 text-[13px] font-semibold uppercase tracking-[0.22em] text-humana-muted transition-colors hover:bg-humana-stone"
          >
            {t.common.cancel}
          </button>
          <button
            onClick={handleReject}
            disabled={submitting || !reason.trim()}
            className="flex-1 rounded-lg bg-red-600 py-3 text-[13px] font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:bg-red-700 disabled:opacity-60"
          >
            {submitting ? (
              <div className="mx-auto h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              t.admin.reject.confirm
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
