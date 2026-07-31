# Dropship Store — Starter

A product-agnostic store built with React + Vite, Supabase, Razorpay, and Netlify Functions.
Swap in your own products and colors once you pick a niche.

## Stack
- **Frontend:** React (Vite) — product grid, product page, cart, checkout
- **Database:** Supabase (Postgres + RLS)
- **Payments:** Razorpay, with order creation + signature verification handled server-side via Netlify Functions
- **Hosting:** Netlify (functions live in `netlify/functions/`)

## Setup

### 1. Supabase
1. Create a project at supabase.com
2. Go to SQL Editor → paste the contents of `supabase/schema.sql` → Run
3. Copy your Project URL and anon key from Project Settings → API
4. Also copy the **service role key** (Project Settings → API) — this is secret, only used in Netlify Functions, never in the frontend

### 2. Razorpay
1. Sign up at razorpay.com, activate test mode
2. Get your Key ID and Key Secret from Settings → API Keys

### 3. Local env
```
cp .env.example .env
```
Fill in the values from steps 1 and 2.

### 4. Install and run
```
npm install
npm run dev
```
Note: `npm run dev` (plain Vite) will not run the `/api` functions — checkout will fail locally with a 404 on `/api/create-razorpay-order`. To test the full payment flow locally, install the Vercel CLI (`npm i -g vercel`) and run `vercel dev` instead, which serves both the frontend and the `/api` functions together. Otherwise, just push to Vercel and test on the deployed preview URL.

### 5. Add real products
Either use the Supabase Table Editor directly, or run inserts via SQL Editor:
```sql
insert into products (name, slug, description, images, cost_price, sell_price, supplier_url)
values ('Product Name', 'product-slug', 'Description here', array['https://image-url.com'], 350, 999, 'https://aliexpress.com/...');
```
Delete the sample product once you have real ones.

### 6. Deploy to Vercel
1. Push this repo to GitHub
2. Go to vercel.com → New Project → import the repo
3. Framework preset: Vite (auto-detected). Build command `npm run build`, output directory `dist` (auto-detected)
4. In Vercel → Project Settings → Environment Variables, add all the server-side vars from `.env.example` (RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY) plus the VITE_ ones for the build
5. Vercel auto-detects serverless functions in `api/` — no extra config needed beyond `vercel.json` (already included, handles SPA routing so refreshing `/product/xyz` doesn't 404)

## What's intentionally left out (build these once you validate the niche)
- **Admin panel** — for now, manage orders/products via the Supabase Table Editor directly
- **Order status emails** — add via a Supabase Edge Function or Netlify Function + Resend/SendGrid once you have real orders to notify
- **Inventory sync with supplier** — dropshipping suppliers rarely offer real-time stock APIs at small scale; check manually until volume justifies automation
- **Design/branding** — `src/styles.css` is intentionally plain. Once you pick a niche, re-theme colors/fonts to match it — that's a bigger lever on conversion than almost anything else here

## Notes on the money side
- `cost_price` on the products table is for YOUR reference (margin tracking), never shown to customers
- RLS policies mean customers can only insert orders, not read others' order data — your data stays private
- The Razorpay secret key and Supabase service role key only ever live in Netlify's server-side environment, never in the browser bundle
