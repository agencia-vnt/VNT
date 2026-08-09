"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Retardo en segundos, para escalonar elementos de una lista. */
  delay?: number;
  className?: string;
  /**
   * Etiqueta a renderizar. Dentro de un <ul> o un <ol> tiene que ser "li": un
   * <div> suelto ahí es HTML inválido, y los lectores de pantalla dejan de
   * anunciar la lista y cuántos elementos tiene, que es justamente lo que
   * hace legible una lista de servicios o de pasos.
   */
  as?: "div" | "li";
};

/**
 * Aparición suave al entrar en viewport. Es el único componente de animación
 * del sitio a propósito: una sola primitiva, usada en todos lados, se ve
 * intencional; muchas animaciones distintas se ven improvisadas.
 *
 * Si el sistema pide menos movimiento, no anima nada.
 *
 * El HTML se sirve con opacity 0 para que no haya un salto al hidratar. El
 * `data-reveal` existe para el fallback de <noscript> del layout: sin JS no
 * hay IntersectionObserver, y sin ese fallback media página quedaría invisible.
 * Es un selector de atributo, así que no le importa qué etiqueta sea.
 */
export function Reveal({ children, delay = 0, className, as = "div" }: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return as === "li" ? (
      <li className={className}>{children}</li>
    ) : (
      <div className={className}>{children}</div>
    );
  }

  const MotionTag = as === "li" ? motion.li : motion.div;

  return (
    <MotionTag
      data-reveal=""
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  );
}
