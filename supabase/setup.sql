-- Fuoco Supabase setup
-- Run this file in Supabase SQL Editor in one pass.

begin;

create extension if not exists pgcrypto;

-- =========================
-- 1) Profiles (linked to auth.users)
-- =========================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  address text,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Replace policies safely
DROP POLICY if exists "profiles_select_own" on public.profiles;
DROP POLICY if exists "profiles_insert_own" on public.profiles;
DROP POLICY if exists "profiles_update_own" on public.profiles;

create policy "profiles_select_own"
  on public.profiles
  for select
  using (auth.uid() = id);

create policy "profiles_insert_own"
  on public.profiles
  for insert
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Auto-update timestamp
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- Auto-create profile after signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.email
  )
  on conflict (id) do update
  set
    full_name = coalesce(excluded.full_name, public.profiles.full_name),
    email = coalesce(excluded.email, public.profiles.email);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- =========================
-- 2) Products
-- =========================
create table if not exists public.products (
  id text primary key,
  name text not null,
  description text,
  price integer not null check (price >= 0),
  image_url text,
  category text not null check (category in ('pizza', 'pasta', 'starters', 'desserts', 'drinks')),
  weight text,
  cooking_time integer not null default 0 check (cooking_time >= 0),
  is_popular boolean not null default false,
  is_available boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products enable row level security;

DROP POLICY if exists "products_select_all" on public.products;
create policy "products_select_all"
  on public.products
  for select
  using (true);

-- Optional policy for admins (service role bypasses RLS anyway)
DROP POLICY if exists "products_manage_service" on public.products;
create policy "products_manage_service"
  on public.products
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

drop trigger if exists trg_products_updated_at on public.products;
create trigger trg_products_updated_at
before update on public.products
for each row execute function public.set_updated_at();

-- =========================
-- 3) Orders
-- =========================
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  total integer not null check (total >= 0),
  delivery_address text not null,
  phone text not null,
  comment text,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'preparing', 'delivering', 'delivered', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_orders_user_id on public.orders(user_id);
create index if not exists idx_orders_created_at on public.orders(created_at desc);

alter table public.orders enable row level security;

DROP POLICY if exists "orders_select_own" on public.orders;
DROP POLICY if exists "orders_insert_own" on public.orders;
DROP POLICY if exists "orders_update_own" on public.orders;

create policy "orders_select_own"
  on public.orders
  for select
  using (auth.uid() = user_id);

create policy "orders_insert_own"
  on public.orders
  for insert
  with check (auth.uid() = user_id);

-- Let user update only selected fields (status updates usually by backend)
create policy "orders_update_own"
  on public.orders
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop trigger if exists trg_orders_updated_at on public.orders;
create trigger trg_orders_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

-- =========================
-- 4) Order items
-- =========================
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id text,
  product_name text not null,
  product_price integer not null check (product_price >= 0),
  quantity integer not null check (quantity > 0),
  created_at timestamptz not null default now()
);

create index if not exists idx_order_items_order_id on public.order_items(order_id);

alter table public.order_items enable row level security;

DROP POLICY if exists "order_items_select_own" on public.order_items;
DROP POLICY if exists "order_items_insert_own" on public.order_items;

create policy "order_items_select_own"
  on public.order_items
  for select
  using (
    exists (
      select 1
      from public.orders o
      where o.id = order_items.order_id
        and o.user_id = auth.uid()
    )
  );

create policy "order_items_insert_own"
  on public.order_items
  for insert
  with check (
    exists (
      select 1
      from public.orders o
      where o.id = order_items.order_id
        and o.user_id = auth.uid()
    )
  );

