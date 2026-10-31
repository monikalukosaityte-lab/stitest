import Image from 'next/image';
import Link from 'next/link';

import { ClockIcon, DropIcon, SwabIcon } from '@/components/icons/shop';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ShopProduct } from '@/lib/types';
import { cn, shopUrl } from '@/lib/utils';

// Mirrors the "Explore our tests" grid on testdiscreet.co.uk. Prices and variant
// IDs come from the Shopify catalogue — update them here if they change there.
// Cards open this site's product pages; "Quick add" goes to the Shopify cart.
export const SHOP_PRODUCTS: ShopProduct[] = [
  {
    handle: 'sti-bundle',
    slug: '7-in-1-sti-test-kit',
    title: '7-in-1 STI Test Kit',
    price: '£64.95',
    compareAt: '£98.75',
    variantId: 63780179870026,
    badge: 'Best value',
    checks: 'HIV, syphilis, chlamydia, gonorrhoea, herpes, hepatitis B and C',
    includes: [
      'Chlamydia',
      'Gonorrhoea',
      'Syphilis',
      'HIV 1/2',
      'Genital herpes (HSV-2)',
      'Hepatitis B',
      'Hepatitis C',
    ],
    sample: 'Blood + swab',
    image: {
      src: '/images/products/shop-sti-bundle.webp',
      alt: '7-in-1 STI home test kit',
    },
  },
  {
    handle: 'core-4',
    slug: 'core-4-sti-test-kit',
    title: 'Core 4 STI Test Kit',
    price: '£44.95',
    compareAt: '£50.85',
    variantId: 63780180492618,
    badge: 'Most popular',
    checks: 'Chlamydia, gonorrhoea, HIV, syphilis',
    includes: ['Chlamydia', 'Gonorrhoea', 'HIV 1/2', 'Syphilis'],
    sample: 'Blood + swab',
    image: {
      src: '/images/products/shop-core-4.webp',
      alt: 'Core 4 STI home test kit',
    },
  },
  {
    handle: 'chlamydia-gonorrhoea',
    slug: 'chlamydia-gonorrhoea-home-test-kit',
    title: 'Chlamydia & Gonorrhoea Test',
    price: '£19.95',
    variantId: 63780180590922,
    checks: 'Chlamydia, gonorrhoea',
    includes: ['Chlamydia', 'Gonorrhoea'],
    sample: 'Swab',
    image: {
      src: '/images/products/shop-chlamydia-gonorrhoea.webp',
      alt: 'Chlamydia and gonorrhoea home test kit',
    },
  },
  {
    handle: 'hiv',
    slug: 'hiv-home-test-kit',
    title: 'HIV Test',
    price: '£15.95',
    variantId: 63780178592074,
    checks: 'HIV-1 and HIV-2',
    includes: ['HIV-1', 'HIV-2'],
    sample: 'Finger-prick',
    image: { src: '/images/products/shop-hiv.webp', alt: 'HIV home test kit' },
  },
  {
    handle: 'syphilis',
    slug: 'syphilis-home-test-kit',
    title: 'Syphilis Test',
    price: '£14.95',
    variantId: 63780180623690,
    checks: 'Syphilis',
    includes: ['Syphilis (Treponema pallidum)'],
    sample: 'Finger-prick',
    image: {
      src: '/images/products/shop-syphilis.webp',
      alt: 'Syphilis home test kit',
    },
  },
  {
    handle: 'hsv-2',
    slug: 'herpes-hsv-2-home-test-kit',
    title: 'Herpes (HSV-2) Test',
    price: '£19.95',
    variantId: 63780180656458,
    checks: 'Genital herpes (HSV-2)',
    includes: ['Genital herpes (HSV-2)'],
    sample: 'Finger-prick',
    image: {
      src: '/images/products/shop-hsv-2.webp',
      alt: 'Herpes (HSV-2) home test kit',
    },
  },
  {
    handle: 'hep-b-c',
    slug: 'hepatitis-b-c-home-test-kit',
    title: 'Hepatitis B & C Test',
    price: '£27.95',
    variantId: 63780180787530,
    checks: 'Hepatitis B, hepatitis C',
    includes: ['Hepatitis B', 'Hepatitis C'],
    sample: 'Finger-prick',
    image: {
      src: '/images/products/shop-hep-b-c.webp',
      alt: 'Hepatitis B and C home test kit',
    },
  },
  {
    handle: 'psa',
    slug: 'psa-prostate-home-test-kit',
    title: 'PSA Prostate Test',
    price: '£19.95',
    variantId: 63780180820298,
    checks: 'Prostate health (PSA)',
    includes: ['Prostate specific antigen (PSA)'],
    sample: 'Finger-prick',
    image: {
      src: '/images/products/shop-psa.webp',
      alt: 'PSA prostate home test kit',
    },
  },
];

