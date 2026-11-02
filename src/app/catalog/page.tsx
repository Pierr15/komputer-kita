import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ProductCard } from "@/components/catalog/product-card";
import { demoProducts } from "@/lib/demo-data";

export const metadata: Metadata = { title: "Katalog Produk" };

type CatalogPageProps = {
  searchParams: Promise<{ q?: string; category?: string }>;
};

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const params = await searchParams;
  const query = params.q?.trim().toLowerCase() ?? "";
  const category = params.category?.trim() ?? "";
  const products = demoProducts.filter((product) => {
    const matchesQuery = !query || [product.name, product.brand, product.category].some((value) => value.toLowerCase().includes(query));
    const matchesCategory = !category || product.category.toLowerCase() === category.toLowerCase() || (category.toLowerCase() === "peripheral" && ["mouse", "keyboard", "headset"].includes(product.category.toLowerCase()));
    return matchesQuery && matchesCategory;
  });

  return (
    <div className="page-shell py-12 sm:py-16">
      <Container>
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-700"><ArrowLeft className="size-4" /> Kembali ke beranda</Link>
        <div className="flex flex-col gap-5 border-b border-slate-200 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-blue-600">Komputer Kita / Katalog</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Jelajahi semua produk.</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">Temukan hardware, komponen PC, dan aksesoris untuk melengkapi setup-mu.</p>
          </div>
          <form action="/catalog" className="flex h-12 w-full max-w-md items-center gap-3 rounded-full border border-slate-200 bg-white px-5 shadow-sm">
            <Search className="size-4 shrink-0 text-slate-400" />
            <input name="q" defaultValue={params.q} placeholder="Cari nama, brand, kategori..." className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400" />
            {category ? <input type="hidden" name="category" value={category} /> : null}
            <button className="text-xs font-bold text-blue-700 hover:text-blue-900">Cari</button>
          </form>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <Link href="/catalog" className={`rounded-full px-4 py-2 text-xs font-semibold ${!category ? "bg-slate-950 text-white" : "border border-slate-200 bg-white text-slate-600 hover:border-blue-300"}`}>Semua</Link>
          {["Processor", "Motherboard", "Memory", "Storage", "Graphics Card", "Mouse", "Keyboard", "Headset", "Monitor"].map((item) => (
            <Link key={item} href={`/catalog?category=${encodeURIComponent(item)}`} className={`rounded-full px-4 py-2 text-xs font-semibold ${category.toLowerCase() === item.toLowerCase() ? "bg-slate-950 text-white" : "border border-slate-200 bg-white text-slate-600 hover:border-blue-300"}`}>{item}</Link>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-between">
          <p className="text-sm text-slate-500"><span className="font-bold text-slate-900">{products.length}</span> produk contoh</p>
          <span className="rounded-full bg-amber-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-700">Katalog demo</span>
        </div>
        {products.length ? (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => <ProductCard key={product.slug} product={product} />)}
          </div>
        ) : (
          <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <p className="text-lg font-bold text-slate-900">Produk belum ditemukan.</p>
            <p className="mt-2 text-sm text-slate-500">Coba kata kunci atau kategori lain.</p>
            <Link href="/catalog" className="mt-5 inline-block text-sm font-bold text-blue-700">Reset filter</Link>
          </div>
        )}
      </Container>
    </div>
  );
}
