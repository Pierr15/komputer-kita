-- Komputer Kita: initial schema for Phase 0.
-- Money values are integer Rupiah (bigint). Inventory writes must later go through RPCs.

create extension if not exists pgcrypto with schema extensions;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  role text not null default 'buyer' check (role in ('owner', 'employee', 'buyer')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.employee_permissions (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  permissions text[] not null default '{}',
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.store_settings (
  id smallint primary key default 1 check (id = 1),
  store_name text not null default 'Komputer Kita',
  logo_path text,
  about text,
  address text,
  phone text,
  email text,
  opening_hours jsonb not null default '{}'::jsonb,
  pickup_instructions text,
  critical_stock_threshold integer not null default 5 check (critical_stock_threshold >= 0),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image_path text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.brands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  logo_path text,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  brand_id uuid references public.brands(id) on delete set null,
  name text not null,
  slug text not null unique,
  description text,
  condition text not null default 'new' check (condition in ('new', 'used')),
  is_featured boolean not null default false,
  is_active boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  sku text not null unique,
  name text not null,
  options jsonb not null default '{}'::jsonb check (jsonb_typeof(options) = 'object'),
  options_key text not null,
  price bigint not null check (price >= 0),
  compare_at_price bigint check (compare_at_price is null or compare_at_price >= 0),
  stock integer not null default 0 check (stock >= 0),
  reserved integer not null default 0 check (reserved >= 0 and reserved <= stock),
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (product_id, options_key)
);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  variant_id uuid references public.product_variants(id) on delete cascade,
  storage_path text not null,
  alt_text text,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.carts(id) on delete cascade,
  variant_id uuid not null references public.product_variants(id) on delete restrict,
  quantity integer not null check (quantity > 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (cart_id, variant_id)
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique,
  buyer_id uuid not null references public.profiles(id) on delete restrict,
  status text not null default 'pending_payment' check (status in ('pending_payment', 'paid', 'processing', 'ready_for_pickup', 'completed', 'cancelled', 'refunded')),
  pickup_code text unique,
  subtotal bigint not null default 0 check (subtotal >= 0),
  discount_total bigint not null default 0 check (discount_total >= 0),
  total bigint not null default 0 check (total >= 0),
  voucher_id uuid,
  snap_token text,
  midtrans_order_id text unique,
  payment_expires_at timestamptz,
  notes text,
  paid_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  variant_id uuid references public.product_variants(id) on delete set null,
  product_name text not null,
  sku text not null,
  variant_options jsonb not null default '{}'::jsonb,
  unit_price bigint not null check (unit_price >= 0),
  quantity integer not null check (quantity > 0),
  line_total bigint not null check (line_total >= 0),
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.payment_events (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete set null,
  provider_event_id text not null unique,
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  received_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  target_table text not null,
  target_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.vouchers (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  description text,
  discount_type text not null check (discount_type in ('fixed', 'percentage')),
  discount_value bigint not null check (discount_value > 0),
  minimum_spend bigint not null default 0 check (minimum_spend >= 0),
  max_discount bigint check (max_discount is null or max_discount >= 0),
  usage_limit integer check (usage_limit is null or usage_limit > 0),
  used_count integer not null default 0 check (used_count >= 0),
  starts_at timestamptz,
  expires_at timestamptz,
  is_active boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  buyer_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  body text,
  reply text,
  is_published boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (order_id, product_id)
);

create table if not exists public.wishlist (
  user_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  primary key (user_id, product_id)
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  body text,
  metadata jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.inventory_adjustments (
  id uuid primary key default gen_random_uuid(),
  variant_id uuid not null references public.product_variants(id) on delete restrict,
  actor_id uuid references public.profiles(id) on delete set null,
  quantity_delta integer not null check (quantity_delta <> 0),
  reason text not null,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.orders
  add constraint orders_voucher_id_fkey foreign key (voucher_id) references public.vouchers(id) on delete set null;

create index if not exists products_category_id_idx on public.products(category_id);
create index if not exists products_brand_id_idx on public.products(brand_id);
create index if not exists products_active_featured_idx on public.products(is_active, is_featured);
create index if not exists product_variants_product_id_idx on public.product_variants(product_id);
create index if not exists product_images_product_sort_idx on public.product_images(product_id, sort_order);
create index if not exists cart_items_cart_id_idx on public.cart_items(cart_id);
create index if not exists orders_buyer_created_idx on public.orders(buyer_id, created_at desc);
create index if not exists orders_status_created_idx on public.orders(status, created_at desc);
create index if not exists order_items_order_id_idx on public.order_items(order_id);
create index if not exists reviews_product_created_idx on public.reviews(product_id, created_at desc);
create index if not exists notifications_user_created_idx on public.notifications(user_id, created_at desc);
create index if not exists audit_logs_created_idx on public.audit_logs(created_at desc);

create or replace function public.is_current_user_owner()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'owner'
  );
$$;

grant execute on function public.is_current_user_owner() to authenticated;

create or replace function public.has_permission(permission_name text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and (
        p.role = 'owner'
        or (
          p.role = 'employee'
          and exists (
            select 1
            from public.employee_permissions ep
            where ep.user_id = p.id
              and permission_name = any(ep.permissions)
          )
        )
      )
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', new.email))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.admin_update_user_role(target_user_id uuid, new_role text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_current_user_owner() then
    raise exception 'Forbidden' using errcode = '42501';
  end if;
  if new_role not in ('owner', 'employee', 'buyer') then
    raise exception 'Invalid role';
  end if;
  update public.profiles set role = new_role, updated_at = timezone('utc', now()) where id = target_user_id;
  if not found then raise exception 'Profile not found'; end if;
  if new_role <> 'employee' then delete from public.employee_permissions where user_id = target_user_id; end if;
end;
$$;

create or replace function public.set_employee_permissions(target_user_id uuid, granted_permissions text[])
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_current_user_owner() then
    raise exception 'Forbidden' using errcode = '42501';
  end if;
  if not exists (select 1 from public.profiles where id = target_user_id and role = 'employee') then
    raise exception 'Target user is not an employee';
  end if;
  insert into public.employee_permissions (user_id, permissions)
  values (target_user_id, coalesce(granted_permissions, '{}'))
  on conflict (user_id) do update
    set permissions = excluded.permissions, updated_at = timezone('utc', now());
end;
$$;

grant execute on function public.has_permission(text) to authenticated;
revoke all on function public.admin_update_user_role(uuid, text) from public, anon;
revoke all on function public.set_employee_permissions(uuid, text[]) from public, anon;
grant execute on function public.admin_update_user_role(uuid, text) to authenticated;
grant execute on function public.set_employee_permissions(uuid, text[]) to authenticated;

-- Employee workflow operations are exposed as constrained RPCs instead of broad table updates.
create or replace function public.advance_order_status(target_order_id uuid, next_status text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare current_status text;
begin
  if not public.has_permission('orders.process') then
    raise exception 'Forbidden' using errcode = '42501';
  end if;

  select status into current_status
  from public.orders
  where id = target_order_id
  for update;

  if not found then raise exception 'Order not found'; end if;

  if not (
    (current_status = 'paid' and next_status = 'processing')
    or (current_status = 'processing' and next_status = 'ready_for_pickup')
  ) then
    raise exception 'Invalid order status transition: % -> %', current_status, next_status;
  end if;

  update public.orders
  set status = next_status, updated_at = now()
  where id = target_order_id;

  insert into public.audit_logs (actor_id, action, target_table, target_id, metadata)
  values (auth.uid(), 'order.status_changed', 'orders', target_order_id::text,
          jsonb_build_object('from', current_status, 'to', next_status));
end;
$$;

create or replace function public.complete_pickup(target_order_id uuid, supplied_pickup_code text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare current_status text;
        stored_pickup_code text;
begin
  if not public.has_permission('orders.process') then
    raise exception 'Forbidden' using errcode = '42501';
  end if;

  select status, pickup_code into current_status, stored_pickup_code
  from public.orders
  where id = target_order_id
  for update;

  if not found then raise exception 'Order not found'; end if;
  if current_status <> 'ready_for_pickup' then
    raise exception 'Order is not ready for pickup';
  end if;
  if stored_pickup_code is null or stored_pickup_code <> trim(coalesce(supplied_pickup_code, '')) then
    raise exception 'Invalid pickup code' using errcode = '22023';
  end if;

  update public.orders
  set status = 'completed', completed_at = now(), updated_at = now()
  where id = target_order_id;

  insert into public.audit_logs (actor_id, action, target_table, target_id)
  values (auth.uid(), 'order.pickup_completed', 'orders', target_order_id::text);
end;
$$;

create or replace function public.adjust_variant_stock(target_variant_id uuid, quantity_delta integer, adjustment_reason text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare current_stock integer;
        current_reserved integer;
begin
  if not public.has_permission('inventory.adjust') then
    raise exception 'Forbidden' using errcode = '42501';
  end if;
  if quantity_delta = 0 or nullif(trim(adjustment_reason), '') is null then
    raise exception 'A non-zero adjustment and reason are required';
  end if;

  select stock, reserved into current_stock, current_reserved
  from public.product_variants
  where id = target_variant_id
  for update;

  if not found then raise exception 'Product variant not found'; end if;
  if current_stock + quantity_delta < current_reserved then
    raise exception 'Stock cannot be reduced below reserved quantity';
  end if;
  if current_stock + quantity_delta < 0 then raise exception 'Stock cannot be negative'; end if;

  update public.product_variants
  set stock = current_stock + quantity_delta, updated_at = now()
  where id = target_variant_id;

  insert into public.inventory_adjustments (variant_id, actor_id, quantity_delta, reason)
  values (target_variant_id, auth.uid(), quantity_delta, trim(adjustment_reason));

  insert into public.audit_logs (actor_id, action, target_table, target_id, metadata)
  values (auth.uid(), 'inventory.adjusted', 'product_variants', target_variant_id::text,
          jsonb_build_object('delta', quantity_delta, 'reason', trim(adjustment_reason)));
end;
$$;

create or replace function public.reply_to_review(target_review_id uuid, response_text text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.has_permission('reviews.reply') then
    raise exception 'Forbidden' using errcode = '42501';
  end if;
  if nullif(trim(response_text), '') is null then
    raise exception 'A non-empty reply is required';
  end if;

  update public.reviews
  set reply = trim(response_text), updated_at = now()
  where id = target_review_id;
  if not found then raise exception 'Review not found'; end if;

  insert into public.audit_logs (actor_id, action, target_table, target_id)
  values (auth.uid(), 'review.replied', 'reviews', target_review_id::text);
end;
$$;

revoke all on function public.advance_order_status(uuid, text) from public, anon;
revoke all on function public.complete_pickup(uuid, text) from public, anon;
revoke all on function public.adjust_variant_stock(uuid, integer, text) from public, anon;
revoke all on function public.reply_to_review(uuid, text) from public, anon;
grant execute on function public.advance_order_status(uuid, text) to authenticated;
grant execute on function public.complete_pickup(uuid, text) to authenticated;
grant execute on function public.adjust_variant_stock(uuid, integer, text) to authenticated;
grant execute on function public.reply_to_review(uuid, text) to authenticated;

-- updated_at triggers
DO $$
DECLARE table_name text;
BEGIN
  FOREACH table_name IN ARRAY ARRAY['profiles','employee_permissions','store_settings','carts','cart_items','orders','products','product_variants','categories','brands','vouchers','reviews']
  LOOP
    EXECUTE format('drop trigger if exists set_%I_updated_at on public.%I', table_name, table_name);
    EXECUTE format('create trigger set_%I_updated_at before update on public.%I for each row execute procedure public.set_updated_at()', table_name, table_name);
  END LOOP;
END;
$$;

-- RLS is enabled on every application table.
DO $$
DECLARE table_name text;
BEGIN
  FOREACH table_name IN ARRAY ARRAY[
    'profiles','employee_permissions','store_settings','categories','brands','products','product_variants','product_images',
    'carts','cart_items','orders','order_items','payment_events','audit_logs','vouchers','reviews','wishlist','notifications','inventory_adjustments'
  ]
  LOOP
    EXECUTE format('alter table public.%I enable row level security', table_name);
  END LOOP;
END;
$$;

-- Profile access. Buyers may edit contact fields only; role changes use the owner-only RPC.
create policy "profiles_select_self_or_manager" on public.profiles
for select to authenticated
using (id = auth.uid() or public.has_permission('users.manage'));

create policy "profiles_update_self" on public.profiles
for update to authenticated
using (id = auth.uid())
with check (id = auth.uid());

revoke update on public.profiles from anon, authenticated;
grant update (full_name, phone) on public.profiles to authenticated;

create policy "employee_permissions_select_self_or_manager" on public.employee_permissions
for select to authenticated
using (user_id = auth.uid() or public.has_permission('users.manage'));
create policy "employee_permissions_manage" on public.employee_permissions
for all to authenticated
using (public.is_current_user_owner())
with check (public.is_current_user_owner());

create policy "store_settings_public_read" on public.store_settings
for select to anon, authenticated using (true);
create policy "store_settings_owner_update" on public.store_settings
for update to authenticated
using (public.is_current_user_owner())
with check (public.is_current_user_owner());

create policy "categories_public_read" on public.categories
for select to anon, authenticated using (is_active or public.has_permission('products.read'));
create policy "categories_manage" on public.categories
for all to authenticated using (public.has_permission('products.write')) with check (public.has_permission('products.write'));

create policy "brands_public_read" on public.brands
for select to anon, authenticated using (is_active or public.has_permission('products.read'));
create policy "brands_manage" on public.brands
for all to authenticated using (public.has_permission('products.write')) with check (public.has_permission('products.write'));

create policy "products_public_read" on public.products
for select to anon, authenticated using (is_active or public.has_permission('products.read'));
create policy "products_manage" on public.products
for all to authenticated using (public.has_permission('products.write')) with check (public.has_permission('products.write'));

create policy "variants_public_read" on public.product_variants
for select to anon, authenticated using (
  (is_active and exists (select 1 from public.products p where p.id = product_id and p.is_active))
  or public.has_permission('products.read')
);
create policy "variants_manage" on public.product_variants
for all to authenticated using (public.has_permission('products.write')) with check (public.has_permission('products.write'));
-- Staff may edit variant metadata and price, but stock/reserved are only mutable via RPCs.
revoke insert, update on public.product_variants from anon, authenticated;
grant insert (product_id, sku, name, options, options_key, price, compare_at_price, is_active)
  on public.product_variants to authenticated;
grant update (product_id, sku, name, options, options_key, price, compare_at_price, is_active)
  on public.product_variants to authenticated;

create policy "product_images_public_read" on public.product_images
for select to anon, authenticated using (
  exists (select 1 from public.products p where p.id = product_id and p.is_active)
  or public.has_permission('products.read')
);
create policy "product_images_manage" on public.product_images
for all to authenticated using (public.has_permission('products.write')) with check (public.has_permission('products.write'));

create policy "carts_select_own" on public.carts for select to authenticated using (user_id = auth.uid());
create policy "carts_insert_own" on public.carts for insert to authenticated with check (user_id = auth.uid());
create policy "carts_update_own" on public.carts for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "carts_delete_own" on public.carts for delete to authenticated using (user_id = auth.uid());

create policy "cart_items_select_own" on public.cart_items for select to authenticated
using (exists (select 1 from public.carts c where c.id = cart_id and c.user_id = auth.uid()));
create policy "cart_items_insert_own" on public.cart_items for insert to authenticated
with check (exists (select 1 from public.carts c where c.id = cart_id and c.user_id = auth.uid()));
create policy "cart_items_update_own" on public.cart_items for update to authenticated
using (exists (select 1 from public.carts c where c.id = cart_id and c.user_id = auth.uid()))
with check (exists (select 1 from public.carts c where c.id = cart_id and c.user_id = auth.uid()));
create policy "cart_items_delete_own" on public.cart_items for delete to authenticated
using (exists (select 1 from public.carts c where c.id = cart_id and c.user_id = auth.uid()));

create policy "orders_select_owner_or_processor" on public.orders
for select to authenticated using (buyer_id = auth.uid() or public.has_permission('orders.process'));
revoke update on public.orders from anon, authenticated;

create policy "order_items_select_buyer_or_processor" on public.order_items
for select to authenticated using (
  exists (select 1 from public.orders o where o.id = order_id and (o.buyer_id = auth.uid() or public.has_permission('orders.process')))
);

-- Payment events and audit logs are intentionally service-role only.
create policy "audit_logs_read_authorized" on public.audit_logs
for select to authenticated using (public.has_permission('audit.read'));

create policy "vouchers_public_read_active" on public.vouchers
for select to anon, authenticated using (
  is_active and (starts_at is null or starts_at <= now()) and (expires_at is null or expires_at > now())
);
create policy "vouchers_manage" on public.vouchers
for all to authenticated using (public.has_permission('vouchers.manage')) with check (public.has_permission('vouchers.manage'));

create policy "reviews_public_read_published" on public.reviews
for select to anon, authenticated using (is_published or buyer_id = auth.uid() or public.has_permission('reviews.reply'));
create policy "reviews_insert_completed_order" on public.reviews
for insert to authenticated with check (
  buyer_id = auth.uid()
  and exists (select 1 from public.orders o where o.id = order_id and o.buyer_id = auth.uid() and o.status = 'completed')
  and exists (select 1 from public.order_items oi where oi.order_id = order_id and oi.product_id = product_id)
);
revoke update on public.reviews from anon, authenticated;

create policy "wishlist_manage_own" on public.wishlist
for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "notifications_read_own" on public.notifications
for select to authenticated using (user_id = auth.uid());
create policy "notifications_update_own" on public.notifications
for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
revoke update on public.notifications from anon, authenticated;
grant update (read_at) on public.notifications to authenticated;

create policy "inventory_adjustments_read_authorized" on public.inventory_adjustments
for select to authenticated using (public.has_permission('inventory.adjust'));
revoke insert, update, delete on public.inventory_adjustments from anon, authenticated;

-- Public product image bucket. Object writes require product-write permission.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "product_images_storage_public_read" on storage.objects
for select to anon, authenticated using (bucket_id = 'product-images');
create policy "product_images_storage_insert_authorized" on storage.objects
for insert to authenticated with check (bucket_id = 'product-images' and public.has_permission('products.write'));
create policy "product_images_storage_update_authorized" on storage.objects
for update to authenticated using (bucket_id = 'product-images' and public.has_permission('products.write'))
with check (bucket_id = 'product-images' and public.has_permission('products.write'));
create policy "product_images_storage_delete_authorized" on storage.objects
for delete to authenticated using (bucket_id = 'product-images' and public.has_permission('products.write'));
