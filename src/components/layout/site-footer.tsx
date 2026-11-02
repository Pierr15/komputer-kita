import Link from "next/link";
import { ArrowUpRight, Computer, MapPin, MessageCircle } from "lucide-react";
import { Container } from "@/components/ui/container";

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-slate-950 text-slate-300">
      <Container className="grid gap-12 py-14 md:grid-cols-[1.4fr_0.8fr_0.8fr] md:py-16">
        <div>
          <Link href="/" className="inline-flex items-center gap-2.5 text-white">
            <span className="grid size-10 place-items-center rounded-2xl bg-blue-600"><Computer className="size-5" /></span>
            <span className="text-lg font-black tracking-tight">komputer<span className="text-blue-400">kita</span></span>
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">
            Satu tempat untuk kebutuhan rakit PC, upgrade perangkat, dan aksesoris setup harian.
          </p>
          <p className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-blue-300"><MapPin className="size-4" /> Ambil pesanan langsung di toko</p>
        </div>
        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-white">Jelajahi</h3>
          <div className="mt-5 flex flex-col gap-3 text-sm text-slate-400">
            <Link href="/catalog" className="hover:text-white">Semua produk</Link>
            <Link href="/catalog?category=Processor" className="hover:text-white">Komponen PC</Link>
            <Link href="/catalog?category=Peripheral" className="hover:text-white">Aksesoris</Link>
            <Link href="/cart" className="hover:text-white">Keranjang</Link>
          </div>
        </div>
        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-white">Butuh bantuan?</h3>
          <p className="mt-5 max-w-xs text-sm leading-7 text-slate-400">Detail kontak dan jam buka toko dapat diatur melalui dashboard owner setelah fase pengaturan toko.</p>
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white"><MessageCircle className="size-4 text-blue-400" /> Kontak segera tersedia</span>
        </div>
      </Container>
      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-2 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Komputer Kita. Semua hak dilindungi.</span>
          <span className="inline-flex items-center gap-1">Dibangun untuk kebutuhan tech <ArrowUpRight className="size-3" /></span>
        </Container>
      </div>
    </footer>
  );
}
