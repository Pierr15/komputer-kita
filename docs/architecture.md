# Architecture Notes

## Application layers

- `src/app`: Next.js App Router routes and metadata.
- `src/components`: reusable storefront and dashboard UI.
- `src/lib/supabase/client.ts`: browser client using public/anon key.
- `src/lib/supabase/server.ts`: server-rendered client using SSR cookies.
- `src/lib/supabase/admin.ts`: server-only service-role client for trusted server operations.
- `src/proxy.ts`: optimistic role redirects for owner, employee, and buyer areas. It is not an authorization boundary; server-side checks and RLS are mandatory.
- `supabase/migrations`: schema, RLS policies, helper functions, storage bucket.

## Roles and permissions

- `owner`: full access through `has_permission(text)`.
- `employee`: granular permissions stored in `employee_permissions.permissions`.
- `buyer`: access to their own profile, cart, orders, wishlist, and notifications.

The role column is not directly updateable by authenticated clients. Role changes are exposed through the owner-checked `admin_update_user_role` RPC. Permission changes are exposed through `set_employee_permissions`.

## Order and inventory invariants

- Price fields are integer Rupiah (`bigint`).
- `order_items` is an immutable purchase snapshot at order creation time.
- Checkout must re-read current price and stock on the server.
- Stock reservation must be performed by a database RPC using row locks (`SELECT ... FOR UPDATE`).
- Employee stock adjustments use `adjust_variant_stock`, which locks the variant row and writes an adjustment record in the same transaction.
- Employees cannot directly write `stock` or `reserved` columns. Variant metadata/price updates use column-level grants.
- Order processing uses constrained status transitions. Pickup completion requires the stored pickup code through `complete_pickup`.
- `reserved` must never exceed `stock`.
- Payment state must be driven by a verified, idempotent webhook and reconciliation, never by a browser redirect alone.

## Storage

The `product-images` bucket is public for read access. Upload, update, and delete are restricted to users with `products.write` permission. Store only storage paths in database records; generate public URLs from the storage client at read time.

## Current simplifications

The storefront currently reads a small local demo catalogue so that the UI can be reviewed before Supabase credentials exist. No live inventory or actual pricing is represented.
