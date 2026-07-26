"use server";

import { Resend } from "resend";
import { z } from "zod";
import type { ContactField, ContactState } from "@/lib/contact";
import { siteConfig } from "@/site.config";

const contactSchema = z.object({
  name: z.string().trim().min(1),
  email: z.email(),
  company: z.string().trim().max(200).optional(),
  message: z.string().trim().min(10).max(5000),
  /**
   * Honeypot: campo oculto que una persona nunca completa. Frena casi todo el
   * spam de bots sin pedirle nada al usuario (a diferencia de un captcha).
   */
  website: z.string().max(0).optional(),
});

// Este archivo sólo puede exportar funciones async: los tipos y el estado
// inicial están en @/lib/contact.
export async function sendContact(
  _prevState: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    company: formData.get("company") || undefined,
    message: formData.get("message"),
    website: formData.get("website") || undefined,
  });

  if (!parsed.success) {
    const fieldErrors: Partial<Record<ContactField, true>> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (field === "name" || field === "email" || field === "message") {
        fieldErrors[field] = true;
      }
    }
    return { status: "error", fieldErrors };
  }

  // El bot completó el honeypot: cortamos en silencio, sin darle señal.
  if (parsed.data.website) return { status: "success" };

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn(
      "[contacto] Falta RESEND_API_KEY: el mensaje no se envió.\n" +
        "Configurala en .env.local (ver .env.example) y en Vercel.\n" +
        "Mensaje recibido:",
      parsed.data,
    );
    return { status: "error" };
  }

  const { name, email, company, message } = parsed.data;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      // Tiene que ser un dominio verificado en Resend.
      from: process.env.CONTACT_FROM_EMAIL ?? `web@${new URL(siteConfig.url).hostname}`,
      to: process.env.CONTACT_TO_EMAIL ?? siteConfig.email,
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

    if (error) {
      console.error("[contacto] Resend devolvió un error:", error);
      return { status: "error" };
    }

    return { status: "success" };
  } catch (error) {
    console.error("[contacto] No se pudo enviar el mensaje:", error);
    return { status: "error" };
  }
}
