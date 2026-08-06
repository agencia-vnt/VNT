import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "highlight" | "ghost";

/**
 * Se exporta como función de estilos (y no sólo como componente) para poder
 * aplicar el mismo look a un <Link> sin envolverlo en un <button>.
 */
export function buttonStyles(variant: Variant = "primary", className?: string) {
  return cn(
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 py-3",
    "text-sm font-bold transition-colors duration-200",
    "disabled:cursor-not-allowed disabled:opacity-50",
    variant === "primary" && "bg-brand-indigo text-brand-white hover:bg-brand-violet",
    variant === "secondary" &&
      "border border-brand-indigo bg-transparent text-brand-indigo hover:bg-brand-lime",
    variant === "highlight" && "bg-brand-lime text-ink hover:bg-brand-white",
    variant === "ghost" &&
      "px-0 text-brand-indigo underline underline-offset-4 hover:text-brand-violet",
    className,
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return <button className={buttonStyles(variant, className)} {...props} />;
}
