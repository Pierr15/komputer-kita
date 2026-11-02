# Komputer Kita

Website toko komputer untuk menjual hardware, komponen PC, peripheral, dan aksesoris. Model pemenuhan pesanan adalah **ambil di toko (pickup), tanpa ongkir**.

## Tech stack

- **Frontend:** TypeScript, Next.js 16 App Router, Tailwind CSS v4, shadcn/ui conventions
- **Backend:** Supabase Postgres, Auth, Storage
- **Payment:** Midtrans Snap (sandbox), belum diaktifkan
- **Deployment target:** Vercel (`sin1`) + Supabase Singapore

## Status saat ini

**Fase 0 · Fondasi (scaffold awal)**

Sudah disiapkan:
- Next.js App Router + TypeScript + import alias `@/*`
- Tailwind CSS v4 dan konfigurasi shadcn/ui
- Struktur Supabase client/server/admin; `service_role` hanya di modul server-only
- SQL awal untuk tabel inti, relasi, index, trigger profil, helper izin, dan RLS
- Bucket publik `product-images` dengan aturan tulis berbasis izin
- Next.js 16 `proxy.ts` sebagai penjaga awal area berdasarkan role
- Landing page, katalog, detail produk demo, keranjang placeholder
- CI GitHub Actions: typecheck, lint, build

Belum dilakukan:
- Belum ada project Supabase yang di-link atau migrasi yang dijalankan ke database nyata
- Belum ada akun owner awal, kredensial OAuth, atau environment secrets
- Data produk dan harga pada UI masih **ilustrasi**, bukan katalog/harga toko aktual
- Keranjang/checkout/pembayaran Midtrans belum aktif
- Belum ada deployment Vercel

## Menjalankan lokal

Persyaratan: Node.js `>=20.9.0` (disarankan Node.js 22) dan npm.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Buka `http://localhost:3000`.

UI storefront dan katalog demo dapat dibuka tanpa Supabase. Untuk mengaktifkan proxy role guard dan integrasi database, isi nilai Supabase di `.env.local`.

## Supabase lokal

Install Supabase CLI terlebih dahulu, lalu jalankan:

```bash
supabase start
supabase db reset
```

Konfigurasi ada di `supabase/config.toml`. Migrasi awal ada di `supabase/migrations/`. Seed kategori, brand, dan pengaturan toko ada di `supabase/seed.sql`.

Untuk project hosted, periksa konfigurasi dan backup terlebih dahulu sebelum menjalankan migrasi. Setelah akun owner pertama mendaftar, promosikan akun tersebut melalui SQL Editor sebagai langkah bootstrap satu kali. Jangan commit `.env.local` atau `SUPABASE_SERVICE_ROLE_KEY`.

## Perintah validasi

```bash
npm run typecheck
npm run lint
npm run build
```

## Struktur penting

```text
src/
  app/                    App Router pages
  components/             Layout, catalog, dan UI primitives
  lib/                    Demo data, formatting, Supabase clients
  proxy.ts                Role-aware request guard (Next.js 16)
  types/                  Domain types
supabase/
  migrations/             Database schema + RLS
  seed.sql                Initial store/category/brand data
.github/workflows/ci.yml  CI checks
```

## Roadmap

| Fase | Fokus | Status |
| --- | --- | --- |
| 0 | Fondasi, struktur database, RLS, CI | Scaffold dibuat; validasi runtime menunggu dependency install |
| 1 | Autentikasi dan role | Belum dimulai |
| 2 | Katalog, kategori, brand, varian, gambar | UI demo tersedia; CRUD belum dimulai |
| 3 | Keranjang dan checkout pickup | Belum dimulai |
| 4 | Midtrans Snap sandbox + webhook | Belum dimulai |
| 5 | Dashboard employee | Placeholder |
| 6 | Dashboard owner | Placeholder |
| 7 | Review, wishlist, notifikasi, SEO lanjutan | Fondasi tabel tersedia |
| 8 | Hardening dan deploy | Belum dimulai |

## Keputusan arsitektur penting

1. Semua nilai uang disimpan sebagai integer Rupiah (`bigint`), bukan pecahan.
2. `order_items` menyimpan snapshot nama produk, SKU, opsi varian, dan harga ketika order dibuat.
3. Perubahan stok tidak boleh memakai pola read-then-write dari aplikasi. Implementasi checkout wajib menggunakan RPC/transaksi dengan `SELECT ... FOR UPDATE`.
4. Webhook Midtrans menjadi sumber kebenaran status pembayaran. Halaman `finish` hanya menampilkan status.
5. `SUPABASE_SERVICE_ROLE_KEY` hanya boleh digunakan di server dan tidak pernah diberi awalan `NEXT_PUBLIC_`.
6. Setiap order menggunakan pickup di toko; belum ada ongkos kirim atau integrasi kurir.

## Dependency dan tahap berikutnya

- Fase 1: Supabase Auth + SSR cookie integration, halaman login/register/callback/profile, dan role management.
- Fase 2: CRUD produk/varian, kompresi gambar di browser, Supabase Storage, filtering/sorting katalog.
- Fase 3: cart + cart_items, RPC reserve stock, snapshot order items, pickup code.
- Fase 4: Midtrans Snap sandbox, signature validation, idempotent payment events, reconciliation.

Lihat `docs/architecture.md`, `docs/phase-0-checklist.md`, `docs/owner-bootstrap.md`, dan `docs/github-setup.md` untuk rincian implementasi dan langkah membuat repository GitHub.