-- =========================
-- 5) Seed products (from app mock data)
-- =========================
insert into public.products (id, name, description, price, image_url, category, weight, cooking_time, is_popular, is_available)
values
  ('1', 'Margherita', 'Italian classic with tomato sauce, fior di latte mozzarella, fresh basil leaves, and extra virgin olive oil', 399, 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=80', 'pizza', '450 g', 15, true, true),
  ('2', 'Pepperoni', 'Spicy Italian pepperoni, San Marzano tomato sauce, and a generous mozzarella layer - a restaurant classic', 459, 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&q=80', 'pizza', '480 g', 15, true, true),
  ('3', 'Four Cheese', 'Mozzarella, gorgonzola, parmesan, and cheddar on a creamy white base without tomato sauce', 529, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80', 'pizza', '460 g', 15, true, true),
  ('4', 'Diavola', 'Spicy Calabrian salami, chili peppers, tomato sauce, mozzarella, and chili flakes for heat lovers', 479, 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=600&q=80', 'pizza', '470 g', 15, false, true),
  ('5', 'Grilled Chicken', 'Grilled chicken fillet, bell peppers, mushrooms, tomato sauce, and mozzarella', 489, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80', 'pizza', '500 g', 18, false, true),
  ('6', 'Sicilian', 'Anchovies, Kalamata olives, capers, tomato sauce, and mozzarella with a coastal Mediterranean flavor', 509, 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=600&q=80', 'pizza', '480 g', 18, false, true),
  ('7', 'Prosciutto e Funghi', 'Parma prosciutto, porcini mushrooms, truffle oil, mozzarella, and fresh arugula added after baking', 569, 'https://images.unsplash.com/photo-1506354666786-959d6d497f1a?w=600&q=80', 'pizza', '490 g', 17, true, true),
  ('8', 'Vegetariana', 'Zucchini, eggplant, artichokes, sun-dried tomatoes, spinach, mozzarella, and tomato sauce', 449, 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=600&q=80', 'pizza', '470 g', 16, false, true),
  ('9', 'Quattro Stagioni', 'Four sections and four flavors: mushrooms, artichokes, olives, and prosciutto in one pizza', 549, 'https://images.unsplash.com/photo-1605478371310-a9f1e96b4ff4?w=600&q=80', 'pizza', '510 g', 18, false, true),
  ('10', 'Truffle Bianca', 'White pizza with creamy bechamel, buffalo mozzarella, truffle cream, and parmesan', 649, 'https://images.unsplash.com/photo-1548369937-47519962c11a?w=600&q=80', 'pizza', '450 g', 16, true, true),
  ('11', 'Carbonara', 'Spaghetti, egg yolk, guanciale, parmigiano reggiano, and black pepper - no cream, Roman style', 369, 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=600&q=80', 'pasta', '320 g', 20, true, true),
  ('12', 'Tagliatelle Bolognese', 'Fresh tagliatelle with slow-cooked beef ragu, vegetables, red wine, and parmesan', 389, 'https://images.unsplash.com/photo-1551183053-bf91798d047b?w=600&q=80', 'pasta', '340 g', 25, false, true),
  ('13', 'Classic Bruschetta', 'Grilled crispy bread, diced tomatoes, basil, garlic, and olive oil', 219, 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=600&q=80', 'starters', '180 g', 8, false, true),
  ('14', 'Chicken Caesar', 'Chicken fillet, crunchy romaine, parmesan, croutons, and signature Caesar dressing', 299, 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=600&q=80', 'starters', '280 g', 10, true, true),
  ('15', 'Tiramisu', 'Classic recipe with mascarpone, espresso, savoiardi biscuits, and cocoa', 259, 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&q=80', 'desserts', '180 g', 0, true, true),
  ('16', 'Homemade Lemonade', 'Lemon, mint, syrup, and sparkling water for a refreshing Italian-style lemonade', 149, 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=600&q=80', 'drinks', '400 ml', 0, false, true)
on conflict (id) do update
set
  name = excluded.name,
  description = excluded.description,
  price = excluded.price,
  image_url = excluded.image_url,
  category = excluded.category,
  weight = excluded.weight,
  cooking_time = excluded.cooking_time,
  is_popular = excluded.is_popular,
  is_available = excluded.is_available,
  updated_at = now();

commit;
