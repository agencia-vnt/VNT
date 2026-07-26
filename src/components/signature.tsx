import { siteConfig } from "@/site.config";

type SignatureProps = {
  /**
   * Slug del cliente donde se instala la firma. Viaja como ?ref= para saber
   * qué proyecto trae visitas. Ej: "panaderia-lume".
   *
   * (No se llama `ref` porque ese nombre está reservado por React.)
   */
  client?: string;
  label?: string;
  className?: string;
};

/** Arma el link de la firma con el parámetro de atribución ya puesto. */
export function signatureHref(client?: string) {
  const url = new URL(siteConfig.url);
  if (client) url.searchParams.set("ref", client);
  return url.toString();
}

/**
 * El crédito que dejamos al pie de los sitios que hacemos.
 * Deliberadamente chico y sin clases de Tailwind: tiene que poder copiarse a
 * un proyecto de un cliente que no usa nuestro stack.
 */
export function Signature({ client, label = "Sitio por", className }: SignatureProps) {
  return (
    <span className={className}>
      {label}{" "}
      <a
        href={signatureHref(client)}
        target="_blank"
        rel="noopener"
        style={{ textDecoration: "underline", textUnderlineOffset: "2px" }}
      >
        {siteConfig.name}
      </a>
    </span>
  );
}
