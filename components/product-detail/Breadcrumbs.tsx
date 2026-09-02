import Link from "next/link";
import { HiChevronRight } from "react-icons/hi2";
import type { Product } from "@/data/products";

export default function Breadcrumbs({ product }: { product: Product }) {
  return (
    <nav className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-4 sm:pb-6">
      <ol className="flex items-center gap-1.5 text-sm text-slate-500 min-w-0">
        <li className="shrink-0">
          <Link href="/" className="hover:text-white transition-colors">
            Inicio
          </Link>
        </li>
        <HiChevronRight aria-hidden="true" className="size-3.5 shrink-0" />
        <li className="shrink-0">
          <Link href="/#inventory" className="hover:text-white transition-colors">
            Volver al stock
          </Link>
        </li>
        <HiChevronRight aria-hidden="true" className="size-3.5 shrink-0" />
        <li className="text-slate-300 truncate min-w-0">
          {product.name} {product.capacity}
        </li>
      </ol>
    </nav>
  );
}
