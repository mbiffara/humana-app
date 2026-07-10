/** Shared header for all onboarding pages — full logo + role badge + step indicator. */
import Image from "next/image";
import { useLocale } from "@/i18n/LocaleProvider";

interface OnboardingHeaderProps {
  role: "office" | "agency" | "hotel";
  currentStep: number;
  totalSteps: number;
}

const badgeTextColors: Record<string, string> = {
  office: "text-emerald-400",
  agency: "text-amber-400",
  hotel: "text-blue-400",
};

export default function OnboardingHeader({ role, currentStep, totalSteps }: OnboardingHeaderProps) {
  const { t } = useLocale();
  const badgeLabels = t.onboarding.header;
  const label = badgeLabels[role] || role;

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-humana-line bg-white/95 px-8 py-4 backdrop-blur-sm animate-[fade-in-down_0.4s_ease-out] sm:px-16">
      <div className="flex items-center gap-3">
        <Image
          src="/brand/isotipo.png"
          alt="HUMANA"
          width={32}
          height={32}
          priority
        />
        <Image
          src="/brand/humana-text.svg"
          alt=""
          width={140}
          height={44}
          className="h-[28px] w-auto"
          priority
        />
        <span
          className={`ml-1 rounded bg-humana-ink px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${badgeTextColors[role]}`}
        >
          {label}
        </span>
      </div>
      <span className="text-[12px] font-medium text-humana-subtle">
        {t.onboarding.stepOf(currentStep, totalSteps)}
      </span>
    </nav>
  );
}
