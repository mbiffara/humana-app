/** KPI metric card with animated count-up effect. */
"use client";

import { useEffect, useRef, useState } from "react";

interface KpiCardProps {
  label: string;
  value: number | string;
  prefix?: string;
  icon: React.ReactNode;
  delay?: number;
  change?: string;
  subtitle?: string;
  tooltip?: string;
}

export function KpiCard({ label, value, prefix = "", icon, delay = 0, change, subtitle, tooltip }: KpiCardProps) {
  const [displayed, setDisplayed] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const numValue = typeof value === "number" ? value : 0;
  const isNumeric = typeof value === "number";
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isNumeric) return;
    const timer = setTimeout(() => {
      const duration = 800;
      const startTime = performance.now();
      function animate(currentTime: number) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplayed(Math.round(eased * numValue));
        if (progress < 1) requestAnimationFrame(animate);
      }
      requestAnimationFrame(animate);
    }, delay);
    return () => clearTimeout(timer);
  }, [numValue, isNumeric, delay]);

  return (
    <div
      ref={ref}
      className="group flex flex-col gap-3 rounded-[6px] border border-humana-line bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-humana-gold/5 hover:border-humana-gold/30"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {tooltip && (
            <div
              className="relative"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <span className="flex cursor-pointer text-humana-muted/50 transition-colors hover:text-humana-ink">
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" />
                </svg>
              </span>
              {showTooltip && (
                <div className="absolute bottom-full left-1/2 z-50 mb-2 w-52 -translate-x-1/2 rounded-lg bg-humana-ink px-3.5 py-2.5 text-[11px] leading-[16px] font-normal normal-case tracking-normal text-white shadow-lg animate-[fade-in-up_0.15s_ease-out]">
                  {tooltip}
                  <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-humana-ink" />
                </div>
              )}
            </div>
          )}
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-muted">
            {label}
          </span>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-humana-stone text-humana-gold transition-colors group-hover:bg-humana-gold/10">
          {icon}
        </div>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-[32px] font-semibold tracking-tight text-humana-ink">
          {prefix}{isNumeric ? displayed.toLocaleString() : value}
        </span>
      </div>
      {(change || subtitle) && (
        <div className="flex items-center gap-1.5 flex-wrap">
          {change && (
            <span className="text-[12px] font-medium text-emerald-600">
              {change}
            </span>
          )}
          {subtitle && (
            <span className="text-[12px] text-humana-muted">
              {change ? `\u00B7 ${subtitle}` : subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
