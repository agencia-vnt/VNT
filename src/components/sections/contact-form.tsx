"use client";

import { useActionState, useId } from "react";
import { sendContact } from "@/app/[locale]/contacto/actions";
import { Button } from "@/components/ui/button";
import type { Dictionary } from "@/i18n/dictionaries";
import { type ContactState, initialContactState } from "@/lib/contact";
import { cn } from "@/lib/utils";

const fieldClass =
  "mt-2 w-full rounded-lg border border-line bg-transparent px-4 py-3 text-sm " +
  "placeholder:text-muted/60 focus:border-blanco";

const labelClass = "block text-sm font-medium";
const errorClass = "mt-1.5 text-xs text-lima";

export function ContactForm({ dict }: { dict: Dictionary }) {
  const [state, formAction, pending] = useActionState<ContactState, FormData>(
    sendContact,
    initialContactState,
  );

  const id = useId();
  const t = dict.contact.form;

  if (state.status === "success") {
    return (
      // <output> ya trae role="status": el lector de pantalla anuncia el
      // resultado sin que haya que moverle el foco a nadie.
      <output className="block rounded-lg border border-line bg-ink-elev p-8 text-sm">
        {t.success}
      </output>
    );
  }

  return (
    <form action={formAction} className="space-y-6" noValidate>
      <div>
        <label htmlFor={`${id}-name`} className={labelClass}>
          {t.name}
        </label>
        <input
          id={`${id}-name`}
          name="name"
          type="text"
          required
          autoComplete="name"
          aria-invalid={state.fieldErrors?.name ? "true" : undefined}
          className={cn(fieldClass, state.fieldErrors?.name && "border-violeta")}
        />
        {state.fieldErrors?.name ? (
          <p className={errorClass}>{t.validation.name}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor={`${id}-email`} className={labelClass}>
          {t.email}
        </label>
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          required
          autoComplete="email"
          aria-invalid={state.fieldErrors?.email ? "true" : undefined}
          className={cn(fieldClass, state.fieldErrors?.email && "border-violeta")}
        />
        {state.fieldErrors?.email ? (
          <p className={errorClass}>{t.validation.email}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor={`${id}-company`} className={labelClass}>
          {t.company}
        </label>
        <input
          id={`${id}-company`}
          name="company"
          type="text"
          autoComplete="organization"
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor={`${id}-message`} className={labelClass}>
          {t.message}
        </label>
        <textarea
          id={`${id}-message`}
          name="message"
          rows={6}
          required
          aria-invalid={state.fieldErrors?.message ? "true" : undefined}
          className={cn(
            fieldClass,
            "resize-y",
            state.fieldErrors?.message && "border-violeta",
          )}
        />
        {state.fieldErrors?.message ? (
          <p className={errorClass}>{t.validation.message}</p>
        ) : null}
      </div>

      {/* Honeypot anti-spam: oculto para personas, visible para bots. */}
      <div aria-hidden="true" className="absolute left-[-9999px]">
        <label htmlFor={`${id}-website`}>No completar</label>
        <input
          id={`${id}-website`}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={pending}>
          {pending ? t.sending : t.submit}
        </Button>

        {state.status === "error" && !state.fieldErrors ? (
          <p role="alert" className="text-sm text-lima">
            {t.error}
          </p>
        ) : null}
      </div>
    </form>
  );
}
