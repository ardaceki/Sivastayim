import Image from "next/image";
import Link from "next/link";

export function Hero({ dict, currentLang }: { dict: any; currentLang: string }) {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-slate-900">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/cifteminare.webp"
          alt="Sivas Çifte Minareli Medrese"
          fill
          priority
          className="object-cover object-center w-full h-full"
          quality={90}
        />
        {/* Subtle dark overlay for contrast */}
        <div className="absolute inset-0 bg-black/40 dark:bg-black/60 bg-gradient-to-t from-black/80 dark:from-black/95 via-black/30 dark:via-black/50 to-transparent mix-blend-multiply transition-colors duration-500" />
      </div>

      <div className="relative z-10 container mx-auto px-6 max-w-5xl flex flex-col items-center text-center mt-12 sm:mt-0">
        <div className="relative w-[300px] sm:w-[500px] h-[90px] sm:h-[150px] mb-8">
          <div className="absolute inset-0 bg-black/10 blur-2xl rounded-full z-0"></div>
          <Image
            src="/images/sivastayimlogo.png"
            alt={dict.title}
            fill
            className="relative z-10 object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)] dark:contrast-125"
            priority
          />
        </div>
        <p className="text-lg sm:text-2xl text-slate-200 max-w-2xl font-light mb-12 drop-shadow-lg !leading-relaxed">
          {dict.subtitle}
        </p>

        {/* Touch-Friendly Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full max-w-lg mx-auto">
          {/* Primary Action - Brick Terracotta */}
          <a
            href="#discovery"
            className="w-full sm:w-auto min-h-[64px] px-10 rounded-2xl bg-[var(--color-primary)] text-white font-semibold text-lg tracking-wide shadow-[0_8px_20px_rgba(163,90,66,0.3)] hover:scale-105 active:scale-[0.98] transition-all duration-300 flex items-center justify-center border border-white/10"
            aria-label={dict.start_btn}
          >
            {dict.start_btn}
          </a>

          {/* Secondary Action - Turquoise Blue */}
          <Link
            href={`/${currentLang}/map`}
            className="w-full sm:w-auto min-h-[64px] px-10 rounded-2xl bg-[#0f172a]/40 backdrop-blur-md text-[var(--color-secondary)] font-bold text-lg tracking-wide shadow-xl hover:bg-[var(--color-secondary)]/10 hover:scale-105 active:scale-[0.98] transition-all duration-300 flex items-center justify-center border-2 border-[var(--color-secondary)]/80"
            aria-label={dict.map_btn}
          >
            {dict.map_btn}
          </Link>
        </div>
      </div>
    </section>
  );
}
