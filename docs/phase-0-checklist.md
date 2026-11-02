# Phase 0 checklist

- [x] Next.js App Router + TypeScript + Tailwind CSS v4 scaffold
- [x] shadcn/ui configuration and reusable UI primitives
- [x] Supabase config and browser/server/admin client modules
- [x] Initial schema for profiles, permissions, store settings, categories, brands, products, variants, images, carts, orders, payments, logs, vouchers, reviews, wishlist, notifications, and inventory adjustments
- [x] RLS enabled for application tables
- [x] Owner/employee permission helper and owner-only role/permission RPCs
- [x] Public product image bucket with restricted writes
- [x] Role-aware Next.js 16 proxy scaffold
- [x] Storefront landing page, catalogue demo, and product detail demo
- [x] GitHub Actions validation workflow
- [ ] Install dependencies and generate lockfile
- [ ] Run `npm run typecheck`, `npm run lint`, and `npm run build`
- [ ] Review SQL on a local Supabase instance
- [ ] Create/link the actual hosted Supabase project in Singapore
- [ ] Configure secrets only in local/Vercel environments

## Exit criteria

Phase 0 is complete when all three application checks pass, the migration can be applied cleanly to a local Supabase database, and the actual repository has a protected default branch with CI enabled.
