import Link from "next/link";
import { buttonStyles } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { siteConfig } from "@/site.config";

export function ContactCta({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <Section className="border-t border-line">
      <div className="max-w-2xl">
        <h2 className="font-display text-3xl leading-tight tracking-tight text-balance md:text-5xl">
          {dict.contact.title}
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-ink-muted">
          {dict.contact.intro}
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-6">
          <Link href={`/${locale}/contacto`} className={buttonStyles("primary")}>
            {dict.contact.form.submit}
          </Link>
          <p className="text-sm text-ink-muted">
            {dict.contact.orEmail}{" "}
            <a
              href={`mailto:${siteConfig.email}`}
              className="text-ink underline underline-offset-4"
            >
              {siteConfig.email}
            </a>
          </p>
        </div>
      </div>
    </Section>
  );
}
