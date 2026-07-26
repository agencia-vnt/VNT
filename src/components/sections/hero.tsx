import Link from "next/link";
import { buttonStyles } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

export function Hero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="border-b border-line">
      <Container className="py-24 md:py-36">
        <p className="mb-5 text-xs font-medium uppercase tracking-[0.18em] text-ink-muted">
          {dict.hero.eyebrow}
        </p>

        <h1 className="max-w-4xl font-display text-4xl leading-[1.05] tracking-tight text-balance md:text-6xl">
          {dict.hero.title}
        </h1>

        <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-muted">
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
      </Container>
    </section>
  );
}
