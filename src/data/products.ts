// Sample catalog for the MVP storefront (a general store).
//
// In a later phase this moves into the database (see prisma/schema.prisma).
// For now it lets the storefront run end-to-end with no external services.

export type Product = {
  id: string;
  slug: string;
  title: string;
  description: string;
  priceCents: number;
  currency: string;
  category: string;
  emoji: string;
  color: string; // tailwind gradient classes for the placeholder image
  rating: number;
};

export const products: Product[] = [
  {
    id: "p-001",
    slug: "aurora-led-strip",
    title: "Aurora Smart LED Light Strip",
    description:
      "16M-color app-controlled LED strip with music sync. Transform any room in minutes. 5m, easy peel-and-stick install.",
    priceCents: 2499,
    currency: "usd",
    category: "Home",
    emoji: "💡",
    color: "from-fuchsia-500 to-indigo-500",
    rating: 4.6,
  },
  {
    id: "p-002",
    slug: "stealth-posture-corrector",
    title: "Stealth Posture Corrector",
    description:
      "Adjustable, discreet back brace that gently trains better posture. Breathable and wearable under clothing.",
    priceCents: 1999,
    currency: "usd",
    category: "Fitness",
    emoji: "🧍",
    color: "from-emerald-500 to-teal-500",
    rating: 4.3,
  },
  {
    id: "p-003",
    slug: "voyager-travel-bottle",
    title: "Voyager Collapsible Travel Bottle",
    description:
      "Food-grade silicone water bottle that collapses to a third of its size. Leak-proof, 600ml, clips to any bag.",
    priceCents: 1599,
    currency: "usd",
    category: "Travel",
    emoji: "🧴",
    color: "from-sky-500 to-blue-600",
    rating: 4.7,
  },
  {
    id: "p-004",
    slug: "purrfect-self-groomer",
    title: "Purrfect Self-Groomer Cat Toy",
    description:
      "Wall-mounted grooming arch cats use to brush themselves. Reduces shedding and keeps kitty happy. Refillable catnip pouch.",
    priceCents: 1299,
    currency: "usd",
    category: "Pets",
    emoji: "🐱",
    color: "from-amber-400 to-orange-500",
    rating: 4.5,
  },
  {
    id: "p-005",
    slug: "nebula-galaxy-projector",
    title: "Nebula Galaxy Star Projector",
    description:
      "Projects a drifting galaxy of stars and nebula clouds onto your ceiling. Remote, timer, and 10 brightness modes.",
    priceCents: 3499,
    currency: "usd",
    category: "Home",
    emoji: "🌌",
    color: "from-violet-600 to-purple-800",
    rating: 4.8,
  },
  {
    id: "p-006",
    slug: "gripmaster-phone-stand",
    title: "GripMaster Adjustable Phone Stand",
    description:
      "Aluminum fold-flat desk stand with multi-angle hinge. Fits all phones and small tablets. Pocket-sized for travel.",
    priceCents: 1799,
    currency: "usd",
    category: "Gadgets",
    emoji: "📱",
    color: "from-slate-500 to-slate-700",
    rating: 4.4,
  },
  {
    id: "p-007",
    slug: "zenflow-mini-humidifier",
    title: "ZenFlow Mini Desk Humidifier",
    description:
      "Ultra-quiet 300ml humidifier with soft ambient light. USB-powered, auto-off, perfect for desks and nightstands.",
    priceCents: 2199,
    currency: "usd",
    category: "Home",
    emoji: "💨",
    color: "from-cyan-400 to-sky-600",
    rating: 4.2,
  },
  {
    id: "p-008",
    slug: "flexfit-resistance-bands",
    title: "FlexFit Resistance Band Set",
    description:
      "Five stackable bands (10–50 lbs) with handles, door anchor, and ankle straps. Full-body gym that fits in a drawer.",
    priceCents: 2799,
    currency: "usd",
    category: "Fitness",
    emoji: "🏋️",
    color: "from-rose-500 to-red-600",
    rating: 4.6,
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getCategories(): string[] {
  return Array.from(new Set(products.map((p) => p.category))).sort();
}
