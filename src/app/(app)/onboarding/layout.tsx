/** Minimal onboarding layout — no nav (each page renders OnboardingHeader directly). */
"use client";

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-humana-stone">
      <main className="flex-1">{children}</main>
    </div>
  );
}
