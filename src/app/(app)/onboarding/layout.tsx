/** Minimal onboarding layout — HUMANA logo header only, no nav links. */
"use client";

import Image from "next/image";
import Link from "next/link";

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-humana-stone">
      <nav className="flex items-center justify-center border-b border-humana-line bg-white/95 px-16 py-5 backdrop-blur-sm">
        <Link href="/dashboard" className="flex items-center gap-3">
          <Image src="/brand/isotipo.png" alt="HUMANA" width={32} height={32} priority />
          <Image src="/brand/humana-text.svg" alt="" width={140} height={44} className="h-[30px] w-auto" priority />
        </Link>
      </nav>
      <main className="flex-1">{children}</main>
    </div>
  );
}
