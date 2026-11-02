insert into public.store_settings (id, store_name, pickup_instructions)
values (1, 'Komputer Kita', 'Tunjukkan kode pickup kepada petugas toko saat pesanan siap diambil.')
on conflict (id) do nothing;

insert into public.categories (name, slug, description, sort_order)
values
  ('Processor', 'processor', 'CPU untuk desktop dan workstation.', 1),
  ('Motherboard', 'motherboard', 'Papan utama untuk merakit PC.', 2),
  ('Memory', 'memory', 'RAM DDR4 dan DDR5.', 3),
  ('Storage', 'storage', 'SSD dan media penyimpanan.', 4),
  ('Graphics Card', 'graphics-card', 'GPU untuk gaming dan produktivitas.', 5),
  ('Peripheral', 'peripheral', 'Keyboard, mouse, headset, dan perangkat pendukung.', 6),
  ('Networking', 'networking', 'Router, adapter, dan perangkat jaringan.', 7),
  ('Accessories', 'accessories', 'Kabel, converter, dan aksesoris komputer.', 8)
on conflict (slug) do nothing;

insert into public.brands (name, slug)
values
  ('AMD', 'amd'), ('Intel', 'intel'), ('ASUS', 'asus'), ('MSI', 'msi'),
  ('Kingston', 'kingston'), ('Western Digital', 'western-digital'),
  ('Logitech', 'logitech'), ('Fantech', 'fantech'), ('HyperX', 'hyperx'), ('DeepCool', 'deepcool')
on conflict (slug) do nothing;
