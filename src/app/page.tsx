import Link from "next/link";
import type { ComponentProps } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Box,
  ClipboardCheck,
  Headphones,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { ProductCard } from "@/components/catalog/product-card";
import { ProductIconArt } from "@/components/catalog/product-icon";
import { SectionHeading } from "@/components/layout/section-heading";
import { demoCategories, demoProducts } from "@/lib/demo-data";

const benefits = [
  { icon: PackageCheck, title: "Pickup di toko", description: "Pesan online, ambil sendiri saat pesanan sudah siap." },
  { icon: ShieldCheck, title: "Detail produk jelas", description: "Spesifikasi dan varian disusun agar kamu lebih mudah memilih." },
  { icon: Headphones, title: "Bantuan sebelum checkout", description: "Ruang untuk konsultasi produk dan kebutuhan rakitan." },
];

export default function HomePage() {
  const featured = demoProducts.filter((product) => product.featured).slice(0, 5);

  return (
    <>
      <section className="relative isolate overflow-hidden bg-slate-950 text-white">
        <div className="hero-grid absolute inset-0 opacity-80" />
        <div className="hero-glow absolute -right-36 -top-44 size-[620px] rounded-full" />
        <div className="absolute -bottom-48 left-[22%] size-[420px] rounded-full bg-indigo-500/10 blur-3xl" />
        <Container className="relative grid min-h-[610px] items-center gap-12 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
          <div className="max-w-2xl">
            <div className="hero-chip mb-7 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-blue-100">
              <Sparkles className="size-3.5 text-blue-300" /> Your setup starts here
            </div>
            <h1 className="text-4xl font-black leading-[1.08] tracking-[-0.045em] sm:text-5xl lg:text-[4.2rem]">
              Upgrade setup.
              <span className="mt-1 block text-blue-400">Unlock your next level.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
              Dari komponen inti sampai aksesoris meja kerja, temukan kebutuhan komputermu di satu tempat.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href="/catalog" size="lg">Jelajahi produk <ArrowRight className="size-4" /></ButtonLink>
              <ButtonLink href="#cara-belanja" variant="dark" size="lg" className="border border-white/20 bg-white/5">Cara belanja</ButtonLink>
            </div>
            <div className="mt-12 flex flex-wrap items-center gap-x-7 gap-y-3 text-xs font-medium text-slate-400">
              <span className="inline-flex items-center gap-2"><BadgeCheck className="size-4 text-blue-400" /> Hardware & aksesoris</span>
              <span className="inline-flex items-center gap-2"><Box className="size-4 text-blue-400" /> Pickup tanpa ongkir</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[490px]">
            <div className="absolute inset-8 rounded-full bg-blue-500/20 blur-3xl" />
            <div className="relative rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/10 to-white/[0.03] p-5 shadow-2xl shadow-black/30 backdrop-blur-sm sm:p-7">
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-300">Build your dream PC</p>
                  <p className="mt-1 text-lg font-bold text-white">Komponen pilihan</p>
                </div>
                <span className="rounded-full bg-emerald-400/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300">Explore</span>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-5">
                {[
                  { icon: "cpu" as const, title: "Processor", sub: "The brain" },
                  { icon: "gpu" as const, title: "Graphics", sub: "The power" },
                  { icon: "memory" as const, title: "Memory", sub: "The speed" },
                  { icon: "storage" as const, title: "Storage", sub: "The space" },
                ].map((item) => (
                  <Link href="/catalog" key={item.title} className="group rounded-2xl border border-white/10 bg-slate-900/70 p-4 transition hover:border-blue-400/50 hover:bg-slate-900">
                    <div className="mb-5 grid size-12 place-items-center rounded-xl bg-blue-500/10 text-blue-300 transition group-hover:bg-blue-500/20">
                      <ProductIconArt icon={item.icon} className="size-6" />
                    </div>
                    <p className="text-sm font-bold text-white">{item.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{item.sub}</p>
                  </Link>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between rounded-2xl bg-blue-600 p-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-blue-100">One stop tech store</p>
                  <p className="mt-1 text-sm font-bold text-white">Find your next upgrade.</p>
                </div>
                <Wrench className="size-7 text-blue-100" />
              </div>
            </div>
            <div className="hero-chip absolute -left-7 top-24 hidden rounded-2xl px-4 py-3 shadow-xl sm:block">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-300">Pick your parts</p>
              <p className="mt-1 text-sm font-bold text-white">Build smarter.</p>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Browse by category"
            title="Cari komponen, bukan jalan memutar."
            description="Mulai dari komponen rakitan sampai perangkat yang bikin setup makin nyaman."
            action={<Link href="/catalog" className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-800">Semua kategori <ArrowRight className="size-4" /></Link>}
          />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {demoCategories.map((category) => (
              <Link href={category.href} key={category.name} className="category-tile rounded-2xl p-4 sm:p-5">
                <span className="grid size-12 place-items-center rounded-2xl bg-blue-50 text-blue-700">
                  <ProductIconArt icon={category.icon} className="size-6" />
                </span>
                <span className="mt-5 block text-sm font-bold text-slate-900">{category.name}</span>
                <span className="mt-1 block text-xs text-slate-400">{category.count}</span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-slate-200/70 bg-white py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Curated for your setup"
            title="Produk pilihan untuk mulai eksplorasi."
            description="Katalog awal ini memakai data contoh. Harga dan ketersediaan belum terhubung ke inventaris toko."
            action={<ButtonLink href="/catalog" variant="secondary">Lihat katalog <ArrowRight className="size-4" /></ButtonLink>}
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {featured.map((product) => <ProductCard key={product.slug} product={product} />)}
          </div>
        </Container>
      </section>

      <section id="cara-belanja" className="py-16 sm:py-20">
        <Container>
          <div className="rounded-[2rem] bg-blue-50 p-7 sm:p-10 lg:p-12">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-blue-700">Simple & straightforward</p>
                <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Belanja praktis, ambil langsung.</h2>
                <p className="mt-4 max-w-md text-sm leading-7 text-slate-600">Model pemenuhan Komputer Kita berfokus pada pengambilan pesanan di toko. Tidak ada ongkir yang dihitung saat checkout.</p>
                <ButtonLink href="/catalog" className="mt-7">Mulai jelajahi <ArrowRight className="size-4" /></ButtonLink>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { number: "01", icon: SearchIcon, title: "Pilih produk", text: "Temukan produk dan varian yang sesuai." },
                  { number: "02", icon: ClipboardCheck, title: "Buat pesanan", text: "Konfirmasi ringkasan dan lakukan pembayaran." },
                  { number: "03", icon: PackageCheck, title: "Ambil di toko", text: "Tunjukkan kode pickup saat pesanan siap." },
                ].map((step) => (
                  <div key={step.number} className="rounded-2xl border border-blue-100 bg-white p-5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black tracking-widest text-blue-600">{step.number}</span>
                      <step.icon className="size-5 text-blue-600" />
                    </div>
                    <h3 className="mt-8 text-sm font-bold text-slate-950">{step.title}</h3>
                    <p className="mt-2 text-xs leading-6 text-slate-500">{step.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section id="tentang" className="pb-4">
        <Container>
          <div className="grid gap-8 md:grid-cols-3">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="flex gap-4 border-t border-slate-200 pt-6">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-700"><benefit.icon className="size-5" /></span>
                <div><h3 className="text-sm font-bold text-slate-900">{benefit.title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{benefit.description}</p></div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

function SearchIcon(props: ComponentProps<"svg">) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>;
}
