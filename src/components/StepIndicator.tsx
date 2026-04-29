"use client";

import Link from "next/link";

const stepRoutes = [
  "/create-retreat/step-1",
  "/create-retreat/step-2",
  "/create-retreat/step-3",
  "/create-retreat/step-4",
  "/create-retreat/step-5",
  "/create-retreat/step-6",
];

export function StepIndicator({
  steps,
  currentStep,
  className,
}: {
  steps: string[];
  currentStep: number;
  className?: string;
}) {
  return (
    <div className={className ?? "flex items-center justify-center gap-0 px-16 py-6"}>
      {steps.map((label, i) => {
        const isCompleted = i < currentStep;
        const isActive = i === currentStep;
        const href = stepRoutes[i];

        const circle = (
          <div
            className={`flex h-7 w-7 items-center justify-center rounded-full text-[12px] font-semibold transition-all duration-200 ${
              isCompleted
                ? "bg-humana-gold text-white"
                : isActive
                  ? "bg-humana-ink text-white"
                  : "bg-humana-stone text-humana-muted"
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
              i + 1
            )}
          </div>
        );

        const text = (
          <span
            className={`text-[12px] font-medium uppercase tracking-[0.14em] transition-colors ${
              isCompleted
                ? "text-humana-gold"
                : isActive
                  ? "text-humana-ink"
                  : "text-humana-muted"
            }`}
          >
            {label}
          </span>
        );

        const content = (
          <div className="flex items-center gap-2.5">
            {circle}
            {text}
          </div>
        );

        return (
          <div key={i} className="flex items-center">
            {i > 0 && (
              <div
                className={`mx-3 h-px w-8 ${
                  i <= currentStep ? "bg-humana-gold" : "bg-humana-line"
                }`}
              />
            )}
            {isCompleted ? (
              <Link href={href} className="transition-opacity hover:opacity-80">
                {content}
              </Link>
            ) : (
              <div className={isActive ? "" : "opacity-50"}>{content}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
