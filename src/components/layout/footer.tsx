import Image from 'next/image';
import Link from 'next/link';

import { BrandLockup } from '@/components/layout/logo';
import { shopUrl } from '@/lib/utils';

// Order and names from the homepage SEO doc.
const FOOTER_TESTS = [
  { href: '/rapid-tests/7-in-1-sti-test-kit', label: '7-in-1 STI Test Kit' },
  { href: '/rapid-tests/core-4-sti-test-kit', label: 'Core 4 STI Test Kit' },
  { href: '/rapid-tests/hiv-home-test-kit', label: 'HIV' },
  { href: '/rapid-tests/syphilis-home-test-kit', label: 'Syphilis' },
  {
    href: '/rapid-tests/chlamydia-gonorrhoea-home-test-kit',
    label: 'Chlamydia & Gonorrhoea',
  },
  { href: '/rapid-tests/herpes-hsv-2-home-test-kit', label: 'Herpes (HSV-2)' },
  {
    href: '/rapid-tests/hepatitis-b-c-home-test-kit',
    label: 'Hepatitis B & C',
  },
  { href: '/rapid-tests/psa-prostate-home-test-kit', label: 'PSA Prostate' },
];

// Columns from the homepage SEO doc. Each test links to its product page.
const FOOTER_COLUMNS = [
  {
    heading: 'Tests',
    links: FOOTER_TESTS,
  },
  {
    heading: 'Learn',
    links: [
      { label: 'STI guides', href: '/blog' },
      { label: 'How to test', href: shopUrl('/pages/how-to-test') },
      { label: 'When can I test?', href: '/#when-to-test' },
      { label: 'FAQs', href: '/#faq' },
    ],
  },
  {
    heading: 'Help',
    links: [
      { label: 'Contact', href: shopUrl('/pages/contact') },
      { label: 'Returns', href: shopUrl('/policies/refund-policy') },
      { label: 'Shipping', href: shopUrl('/policies/shipping-policy') },
    ],
  },
  {
    heading: 'About',
    links: [
      { label: 'Privacy policy', href: shopUrl('/policies/privacy-policy') },
      {
        label: 'Terms of service',
        href: shopUrl('/policies/terms-of-service'),
      },
    ],
  },
];

const PAYMENT_ICONS = [
  'American Express',
  'Apple Pay',
  'Diners Club',
  'Discover',
  'Google Pay',
  'Klarna',
  'Maestro',
  'Mastercard',
  'PayPal',
  'Shop Pay',
  'Union Pay',
  'Visa',
];

export default function Footer() {
  return (
    <footer className="bg-accent-deep text-accent-foreground pt-14 pb-6">
      <div className="container">
        <div className="grid md:grid-cols-4 md:gap-8">
          {FOOTER_COLUMNS.map((column) => (
            <details
              key={column.heading}
              open
              className="group border-accent-foreground/20 border-t md:border-0"
            >
              <summary className="flex cursor-pointer list-none justify-between py-4 md:pointer-events-none md:mb-3.5 md:py-0 [&::-webkit-details-marker]:hidden">
                <h3 className="text-base">{column.heading}</h3>
                <span aria-hidden className="md:hidden">
                  <span className="group-open:hidden">+</span>
                  <span className="hidden group-open:inline">&minus;</span>
                </span>
              </summary>
              <ul className="grid gap-2 pb-4 text-sm md:pb-0">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <FooterLink href={link.href}>{link.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </div>

        <div className="border-accent-foreground/20 mt-12 grid justify-items-center gap-5 border-t pt-6 text-center text-xs">
          <Link href="/" className="no-underline">
            <BrandLockup inverted />
          </Link>
          <ul className="flex flex-wrap justify-center gap-1.5">
            {PAYMENT_ICONS.map((name) => (
              <li key={name}>
                <Image
                  src={`/images/payment/${name.toLowerCase().replace(' ', '-')}.svg`}
                  alt={name}
                  width={38}
                  height={24}
                  className="h-auto w-10"
                />
              </li>
            ))}
          </ul>
          <p>&copy; 2026 STI Test Kit</p>
          <p className="max-w-3xl opacity-85">
            Our tests don&apos;t replace advice from a doctor or nurse. For ages
            16 and over. Free, confidential testing is also available from NHS
            sexual health services.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const className = 'text-inherit no-underline hover:underline';

  if (href.startsWith('/')) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}
