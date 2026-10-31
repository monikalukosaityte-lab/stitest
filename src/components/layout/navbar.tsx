'use client';

import Image from 'next/image';
import Link from 'next/link';

import {
  AccountIcon,
  ArrowRightIcon,
  CartIcon,
  MenuIcon,
} from '@/components/icons/shop';
import { BrandLockup } from '@/components/layout/logo';
import { productUrl, SHOP_PRODUCTS } from '@/components/sections/product-grid';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { shopUrl } from '@/lib/utils';

// Same menu as testdiscreet.co.uk: two bundle tiles, then every single test.
const BUNDLE_HANDLES = ['sti-bundle', 'core-4'];

const MENU_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'STI guides', href: '/blog' },
];

export default function Navbar() {
  return (
    <header className="bg-background sticky top-0 z-20">
      <div className="container grid min-h-14 grid-cols-[1fr_auto_1fr] items-center md:min-h-22">
        <MenuDrawer />
        <Link href="/" className="justify-self-center no-underline">
          <BrandLockup />
        </Link>
        <div className="flex items-center gap-3 justify-self-end">
          <a
            href={shopUrl('/account')}
            className="grid size-10 place-items-center"
          >
            <AccountIcon className="size-6" />
            <span className="sr-only">Account</span>
          </a>
          <a
            href={shopUrl('/cart')}
            className="grid size-10 place-items-center"
          >
            <CartIcon className="size-6" />
            <span className="sr-only">Cart</span>
          </a>
        </div>
      </div>
    </header>
  );
}

function MenuDrawer() {
  const bundles = SHOP_PRODUCTS.filter((p) =>
    BUNDLE_HANDLES.includes(p.handle),
  );
  const tests = SHOP_PRODUCTS.filter((p) => !BUNDLE_HANDLES.includes(p.handle));

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          type="button"
          className="inline-flex cursor-pointer items-center gap-1.5 justify-self-start py-2 text-lg font-bold"
        >
          <MenuIcon className="size-6" />
          <span className="max-md:hidden">Menu</span>
        </button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="bg-background w-11/12 gap-0 data-[side=left]:sm:max-w-md"
      >
        <div className="flex items-center border-b px-5 py-4">
          <BrandLockup align="start" />
          <SheetTitle className="sr-only">Menu</SheetTitle>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          <p className="text-muted-foreground mb-3 text-xs tracking-wider uppercase">
            Bundles
          </p>
          <div className="mb-6 grid grid-cols-2 gap-3">
            {bundles.map((product) => (
              <SheetClose key={product.handle} asChild>
                <Link
                  href={productUrl(product)}
                  className="bg-muted block overflow-hidden rounded-lg no-underline"
                >
                  <div className="bg-secondary relative aspect-4/3">
                    <Image
                      src={product.image.src}
                      alt={product.image.alt}
                      fill
                      sizes="200px"
                      className="object-cover"
                    />
                  </div>
                  <span className="flex items-center justify-between gap-2 px-3 py-2.5 text-sm font-bold">
                    {product.title}
                    <ArrowRightIcon className="size-4 shrink-0" />
                  </span>
                </Link>
              </SheetClose>
            ))}
          </div>

          <p className="text-muted-foreground mb-3 text-xs tracking-wider uppercase">
            Single tests
          </p>
          <ul className="mb-6 border-t">
            {tests.map((product) => (
              <li key={product.handle}>
                <SheetClose asChild>
                  <Link
                    href={productUrl(product)}
                    className="block border-b py-3 font-bold no-underline"
                  >
                    {product.title}
                  </Link>
                </SheetClose>
              </li>
            ))}
          </ul>

          <ul>
            {MENU_LINKS.map((link) => (
              <li key={link.label}>
                {link.href.startsWith('/') ? (
                  <SheetClose asChild>
                    <Link href={link.href} className="block py-2 no-underline">
                      {link.label}
                    </Link>
                  </SheetClose>
                ) : (
                  <a href={link.href} className="block py-2 no-underline">
                    {link.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      </SheetContent>
    </Sheet>
  );
}
