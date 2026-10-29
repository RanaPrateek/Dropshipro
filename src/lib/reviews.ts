import { prisma } from "./prisma";

export type StoreReview = {
  id: string;
  authorName: string;
  rating: number;
  title: string | null;
  body: string;
  verified: boolean;
  createdAt: string;
};

export type ReviewSummary = {
  count: number;
  average: number; // 0 when no reviews
};

export async function getReviews(productId: string): Promise<StoreReview[]> {
  const rows = await prisma.review.findMany({
    where: { productId },
    orderBy: { createdAt: "desc" },
  });
  return rows.map((r) => ({
    id: r.id,
    authorName: r.authorName,
    rating: r.rating,
    title: r.title,
    body: r.body,
    verified: r.verified,
    createdAt: r.createdAt.toISOString(),
  }));
}

export async function getReviewSummary(
  productId: string,
): Promise<ReviewSummary> {
  const agg = await prisma.review.aggregate({
    where: { productId },
    _count: { _all: true },
    _avg: { rating: true },
  });
  return {
    count: agg._count._all,
    average: agg._avg.rating ?? 0,
  };
}
