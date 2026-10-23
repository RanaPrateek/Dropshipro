import { categoryGradient } from "@/lib/format";

type Props = {
  image: string | null;
  title: string;
  category: string;
  className?: string;
  /** text size for the placeholder label */
  compact?: boolean;
};

/**
 * Renders a product image. Falls back to a tasteful gradient block with the
 * category label when no image has been uploaded yet.
 */
export default function ProductImage({
  image,
  title,
  category,
  className = "",
  compact = false,
}: Props) {
  if (image) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={image}
        alt={title}
        className={`h-full w-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${categoryGradient(
        category,
      )} ${className}`}
    >
      <span
        className={`font-semibold uppercase tracking-wide text-white/90 ${
          compact ? "text-xs" : "text-sm"
        }`}
      >
        {category}
      </span>
    </div>
  );
}
