"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";

/** Clave de sessionStorage: la intro se ve una vez por pestaña, no por visita. */
export const INTRO_SEEN_KEY = "vnt:intro";

/** Si nadie toca nada, la intro sigue sola. Nunca deja el sitio trabado. */
const AUTO_ADVANCE_MS = 2800;

/**
 * La entrada del sitio, según el prototipo del Figma: pantalla negra, el
 * logo aparece creciendo hasta ocupar el ancho de la pantalla, espera con el
 * indicador de flecha, y al salir se achica y se desvanece mientras el hero
 * entra por debajo.
 *
 * Quién decide si se ve es el script de `layout.tsx`, que corre antes del
 * primer pintado y marca `<html data-intro="playing">`. Este componente sólo
 * lo lee: así no hay un fotograma con el hero visible antes de que monte el
 * overlay, y sin JavaScript el atributo nunca se pone y el sitio se ve
 * entero de una.
 *
 * El resto de la coreografía vive en `globals.css`, colgada de ese atributo:
 * el contenido del hero espera oculto y los glows arrancan achicados.
 */
export function Intro() {
  // `null` = todavía no sabemos (primer render, igual que en el server).
  const [playing, setPlaying] = useState<boolean | null>(null);

  useEffect(() => {
    setPlaying(document.documentElement.dataset.intro === "playing");
  }, []);

  useEffect(() => {
    if (!playing) return;

    const finish = () => {
      // El atributo se saca acá y no al terminar la animación de salida: así
      // los glows del hero empiezan a crecer mientras el overlay se va, que
      // es el cruce que hace el prototipo entre sus dos últimos cuadros.
      document.documentElement.dataset.intro = "done";
      try {
        sessionStorage.setItem(INTRO_SEEN_KEY, "1");
      } catch {
        // Modo privado o storage bloqueado: se verá otra vez, no es grave.
      }
      setPlaying(false);
    };

    const timer = window.setTimeout(finish, AUTO_ADVANCE_MS);
    const events = ["wheel", "touchmove", "keydown", "pointerdown"] as const;
    for (const event of events) {
      window.addEventListener(event, finish, { once: true, passive: true });
    }

    return () => {
      window.clearTimeout(timer);
      for (const event of events) window.removeEventListener(event, finish);
    };
  }, [playing]);

  return (
    <AnimatePresence>
      {playing ? (
        // Oculto para lectores de pantalla: es decoración, y el contenido
        // real ya está en el DOM debajo.
        <motion.div
          aria-hidden="true"
          className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-ink"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            // Más ancho en pantalla chica: con el 54% del diseño el logo
            // quedaba perdido en el medio de un teléfono.
            className="w-[72vw] max-w-[780px] sm:w-[54vw]"
            // 0.337 es la proporción entre el logo chico y el grande del
            // prototipo (300px contra 889px).
            initial={{ opacity: 0, scale: 0.337 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.337 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src="/brand/logo-lockup-blanco.svg"
              alt=""
              width={214}
              height={27}
              priority
              className="h-auto w-full"
            />
          </motion.div>

          <motion.div
            className="absolute bottom-[8vh] flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 1.2 }}
          >
            <motion.span
              className="text-h3 text-lima"
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.6, repeat: Number.POSITIVE_INFINITY, delay: 1.2 }}
            >
              ↓
            </motion.span>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
