"use client";

import { useActionState, useId } from "react";
import { sendContact } from "@/app/[locale]/contacto/actions";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { type ContactState, initialContactState } from "@/lib/contact";
import { cn } from "@/lib/utils";

const fieldClass =
  "mt-2 w-full rounded-lg border border-line bg-transparent px-4 py-3 text-sm " +
  "placeholder:text-muted/60 focus:border-blanco";

const labelClass = "block text-sm font-medium";
const errorClass = "mt-1.5 text-xs text-lima";

export function ContactForm({ dict, locale }: { dict: Dictionary; locale: Locale }) {
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
      <input type="hidden" name="locale" value={locale} />
      <div>
        <label htmlFor={`${id}-name`} className={labelClass}>
          {t.name}
        </label>
        <input
          id={`${id}-name`}
          name="name"
          type="text"
          defaultValue={state.fieldValues?.name ?? ""}
          required
          autoComplete="name"
          maxLength={200}
          aria-invalid={state.fieldErrors?.name ? "true" : undefined}
          aria-describedby={state.fieldErrors?.name ? `${id}-name-error` : undefined}
          className={cn(fieldClass, state.fieldErrors?.name && "border-violeta")}
        />
        {state.fieldErrors?.name ? (
          <p id={`${id}-name-error`} className={errorClass}>
            {t.validation.name}
          </p>
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
          defaultValue={state.fieldValues?.email ?? ""}
          required
          autoComplete="email"
          maxLength={254}
          aria-invalid={state.fieldErrors?.email ? "true" : undefined}
          aria-describedby={state.fieldErrors?.email ? `${id}-email-error` : undefined}
          className={cn(fieldClass, state.fieldErrors?.email && "border-violeta")}
        />
        {state.fieldErrors?.email ? (
          <p id={`${id}-email-error`} className={errorClass}>
            {t.validation.email}
          </p>
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
          defaultValue={state.fieldValues?.company ?? ""}
          autoComplete="organization"
          maxLength={200}
          aria-invalid={state.fieldErrors?.company ? "true" : undefined}
          aria-describedby={
            state.fieldErrors?.company ? `${id}-company-error` : undefined
          }
          className={cn(fieldClass, state.fieldErrors?.company && "border-violeta")}
        />
        {state.fieldErrors?.company ? (
          <p id={`${id}-company-error`} className={errorClass}>
            {t.validation.company}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor={`${id}-message`} className={labelClass}>
          {t.message}
        </label>
        <textarea
          id={`${id}-message`}
          name="message"
          defaultValue={state.fieldValues?.message ?? ""}
          rows={6}
          required
          minLength={10}
          maxLength={5000}
          aria-invalid={state.fieldErrors?.message ? "true" : undefined}
          aria-describedby={
            state.fieldErrors?.message ? `${id}-message-error` : undefined
          }
          className={cn(
            fieldClass,
            "resize-y",
            state.fieldErrors?.message && "border-violeta",
          )}
        />
        {state.fieldErrors?.message ? (
          <p id={`${id}-message-error`} className={errorClass}>
            {t.validation.message}
          </p>
        ) : null}
      </div>

      {/* Honeypot anti-spam: oculto para personas, visible para bots. */}
      <div aria-hidden="true" className="absolute left-[-9999px]">
        <label htmlFor={`${id}-website`}>{t.honeypot}</label>
        <input
          id={`${id}-website`}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" disabled={pending}>
          {pending ? t.sending : t.submit}
        </Button>

        {state.status === "error" ? (
          <p role="alert" className="text-sm text-lima">
            {state.fieldErrors ? t.validation.summary : t.error}
          </p>
        ) : null}
      </div>
    </form>
  );
}
