import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "group/button inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-transparent font-display leading-tight font-extrabold tracking-wide whitespace-nowrap uppercase transition-colors outline-none select-none active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-55 aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          'border-primary bg-primary text-primary-foreground hover:border-primary-hover hover:bg-primary-hover',
        brand:
          'border-accent bg-accent text-accent-foreground hover:border-accent-deep hover:bg-accent-deep',
        'brand-deep':
          'border-accent-deep bg-accent-deep text-accent-foreground hover:border-primary hover:bg-primary',
        light:
          'border-background bg-background text-accent-deep hover:border-muted hover:bg-muted',
        outline:
          'border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground',
        secondary:
          'border-muted bg-muted text-foreground hover:border-secondary hover:bg-secondary',
        ghost:
          'font-text font-medium tracking-normal normal-case hover:bg-muted hover:text-foreground aria-expanded:bg-muted',
        destructive:
          'bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:outline-destructive',
        'outline-invert':
          'border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10',
        link: 'border-0 font-text font-bold tracking-normal text-primary normal-case underline-offset-4 hover:underline',
      },
      size: {
        default: 'min-h-12 px-9 py-3 text-base',
        xs: "min-h-7 px-3 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "min-h-9 px-5 py-1.5 text-sm [&_svg:not([class*='size-'])]:size-3.5",
        lg: 'min-h-13 px-9 py-3 text-lg tracking-normal normal-case',
        icon: 'size-8',
        'icon-xs': "size-6 [&_svg:not([class*='size-'])]:size-3",
        'icon-sm': 'size-7',
        'icon-lg': 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : 'button';

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
