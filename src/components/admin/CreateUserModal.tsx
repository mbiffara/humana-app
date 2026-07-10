/** Modal for inviting a new user to the platform. */
"use client";

import { useState, useEffect } from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import { adminApi } from "@/lib/api/admin";
import { ApiError } from "@/lib/api";
import type { Organization } from "@/lib/types";

interface CreateUserModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  organizations: Organization[];
}

export function CreateUserModal({ open, onClose, onSuccess, organizations }: CreateUserModalProps) {
  const { t } = useLocale();
  const [role, setRole] = useState<"agency" | "hotel" | "office">("agency");
  const [email, setEmail] = useState("");
  const [orgId, setOrgId] = useState<number | "">("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (open) {
      setRole("agency");
      setEmail("");
      setOrgId("");
      setError("");
      setSuccess(false);
    }
  }, [open]);

  const filteredOrgs = organizations.filter((o) => o.kind === role);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!orgId) return;
    setSubmitting(true);
    setError("");
    try {
      await adminApi.inviteUser({ email, role: "member", organization_id: Number(orgId) });
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to send invitation");
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-[backdrop-fade-in_0.2s_ease-out]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-[480px] rounded-2xl bg-white shadow-2xl animate-[fade-in-scale_0.3s_ease-out]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-humana-line px-8 py-5">
          <h2 className="text-[18px] font-semibold text-humana-ink">{t.admin.invite.title}</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-humana-muted transition-colors hover:bg-humana-stone"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 px-8 py-6">
          {/* Role selection */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-muted">
              {t.admin.invite.selectRole}
            </label>
            <div className="flex gap-2">
              {(["agency", "hotel", "office"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => { setRole(r); setOrgId(""); }}
                  className={`flex-1 rounded-lg border py-2.5 text-[13px] font-medium transition-all duration-200 ${
                    role === r
                      ? "border-humana-gold bg-humana-gold/10 text-humana-gold"
                      : "border-humana-line text-humana-muted hover:border-humana-gold/40"
                  }`}
                >
                  {t.admin.invite.roles[r]}
                </button>
              ))}
            </div>
          </div>

          {/* Organization */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-muted">
              {t.admin.invite.office}
            </label>
            <select
              value={orgId}
              onChange={(e) => setOrgId(Number(e.target.value))}
              required
              className="rounded-lg border border-humana-line bg-white px-4 py-3 text-[14px] text-humana-ink outline-none transition-colors focus:border-humana-gold"
            >
              <option value="">Select organization...</option>
              {filteredOrgs.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name} — {org.city}, {org.country}
                </option>
              ))}
            </select>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-muted">
              {t.admin.invite.email}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.admin.invite.emailPlaceholder}
              className="rounded-lg border border-humana-line px-4 py-3 text-[14px] text-humana-ink outline-none transition-colors placeholder:text-humana-subtle focus:border-humana-gold"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-2 text-[13px] text-red-600 animate-[fade-in-up_0.2s_ease-out]">
              {error}
            </p>
          )}

          {success && (
            <p className="rounded-lg bg-emerald-50 px-4 py-2 text-[13px] text-emerald-700 animate-[fade-in-up_0.2s_ease-out]">
              {t.admin.invite.success}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting || success}
            className="flex items-center justify-center gap-2 rounded-lg bg-humana-ink py-3.5 text-[13px] font-semibold uppercase tracking-[0.22em] text-white transition-all duration-200 hover:bg-black disabled:opacity-60"
          >
            {submitting ? t.admin.invite.sending : success ? "✓" : t.admin.invite.send}
          </button>
        </form>
      </div>
    </div>
  );
}
