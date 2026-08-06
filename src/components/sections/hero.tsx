import Image from "next/image";
import Link from "next/link";
import { buttonStyles } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

export function Hero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="border-b border-line">
      <Container className="grid gap-10 py-14 md:py-20 lg:min-h-[calc(100svh-4rem)] lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.48fr)] lg:items-center lg:gap-16 lg:py-16">
        <div>
          <p className="mb-5 text-xs font-medium uppercase tracking-[0.18em] text-brand-violet">
            {dict.hero.eyebrow}
          </p>

          <h1 className="max-w-4xl font-display text-5xl leading-[0.98] tracking-[-0.035em] text-balance md:text-7xl">
            {dict.hero.title}
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink-muted">
            {dict.hero.subtitle}
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href={`/${locale}/proyectos`} className={buttonStyles("primary")}>
              {dict.hero.ctaPrimary}
            </Link>
            <Link href={`/${locale}/contacto`} className={buttonStyles("secondary")}>
              {dict.hero.ctaSecondary}
            </Link>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="relative min-h-72 overflow-hidden rounded-[2rem] bg-brand-violet md:min-h-96 lg:min-h-[34rem]"
        >
          <Image
            src="/brand/fondo-isotipo-violeta.png"
            alt=""
            fill
            priority
            sizes="(min-width: 1024px) 34vw, (min-width: 768px) 100vw, 100vw"
            className="object-cover object-bottom"
          />
        </div>
      </Container>
    </section>
  );
}
