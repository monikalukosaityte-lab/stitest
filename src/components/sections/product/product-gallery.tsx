'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';

import { ChevronLeftIcon, ChevronRightIcon } from '@/components/icons/shop';
import { ProductImage } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function ProductGallery({ images }: { images: ProductImage[] }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [current, setCurrent] = useState(0);

  // Slide positions, measured from the first slide so the mobile peek layout
  // (slides narrower than the track) and the desktop full-width layout both work.
  function slideOffsets() {
    const track = trackRef.current;
    if (!track) return [];
    const slides = Array.from(track.children) as HTMLElement[];
    const first = slides[0]?.offsetLeft ?? 0;
    return slides.map((slide) => slide.offsetLeft - first);
  }

  function goTo(index: number) {
    const offsets = slideOffsets();
    trackRef.current?.scrollTo({ left: offsets[index], behavior: 'smooth' });
  }

  function onScroll() {
    const track = trackRef.current;
    if (!track) return;
    const offsets = slideOffsets();
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
    if (atEnd) return setCurrent(offsets.length - 1);
    const nearest = offsets.reduce(
      (best, offset, index) =>
        Math.abs(offset - track.scrollLeft) <
        Math.abs(offsets[best] - track.scrollLeft)
          ? index
          : best,
      0,
    );
    setCurrent(nearest);
  }

  return (
    <div className="md:sticky md:top-28">
      <div className="relative md:px-9">
        <ul
          ref={trackRef}
          onScroll={onScroll}
          className="relative -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-2 overflow-x-auto overscroll-x-contain px-4 [scrollbar-width:none] md:mx-0 md:scroll-px-0 md:gap-0 md:rounded-lg md:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {images.map((image, index) => (
            <li
              key={image.src}
              className="bg-secondary relative aspect-square w-5/6 shrink-0 snap-start overflow-hidden rounded-lg md:w-full md:rounded-none"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                priority={index === 0}
                sizes="(min-width: 900px) 50vw, 85vw"
                className="object-contain"
              />
            </li>
          ))}
        </ul>
        <GalleryArrow
          side="prev"
          disabled={current === 0}
          onClick={() => goTo(current - 1)}
        />
        <GalleryArrow
          side="next"
          disabled={current === images.length - 1}
          onClick={() => goTo(current + 1)}
        />
      </div>

      {/* Mobile: dots instead of thumbnails; the next photo peeks in from the right. */}
      <div className="mt-3 flex items-center justify-center gap-1.5 md:hidden">
        {images.map((image, index) => (
          <button
            key={image.src}
            type="button"
            onClick={() => goTo(index)}
            aria-label={`Show image ${index + 1} of ${images.length}`}
            aria-current={index === current}
            className={cn(
              'h-2 cursor-pointer rounded-full transition-all',
              index === current ? 'bg-primary w-5' : 'bg-accent-muted w-2',
            )}
          />
        ))}
      </div>

      <div className="mt-4 hidden gap-2 overflow-x-auto px-9 [scrollbar-width:none] md:flex">
        {images.map((image, index) => (
          <button
            key={image.src}
            type="button"
            onClick={() => goTo(index)}
            aria-label={`Show image ${index + 1}`}
            aria-current={index === current}
            className={cn(
              'bg-secondary relative size-18 shrink-0 cursor-pointer overflow-hidden rounded-md border-2',
              index === current ? 'border-primary' : 'border-transparent',
            )}
          >
            <Image
              src={image.src}
              alt=""
              fill
              sizes="72px"
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

function GalleryArrow({
  side,
  disabled,
  onClick,
}: {
  side: 'prev' | 'next';
  disabled: boolean;
  onClick: () => void;
}) {
  const Icon = side === 'prev' ? ChevronLeftIcon : ChevronRightIcon;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === 'prev' ? 'Previous' : 'Next'}
      className={cn(
        'bg-primary text-primary-foreground absolute top-1/2 hidden size-7 -translate-y-1/2 cursor-pointer place-items-center rounded-full shadow-sm transition-opacity md:grid',
        side === 'prev' ? 'left-0' : 'right-0',
        disabled && 'pointer-events-none opacity-0',
      )}
    >
      <Icon className="size-3" />
    </button>
  );
}
