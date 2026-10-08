"use client";

import { motion, useSpring } from "motion/react";
import { useEffect, useRef } from "react";
import { Glow } from "@/components/ui/glow";

const spring = { stiffness: 90, damping: 24, mass: 1 };

/** La luz acompaña al mouse sin desplazar el contenido ni el isotipo. */
export function PointerGlow({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, spring);
  const y = useSpring(0, spring);

  useEffect(() => {
    const section = ref.current?.closest("section");
    if (!section) return;

    const media = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    const reset = () => {
      x.set(0);
      y.set(0);
    };
    const stop = () => {
      x.jump(0);
      y.jump(0);
    };
    const follow = (event: PointerEvent) => {
      if (!media.matches || event.pointerType !== "mouse") return;
      const bounds = section.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;

      // Recorrido proporcional y acotado: conserva el foco visual a la derecha.
      const horizontal = Math.max(
        -0.5,
        Math.min(0.5, (event.clientX - bounds.left) / bounds.width - 0.5),
      );
      const vertical = Math.max(
        -0.5,
        Math.min(0.5, (event.clientY - bounds.top) / bounds.height - 0.5),
      );
      x.set(horizontal * bounds.width * 0.24);
      y.set(vertical * bounds.height * 0.32);
    };

    section.addEventListener("pointerenter", follow);
    section.addEventListener("pointermove", follow);
    section.addEventListener("pointerleave", reset);
    section.addEventListener("pointercancel", reset);
    window.addEventListener("blur", reset);
    window.addEventListener("resize", reset);
    window.addEventListener("scroll", reset, { passive: true, capture: true });
    media.addEventListener("change", stop);

    return () => {
      section.removeEventListener("pointerenter", follow);
      section.removeEventListener("pointermove", follow);
      section.removeEventListener("pointerleave", reset);
      section.removeEventListener("pointercancel", reset);
      window.removeEventListener("blur", reset);
      window.removeEventListener("resize", reset);
      window.removeEventListener("scroll", reset, true);
      media.removeEventListener("change", stop);
      stop();
    };
  }, [x, y]);

  return (
    <motion.div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{ x, y }}
    >
      <Glow className={className} />
    </motion.div>
  );
}
