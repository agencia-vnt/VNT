import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";

/**
 * Se exporta como función de estilos (y no sólo como componente) para poder
 * aplicar el mismo look a un <Link> sin envolverlo en un <button>.
 */
export function buttonStyles(variant: Variant = "primary", className?: string) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3",
    "text-sm font-medium transition-colors duration-200",
    "disabled:cursor-not-allowed disabled:opacity-50",
    variant === "primary" && "bg-ink text-paper hover:bg-accent",
    variant === "secondary" &&
      "border border-line bg-transparent text-ink hover:border-ink",
    variant === "ghost" && "px-0 text-ink underline underline-offset-4 hover:text-accent",
    className,
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return <button className={buttonStyles(variant, className)} {...props} />;
}
