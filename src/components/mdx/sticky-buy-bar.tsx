'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Mobile buy bar for articles. It slides in once the in-article box with
// `targetId` has scrolled off the top of the screen, and flags <html> with
// `data-sticky-buy` so floating buttons (the "Sections" pill) can move up.
export default function StickyBuyBar({
  targetId,
  title,
  subtitle,
  href,
  label,
}: {
  targetId: string;
  title: string;
  subtitle: string;
  href: string;
  label: string;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el) return;
    // A scroll check rather than an IntersectionObserver, so jumping past the
    // box (e.g. from the "Sections" menu) still shows the bar.
    const update = () => setShow(el.getBoundingClientRect().bottom < 0);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [targetId]);

  useEffect(() => {
    const root = document.documentElement;
    const mobile = window.matchMedia('(max-width: 767px)');
    const sync = () =>
      root.toggleAttribute('data-sticky-buy', show && mobile.matches);
    sync();
    mobile.addEventListener('change', sync);
    return () => {
      mobile.removeEventListener('change', sync);
      root.removeAttribute('data-sticky-buy');
    };
  }, [show]);

  return (
    <div
      aria-hidden={!show}
      className={cn(
        'not-prose bg-background fixed inset-x-0 bottom-0 z-15 flex items-center justify-between gap-4 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-lg transition-transform md:hidden',
        show ? 'translate-y-0' : 'translate-y-full',
      )}
    >
      <div>
        <p className="font-display text-sm font-bold">{title}</p>
        <p className="text-muted-foreground text-xs">{subtitle}</p>
      </div>
      <Button asChild size="sm" variant="brand">
        <a href={href} tabIndex={show ? undefined : -1}>
          {label}
        </a>
      </Button>
    </div>
  );
}
