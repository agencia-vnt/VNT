import Image from "next/image";
import Link from "next/link";
import { buttonStyles } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { siteConfig } from "@/site.config";

export function ContactCta({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <Section className="border-t border-line">
      <div className="relative overflow-hidden rounded-[2rem] bg-brand-indigo px-6 py-14 text-brand-white md:px-12 md:py-20">
        <Image
          src="/brand/gradiente-ink-violeta.png"
          alt=""
          fill
          sizes="(min-width: 1152px) 1152px, 100vw"
          className="object-cover opacity-80"
        />
        <div className="absolute inset-y-0 right-0 hidden w-1/3 overflow-hidden md:block">
          <Image
            src="/brand/trama-ink-violeta.png"
            alt=""
            fill
            sizes="384px"
            className="object-cover opacity-25"
          />
        </div>

        <div className="relative z-10 max-w-2xl">
          <h2 className="font-display text-3xl leading-tight tracking-tight text-balance md:text-5xl">
            {dict.contact.title}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-brand-white/75">
            {dict.contact.intro}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-6">
            <Link href={`/${locale}/contacto`} className={buttonStyles("highlight")}>
              {dict.contact.form.submit}
            </Link>
            <p className="text-sm text-brand-white/75">
              {dict.contact.orEmail}{" "}
              <a
                href={`mailto:${siteConfig.email}`}
                className="text-brand-white underline underline-offset-4 transition-colors hover:text-brand-lime"
              >
                {siteConfig.email}
              </a>
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
