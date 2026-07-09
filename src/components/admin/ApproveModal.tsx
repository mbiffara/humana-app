/** Confirmation dialog for approving a pending user. */
"use client";

import { useState } from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import { adminApi } from "@/lib/api/admin";
import type { User } from "@/lib/types";

interface ApproveModalProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function ApproveModal({ open, user, onClose, onSuccess }: ApproveModalProps) {
  const { t } = useLocale();
  const [submitting, setSubmitting] = useState(false);

  async function handleApprove() {
    if (!user) return;
    setSubmitting(true);
    try {
      await adminApi.approveUser(user.id);
      onSuccess();
      onClose();
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
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
              <svg className="h-5 w-5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-[18px] font-semibold text-humana-ink">{t.admin.approve.title}</h3>
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

        {/* Description */}
        <p className="mx-7 mt-5 text-[14px] leading-relaxed text-humana-muted">
          {t.admin.approve.message}
        </p>

        {/* Info box */}
        <div className="mx-7 mt-4 flex gap-3 rounded-xl bg-amber-50 border border-amber-200/60 px-4 py-3.5">
          <svg className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
          </svg>
          <p className="text-[13px] leading-relaxed text-amber-800">
            {t.admin.approve.notification}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-7 pt-6 pb-7">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-humana-line py-3 text-[13px] font-semibold uppercase tracking-[0.22em] text-humana-muted transition-colors hover:bg-humana-stone"
          >
            {t.common.cancel}
          </button>
          <button
            onClick={handleApprove}
            disabled={submitting}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-humana-ink py-3 text-[13px] font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:bg-black disabled:opacity-60"
          >
            {submitting ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {t.admin.approve.confirm}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
