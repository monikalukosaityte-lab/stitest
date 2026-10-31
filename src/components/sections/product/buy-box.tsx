'use client';

import Link from 'next/link';
import { Fragment, useEffect, useRef, useState } from 'react';

import { RichText } from '@/components/elements/rich-text';
import {
  CheckIcon,
  InfoIcon,
  PackageIcon,
  PRODUCT_ICONS,
} from '@/components/icons/shop';
import { productUrl, SHOP_PRODUCTS } from '@/components/sections/product-grid';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { ProductHeroContent, ProductPageData } from '@/lib/types';
import { cn, shopUrl } from '@/lib/utils';

function toPence(price: string) {
  return Math.round(parseFloat(price.replace(/[^0-9.]/g, '')) * 100);
}

// Matches the Shopify "Test + retest" discount: the percentage comes off each
// kit and is rounded down to the penny (e.g. £15.95 → £1.59 off per kit).
function totalFor(unitPence: number, quantity: number, discount: number) {
  if (quantity === 1) return unitPence;
  return quantity * (unitPence - Math.floor((unitPence * discount) / 100));
}

function formatPence(pence: number) {
  return `£${(pence / 100).toFixed(2)}`;
}

// `featured` is the homepage version: no breadcrumb, and the title is an h2
// linking to the product page.
export default function BuyBox({
  product,
  featured = false,
}: {
  product: ProductPageData;
  featured?: boolean;
}) {
  const options = product.bundleChoice?.options ?? [];
  const shopProduct = SHOP_PRODUCTS.find((p) => p.handle === product.handle);
  const [choice, setChoice] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const buyRef = useRef<HTMLDivElement>(null);
  const [showSticky, setShowSticky] = useState(false);

  const selected = options[choice];
  const isBundle = choice > 0 && Boolean(selected?.variantId);
  const variantId = isBundle ? selected.variantId! : product.variantId;
  const unitPence = toPence(selected?.price ?? shopProduct?.price ?? '0');
  const discount = product.retest?.discount ?? 0;
  const totalPence = totalFor(unitPence, quantity, discount);
  // "__PRICE__" in the label shows the current total.
  const buyLabel = (
    isBundle ? (selected.buttonLabel ?? product.buyLabel) : product.buyLabel
  ).replace('__PRICE__', formatPence(totalPence));
  const buyHref = shopUrl(`/cart/add?id=${variantId}&quantity=${quantity}`);

  // Mobile: keep a buy button on screen once the main one scrolls away.
  useEffect(() => {
    const el = buyRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) =>
      setShowSticky(!entry.isIntersecting && entry.boundingClientRect.top < 0),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="space-y-5">
      {product.hero ? (
        <>
          <HeroIntro hero={product.hero} />
          {product.hero.priceNote !== undefined && shopProduct && (
            <div className="space-y-1">
              <Price
                price={shopProduct.price}
                compareAt={shopProduct.compareAt}
              />
              {product.hero.priceNote && (
                <p className="text-muted-foreground text-sm">
                  {product.hero.priceNote}
                </p>
              )}
            </div>
          )}
        </>
      ) : (
        <>
          {!featured && <Breadcrumb current={product.title} />}

          {featured && shopProduct ? (
            <h2 className="text-3xl lg:text-4xl">
              <Link href={productUrl(shopProduct)} className="no-underline">
                {product.title}
              </Link>
            </h2>
          ) : (
            <h1 className="text-3xl lg:text-4xl">{product.title}</h1>
          )}

          <RichText html={product.intro} className="text-base md:text-lg" />

          {product.keyFacts.length > 0 && (
            <ul className="space-y-2.5">
              {product.keyFacts.map((fact) => (
                <CheckItem key={fact} html={fact} />
              ))}
            </ul>
          )}

          {product.shipping && (
            <p className="bg-muted inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm">
              <PackageIcon className="text-primary size-4.5" />
              <RichText as="span" html={product.shipping} />
            </p>
          )}

          {!product.bundleChoice && shopProduct && (
            <Price
              price={shopProduct.price}
              compareAt={shopProduct.compareAt}
            />
          )}
        </>
      )}

      {product.bundleChoice && (
        <fieldset className="pt-2">
          <legend className="mb-4 font-semibold">
            {product.bundleChoice.heading}
          </legend>
          <div className="grid gap-3.5">
            {options.map((option, index) => (
              <Fragment key={option.title}>
                <label
                  className={cn(
                    'bg-card relative grid cursor-pointer grid-cols-[auto_1fr_auto] items-center gap-3.5 rounded-lg border px-4 py-4 transition-colors',
                    choice === index &&
                      'border-accent-deep ring-accent-deep ring-1 ring-inset',
                  )}
                >
                  <input
                    type="radio"
                    name="bundle"
                    checked={choice === index}
                    onChange={() => setChoice(index)}
                    className="peer sr-only"
                  />
                  <span
                    aria-hidden
                    className={cn(
                      'size-5 rounded-full border-2',
                      choice === index
                        ? 'border-accent-deep from-accent-deep bg-radial from-40% to-transparent to-45%'
                        : 'bg-card',
                    )}
                  />
                  {option.badge && (
                    <span className="bg-accent-deep text-accent-foreground absolute top-0 right-4 -translate-y-1/2 rounded-full px-2.5 py-1 text-[0.6875rem] font-semibold tracking-wider uppercase">
                      {option.badge}
                    </span>
                  )}
                  <span className="grid gap-1">
                    <span className="font-semibold">{option.title}</span>
                    {option.includes && (
                      <RichText
                        as="span"
                        html={option.includes}
                        className="text-muted-foreground [&_strong]:text-foreground text-sm leading-snug [&_strong]:font-semibold"
                      />
                    )}
                  </span>
                  <span className="flex max-w-32 flex-wrap items-baseline justify-end gap-x-1.5 gap-y-0.5 text-right">
                    {option.was && (
                      <s className="text-muted-foreground text-sm">
                        {option.was}
                      </s>
                    )}
                    <span className="text-lg font-bold">{option.price}</span>
                    {option.save && (
                      <span className="bg-accent-light text-accent-deep rounded-full px-2 py-0.5 text-xs font-semibold">
                        {option.save}
                      </span>
                    )}
                  </span>
                </label>
                {index === 0 && product.bundleChoice!.intro && (
                  <Notice>{product.bundleChoice!.intro}</Notice>
                )}
              </Fragment>
            ))}
          </div>
        </fieldset>
      )}

      {product.retest && (
        <fieldset className="pt-2">
          <legend className="mb-5 font-semibold">
            {product.retest.heading}
          </legend>
          <div className="grid grid-cols-2 gap-3">
            {[1, 2].map((qty) => {
              const pence = totalFor(unitPence, qty, discount);
              const unit = isBundle
                ? 'bundle'
                : (product.retest!.unit ?? 'test');
              return (
                <label
                  key={qty}
                  className={cn(
                    'bg-card relative flex cursor-pointer flex-col items-center gap-1 rounded-lg border px-3 pt-5 pb-4 text-center transition-colors',
                    quantity === qty &&
                      'border-accent-deep ring-accent-deep ring-1 ring-inset',
                  )}
                >
                  <input
                    type="radio"
                    name="quantity"
                    checked={quantity === qty}
                    onChange={() => setQuantity(qty)}
                    className="sr-only"
                  />
                  {qty === 2 && (
                    <span className="bg-accent-deep text-accent-foreground absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full px-2.5 py-1 text-[0.6875rem] font-semibold tracking-wider whitespace-nowrap uppercase">
                      {product.retest!.badge}
                    </span>
                  )}
                  <span className="text-lg font-semibold">
                    {qty} {qty === 1 ? unit : `${unit}s`}
                  </span>
                  <span className="text-muted-foreground">
                    {formatPence(pence)}
                    {qty === 2 && discount > 0 && (
                      <span className="text-accent-deep ml-1.5 font-semibold">
                        Save {discount}%
                      </span>
                    )}
                  </span>
                </label>
              );
            })}
          </div>
          {product.retest.note && (
            <Notice className="mt-3.5">{product.retest.note}</Notice>
          )}
        </fieldset>
      )}

      <div ref={buyRef} className="grid gap-3.5 pt-2">
        <Button asChild size="lg">
          <a href={buyHref}>{buyLabel}</a>
        </Button>
        {product.hero && product.trust && (
          <p className="text-muted-foreground text-center text-sm">
            {product.trust}
          </p>
        )}
      </div>

      {product.reassurance && (
        <p className="bg-secondary rounded-md px-4 py-3 text-center text-sm">
          <strong className="block">{product.reassurance.title}</strong>
          {product.reassurance.text}
        </p>
      )}

      {product.hero?.after && <RichText html={product.hero.after} />}

      <RichText
        html={product.footnote}
        className="text-muted-foreground text-sm"
      />

      {/* Pages with an About section show these questions there instead. */}
      {!product.about && product.accordions.length > 0 && (
        <Accordion
          type="multiple"
          defaultValue={product.accordions
            .filter((a) => a.open)
            .map((a) => a.heading)}
          className="border-t"
        >
          {product.accordions.map((accordion) => (
            <AccordionItem
              key={accordion.heading}
              value={accordion.heading}
              className="border-b"
            >
              <AccordionTrigger className="py-4 text-base font-extrabold">
                {accordion.heading}
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-base">
                <RichText html={accordion.content} />
                {accordion.checklist.length > 0 && (
                  <ul className="mt-3 space-y-2.5">
                    {accordion.checklist.map((item) => (
                      <CheckItem key={item} html={item} />
                    ))}
                  </ul>
                )}
                <RichText html={accordion.after} className="mt-3" />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}

      <div
        className={cn(
          'bg-background fixed inset-x-0 bottom-0 z-15 grid px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-lg transition-transform md:hidden',
          showSticky ? 'translate-y-0' : 'translate-y-full',
        )}
      >
        <Button asChild size="lg">
          <a href={buyHref}>{buyLabel}</a>
        </Button>
      </div>
    </div>
  );
}

function HeroIntro({ hero }: { hero: ProductHeroContent }) {
  return (
    <>
      <Breadcrumb current={hero.breadcrumb} />

      {hero.badge && (
        <p className="bg-accent-deep text-accent-foreground inline-block rounded-full px-3 py-1 text-xs font-semibold tracking-wider uppercase">
          {hero.badge}
        </p>
      )}

      <h1 className="text-3xl lg:text-4xl">{hero.heading}</h1>

      <p className="text-base md:text-lg">{hero.intro}</p>

      <ul className="flex flex-wrap gap-1.5">
        {hero.highlights.map((highlight) => {
          const Icon = PRODUCT_ICONS[highlight.icon];
          return (
            <li
              key={highlight.label}
              className="bg-accent text-accent-foreground inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-sm font-medium whitespace-nowrap"
            >
              <Icon className="size-3.5" />
              {highlight.label}
            </li>
          );
        })}
      </ul>

      <dl className="bg-card divide-y rounded-xl border px-5 shadow-sm md:px-6">
        {hero.specs.map((spec) => {
          const Icon = PRODUCT_ICONS[spec.icon];
          return (
            <div
              key={spec.label}
              className="grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-0.5 py-3.5 sm:grid-cols-[auto_auto_1fr] sm:gap-x-3.5 sm:py-4"
            >
              <Icon className="text-accent row-span-2 size-5 sm:row-span-1" />
              <dt className="text-muted-foreground text-sm sm:text-base">
                {spec.label}
              </dt>
              <dd className="col-start-2 font-bold sm:col-start-auto sm:text-right">
                {spec.value}
              </dd>
            </div>
          );
        })}
      </dl>

      {hero.inBox && <RichText html={hero.inBox} className="text-sm" />}
    </>
  );
}

// Bundles show what the tests would cost separately and the saving.
function Price({ price, compareAt }: { price: string; compareAt?: string }) {
  const save = compareAt ? toPence(compareAt) - toPence(price) : 0;

  return (
    <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <span className="text-3xl font-extrabold">{price}</span>
      {compareAt && (
        <span className="text-muted-foreground">
          <s>{compareAt}</s> if bought separately
        </span>
      )}
      {save > 0 && (
        <span className="bg-accent-light text-accent-deep rounded-full px-2.5 py-0.5 text-sm font-semibold">
          Save {formatPence(save)}
        </span>
      )}
    </p>
  );
}

function Breadcrumb({ current }: { current: string }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="text-muted-foreground text-sm md:text-base"
    >
      <Link
        href="/"
        className="hover:text-foreground underline underline-offset-3"
      >
        Home
      </Link>
      <span className="mx-1.5">/</span>
      <span aria-current="page">{current}</span>
    </nav>
  );
}

// Info note: icon sits inline with the text so it doesn't take a line of its own.
function Notice({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      role="note"
      className={cn(
        'bg-accent-subtle text-accent-deep rounded-lg px-4 py-3 text-center text-sm sm:text-left',
        className,
      )}
    >
      <InfoIcon className="mr-1.5 inline size-4 -translate-y-px align-middle" />
      {children}
    </p>
  );
}

function CheckItem({ html }: { html: string }) {
  return (
    <li className="flex items-start gap-2.5">
      <span className="bg-primary text-primary-foreground mt-0.5 grid size-4.5 shrink-0 place-items-center rounded-xs">
        <CheckIcon className="size-3.5" />
      </span>
      <RichText as="span" html={html} />
    </li>
  );
}
