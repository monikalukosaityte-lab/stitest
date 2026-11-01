import type { ReactElement, SVGProps } from 'react';

import type { ProductIconName } from '@/lib/types';

// Line icons from the Test Discreet Shopify theme (snippets/icon.liquid).

export const MenuIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    aria-hidden
    {...props}
  >
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

export const CartIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinejoin="round"
    aria-hidden
    {...props}
  >
    <path d="M5 8h14l-1 13H6L5 8z" />
    <path d="M9 8V6a3 3 0 016 0v2" />
  </svg>
);

export const AccountIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    aria-hidden
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="10" r="3.5" />
    <path d="M5.5 19c1.4-2.6 3.8-4 6.5-4s5.1 1.4 6.5 4" />
  </svg>
);

export const ArrowRightIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
    {...props}
  >
    <path d="M2 8h11M9 4l4 4-4 4" />
  </svg>
);

export const DropIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
    {...props}
  >
    <path d="M12 3.5c3 4 5.5 7 5.5 10.5a5.5 5.5 0 01-11 0c0-3.5 2.5-6.5 5.5-10.5z" />
  </svg>
);

export const SwabIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
    {...props}
  >
    <path d="M7 17L17 7" />
    <ellipse
      cx="18.5"
      cy="5.5"
      rx="2.25"
      ry="1.6"
      transform="rotate(-45 18.5 5.5)"
    />
    <path d="M4 20l3-3" />
  </svg>
);

export const ClockIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
    {...props}
  >
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);

export const CheckIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
    {...props}
  >
    <path d="M3.5 8.5l3 3 6-7" />
  </svg>
);

export const PackageIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
    {...props}
  >
    <path d="M3.5 7.5L12 3l8.5 4.5v9L12 21l-8.5-4.5v-9z" />
    <path d="M3.5 7.5L12 12l8.5-4.5M12 12v9" />
  </svg>
);

export const HomeIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
    {...props}
  >
    <path d="M4 10.5L12 4l8 6.5V20H4v-9.5z" />
    <path d="M9.5 20v-5.5h5V20" />
  </svg>
);

export const LockIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
    {...props}
  >
    <rect x="4.5" y="10.5" width="15" height="10" rx="2" />
    <path d="M8 10.5V7.5a4 4 0 018 0v3" />
  </svg>
);

export const VerifiedIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden {...props}>
    <path d="M8 0l1.9 1.4 2.3-.2.8 2.2 2 1.2-.6 2.3.6 2.3-2 1.2-.8 2.2-2.3-.2L8 16l-1.9-1.4-2.3.2-.8-2.2-2-1.2.6-2.3L1 6.8l2-1.2.8-2.2 2.3.2L8 0z" />
    <path
      d="M5 8.2l2 2 4-4.2"
      fill="none"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ChevronLeftIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.25"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
    {...props}
  >
    <path d="M10 3L5 8l5 5" />
  </svg>
);

export const ChevronRightIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.25"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
    {...props}
  >
    <path d="M6 3l5 5-5 5" />
  </svg>
);

export const SearchIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
    {...props}
  >
    <circle cx="11" cy="11" r="6.5" />
    <path d="M20 20l-4.25-4.25" />
  </svg>
);

export const UsersIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
    {...props}
  >
    <circle cx="9" cy="8.5" r="3.25" />
    <path d="M3.5 19.5c.6-3 2.8-4.75 5.5-4.75s4.9 1.75 5.5 4.75" />
    <path d="M15.5 5.5a3.25 3.25 0 010 6.25M17.5 14.9c1.6.6 2.7 2.1 3 4.6" />
  </svg>
);

export const InfoIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
    {...props}
  >
    <circle cx="12" cy="12" r="9.5" />
    <path d="M12 8h.01M11 12h1v4h1" />
  </svg>
);

/** Icons that product page content (content/products/*.json) can refer to by name. */
export const TagIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinejoin="round"
    aria-hidden
    {...props}
  >
    <path d="M3 12.6V4a1 1 0 0 1 1-1h8.6a1 1 0 0 1 .7.3l7.4 7.4a1 1 0 0 1 0 1.4l-8.6 8.6a1 1 0 0 1-1.4 0l-7.4-7.4a1 1 0 0 1-.3-.7Z" />
    <circle cx="8" cy="8" r="1.5" />
  </svg>
);

export const PRODUCT_ICONS: Record<
  ProductIconName,
  (props: SVGProps<SVGSVGElement>) => ReactElement
> = {
  clock: ClockIcon,
  drop: DropIcon,
  home: HomeIcon,
  lock: LockIcon,
  package: PackageIcon,
  search: SearchIcon,
  swab: SwabIcon,
  tag: TagIcon,
  users: UsersIcon,
  verified: VerifiedIcon,
};
