"use client";

import { usePathname } from "next/navigation";
import { useLocale } from "@/i18n/LocaleProvider";
import { StepIndicator } from "@/components/StepIndicator";

const stepRoutes = [
  "/create-retreat/step-1",
  "/create-retreat/step-2",
  "/create-retreat/step-3",
  "/create-retreat/step-4",
  "/create-retreat/step-5",
  "/create-retreat/step-6",
];

export default function WizardLayout({ children }: { children: React.ReactNode }) {
  const { t } = useLocale();
  const pathname = usePathname();

  const currentIndex = stepRoutes.findIndex((r) => pathname === r);
  const activeIndex = currentIndex >= 0 ? currentIndex : 0;

  const steps = t.createRetreat?.steps ?? [
    "Hotel",
    "Info basica",
    "Programa",
    "Precios",
    "Galeria",
    "Revision",
  ];

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {activeIndex === 0 && (
        <div className="flex flex-col gap-3 px-16 pt-14 pb-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
            Crear nuevo retiro
          </span>
          <h1 className="text-[36px] font-light leading-[44px] tracking-[-0.02em] text-humana-ink">
            Diseñar retiro en hotel asignado
          </h1>
          <p className="text-[15px] leading-[22px] text-humana-muted">
            Configurará los detalles del retiro que se ofrecerá en el hotel seleccionado.
          </p>
        </div>
      )}
      {activeIndex === 0 && (
        <StepIndicator steps={steps} currentStep={activeIndex} className="flex items-center gap-0 px-16 py-6" />
      )}
      {children}
    </div>
  );
}
