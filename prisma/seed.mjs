// Seeds a couple of example products so the store isn't empty on first run.
// These are safe to delete from the Admin panel once you add your own.
//
// Run with:  npm run db:seed   (or npm run db:setup to push schema + seed)

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const samples = [
  {
    slug: "sample-essential-hoodie",
    title: "Sample — Essential Hoodie",
    description:
      "This is an example Clothing product. Edit or delete it from the Admin panel, then add your own real products with your own images.",
    priceCents: 3999,
    currency: "usd",
    category: "Clothing",
    image: null,
    active: true,
  },
  {
    slug: "sample-wireless-earbuds",
    title: "Sample — Wireless Earbuds",
    description:
      "This is an example Electronics product. Edit or delete it from the Admin panel, then add your own real products with your own images.",
    priceCents: 4999,
    currency: "usd",
    category: "Electronics",
    image: null,
    active: true,
  },
];

async function main() {
  for (const p of samples) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: p,
    });
  }
  console.log(`Seeded ${samples.length} example products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
