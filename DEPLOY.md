# Deploying Nuvo (free)

This guide takes the store from "runs on my PC" to "live on the internet".
Everything here is **free** and needs **no business and no card**.

## What we use
- **Vercel** — hosts the website (free "Hobby" plan)
- **Neon** — the online PostgreSQL database (free plan)
- **Vercel Blob** — stores uploaded product/review images (free plan)

> Why not just the SQLite file we use locally? Hosts like Vercel don't keep a
> local file between visits, so a real store needs an online database (Neon)
> and online image storage (Blob).

---

## Step 1 — Create a Neon database (the online database)
1. Go to **https://neon.tech** and sign up (you can use your GitHub account).
2. Create a new **Project** (any name, e.g. "nuvo"). Pick the region closest
   to you.
3. On the project dashboard, find the **Connection string** (it looks like
   `postgresql://user:password@...neon.tech/dbname?sslmode=require`).
4. **Copy it and keep it somewhere safe.** This is a password — don't paste it
   into chat. You'll paste it into Vercel and your local `.env`.

## Step 2 — Tell Claude you have the database
Once you have the Neon connection string, let Claude know. Claude will switch
the code to use PostgreSQL (and push the update). Then:
- In your local `.env`, set `DATABASE_URL` to the Neon connection string.
- Run `npm run db:push` once to create the tables in Neon.
- (Optional) `npm run db:seed` to add the sample products.

## Step 3 — Deploy on Vercel
1. Go to **https://vercel.com** and sign up with your **GitHub** account.
2. Click **Add New… → Project**, and **Import** the `Dropshipro` repository.
3. Before deploying, open **Environment Variables** and add these:

   | Name | Value |
   |---|---|
   | `DATABASE_URL` | your Neon connection string |
   | `ADMIN_PASSWORD` | a password for your /admin area |
   | `AUTH_SECRET` | a long random string (run `openssl rand -hex 32`, or mash the keyboard) |
   | `NEXT_PUBLIC_SITE_URL` | your site URL (e.g. `https://nuvo.vercel.app`) |

4. Click **Deploy**. In ~1 minute you'll get a live URL like
   `https://nuvo-xxxx.vercel.app`.

## Step 4 — Turn on image uploads (Vercel Blob)
1. In your Vercel project → **Storage** tab → **Create Database → Blob**.
2. Connect it to the project. Vercel adds a `BLOB_READ_WRITE_TOKEN`
   environment variable automatically.
3. **Redeploy** (Deployments → ⋯ → Redeploy) so it picks up the token.

Now admin product images and customer review photos upload to the cloud.

## Step 5 — Create your tables + first admin
- If you didn't already, run locally (with `DATABASE_URL` pointing at Neon):
  ```
  npm run db:push
  ```
  This creates the tables in your Neon database (shared by local + live).
- Open `https://<your-site>/admin` (password = your `ADMIN_PASSWORD`) and add
  your real products.

## Optional add-ons (later)
- **Real emails:** add `RESEND_API_KEY` (free at resend.com) to send order +
  review emails for real.
- **Card payments:** add `STRIPE_SECRET_KEY` (Stripe allows individuals / sole
  traders — no company needed).
- **Your own domain:** in Vercel → Settings → Domains, add a domain you buy
  (e.g. from Namecheap) like `nuvo.co`.

---

### Environment variables summary
| Variable | Required | What it's for |
|---|---|---|
| `DATABASE_URL` | ✅ | Neon Postgres connection |
| `ADMIN_PASSWORD` | ✅ | Sign in to /admin |
| `AUTH_SECRET` | ✅ | Signs customer login sessions |
| `NEXT_PUBLIC_SITE_URL` | ✅ | Links in emails / redirects |
| `BLOB_READ_WRITE_TOKEN` | ✅ (auto) | Cloud image uploads (added by Vercel Blob) |
| `RESEND_API_KEY` | optional | Send real emails |
| `STRIPE_SECRET_KEY` | optional | Card payments |
