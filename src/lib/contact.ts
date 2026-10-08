/**
 * Tipos y estado inicial del formulario de contacto.
 *
 * Viven acá y no en `actions.ts` porque un archivo `"use server"` sólo puede
 * exportar funciones async: exportar un objeto desde ahí revienta en runtime
 * (el build no lo detecta). Los tipos se borran al compilar, pero mantenerlos
 * juntos evita que alguien vuelva a mover la constante de vuelta.
 */

export type ContactField = "name" | "email" | "company" | "message";

export type ContactState = {
  status: "idle" | "success" | "error";
  /** Qué campos rebotaron. El texto del error lo pone el diccionario. */
  fieldErrors?: Partial<Record<ContactField, true>>;
  /** Valores acotados para reponer el formulario cuando React lo reinicia. */
  fieldValues?: Partial<Record<ContactField, string>>;
};

export const initialContactState: ContactState = { status: "idle" };
