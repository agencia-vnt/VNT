import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";

/**
 * Se exporta como función de estilos (y no sólo como componente) para poder
 * aplicar el mismo look a un <Link> sin envolverlo en un <button>.
 *
 * En el diseño hay dos botones y nada más: el lima, que es la acción
 * principal de cada pantalla, y el de contorno, que la acompaña.
 */
export function buttonStyles(variant: Variant = "primary", className?: string) {
  return cn(
    "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-[30px] py-4",
    "text-body-s font-bold uppercase leading-none transition-colors duration-200",
    "disabled:cursor-not-allowed disabled:opacity-50",
    variant === "primary" && "bg-lima text-ink hover:bg-blanco",
    variant === "secondary" &&
      "border border-line bg-transparent text-blanco hover:border-lima hover:text-lima",
    variant === "ghost" &&
      "min-h-0 px-0 py-0 normal-case text-blanco underline underline-offset-4 hover:text-lima",
    className,
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return <button className={buttonStyles(variant, className)} {...props} />;
}
