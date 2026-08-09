"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useId, useState } from "react";

type MobileNavProps = {
  links: { href: string; label: string }[];
  /** Etiqueta accesible del botón que abre y cierra. */
  menuLabel: string;
  /** El selector de idioma, que abajo del panel entra sin apretar. */
  children: ReactNode;
};

/**
 * El menú de pantallas chicas. Los links del header no entran en 375px junto
 * al logo, así que abajo de `md` se pliegan acá.
 *
 * Es cliente porque necesita cerrarse al navegar: con `<details>` el panel
 * quedaría abierto después de tocar un link, porque Next no recarga el DOM.
 */
export function MobileNav({ links, menuLabel, children }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelId = useId();

  // Al cambiar de página el panel se cierra solo.
  // biome-ignore lint/correctness/useExhaustiveDependencies: el efecto existe justamente para reaccionar al pathname
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={menuLabel}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="-mr-2 flex size-11 items-center justify-center text-blanco"
      >
        <span aria-hidden="true" className="relative block h-3.5 w-6">
          {/* Dos rayas que se cruzan al abrir: la misma pieza, rotada. */}
          <span
            className={`absolute left-0 block h-px w-full bg-current transition-transform duration-200 ${
              open ? "top-1/2 rotate-45" : "top-0"
            }`}
          />
          <span
            className={`absolute left-0 block h-px w-full bg-current transition-transform duration-200 ${
              open ? "top-1/2 -rotate-45" : "top-full"
            }`}
          />
        </span>
      </button>

      {open ? (
        <div
          id={panelId}
          className="absolute inset-x-0 top-full border-b border-line bg-ink px-6 pb-8 pt-2"
        >
          <nav aria-label={menuLabel} className="flex flex-col">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="border-b border-line py-4 text-h3 text-blanco transition-colors hover:text-lima"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* El selector de idioma centra su texto dentro de un área táctil
              de 44px; el margen negativo lo alinea con los links de arriba. */}
          <div className="-ml-3.5 mt-6">{children}</div>
        </div>
      ) : null}
    </div>
  );
}
