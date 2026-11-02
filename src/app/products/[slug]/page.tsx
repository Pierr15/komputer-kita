import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Check, PackageCheck, ShoppingBag } from "lucide-react";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { ProductIconArt } from "@/components/catalog/product-icon";
import { demoProducts } from "@/lib/demo-data";
import { formatRupiah } from "@/lib/format";

type ProductPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = demoProducts.find((item) => item.slug === slug);
  return { title: product?.name ?? "Produk tidak ditemukan" };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = demoProducts.find((item) => item.slug === slug);
  if (!product) notFound();

  return (
    <div className="page-shell py-12 sm:py-16">
      <Container>
        <Link href="/catalog" className="mb-8 inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-700"><ArrowLeft className="size-4" /> Kembali ke katalog</Link>
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className={`product-art product-art-${product.accent} min-h-[360px] rounded-[2rem] sm:min-h-[480px]`}>
            <span className="product-art-orbit" />
            <ProductIconArt icon={product.icon} className="relative z-10 size-36 text-slate-800 sm:size-44" />
            <span className="absolute bottom-7 left-7 rounded-full bg-white/80 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-600 backdrop-blur">Ilustrasi produk</span>
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-blue-600">{product.brand} / {product.category}</p>
            <h1 className="mt-3 text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-4xl">{product.name}</h1>
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Harga contoh</p>
              <p className="mt-2 text-3xl font-black tracking-tight text-slate-950">{formatRupiah(product.price)}</p>
              <p className="mt-3 text-xs leading-5 text-amber-700">Harga ini hanya data ilustrasi untuk tampilan awal, bukan penawaran atau harga toko aktual.</p>
            </div>
            <p className="mt-6 text-sm leading-7 text-slate-600">{product.description}</p>
            <div className="mt-7">
              <h2 className="text-sm font-bold text-slate-950">Spesifikasi ringkas</h2>
              <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                {product.specs.map((spec) => <li key={spec} className="flex items-center gap-2 text-sm text-slate-600"><Check className="size-4 text-emerald-600" /> {spec}</li>)}
              </ul>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/cart" size="lg"><ShoppingBag className="size-4" /> Lihat keranjang demo</ButtonLink>
              <ButtonLink href="/catalog" variant="secondary" size="lg">Lanjut belanja</ButtonLink>
            </div>
            <div className="mt-7 flex items-start gap-3 rounded-2xl bg-blue-50 p-4 text-xs leading-6 text-blue-900">
              <PackageCheck className="mt-0.5 size-5 shrink-0 text-blue-700" />
              <span>Model pemenuhan yang direncanakan adalah pickup di toko. Stok, varian, keranjang, dan checkout akan dihubungkan pada fase berikutnya.</span>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
