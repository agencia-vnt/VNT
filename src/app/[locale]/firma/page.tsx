import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Signature, signatureHref } from "@/components/signature";
import { CopyButton } from "@/components/ui/copy-button";
import { Section, SectionHeading } from "@/components/ui/section";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { siteConfig } from "@/site.config";

type PageParams = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);
  return {
    title: dict.signature.title,
    description: dict.signature.intro,
    alternates: { canonical: `/${locale}/firma` },
    // Es una página interna de trabajo: no aporta nada en buscadores.
    robots: { index: false, follow: false },
  };
}

export default async function SignaturePage({ params }: PageParams) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);
  const example = signatureHref("nombre-cliente");

  const snippets = [
    {
      title: "HTML",
      description: "Para cualquier sitio: WordPress, Webflow, HTML plano.",
      code: `<p class="credit">\n  ${dict.signature.credit}\n  <a href="${example}" target="_blank" rel="noopener">${siteConfig.name}</a>\n</p>`,
    },
    {
      title: "React / Next.js",
      description: "Para los proyectos que hacemos con nuestro stack.",
      code: `<p className="credit">\n  ${dict.signature.credit}{" "}\n  <a href="${example}" target="_blank" rel="noopener">\n    ${siteConfig.name}\n  </a>\n</p>`,
    },
    {
      title: "Sólo el link",
      description: "Para firmas de mail, perfiles y menciones sueltas.",
      code: example,
    },
  ];

  return (
    <Section>
      <SectionHeading title={dict.signature.title} intro={dict.signature.intro} />

      <div className="mt-12 max-w-2xl rounded-lg border border-line bg-ink-elev p-8">
        <p className="text-xs uppercase tracking-[0.18em] text-muted">
          {dict.signature.preview}
        </p>
        <div className="mt-4 text-sm">
          <Signature client="nombre-cliente" label={dict.signature.credit} />
        </div>
      </div>

      <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted">
        {dict.signature.note}
      </p>

      <div className="mt-12 space-y-10">
        {snippets.map((snippet) => (
          <div key={snippet.title} className="max-w-2xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg tracking-tight">{snippet.title}</h2>
                <p className="mt-1 text-sm text-muted">{snippet.description}</p>
              </div>
              <CopyButton value={snippet.code} />
            </div>

            <pre className="mt-4 overflow-x-auto rounded-lg border border-line bg-ink-elev p-5 text-xs leading-relaxed">
              <code>{snippet.code}</code>
            </pre>
          </div>
        ))}
      </div>
    </Section>
  );
}
