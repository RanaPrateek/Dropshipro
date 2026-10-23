type Props = {
  /** pixel size of the square mark */
  size?: number;
  /** show the "nuvo" wordmark next to the mark */
  wordmark?: boolean;
  className?: string;
};

/**
 * Nuvo brand logo: a rounded-gradient mark with an upward "u" arc
 * (the signature letter of the name), optionally with the wordmark.
 */
export default function Logo({
  size = 32,
  wordmark = true,
  className = "",
}: Props) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="nuvoGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#6366f1" />
            <stop offset="1" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        <rect width="40" height="40" rx="11" fill="url(#nuvoGrad)" />
        <path
          d="M13 12 V21 a7 7 0 0 0 14 0 V12"
          stroke="white"
          strokeWidth="3.6"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      {wordmark && (
        <span className="text-xl font-extrabold lowercase tracking-tight text-slate-900">
          nuvo
        </span>
      )}
    </span>
  );
}
