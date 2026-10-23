// Seeds a few example products so the store isn't empty on first run.
// These are safe to delete from the Admin panel once you add your own.
//
// Run with:  npm run db:seed   (or npm run db:setup to push schema + seed)

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const samples = [
  {
    slug: "sample-womens-hoodie",
    title: "Sample — Women's Oversized Hoodie",
    description:
      "A soft, everyday hoodie. **Example Women's product** — edit or delete it from the Admin panel.\n\n- Heavyweight brushed fleece\n- Ribbed cuffs and hem\n- Relaxed fit",
    priceCents: 3999,
    compareAtCents: 5999,
    currency: "usd",
    category: "Women",
    image: null,
    images: JSON.stringify([]),
    colors: JSON.stringify(["Black", "Cream", "Navy"]),
    sizes: JSON.stringify(["XS", "S", "M", "L", "XL"]),
    ratingAvg: 4.6,
    reviewsCount: 128,
    soldCount: 540,
    shipDaysMin: 7,
    shipDaysMax: 14,
    active: true,
  },
  {
    slug: "sample-mens-tee",
    title: "Sample — Men's Classic Tee",
    description:
      "A wardrobe staple. **Example Men's product** — edit or delete it from the Admin panel.\n\n- 100% combed cotton\n- Pre-shrunk\n- Crew neck",
    priceCents: 1999,
    compareAtCents: null,
    currency: "usd",
    category: "Men",
    image: null,
    images: JSON.stringify([]),
    colors: JSON.stringify(["White", "Black", "Olive"]),
    sizes: JSON.stringify(["S", "M", "L", "XL", "XXL"]),
    ratingAvg: 4.4,
    reviewsCount: 64,
    soldCount: 220,
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
    compareAtCents: 7999,
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
