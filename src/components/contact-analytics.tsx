"use client";

import { track } from "@vercel/analytics";
import { useEffect } from "react";
import type { Locale } from "@/i18n/config";

const sources = ["hero", "contact-cta", "footer", "navigation", "contact-page"] as const;

/** Mide enlaces existentes sin convertir sus secciones en componentes cliente. */
export function ContactAnalytics({ locale }: { locale: Locale }) {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.button !== 0 || !(event.target instanceof Element)) return;

      const link = event.target.closest<HTMLAnchorElement>("a[href]");
      if (!link) return;

      const url = new URL(link.href, window.location.href);
      const name =
        url.protocol === "mailto:"
          ? "email_clicked"
          : url.origin === window.location.origin &&
              /^\/(es|en)\/contacto\/?$/.test(url.pathname)
            ? "contact_clicked"
            : null;
      if (!name) return;

      // Sólo valores controlados: no enviar href, texto ni datos de contacto.
      const source =
        sources.find((item) => item === link.dataset.contactSource) ?? "navigation";
      try {
        track(name, { locale, source });
      } catch {
        // La medición nunca debe impedir abrir el correo o navegar.
      }
    };

    // Captura antes de que Next intercepte el enlace para navegar sin recargar.
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [locale]);

  return null;
}
