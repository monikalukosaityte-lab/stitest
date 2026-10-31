'use client';

import * as React from 'react';
import { Accordion as AccordionPrimitive } from 'radix-ui';

import { cn } from '@/lib/utils';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';

function Accordion({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn('flex w-full flex-col', className)}
      {...props}
    />
  );
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn('not-last:border-b', className)}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  headingAs: Heading = 'h3',
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger> & {
  headingAs?: 'h2' | 'h3' | 'h4';
}) {
  return (
    <AccordionPrimitive.Header asChild>
      <Heading className="flex">
        <AccordionPrimitive.Trigger
          data-slot="accordion-trigger"
          className={cn(
            'group/accordion-trigger focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:after:border-ring **:data-[slot=accordion-trigger-icon]:text-muted-foreground relative flex flex-1 cursor-pointer items-center justify-between rounded-lg border border-transparent py-5 text-left text-sm font-medium transition-all outline-none focus-visible:ring-3 disabled:pointer-events-none disabled:opacity-50 **:data-[slot=accordion-trigger-icon]:ml-auto **:data-[slot=accordion-trigger-icon]:size-4',
            className,
          )}
          {...props}
        >
          {children}
          <ChevronDownIcon
            data-slot="accordion-trigger-icon"
            className="pointer-events-none shrink-0 group-aria-expanded/accordion-trigger:hidden"
          />
          <ChevronUpIcon
            data-slot="accordion-trigger-icon"
            className="pointer-events-none hidden shrink-0 group-aria-expanded/accordion-trigger:inline"
          />
        </AccordionPrimitive.Trigger>
      </Heading>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    // Always rendered, so closed answers are still in the HTML for search
    // engines; closed items are hidden with CSS instead of being removed.
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      forceMount
      className="data-open:animate-accordion-down overflow-hidden text-sm data-[state=closed]:hidden"
      {...props}
    >
      <div
        className={cn(
          '[&_a]:hover:text-foreground h-(--radix-accordion-content-height) pt-0 pb-2.5 [&_a]:underline [&_a]:underline-offset-3 [&_p:not(:last-child)]:mb-4',
          className,
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
