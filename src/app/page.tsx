import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen w-full flex-row">
      {/* Brand panel */}
      <section className="relative hidden lg:flex w-[44%] max-w-[640px] flex-col justify-between overflow-hidden bg-humana-stone px-16 py-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-no-repeat opacity-70"
          style={{
            backgroundImage: "url('/brand/world.svg')",
            backgroundSize: "cover",
            backgroundPosition: "15% center",
            backgroundRepeat: "no-repeat",
          }}
        />
        <div className="relative flex items-center gap-4">
          <Image
            src="/brand/isotipo.png"
            alt=""
            width={36}
            height={36}
            priority
          />
          <Image
            src="/brand/logotipo.svg"
            alt="HUMANA"
            width={124}
            height={43}
            priority
          />
        </div>

        <div className="relative flex max-w-[460px] flex-col gap-8">
          <div className="flex items-center gap-4">
            <span className="h-px w-7 bg-humana-gold" />
            <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-humana-muted">
              HUMANA.GLOBAL
            </span>
          </div>
          <h1 className="text-[36px] font-light leading-[44px] tracking-[-0.02em] text-humana-ink">
            La red global
            <br />
            que conecta a la humanidad
            <br />
            con el bienestar.
          </h1>
          <p className="max-w-[380px] text-[13px] leading-[22px] text-[#4A463E]">
            Acceso exclusivo para hoteles, agencias de turismo y operadores
            integrados a la red HUMANA.
          </p>
        </div>

        <div className="relative flex items-end justify-between gap-6">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-humana-subtle">
              Red internacional
            </span>
            <span className="text-[12px] text-humana-ink">
              Miami · Buenos Aires · CDMX · Madrid · São Paulo
            </span>
          </div>
          <span className="text-[10px] font-medium tracking-[0.24em] text-humana-subtle">
            MMXXVI
          </span>
        </div>
      </section>

      {/* Form panel */}
      <section className="flex flex-1 flex-col justify-between px-8 py-12 sm:px-16 lg:px-20">
        <div className="flex items-center justify-end gap-5">
          <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-humana-muted">
            ES · EN · PT
          </span>
          <span className="h-3 w-px bg-[#D8D4C8]" />
          <a
            href="#"
            className="text-[12px] text-[#4A463E] hover:text-humana-ink"
          >
            Soporte institucional
          </a>
        </div>

        <form className="mx-auto flex w-full max-w-[400px] flex-col gap-7">
          <header className="flex flex-col gap-3">
            <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-humana-gold">
              Portal de acceso
            </span>
            <h2 className="text-[28px] font-light leading-[36px] tracking-[-0.01em] text-humana-ink">
              Ingresa a tu cuenta.
            </h2>
            <p className="text-[13px] leading-[20px] text-humana-muted">
              Plataforma exclusiva para miembros verificados de la red.
            </p>
          </header>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-[10px] font-medium uppercase tracking-[0.22em] text-humana-muted"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="tucorreo@empresa.com"
              className="border-b border-humana-ink bg-transparent py-3 text-[14px] text-humana-ink outline-none placeholder:text-humana-subtle focus:border-humana-gold"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-[10px] font-medium uppercase tracking-[0.22em] text-humana-muted"
              >
                Contraseña
              </label>
              <a
                href="#"
                className="text-[11px] font-medium text-humana-gold underline underline-offset-4"
              >
                Recuperar acceso
              </a>
            </div>
            <div className="flex items-center gap-3 border-b border-[#D8D4C8] py-3 focus-within:border-humana-ink">
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="flex-1 bg-transparent text-[16px] tracking-[0.3em] text-humana-ink outline-none placeholder:text-humana-subtle"
              />
              <svg
                width="16"
                height="16"
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
              className="h-[14px] w-[14px] cursor-pointer accent-humana-ink"
            />
            <span className="text-[12px] text-[#4A463E]">
              Mantener sesión iniciada en este dispositivo de confianza
            </span>
          </label>

          <Link
            href="/dashboard"
            className="group flex items-center justify-center gap-3 bg-humana-ink px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.22em] text-white hover:bg-black"
          >
            Acceder a la plataforma
            <svg
              width="14"
              height="9"
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
          </Link>
        </form>

        <div className="flex justify-center">
          <span className="text-[11px] text-humana-muted">
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