export function productUrl(product: ShopProduct) {
  return `/rapid-tests/${product.slug}`;
}

export default function ProductGrid({
  heading = 'Explore our tests',
  handles,
  featureFirst = true,
}: {
  heading?: string;
  handles?: string[];
  featureFirst?: boolean;
}) {
  const products = handles
    ? handles
        .map((handle) => SHOP_PRODUCTS.find((p) => p.handle === handle))
        .filter((p): p is ShopProduct => Boolean(p))
    : SHOP_PRODUCTS;

  return (
    <section id="tests" className="pt-10 pb-14">
      <div className="container">
        <h2 className="mb-8 text-center text-3xl font-bold">{heading}</h2>
        <ul className="grid grid-cols-2 gap-2.5 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
          {products.map((product, index) => {
            const hero = featureFirst && index === 0;
            return (
              <li key={product.handle} className={cn(hero && 'col-span-full')}>
                <ProductCard product={product} hero={hero} />
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function ProductCard({
  product,
  hero = false,
}: {
  product: ShopProduct;
  hero?: boolean;
}) {
  const href = productUrl(product);
  const SampleIcon = product.sample === 'Swab' ? SwabIcon : DropIcon;

  return (
    <Card
      className={cn(
        'bg-secondary text-foreground relative h-full rounded-lg text-base ring-0',
        hero && 'md:flex-row',
      )}
    >
      <Link
        href={href}
        tabIndex={-1}
        aria-hidden
        className={cn(
          'relative block aspect-10/9',
          hero && 'md:aspect-auto md:min-h-80 md:shrink-0 md:basis-5/12',
        )}
      >
        <Image
          src={product.image.src}
          alt={product.image.alt}
          fill
          sizes={
            hero
              ? '(min-width: 750px) 45vw, 100vw'
              : '(min-width: 990px) 25vw, 50vw'
          }
          className="object-contain p-2"
        />
      </Link>
      {product.badge && (
        <Badge className="bg-card text-foreground font-text absolute top-3 left-3 z-10 rounded-xs border-transparent px-2 py-0.5 text-[0.6875rem] font-bold tracking-wide uppercase">
          {product.badge}
        </Badge>
      )}
      <div
        className={cn(
          'flex flex-1 flex-col p-3 md:px-4 md:pt-3.5 md:pb-4',
          hero && 'md:justify-center md:px-10 md:py-8',
        )}
      >
        <h3
          className={cn(
            'mb-1.5 text-sm md:text-lg',
            hero && 'md:mb-3 md:text-3xl',
          )}
        >
          <Link
            href={href}
            className="no-underline after:absolute after:inset-0"
          >
            {product.title}
          </Link>
        </h3>
        <p className={cn('mb-3 text-sm', hero && 'md:mb-4 md:text-base')}>
          <span className="font-bold">Checks for:</span> {product.checks}
        </p>
        <ul className="mb-3 flex flex-wrap gap-1.5">
          <li className="bg-muted inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs">
            <SampleIcon className="size-4" />
            {product.sample}
          </li>
          <li className="bg-muted inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs">
            <ClockIcon className="size-4" />
            Results in around 15 minutes
          </li>
        </ul>
        <p
          className={cn('mt-auto mb-3 font-bold', hero && 'md:mt-2 md:text-xl')}
        >
          {product.price}
        </p>
        <div
          className={cn('relative z-10 grid', hero && 'md:justify-items-start')}
        >
          <Button asChild variant="brand" size="sm">
            <a href={shopUrl(`/cart/add?id=${product.variantId}&quantity=1`)}>
              Quick add
            </a>
          </Button>
        </div>
      </div>
    </Card>
  );
}
