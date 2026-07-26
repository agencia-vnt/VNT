"use client";

import { useState } from "react";

export function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // El navegador bloqueó el portapapeles: el código igual está visible
      // y se puede seleccionar a mano.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="rounded-full border border-line px-3 py-1 text-xs text-ink-muted transition-colors hover:border-ink hover:text-ink"
    >
      {copied ? "Copiado ✓" : "Copiar"}
    </button>
  );
}
