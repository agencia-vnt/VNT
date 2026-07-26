import type { MDXComponents } from "mdx/types";
import Image from "next/image";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/**
 * Imagen optimizada para usar dentro de un .mdx.
 * Requiere width/height porque next/image no puede inferirlos desde markdown.
 *
 *   <Figure src="/projects/slug/home.jpg" width={1600} height={1000}
 *           alt="Home del sitio" caption="La home, en desktop" />
 */
export function Figure({
  src,
  alt,
  width,
  height,
  caption,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
}) {
  return (
    <figure className="my-10 -mx-6 md:mx-0">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes="(min-width: 768px) 720px, 100vw"
        className="w-full rounded-none md:rounded-lg"
      />
      {caption ? (
        <figcaption className="mt-3 px-6 text-xs text-ink-muted md:px-0">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

/** Dos imágenes lado a lado, para antes/después o detalles. */
export function Grid({ children }: { children: React.ReactNode }) {
  return <div className="my-10 grid gap-4 md:grid-cols-2">{children}</div>;
}

/** Una cita destacada del cliente. Vale oro en un caso de estudio. */
export function Quote({
  children,
  author,
}: {
  children: React.ReactNode;
  author?: string;
}) {
  // Los estilos van en el <blockquote> y se proyectan sobre el <p> que MDX
  // genera solo. Envolver `children` en un <p> propio anidaría dos párrafos:
  // HTML inválido y error de hidratación.
  return (
    <blockquote className="my-10 border-l-2 border-accent pl-6 [&>p]:my-0 [&>p]:font-display [&>p]:text-xl [&>p]:leading-snug [&>p]:tracking-tight [&>p]:text-ink">
      {children}
      {author ? (
        <cite className="mt-3 block text-sm not-italic text-ink-muted">{author}</cite>
      ) : null}
    </blockquote>
  );
}

/**
 * Estilos del contenido MDX. Al estar acá y no en clases de Tailwind sueltas
 * dentro de cada .mdx, quien escribe contenido no necesita saber de estilos.
 */
export const mdxComponents: MDXComponents = {
  h2: ({ className, ...props }: ComponentProps<"h2">) => (
    <h2
      className={cn(
        "mt-14 mb-4 font-display text-2xl tracking-tight text-balance",
        className,
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }: ComponentProps<"h3">) => (
    <h3
      className={cn("mt-10 mb-3 font-display text-lg tracking-tight", className)}
      {...props}
    />
  ),
  p: ({ className, ...props }: ComponentProps<"p">) => (
    <p className={cn("my-5 leading-relaxed text-ink-muted", className)} {...props} />
  ),
  ul: ({ className, ...props }: ComponentProps<"ul">) => (
    <ul
      className={cn("my-5 list-disc space-y-2 pl-5 text-ink-muted", className)}
      {...props}
    />
  ),
  ol: ({ className, ...props }: ComponentProps<"ol">) => (
    <ol
      className={cn("my-5 list-decimal space-y-2 pl-5 text-ink-muted", className)}
      {...props}
    />
  ),
  a: ({ className, ...props }: ComponentProps<"a">) => (
    <a
      className={cn("text-ink underline underline-offset-4 hover:text-accent", className)}
      {...props}
    />
  ),
  hr: () => <hr className="my-14 border-line" />,
  strong: ({ className, ...props }: ComponentProps<"strong">) => (
    <strong className={cn("font-semibold text-ink", className)} {...props} />
  ),
  img: ({ className, alt, ...props }: ComponentProps<"img">) => (
    // Markdown puro (![]()) no trae dimensiones, así que acá no se puede usar
    // next/image. Para imágenes importantes usar <Figure /> en el .mdx.
    // biome-ignore lint/performance/noImgElement: sin width/height desde markdown
    <img
      className={cn("my-10 w-full rounded-lg", className)}
      alt={alt ?? ""}
      loading="lazy"
      {...props}
    />
  ),
  Figure,
  Grid,
  Quote,
};
