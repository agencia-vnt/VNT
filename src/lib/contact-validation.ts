import { z } from "zod";
import type { ContactField, ContactState } from "./contact";

const fieldLimits = { name: 200, email: 254, company: 200, message: 5000 } as const;

const contactSchema = z.object({
  name: z.string().trim().min(1).max(fieldLimits.name),
  email: z.string().trim().max(fieldLimits.email).pipe(z.email()),
  company: z.string().trim().max(fieldLimits.company).optional(),
  message: z.string().trim().min(10).max(fieldLimits.message),
  locale: z.enum(["es", "en"]),
});

export type ContactSubmission = z.infer<typeof contactSchema>;

type ContactDelivery = {
  /** Sólo devuelve true cuando el proveedor acepta el correo. */
  send: (submission: ContactSubmission) => Promise<boolean>;
  onSubmitted?: (locale: ContactSubmission["locale"]) => Promise<void>;
};

export async function submitContact(
  formData: FormData,
  delivery: ContactDelivery,
): Promise<ContactState> {
  // Los bots reciben el mismo resultado que un envío, sin correo ni evento.
  // Se comprueba antes del esquema para que el honeypot no falle al validar.
  if (formData.get("website")) return { status: "success" };

  const fieldValues: Partial<Record<ContactField, string>> = {};
  for (const field of Object.keys(fieldLimits) as ContactField[]) {
    const value = formData.get(field);
    if (typeof value === "string")
      fieldValues[field] = value.slice(0, fieldLimits[field]);
  }
  const errorState: ContactState = { status: "error", fieldValues };

  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    company: formData.get("company") || undefined,
    message: formData.get("message"),
    locale: formData.get("locale"),
  });

  if (!parsed.success) {
    const fieldErrors: Partial<Record<ContactField, true>> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (
        field === "name" ||
        field === "email" ||
        field === "company" ||
        field === "message"
      ) {
        fieldErrors[field] = true;
      }
    }
    return Object.keys(fieldErrors).length ? { ...errorState, fieldErrors } : errorState;
  }

  try {
    if (!(await delivery.send(parsed.data))) return errorState;
  } catch {
    return errorState;
  }

  try {
    await delivery.onSubmitted?.(parsed.data.locale);
  } catch {
    // Un fallo de métricas no cambia un correo que ya fue aceptado.
  }

  return { status: "success" };
}
