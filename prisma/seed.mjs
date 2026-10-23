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
      "A soft, everyday hoodie. **Example Clothing product** — edit or delete it from the Admin panel.\n\n- Heavyweight brushed fleece\n- Ribbed cuffs and hem\n- Unisex relaxed fit",
    priceCents: 3999,
    currency: "usd",
    category: "Clothing",
    image: null,
    images: JSON.stringify([]),
    colors: JSON.stringify(["Black", "White", "Navy"]),
    sizes: JSON.stringify(["S", "M", "L", "XL"]),
    ratingAvg: 4.6,
    reviewsCount: 128,
    soldCount: 540,
    shipDaysMin: 7,
    shipDaysMax: 14,
    active: true,
  },
  {
    slug: "sample-wireless-earbuds",
    title: "Sample — Wireless Earbuds",
    description:
      "Compact wireless earbuds. **Example Electronics product** — edit or delete it from the Admin panel.\n\n- Bluetooth 5.3\n- 24h battery with charging case\n- Touch controls",
    priceCents: 4999,
    currency: "usd",
    category: "Electronics",
    image: null,
    images: JSON.stringify([]),
    colors: JSON.stringify(["Black", "White"]),
    sizes: JSON.stringify([]),
    ratingAvg: 4.3,
    reviewsCount: 86,
    soldCount: 1200,
    shipDaysMin: 5,
    shipDaysMax: 10,
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
