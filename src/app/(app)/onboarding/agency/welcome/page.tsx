/** Agency onboarding welcome — AG-00d: account ready + feature cards. */
"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

/* ─── Feature cards data ─── */
const features = [
  {
    number: "1",
    title: "Explore Retreats",
    description: "Browse curated wellness retreats across the network.",
  },
  {
    number: "2",
    title: "Book Hotels",
    description: "Reserve accommodation directly at partner hotels.",
  },
  {
    number: "3",
    title: "Create Retreats",
    description: "Design and publish retreats at assigned hotel properties.",
  },
  {
    number: "4",
    title: "Track Commissions",
    description: "Manage billing and earn 16% commission on every booking.",
  },
];

export default function AgencyWelcomePage() {
  const router = useRouter();

  return (
    <div className="flex min-h-[calc(100vh-73px)] items-center justify-center px-6 py-16">
      <div className="flex w-full max-w-[860px] flex-col items-center text-center animate-[fade-in-up_0.5s_ease-out]">
        {/* Logo */}
        <div className="mb-3">
          <Image
            src="/brand/isotipo.png"
            alt="HUMANA"
            width={80}
            height={80}
            priority
          />
        </div>

        {/* HUMANA text */}
        <span className="mb-10 text-[14px] font-semibold uppercase tracking-[0.3em] text-humana-gold">
          HUMANA
        </span>

        {/* Eyebrow */}
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
          Welcome to HUMANA
        </span>

        {/* Title */}
        <h1 className="mt-3 text-[32px] font-light tracking-[-0.01em] text-humana-ink">
          Your agency account is ready.
        </h1>

        {/* Subtitle */}
        <p className="mt-2 max-w-[580px] text-[15px] leading-relaxed text-humana-muted">
          Choose your subscription plan to unlock all features and start
          connecting with hotels and retreats worldwide.
        </p>

        {/* Feature cards */}
        <div className="mt-12 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <div
              key={feature.number}
              className="flex flex-col items-center rounded-xl border border-humana-line bg-white px-5 py-8 text-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              style={{ animationDelay: `${0.1 + i * 0.08}s` }}
            >
              {/* Gold number */}
              <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-humana-gold/10 text-[18px] font-semibold text-humana-gold">
                {feature.number}
              </span>

              {/* Title */}
              <h3 className="mb-2 text-[14px] font-semibold text-humana-ink">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-[13px] leading-relaxed text-humana-muted">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA button */}
        <button
          onClick={() => router.push("/dashboard")}
          className="cursor-pointer mt-12 flex items-center justify-center gap-2 rounded-lg bg-humana-ink px-16 py-4 text-[13px] font-semibold uppercase tracking-[0.22em] text-white transition-all duration-200 hover:bg-black"
        >
          Choose your plan
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
            />
          </svg>
        </button>

        {/* Help text */}
        <p className="mt-6 text-[12px] text-humana-subtle">
          Need help? Contact{" "}
          <a
            href="mailto:support@humana.global"
            className="cursor-pointer text-humana-gold underline underline-offset-2 transition-colors hover:text-[#c5a030]"
          >
            support@humana.global
          </a>
        </p>
      </div>
    </div>
  );
}
