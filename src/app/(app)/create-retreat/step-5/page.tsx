"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useLocale } from "@/i18n/LocaleProvider";
import { useWizard } from "@/contexts/WizardContext";
import { WizardVistaPrevia } from "@/components/WizardVistaPrevia";
import { StepIndicator } from "@/components/StepIndicator";

const DEMO_IMAGES = [
  "/images/retreat-ibiza.jpg",
  "/images/retreat-tulum.jpg",
  "/images/retreat-singapore.jpg",
  "/images/retreat-bali.jpg",
];


export default function WizardStep5() {
  const { t } = useLocale();
  const { state, set } = useWizard();
  const [gallery, setGallery] = useState<string[]>(
    state.gallery.length > 0 ? state.gallery : DEMO_IMAGES
  );

  /* Drag & drop reorder state */
  const dragIdx = useRef<number | null>(null);
  const [dropTarget, setDropTarget] = useState<number | null>(null);

  function addDemoImages() {
    const newGallery = [...new Set([...gallery, ...DEMO_IMAGES])].slice(0, 10);
    setGallery(newGallery);
  }

  function removeImage(idx: number) {
    setGallery((prev) => prev.filter((_, i) => i !== idx));
  }

  /* Drag handlers */
  function handleDragStart(i: number) {
    dragIdx.current = i;
  }

  function handleDragOver(e: React.DragEvent, i: number) {
    e.preventDefault();
    setDropTarget(i);
  }

  function handleDrop(i: number) {
    const from = dragIdx.current;
    if (from === null || from === i) {
      dragIdx.current = null;
      setDropTarget(null);
      return;
    }
    setGallery((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(i, 0, moved);
      return next;
    });
    dragIdx.current = null;
    setDropTarget(null);
  }

  function handleDragEnd() {
    dragIdx.current = null;
    setDropTarget(null);
  }

  return (
    <div className="animate-fade-in-up flex flex-col gap-0 px-16 py-10">
      <div className="flex gap-12">
        {/* LEFT: main content */}
        <div className="flex flex-1 flex-col gap-8">
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
              PASO 5 DE 6
            </span>
            <h2 className="text-[32px] font-light leading-[40px] tracking-[-0.01em] text-humana-ink">
              Galeria de imagenes
            </h2>
            <p className="text-[15px] leading-[22px] text-humana-muted">
              Sube fotos que representen la experiencia. La primera imagen sera la portada.
            </p>
          </div>

          <StepIndicator
            steps={t.createRetreat?.steps ?? ["Hotel", "Info basica", "Programa", "Precios", "Galeria", "Revision"]}
            currentStep={4}
            className="flex items-center gap-0 py-6"
          />

          {/* Upload zone */}
          <button
            type="button"
            onClick={addDemoImages}
            className="upload-zone flex flex-col items-center justify-center gap-3 rounded-lg py-16"
          >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#8A8578" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            <span className="text-[15px] font-medium text-humana-ink">Arrastra imagenes aqui</span>
            <span className="text-[14px] text-humana-muted">o haz clic para seleccionar archivos</span>
            <span className="text-[12px] text-humana-subtle">JPG, PNG o WebP &middot; Max. 5 MB cada una</span>
          </button>

          {/* Image preview grid with drag & drop */}
          {gallery.length > 0 && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-subtle">
                  Vista previa ({gallery.length}/10)
                </span>
                <span className="text-[12px] text-humana-subtle">
                  Arrastra para reordenar &middot; La primera es la portada
                </span>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {gallery.map((img, i) => (
                  <div
                    key={img}
                    draggable
                    onDragStart={() => handleDragStart(i)}
                    onDragOver={(e) => handleDragOver(e, i)}
                    onDrop={() => handleDrop(i)}
                    onDragEnd={handleDragEnd}
                    className={`group relative h-28 cursor-grab overflow-hidden transition-all duration-150 active:cursor-grabbing ${
                      i === 0 ? "ring-2 ring-humana-gold" : "border border-humana-line"
                    } ${dropTarget === i ? "scale-[1.03] ring-2 ring-humana-gold/50" : ""}`}
                  >
                    <Image src={img} alt="" fill className="pointer-events-none object-cover" draggable={false} />
                    {/* Delete button on hover */}
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute right-2 top-2 cursor-pointer rounded bg-black/50 p-1.5 text-white opacity-0 transition-all hover:bg-red-600 group-hover:opacity-100"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6" />
                      </svg>
                    </button>
                    {/* Cover badge on first image */}
                    {i === 0 && (
                      <div className="absolute left-2 top-2 bg-humana-gold px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
                        PORTADA
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* RIGHT: VISTA PREVIA sidebar */}
        <WizardVistaPrevia currentStep={5} onNext={() => set({ gallery, coverIndex: 0 })} />
      </div>
    </div>
  );
}
