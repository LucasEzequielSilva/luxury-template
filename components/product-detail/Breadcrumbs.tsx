import Link from "next/link";
import { HiChevronRight } from "react-icons/hi2";

/* Dos niveles. El "Stock" intermedio linkeaba a /#inventory, que es la misma
   URL que Inicio con otro fragmento: como nivel de jerarquía no aportaba nada
   y en el BreadcrumbList hacía que Google descartara el trail. El acceso al
   stock sigue estando en el Navbar y en el menú mobile.
   La etiqueta la arma la página porque incluye la condición cuando hay otra
   unidad idéntica, y tiene que coincidir con el structured data. */
export default function Breadcrumbs({ etiqueta }: { etiqueta: string }) {
  return (
    <nav aria-label="Miga de pan" className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-4 sm:pb-6">
      <ol className="flex items-center gap-1.5 text-sm text-slate-500 min-w-0">
        <li className="shrink-0">
          <Link href="/" className="hover:text-white transition-colors">
            Inicio
          </Link>
        </li>
        <HiChevronRight aria-hidden="true" className="size-3.5 shrink-0" />
        <li aria-current="page" className="text-slate-300 truncate min-w-0">
          {etiqueta}
        </li>
      </ol>
    </nav>
  );
}
