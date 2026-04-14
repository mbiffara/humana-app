import Image from "next/image";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen w-full flex-row">
      {/* Brand panel */}
      <section className="hidden lg:flex w-[44%] max-w-[640px] flex-col justify-between bg-humana-stone px-20 py-[72px]">
        <div className="flex items-center gap-[18px]">
          <Image
            src="/brand/isotipo.png"
            alt=""
            width={44}
            height={44}
            priority
          />
          <Image
            src="/brand/logotipo.svg"
            alt="HUMANA"
            width={148}
            height={51}
            priority
          />
        </div>

        <div className="flex max-w-[480px] flex-col gap-10">
          <div className="flex items-center gap-4">
            <span className="h-px w-8 bg-humana-gold" />
            <span className="text-[11px] font-medium uppercase tracking-[0.28em] text-humana-muted">
              HUMANA.GLOBAL
            </span>
          </div>
          <h1 className="text-[56px] font-light leading-[64px] tracking-[-0.02em] text-humana-ink">
            El movimiento
            <br />
            ya está en marcha.
          </h1>
          <p className="max-w-[400px] text-[15px] leading-[26px] text-[#4A463E]">
            Acceso exclusivo para hoteles, agencias de turismo y operadores
            integrados a la red HUMANA.
          </p>
        </div>

        <div className="flex items-end justify-between gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-medium uppercase tracking-[0.24em] text-humana-subtle">
              Red internacional
            </span>
            <span className="text-[13px] text-humana-ink">
              Madrid · Nueva York · Singapur · Ciudad de México
            </span>
          </div>
          <span className="text-[11px] font-medium tracking-[0.24em] text-humana-subtle">
            MMXXVI
          </span>
        </div>
      </section>

      {/* Form panel */}
      <section className="flex flex-1 flex-col justify-between px-8 py-14 sm:px-16 lg:px-[100px]">
        <div className="flex items-center justify-end gap-6">
          <span className="text-[12px] font-medium uppercase tracking-[0.18em] text-humana-muted">
            ES · EN · PT
          </span>
          <span className="h-3.5 w-px bg-[#D8D4C8]" />
          <a
            href="#"
            className="text-[13px] text-[#4A463E] hover:text-humana-ink"
          >
            Soporte institucional
          </a>
        </div>

        <form className="mx-auto flex w-full max-w-[440px] flex-col gap-8">
          <header className="flex flex-col gap-4">
            <span className="text-[11px] font-medium uppercase tracking-[0.28em] text-humana-gold">
              Portal de acceso
            </span>
            <h2 className="text-[36px] font-light leading-[44px] tracking-[-0.01em] text-humana-ink">
              Ingresa a tu cuenta.
            </h2>
            <p className="text-[14px] leading-[22px] text-humana-muted">
              Plataforma exclusiva para miembros verificados de la red.
            </p>
          </header>

          <div className="flex flex-col gap-2.5">
            <label
              htmlFor="email"
              className="text-[11px] font-medium uppercase tracking-[0.22em] text-humana-muted"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              defaultValue="contacto@hotelpremium.com"
              className="border-b border-humana-ink bg-transparent py-3.5 text-[16px] text-humana-ink outline-none focus:border-humana-gold"
            />
          </div>

          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-[11px] font-medium uppercase tracking-[0.22em] text-humana-muted"
              >
                Contraseña
              </label>
              <a
                href="#"
                className="text-[12px] font-medium text-humana-gold underline underline-offset-4"
              >
                Recuperar acceso
              </a>
            </div>
            <div className="flex items-center gap-3 border-b border-[#D8D4C8] py-3.5 focus-within:border-humana-ink">
              <input
                id="password"
                type="password"
                defaultValue="demopassword"
                className="flex-1 bg-transparent text-[18px] tracking-[0.3em] text-humana-ink outline-none"
              />
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#8A8578"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
          </div>

          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              className="h-4 w-4 appearance-none border border-[#C8C2B0] bg-white checked:bg-humana-ink"
            />
            <span className="text-[13px] text-[#4A463E]">
              Mantener sesión iniciada en este dispositivo de confianza
            </span>
          </label>

          <button
            type="submit"
            className="group flex items-center justify-center gap-3.5 bg-humana-ink px-8 py-5 text-[13px] font-semibold uppercase tracking-[0.22em] text-white hover:bg-black"
          >
            Acceder a la plataforma
            <svg
              width="16"
              height="10"
              viewBox="0 0 16 10"
              fill="none"
              stroke="#D4AF37"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform group-hover:translate-x-1"
            >
              <path d="M1 5h14M10 1l4 4-4 4" />
            </svg>
          </button>
        </form>

        <div>
          <span className="text-[12px] text-humana-muted">
            ¿Tu organización desea integrarse?{" "}
            <a
              href="#"
              className="font-medium text-humana-ink underline underline-offset-4"
            >
              Solicitar incorporación
            </a>
          </span>
        </div>
      </section>
    </main>
  );
}
