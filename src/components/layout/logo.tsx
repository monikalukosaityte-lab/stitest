import Link from 'next/link';
import type { CSSProperties } from 'react';

import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        'text-foreground flex items-center gap-3 no-underline',
        className,
      )}
    >
      <LogoMark
        className="text-accent shrink-0"
        style={{ width: 'clamp(2.8rem, 3vw, 4rem)', height: 'auto' }}
      />
      <span className="font-display text-foreground text-[0.9rem] leading-none tracking-[0.18em] uppercase md:text-base">
        Test Discreet
      </span>
    </Link>
  );
}

/** Text logo in the testdiscreet.co.uk style: "STI Test Kit" over a spaced "by Test Discreet". */
export function BrandLockup({
  inverted = false,
  align = 'center',
}: {
  inverted?: boolean;
  align?: 'center' | 'start';
}) {
  return (
    <span
      className={cn(
        'font-logo inline-flex flex-col gap-1 font-medium',
        align === 'center' ? 'items-center' : 'items-start',
        inverted ? 'text-inherit' : 'text-foreground/85',
      )}
    >
      <span
        className={cn(
          'text-xl leading-none tracking-tight whitespace-nowrap md:text-2xl',
          !inverted && 'text-muted-foreground',
        )}
      >
        STI Test Kit
      </span>
      <span className="-mr-[0.28em] text-[0.625rem] leading-none tracking-[0.28em] whitespace-nowrap uppercase">
        by Test Discreet
      </span>
    </span>
  );
}

export function LogoMark({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      viewBox="88 50 182 116"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-hidden
    >
      <g transform="matrix(1,0,0,-1,0,841.92)" fill="currentColor">
        <path d="M128.235 682.356V773.27H94.2739V785.434H189.969L189.995 773.299 141.876 773.27V682.356Z" />
        <path
          fillRule="evenodd"
          d="M177.645 773.277 177.628 785.434H213.136C221.152 785.434 227.269 784.942 231.488 783.958 237.394 782.598 242.433 780.138 246.605 776.575 252.043 771.981 256.109 766.11 258.804 758.962 261.5 751.813 262.847 743.645 262.847 734.458 262.847 726.63 261.933 719.692 260.105 713.645 258.277 707.598 255.933 702.595 253.074 698.634 250.214 694.673 247.085 691.556 243.687 689.282 240.289 687.009 236.187 685.286 231.382 684.114 226.578 682.942 221.058 682.356 214.824 682.356H177.628V762.155H191.433M191.433 762.155 191.269 694.52H213.277C220.074 694.52 225.406 695.153 229.273 696.419 233.14 697.684 236.222 699.466 238.519 701.763 241.753 704.997 244.273 709.345 246.078 714.806 247.882 720.266 248.785 726.888 248.785 734.669 248.785 745.45 247.015 753.735 243.476 759.524 239.937 765.313 235.636 769.192 230.574 771.161 226.918 772.567 221.035 773.27 212.925 773.27L177.645 773.277"
        />
      </g>
    </svg>
  );
}
