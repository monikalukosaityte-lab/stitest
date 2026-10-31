'use client';

import { AnimatePresence, motion } from 'motion/react';
import { List, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { cn } from '@/lib/utils';

interface TocItem {
  id: string;
  label: string;
}

// Jumplinks manage the URL hash and scrolling themselves, entirely with the
// raw History API — bypassing both the browser's native anchor-jump-on-load
// and Next.js Link's own hash handling, which otherwise race and desync.
function jumpTo(id: string) {
  return (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
    history.pushState(null, '', `#${id}`);
  };
}

export function TableOfContents({ items }: { items: readonly TocItem[] }) {
  const [activeId, setActiveId] = useState<string>('');
  const [sheetOpen, setSheetOpen] = useState(false);

  // Always start at the top on a fresh page load/refresh — browsers restore
  // both hash-based position and plain manual-scroll position on reload, so
  // this must be unconditional. In-page jumplink clicks don't remount this
  // component, so this only ever fires on real loads.
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
    if (window.location.hash) {
      history.replaceState(
        null,
        '',
        window.location.pathname + window.location.search,
      );
    }
  }, []);

  useEffect(() => {
    const headingEls = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    const OFFSET = 120;
    let ticking = false;

    function updateActive() {
      ticking = false;
      let currentId = headingEls[0]?.id ?? '';
      for (const el of headingEls) {
        if (el.getBoundingClientRect().top - OFFSET <= 0) {
          currentId = el.id;
        } else {
          break;
        }
      }
      setActiveId(currentId);
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(updateActive);
    }

    updateActive();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [items]);

  useEffect(() => {
    document.body.style.overflow = sheetOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [sheetOpen]);

  return (
    <div className="order-first lg:order-none">
      {/* Desktop — sticky sidebar with scrollspy */}
      <nav className="sticky top-28 hidden max-h-[calc(100vh-8rem)] overflow-y-auto lg:block">
        <span className="text-muted-foreground mb-3 block text-xs">
          On this page
        </span>
        <ul className="border-border space-y-2.5 border-l">
          {items.map((item) => (
            <li key={item.id}>
              <Link
                href={`#${item.id}`}
                onClick={jumpTo(item.id)}
                className={cn(
                  '-ml-px block border-l-2 py-0.5 pl-4 text-sm no-underline transition-colors',
                  activeId === item.id
                    ? 'border-accent text-accent font-medium'
                    : 'text-muted-foreground hover:text-foreground border-transparent',
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile — floating "Sections" pill + bottom sheet */}
      <button
        onClick={() => setSheetOpen(true)}
        className="border-accent bg-card text-accent fixed right-4 bottom-6 z-30 flex items-center gap-2 rounded-full border-2 px-4 py-2.5 text-sm font-medium shadow-lg lg:hidden"
      >
        <List className="size-4" />
        Sections
      </button>

      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {sheetOpen && (
              <MobileSectionsSheet
                items={items}
                activeId={activeId}
                onClose={() => setSheetOpen(false)}
              />
            )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
}

function MobileSectionsSheet({
  items,
  activeId,
  onClose,
}: {
  items: readonly TocItem[];
  activeId: string;
  onClose: () => void;
}) {
  return (
    <>
      <motion.div
        className="bg-foreground/40 fixed inset-0 z-40 lg:hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        className="bg-background border-accent fixed inset-x-0 bottom-0 z-50 rounded-t-3xl border-t-2 p-6 pb-8 lg:hidden"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="mb-4 flex items-center justify-between">
          <span className="text-muted-foreground block text-xs">
            On this page
          </span>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="size-5" />
          </button>
        </div>
        <ul className="max-h-[60vh] space-y-1 overflow-y-auto">
          {items.map((item) => (
            <li key={item.id}>
              <Link
                href={`#${item.id}`}
                onClick={(e) => {
                  jumpTo(item.id)(e);
                  onClose();
                }}
                className={cn(
                  'block rounded-lg px-3 py-2.5 text-sm no-underline transition-colors',
                  activeId === item.id
                    ? 'bg-accent-subtle text-accent font-medium'
                    : 'text-foreground hover:bg-accent-subtle',
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </motion.div>
    </>
  );
}
