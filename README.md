# Dropshipro

An AI-assisted dropshipping storefront. See [`ROADMAP.md`](./ROADMAP.md) for the
full vision and phased build plan.

**Current status:** Phase 0 (Foundations) + Phase 1 (MVP storefront) — a working
Next.js store with a product catalog, cart, and Stripe-ready checkout.

## Tech stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** for styling
- **Stripe** for checkout
- **Prisma + PostgreSQL** data layer (schema defined; wired up in a later phase)

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. (Optional) configure environment
cp .env.example .env
#    Fill in STRIPE_SECRET_KEY to enable live payments.
#    Without it, the store works fully except the final payment step.

# 3. Run the dev server
npm run dev
```

Open http://localhost:3000.

## What works today

- **Home page** with hero, value props, and featured products
- **Product catalog** (`/products`) and **product detail** pages (`/products/[slug]`)
- **Cart** (`/cart`) with quantity controls, persisted in the browser
- **Checkout** (`/checkout`) that creates a Stripe Checkout Session
  - Prices are validated server-side (the client can't tamper with them)
  - Gracefully explains what to configure if Stripe keys aren't set

The sample catalog lives in [`src/data/products.ts`](./src/data/products.ts). In a
later phase this moves into the database (see [`prisma/schema.prisma`](./prisma/schema.prisma)).

## Project structure

```
src/
  app/              # routes (App Router)
    page.tsx          # home
    products/         # catalog + detail
    cart/             # cart page
    checkout/         # checkout + success
    api/checkout/     # Stripe session endpoint
  components/        # Header, Footer, ProductCard, AddToCartButton
  context/           # CartContext (client-side cart state)
  data/              # sample product catalog
  lib/               # helpers (price formatting)
prisma/
  schema.prisma      # database schema (for the DB phase)
```

## What's next (from the roadmap)

- **Phase 2** — operator admin: manage products/orders, CSV import, persist orders in Postgres
- **Phase 3** — AI layer: generate listings, pricing suggestions, support replies
- **Phase 4** — supplier automation: auto-route orders, sync tracking
- **Phase 5** — growth: SEO, analytics, email/SMS, ad creatives
