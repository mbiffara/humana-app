/** Confirmation dialog for suspending a user. */
"use client";

import { useState } from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import { adminApi } from "@/lib/api/admin";
import type { User } from "@/lib/types";

interface SuspendModalProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function SuspendModal({ open, user, onClose, onSuccess }: SuspendModalProps) {
  const { t } = useLocale();
  const [submitting, setSubmitting] = useState(false);

  async function handleSuspend() {
    if (!user) return;
    setSubmitting(true);
    try {
      await adminApi.suspendUser(user.id);
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
  const roleDescription = `${orgKind.charAt(0).toUpperCase() + orgKind.slice(1)} · ${user.role.charAt(0).toUpperCase() + user.role.slice(1)}`;

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
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
            <h3 className="text-[18px] font-semibold text-humana-ink">{t.admin.suspendModal.title}</h3>
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
            <p className="text-[12px] text-humana-muted truncate">{roleDescription} · {user.email}</p>
          </div>
        </div>

        {/* Description */}
        <p className="mx-7 mt-5 text-[14px] leading-relaxed text-humana-muted">
          {t.admin.suspendModal.message}
        </p>

        {/* Warning box */}
        <div className="mx-7 mt-4 flex gap-3 rounded-xl bg-red-50 border border-red-200/60 px-4 py-3.5">
          <svg className="mt-0.5 h-4 w-4 shrink-0 text-red-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <p className="text-[13px] leading-relaxed text-red-800">
            {t.admin.suspendModal.warning}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-7 pt-6 pb-7">
          <button
            onClick={onClose}
            className="cursor-pointer flex-1 rounded-lg border border-humana-line py-3 text-[13px] font-semibold uppercase tracking-[0.22em] text-humana-muted transition-colors hover:bg-humana-stone"
          >
            {t.common.cancel}
          </button>
          <button
            onClick={handleSuspend}
            disabled={submitting}
            className="cursor-pointer flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 py-3 text-[13px] font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:bg-red-700 disabled:opacity-60"
          >
            {submitting ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
                {t.admin.suspendModal.confirm}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
