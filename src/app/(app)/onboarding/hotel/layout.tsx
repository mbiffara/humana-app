"use client";

import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { HotelWizardProvider, useHotelWizard } from "@/contexts/HotelWizardContext";

const STEPS = [
  { number: 1, label: "Identity", path: "/onboarding/hotel/step-1" },
  { number: 2, label: "Rooms", path: "/onboarding/hotel/step-2" },
  { number: 3, label: "Amenities", path: "/onboarding/hotel/step-3" },
  { number: 4, label: "Photos", path: "/onboarding/hotel/step-4" },
];

function StepProgressBar() {
  const pathname = usePathname();

  const currentStepIndex = STEPS.findIndex((s) => pathname === s.path);
  const activeIndex = currentStepIndex >= 0 ? currentStepIndex : 0;

  return (
    <div className="flex items-center gap-0">
      {STEPS.map((step, i) => {
        const isCompleted = i < activeIndex;
        const isActive = i === activeIndex;

        return (
          <div key={step.number} className="flex items-center">
            {i > 0 && (
              <div
                className={`mx-2 h-px w-10 transition-colors duration-300 ${
                  i <= activeIndex ? "bg-humana-gold" : "bg-humana-line"
                }`}
              />
            )}
            <div className="flex items-center gap-2">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold transition-all duration-300 ${
                  isCompleted
                    ? "bg-humana-gold text-white"
                    : isActive
                      ? "border-2 border-humana-gold bg-transparent text-humana-gold"
                      : "border border-humana-line bg-transparent text-humana-muted"
                }`}
              >
                {isCompleted ? (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  step.number
                )}
              </div>
              <span
                className={`text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors duration-300 ${
                  isCompleted
                    ? "text-humana-gold"
                    : isActive
                      ? "text-humana-ink"
                      : "text-humana-muted/50"
                }`}
              >
                {step.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function BottomBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { state } = useHotelWizard();

  const currentStepIndex = STEPS.findIndex((s) => pathname === s.path);
  const activeIndex = currentStepIndex >= 0 ? currentStepIndex : 0;
  const isLastStep = activeIndex === STEPS.length - 1;
  const isFirstStep = activeIndex === 0;

  // Hide bottom bar on under-review page
  if (pathname.includes("under-review")) return null;

  function handleBack() {
    if (activeIndex > 0) {
      router.push(STEPS[activeIndex - 1].path);
    }
  }

  function handleNext() {
    if (isLastStep) {
      router.push("/onboarding/hotel/under-review");
    } else {
      router.push(STEPS[activeIndex + 1].path);
    }
  }

  // Validation per step
  function canProceed(): boolean {
    switch (activeIndex) {
      case 0:
        return state.hotelName.trim().length > 0 && state.address.trim().length > 0;
      case 1:
        return state.roomTypes.length > 0;
      case 2:
        return state.amenities.length > 0 || state.customAmenities.length > 0;
      case 3:
        return state.photos.length >= 1;
      default:
        return true;
    }
  }

  return (
    <div className="sticky bottom-0 z-40 flex items-center justify-between border-t border-humana-line bg-white px-16 py-4">
      {/* Back */}
      <div className="w-[160px]">
        {!isFirstStep && (
          <button
            type="button"
            onClick={handleBack}
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
            Back
          </button>
        )}
      </div>

      {/* Step dots */}
      <div className="flex items-center gap-2">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === activeIndex
                ? "w-6 bg-humana-gold"
                : i < activeIndex
                  ? "w-1.5 bg-humana-gold/50"
                  : "w-1.5 bg-humana-line"
            }`}
          />
        ))}
      </div>

      {/* Next / Publish */}
      <div className="flex w-[160px] justify-end">
        <button
          type="button"
          onClick={handleNext}
          disabled={!canProceed()}
          className={`cursor-pointer flex items-center gap-2 px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.22em] transition-all duration-200 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none ${
            isLastStep
              ? "bg-humana-ink text-white hover:bg-black"
              : "bg-humana-ink text-white hover:bg-black"
          }`}
        >
          {isLastStep ? "Publish Property" : "Next"}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke={isLastStep ? "#d4af37" : "currentColor"}
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

function HotelWizardLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Hide wizard chrome on under-review page
  const isUnderReview = pathname.includes("under-review");

  return (
    <div className="flex min-h-screen flex-col bg-humana-stone">
      {/* ─── Top Bar ─── */}
      <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-humana-line bg-white/95 px-16 py-4 backdrop-blur-sm animate-[fade-in-down_0.4s_ease-out]">
        {/* Left: Logo */}
        <Link
          href="/dashboard"
          className="cursor-pointer flex items-center gap-3 transition-opacity hover:opacity-80"
        >
          <Image
            src="/brand/isotipo.png"
            alt="HUMANA"
            width={32}
            height={32}
            priority
          />
        </Link>

        {/* Center: Step progress */}
        {!isUnderReview && <StepProgressBar />}

        {/* Right: Links */}
        <div className="flex items-center gap-5">
          <button
            type="button"
            className="cursor-pointer text-[12px] font-medium text-humana-muted underline decoration-humana-line underline-offset-2 transition-colors hover:text-humana-ink hover:decoration-humana-ink"
          >
            Questions?
          </button>
          <span className="h-3.5 w-px bg-humana-line" />
          <Link
            href="/dashboard"
            className="cursor-pointer text-[12px] font-medium text-humana-muted transition-colors hover:text-humana-ink"
          >
            Save &amp; exit
          </Link>
        </div>
      </nav>

      {/* ─── Content ─── */}
      <main className="flex-1">{children}</main>

      {/* ─── Bottom Bar ─── */}
      {!isUnderReview && <BottomBar />}
    </div>
  );
}

export default function HotelWizardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <HotelWizardProvider>
      <HotelWizardLayoutInner>{children}</HotelWizardLayoutInner>
    </HotelWizardProvider>
  );
}
