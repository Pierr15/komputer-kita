import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";

export default function CartPage() {
  return (
    <div className="page-shell py-16 sm:py-24">
      <Container>
        <div className="mx-auto max-w-xl rounded-[2rem] border border-slate-200 bg-white px-7 py-12 text-center shadow-sm sm:px-12">
          <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-blue-50 text-blue-700"><ShoppingBag className="size-7" /></span>
          <p className="mt-7 text-[11px] font-bold uppercase tracking-[0.2em] text-blue-600">Keranjang</p>
          <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-950">Keranjang belum aktif.</h1>
          <p className="mt-3 text-sm leading-7 text-slate-500">Penyimpanan keranjang, validasi stok, dan checkout akan dibangun pada Fase 3. Saat ini halaman ini masih berupa placeholder.</p>
          <ButtonLink href="/catalog" className="mt-7">Lihat katalog <ArrowRight className="size-4" /></ButtonLink>
          <p className="mt-5 text-xs text-slate-400"><Link href="/" className="hover:text-blue-700">Kembali ke beranda</Link></p>
        </div>
      </Container>
    </div>
  );
}
