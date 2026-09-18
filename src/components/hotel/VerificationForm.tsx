"use client";

/**
 * The organization's legal identity, shared by the hotel onboarding wizard
 * (step 1) and the hotel settings "Verification" card so both screens capture
 * exactly the same fields. The parent owns the value and the persistence.
 */

import { useLocale } from "@/i18n/LocaleProvider";
import { DocumentUpload } from "@/components/hotel/DocumentUpload";
import {
  SECTION_CLASS,
  TextField,
  type PropertyFormVariant,
} from "@/components/hotel/PropertyFormBlocks";
import type { OrgVerificationUpdate, SocialLinkKey } from "@/lib/api/hotel";

/** Brand names stay untranslated; "other" is the only labelled network. */
const SOCIAL_FIELDS: { key: SocialLinkKey; label: string | null }[] = [
  { key: "instagram", label: "Instagram" },
  { key: "facebook", label: "Facebook" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "tiktok", label: "TikTok" },
  { key: "youtube", label: "YouTube" },
  { key: "other", label: null },
];

export type VerificationFormProps = {
  value: OrgVerificationUpdate;
  onChange: (next: OrgVerificationUpdate) => void;
  variant?: PropertyFormVariant;
};

export function VerificationForm({
  value,
  onChange,
  variant = "wizard",
}: VerificationFormProps) {
  const { t } = useLocale();
  const h = t.onboarding.hotel;

  const setField = <K extends keyof OrgVerificationUpdate>(
    key: K,
    next: OrgVerificationUpdate[K],
  ) => onChange({ ...value, [key]: next });

  const setSocial = (key: SocialLinkKey, next: string) =>
    onChange({ ...value, social_links: { ...value.social_links, [key]: next } });

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className={SECTION_CLASS[variant]}>{h.verificationSectionTitle}</h3>
        <p className="mt-1.5 text-[13px] leading-relaxed text-humana-muted">
          {h.verificationIntro}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <TextField
          label={h.legalNameLabel}
          value={value.legal_name}
          onValueChange={(v) => setField("legal_name", v)}
          variant={variant}
        />
        <TextField
          label={h.businessNameLabel}
          value={value.business_name}
          onValueChange={(v) => setField("business_name", v)}
          variant={variant}
        />
        <TextField
          label={h.taxIdLabel}
          value={value.tax_id}
          onValueChange={(v) => setField("tax_id", v)}
          variant={variant}
        />
        <TextField
          label={h.commercialRegistrationLabel}
          value={value.commercial_registration}
          onValueChange={(v) => setField("commercial_registration", v)}
          variant={variant}
        />
        <TextField
          label={h.primaryContactLabel}
          value={value.primary_contact}
          onValueChange={(v) => setField("primary_contact", v)}
          variant={variant}
        />
        <TextField
          label={h.primaryContactRoleLabel}
          value={value.primary_contact_role}
          onValueChange={(v) => setField("primary_contact_role", v)}
          variant={variant}
        />
        <TextField
          label={h.contactPhoneLabel}
          value={value.phone}
          onValueChange={(v) => setField("phone", v)}
          variant={variant}
        />
        <TextField
          label={h.contactEmailLabel}
          value={value.contact_email}
          onValueChange={(v) => setField("contact_email", v)}
          variant={variant}
        />
        <TextField
          label={h.websiteLabel}
          value={value.website}
          onValueChange={(v) => setField("website", v)}
          variant={variant}
          type="url"
          placeholder="https://"
          className="col-span-2"
        />
      </div>

      {/* Social media */}
      <div className="mt-2">
        <h4 className={SECTION_CLASS[variant]}>{h.socialLinksLabel}</h4>
        <div className="mt-3 grid grid-cols-2 gap-4">
          {SOCIAL_FIELDS.map(({ key, label }) => (
            <TextField
              key={key}
              label={label ?? h.socialOtherLabel}
              value={value.social_links[key] ?? ""}
              onValueChange={(v) => setSocial(key, v)}
              variant={variant}
              type="url"
              placeholder="https://"
            />
          ))}
        </div>
      </div>

      {/* Proof of ownership or representation */}
      <div className="mt-2 flex flex-col gap-2">
        <h4 className={SECTION_CLASS[variant]}>{h.ownershipDocumentLabel}</h4>
        <p className="text-[12px] text-humana-subtle">{h.ownershipDocumentHint}</p>
        <DocumentUpload
          value={value.ownership_document_url}
          onChange={(url) => setField("ownership_document_url", url)}
        />
      </div>

      {/* Authorisation declaration */}
      <label className="mt-2 flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={value.authorization_declared}
          onChange={(e) => setField("authorization_declared", e.target.checked)}
          className="mt-0.5 h-[16px] w-[16px] shrink-0 cursor-pointer rounded border-humana-line accent-humana-ink"
        />
        <span className="text-[13px] leading-[18px] text-humana-muted">
          {h.declarationLabel}
        </span>
      </label>
    </div>
  );
}
