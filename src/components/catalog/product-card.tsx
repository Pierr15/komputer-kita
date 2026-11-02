import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import type { DemoProduct } from "@/types/catalog";
import { formatRupiah } from "@/lib/format";
import { ProductIconArt } from "@/components/catalog/product-icon";

export function ProductCard({ product }: { product: DemoProduct }) {
  return (
    <article className="product-card group">
      <Link href={`/products/${product.slug}`} className="block" aria-label={`Lihat ${product.name}`}>
        <div className={`product-art product-art-${product.accent}`}>
          {product.featured ? (
            <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-white/85 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-700 backdrop-blur">
              <Sparkles className="size-3" /> Pilihan
            </span>
          ) : null}
          <span className="product-art-orbit" />
          <ProductIconArt icon={product.icon} className="relative z-10 size-20 text-slate-800 transition-transform duration-300 group-hover:scale-110" />
          <span className="absolute bottom-4 right-4 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500/80">{product.category}</span>
        </div>
      </Link>
      <div className="p-4 sm:p-5">
        <div className="mb-2 flex items-center justify-between gap-3">
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">{product.brand}</span>
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700">Baru</span>
        </div>
        <Link href={`/products/${product.slug}`} className="line-clamp-2 min-h-12 text-sm font-bold leading-6 text-slate-900 transition-colors hover:text-blue-700">
          {product.name}
        </Link>
        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Harga contoh</p>
            <p className="mt-1 text-base font-extrabold tracking-tight text-slate-950">{formatRupiah(product.price)}</p>
          </div>
          <span className="grid size-9 place-items-center rounded-full border border-slate-200 text-slate-500 transition-all group-hover:border-blue-600 group-hover:bg-blue-600 group-hover:text-white">
            <ArrowUpRight className="size-4" />
          </span>
        </div>
      </div>
    </article>
  );
}
