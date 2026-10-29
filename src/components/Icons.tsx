import type { SVGProps } from "react";

function Base({ children, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {children}
    </svg>
  );
}

export const TruckIcon = (p: SVGProps<SVGSVGElement>) => (
  <Base {...p}>
    <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" />
    <circle cx="7" cy="18" r="1.6" />
    <circle cx="17.5" cy="18" r="1.6" />
  </Base>
);

export const ShieldIcon = (p: SVGProps<SVGSVGElement>) => (
  <Base {...p}>
    <path d="M12 3l7 3v5c0 4.4-3 7.7-7 9-4-1.3-7-4.6-7-9V6z" />
    <path d="M9.5 12l1.8 1.8 3.5-3.6" />
  </Base>
);

export const ReturnIcon = (p: SVGProps<SVGSVGElement>) => (
  <Base {...p}>
    <path d="M3 7h11a5 5 0 010 10H9" />
    <path d="M6 4L3 7l3 3" />
  </Base>
);

export const ChatIcon = (p: SVGProps<SVGSVGElement>) => (
  <Base {...p}>
    <path d="M4 5h16v11H9l-4 3v-3H4z" />
    <path d="M8 9h8M8 12h5" />
  </Base>
);

export const SparkleIcon = (p: SVGProps<SVGSVGElement>) => (
  <Base {...p}>
    <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />
  </Base>
);

export const BoltIcon = (p: SVGProps<SVGSVGElement>) => (
  <Base {...p}>
    <path d="M13 3L5 13h6l-1 8 8-10h-6z" />
  </Base>
);
