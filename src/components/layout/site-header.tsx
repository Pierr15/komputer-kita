import Link from "next/link";
import { Computer, Search, ShoppingBag, UserRound } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <>
      <div className="bg-slate-950 text-center text-[11px] font-medium tracking-wide text-slate-300 sm:text-xs">
        <Container className="py-2">Belanja online, ambil pesanan langsung di toko. Tanpa ongkir pickup.</Container>
      </div>
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
        <Container className="flex h-[76px] items-center justify-between gap-4">
          <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="Komputer Kita, beranda">
            <span className="grid size-10 place-items-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
              <Computer className="size-5" />
            </span>
            <span className="leading-tight">
              <span className="block text-[15px] font-black tracking-tight text-slate-950">komputer<span className="text-blue-600">kita</span></span>
              <span className="mt-0.5 block text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-400">Tech store</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-600 md:flex" aria-label="Navigasi utama">
            <Link className="transition-colors hover:text-blue-700" href="/catalog">Semua produk</Link>
            <Link className="transition-colors hover:text-blue-700" href="/catalog?category=Processor">Komponen PC</Link>
            <Link className="transition-colors hover:text-blue-700" href="/catalog?category=Peripheral">Aksesoris</Link>
            <a className="transition-colors hover:text-blue-700" href="#tentang">Tentang</a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <form action="/catalog" className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 lg:flex">
              <Search className="size-4 text-slate-400" />
              <input name="q" aria-label="Cari produk" placeholder="Cari hardware..." className="w-36 bg-transparent text-xs outline-none placeholder:text-slate-400" />
            </form>
            <Link href="/cart" className="grid size-10 place-items-center rounded-full text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950" aria-label="Keranjang">
              <ShoppingBag className="size-[19px]" />
            </Link>
            <ButtonLink href="/login" variant="secondary" size="sm" className="hidden sm:inline-flex">
              <UserRound className="size-4" /> Masuk
            </ButtonLink>
            <Link href="/login" className="grid size-10 place-items-center rounded-full bg-blue-50 text-blue-700 sm:hidden" aria-label="Masuk">
              <UserRound className="size-[18px]" />
            </Link>
          </div>
        </Container>
      </header>
    </>
  );
}
