# Dropshipro — Roadmap & Blueprint

> An AI-assisted dropshipping storefront: our own branded website where customers
> browse and buy, with AI handling the heavy lifting behind the scenes (product
> research, listings, pricing, ad creative, and support). We drive traffic to the
> site; suppliers ship directly to customers.

_Status: APPROVED (decisions locked) • Last updated: 2026-10-20_

---

## 1. Vision

Build a custom e-commerce storefront (not a Shopify theme) that we fully control,
with an AI layer that automates the time-consuming parts of running a dropshipping
business. The goal is a site a single operator can run, where AI compresses the
work that normally needs a team.

**Two halves of the product:**
1. **Storefront (customer-facing)** — product catalog, cart, checkout, order tracking.
2. **Admin + AI engine (operator-facing)** — product import from suppliers, AI
   listing generation, pricing, order routing to suppliers, and marketing creative.

---

## 2. Confirmed decisions ✅

| Decision | Choice | Why |
|---|---|---|
| **Build approach** | **Fully custom coded site** | Max control + margins; we own the customer and the data |
| **Store type** | **General store** | Broad catalog; find winning products via AI research later |
| **Framework** | **Next.js (React) + TypeScript** | SSR for SEO; one codebase for store + admin + API |
| **Database** | **PostgreSQL (via Prisma ORM)** | Reliable for orders/products; easy to host |
| **Payments** | **Stripe** | Fast to integrate, trusted checkout |
| **Hosting** | Vercel (app) + managed Postgres | Simple deploys, scales with traffic |
| **AI provider** | Claude (Anthropic API) | Listing copy, product research summaries, support replies |
| **Supplier integration** | Start manual CSV import → add AliExpress/DSers API later | Ship MVP fast, automate once validated |

---

## 3. Architecture (high level)

```
                    ┌─────────────────────────────┐
  Customers  ─────▶ │  Storefront (Next.js)       │
  (from ads/social) │  - catalog, cart, checkout  │
                    └──────────────┬──────────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │  API / Backend (Next.js)    │
                    │  - orders, products, auth   │
                    └───┬───────────┬──────────┬──┘
                        │           │          │
            ┌───────────▼──┐  ┌─────▼─────┐ ┌──▼────────────┐
            │ PostgreSQL   │  │  Stripe   │ │ AI layer      │
            │ (Prisma)     │  │ payments  │ │ (Claude API)  │
            └──────────────┘  └───────────┘ └───────────────┘
                        │
            ┌───────────▼───────────────┐
            │ Supplier fulfillment       │
            │ (manual → AliExpress API)  │
            └────────────────────────────┘
```

---

## 4. Phased roadmap

### Phase 0 — Foundations (project setup)
- [ ] Scaffold Next.js + TypeScript project
- [ ] Set up PostgreSQL + Prisma schema (Product, Order, Customer, User)
- [ ] Linting, formatting, CI (so web sessions can run tests)
- [ ] Environment config + secrets (.env, deploy target)
- **Outcome:** empty-but-running app deployed to a URL.

### Phase 1 — MVP storefront (sell something, end-to-end)
- [ ] Product catalog: list + detail pages (data from DB)
- [ ] Shopping cart (add/remove/update quantity)
- [ ] Checkout with Stripe (test mode first)
- [ ] Order confirmation + order record in DB
- [ ] Basic responsive design + branding
- **Outcome:** a customer can buy a product and we capture the order.

### Phase 2 — Operator admin
- [ ] Admin auth (just you to start)
- [ ] Add/edit/delete products manually
- [ ] Import products via CSV (from supplier export)
- [ ] View + manage orders (status: new → fulfilled → shipped)
- [ ] Manual "mark as ordered with supplier" workflow
- **Outcome:** you can run the store without touching the database.

### Phase 3 — AI layer
- [ ] AI product-listing generation (title, description, SEO) from a product URL/image
- [ ] AI pricing suggestions (margin + competitor hints)
- [ ] AI customer-support draft replies (FAQ, order status)
- [ ] (Optional) AI product-research helper (trend/demand summaries)
- **Outcome:** the "AI" in AI dropshipping — listings and support largely automated.

### Phase 4 — Supplier automation
- [ ] Integrate a supplier API (AliExpress / DSers or similar)
- [ ] Auto-import product data + images
- [ ] Auto-route a paid order to the supplier
- [ ] Sync tracking numbers back to the customer
- **Outcome:** orders flow to suppliers with minimal manual steps.

### Phase 5 — Growth & marketing
- [ ] SEO polish (metadata, sitemap, fast load, structured data)
- [ ] Email/SMS capture + abandoned-cart recovery
- [ ] Analytics (traffic, conversion, ad ROI)
- [ ] Ad-creative generation (product images/videos for FB/TikTok/Google)
- [ ] A/B testing on product pages
- **Outcome:** we can drive and convert traffic profitably.

---

## 5. Suggested milestones

| Milestone | Phases | What "done" looks like |
|---|---|---|
| **M1 — It runs** | 0 | Deployed app at a live URL |
| **M2 — First sale possible** | 1 | End-to-end purchase in Stripe test mode |
| **M3 — Self-serve store** | 2 | You manage products + orders from admin |
| **M4 — AI-powered** | 3 | Listings & support generated by AI |
| **M5 — Hands-off fulfillment** | 4 | Orders auto-sent to supplier |
| **M6 — Ready to scale ads** | 5 | SEO + analytics + creatives in place |

---

## 6. Decisions resolved & what's next

**Resolved (2026-10-20):**
- Build approach → fully custom code
- Store type → general store (AI-driven product research picks winners later)
- Tech stack → Next.js + TypeScript + PostgreSQL + Stripe

**Still open (not blocking the roadmap):**
- Business entity / Stripe account setup (needed before real payments in Phase 1)
- Branding: store name, logo, visual style (can start with placeholders)

**Next step:** This roadmap is approved and committed. When you're ready to start
building, we'll kick off **Phase 0 (Foundations)** — scaffold the Next.js app,
set up the Prisma/Postgres schema, and get a running deploy. Just say the word.

---

## 7. Risks & realities (so we go in clear-eyed)

- **Traffic is the hard part.** The site won't sell on its own — ad budget/strategy matters.
- **Margins are thin;** supplier reliability and shipping times affect refunds/reviews.
- **Payment/legal:** Stripe needs a real business entity; dropshipping has policy rules.
- **Supplier APIs** can be rate-limited or require approval — hence the manual-first plan.
