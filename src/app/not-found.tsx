import Link from "next/link";
import { Container } from "@/components/ui/container";

export default function NotFound() {
  return (
    <div className="page-shell grid place-items-center py-24">
      <Container className="text-center">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-blue-600">404 / Not found</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">Halaman tidak ditemukan.</h1>
        <p className="mt-4 text-sm text-slate-500">Sepertinya halaman yang kamu cari belum ada.</p>
        <Link href="/" className="mt-7 inline-flex rounded-full bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-700">Ke beranda</Link>
      </Container>
    </div>
  );
}
