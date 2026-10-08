"use server";

import { track } from "@vercel/analytics/server";
import { headers } from "next/headers";
import { Resend } from "resend";
import type { ContactState } from "@/lib/contact";
import { submitContact } from "@/lib/contact-validation";
import { siteConfig } from "@/site.config";

// Este archivo sólo puede exportar funciones async: los tipos y el estado
// inicial están en @/lib/contact.
export async function sendContact(
  _prevState: ContactState,
  formData: FormData,
): Promise<ContactState> {
  return submitContact(formData, {
    send: async ({ name, email, company, message }) => {
      const apiKey = process.env.RESEND_API_KEY;
      if (!apiKey) {
        console.warn("[contacto] Falta RESEND_API_KEY: el mensaje no se envió.");
        return false;
      }

      try {
        const resend = new Resend(apiKey);
        const { data, error } = await resend.emails.send({
          // Tiene que ser un dominio verificado en Resend.
          from:
            process.env.CONTACT_FROM_EMAIL ?? `web@${new URL(siteConfig.url).hostname}`,
          to: siteConfig.email,
          replyTo: email,
          subject: `Consulta de ${name}${company ? ` (${company})` : ""}`,
          text: [
            `Nombre: ${name}`,
            `Email: ${email}`,
            company ? `Empresa: ${company}` : null,
            "",
            message,
          ]
            .filter((line) => line !== null)
            .join("\n"),
        });

        if (error || !data?.id) {
          console.error("[contacto] Resend no aceptó el correo.");
          return false;
        }

        return true;
      } catch {
        console.error("[contacto] No se pudo enviar el mensaje.");
        return false;
      }
    },
    onSubmitted: async (locale) => {
      await track("contact_submitted", { locale }, { headers: await headers() });
    },
  });
}
