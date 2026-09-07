import { SITIO } from "@/lib/seo";

/* El @id de la organización tiene que ser idéntico entre la home y cada ficha
   para que las dos hablen de la misma entidad. Ojo: Google parsea el
   structured data por página, así que una referencia por @id sólo tiene
   contenido si el nodo también está definido EN esa página — por eso la ficha
   suma su propio stub de Organization con este mismo @id en vez de apoyarse en
   el bloque de la home. Sale de la misma constante de dominio que usan robots
   y sitemap, y no de un literal suelto. */
export const ORG_ID = `${SITIO}/#organizacion`;
export { SITIO };

export type JsonLdValue =
  | string
  | number
  | boolean
  | null
  | JsonLdValue[]
  | { [clave: string]: JsonLdValue };

export type JsonLdObject = { [clave: string]: JsonLdValue };

export default function JsonLd({ data }: { data: JsonLdObject }) {
  return (
    <script
      type="application/ld+json"
      /* Se escapa el "menor que" a su forma unicode porque un nombre de
         producto que lo contenga cerraría el script y partiría el HTML en dos.
         En JSON válido ese carácter sólo aparece dentro de un string, así que
         reemplazarlo siempre es seguro. */
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
