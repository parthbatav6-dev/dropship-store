-- ============================================
-- Dropship Store — Supabase Schema
-- Run this in the Supabase SQL Editor
-- ============================================

-- PRODUCTS
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  images text[] default '{}',          -- array of image URLs
  cost_price numeric(10,2) not null,   -- what YOU pay the supplier
  sell_price numeric(10,2) not null,   -- what the CUSTOMER pays
  supplier_url text,                    -- link to AliExpress/CJ/Meesho product, for your own reference
  stock_status text default 'in_stock' check (stock_status in ('in_stock', 'out_of_stock', 'preorder')),
  is_active boolean default true,       -- toggle visibility without deleting
  created_at timestamptz default now()
);

-- ORDERS
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  shipping_address jsonb not null,      -- {line1, line2, city, state, pincode}
  subtotal numeric(10,2) not null,
  shipping_fee numeric(10,2) default 0,
  total numeric(10,2) not null,
  razorpay_order_id text,
  razorpay_payment_id text,
  payment_status text default 'pending' check (payment_status in ('pending', 'paid', 'failed')),
  fulfillment_status text default 'unfulfilled' check (fulfillment_status in ('unfulfilled', 'ordered_from_supplier', 'shipped', 'delivered', 'cancelled')),
  created_at timestamptz default now()
);

-- ORDER ITEMS
create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id),
  product_name text not null,           -- snapshot at time of order, in case product changes later
  unit_price numeric(10,2) not null,
  quantity int not null default 1
);

-- ============================================
-- ROW LEVEL SECURITY
-- Public can READ active products only.
-- Public can INSERT orders (checkout) but not read/edit others' orders.
-- You (via Supabase dashboard, using the service role) manage everything else.
-- ============================================

alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

create policy "Public can view active products"
  on products for select
  using (is_active = true);

create policy "Public can create orders"
  on orders for insert
  with check (true);

create policy "Public can create order items"
  on order_items for insert
  with check (true);

-- No public select/update/delete policies on orders/order_items —
-- that keeps customer data private. You'll manage orders from the
-- Supabase Table Editor or a future admin panel using the service role key.

-- ============================================
-- Sample product (delete this once you add real ones)
-- ============================================
insert into products (name, slug, description, images, cost_price, sell_price, supplier_url)
values (
  'Sample Product',
  'sample-product',
  'Replace this with your real product once you pick a niche.',
  array['https://placehold.co/600x600'],
  299.00,
  899.00,
  'https://aliexpress.com/example'
);
