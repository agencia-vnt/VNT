import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";
import { isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { socialImageSize } from "@/lib/metadata";
import { siteConfig } from "@/site.config";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/** ImageResponse no interpreta @theme; conserva el CSS como fuente de verdad. */
function brandToken(css: string, name: string) {
  const value = css.match(new RegExp(`--${name}:\\s*([^;]+);`))?.[1];
  if (!value) throw new Error(`Falta el token de marca --${name}`);
  return value;
}

function upperSize(css: string, name: string) {
  const token = brandToken(css, name);
  const value = token.startsWith("clamp(") ? token.split(",").at(-1) : token;
  const rem = Number.parseFloat(value ?? "");
  if (!Number.isFinite(rem)) throw new Error(`Tamaño de marca inválido: --${name}`);
  return rem * 16;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const [dict, css, font, logo] = await Promise.all([
    getDictionary(locale),
    readFile(join(process.cwd(), "src/app/globals.css"), "utf8"),
    // Satori necesita la variante estática; next/font sigue usando la variable.
    readFile(join(process.cwd(), "src/app/fonts/HostGrotesk-Regular.ttf")),
    readFile(join(process.cwd(), "public/brand/logo-horizontal-white.svg")),
  ]);
  const gutter = upperSize(css, "spacing-section") / 2;
  const logoWidth = socialImageSize.width / 4;
  const logoHeight = logoWidth * (659.19 / 2648.34);
  const ink = brandToken(css, "color-ink");
  const white = brandToken(css, "color-blanco");
  const lime = brandToken(css, "color-lima");
  const violet = brandToken(css, "color-violeta");

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        padding: gutter,
        backgroundColor: ink,
        backgroundImage: `linear-gradient(135deg, ${ink} 20%, ${violet} 145%)`,
        color: white,
        fontFamily: "Host Grotesk",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* biome-ignore lint/performance/noImgElement: ImageResponse requiere img para rasterizar el SVG oficial. */}
        <img
          src={`data:image/svg+xml;base64,${logo.toString("base64")}`}
          alt={siteConfig.name}
          width={logoWidth}
          height={logoHeight}
        />
        <div style={{ color: lime, fontSize: upperSize(css, "text-body-s") }}>
          {new URL(siteConfig.url).hostname}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: gutter / 2 }}>
        <div
          style={{
            fontSize: upperSize(css, "text-display"),
            lineHeight: Number(brandToken(css, "text-display--line-height")),
            letterSpacing: brandToken(css, "text-display--letter-spacing"),
          }}
        >
          {dict.hero.title}
        </div>
        <div
          style={{
            color: lime,
            fontSize: upperSize(css, "text-body") * 1.5,
            lineHeight: Number(brandToken(css, "text-body--line-height")),
          }}
        >
          {dict.hero.subtitle}
        </div>
      </div>
      <div style={{ width: "100%", height: gutter / 8, backgroundColor: lime }} />
    </div>,
    {
      ...socialImageSize,
      fonts: [{ name: "Host Grotesk", data: font, style: "normal", weight: 400 }],
    },
  );
}
