import type { Metadata } from 'next';

import HomePage, { HOME_FAQ } from '@/components/sections/home/home-page';
import { SHOP_PRODUCTS } from '@/components/sections/product-grid';
import { CONTACT_EMAIL } from '@/lib/constants';
import { socialMetadata } from '@/lib/metadata';

const SITE_URL = 'https://www.stitestkit.co.uk';

const TITLE = 'Home STI Test Kits UK – 15 Minute Results | STI Test Kit';
const DESCRIPTION =
  'Private home STI test kits for HIV, syphilis, chlamydia, gonorrhoea, herpes and hepatitis. Results in 15 minutes, discreet UK delivery.';

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
  ...socialMetadata({ title: TITLE, description: DESCRIPTION, path: '/' }),
};

const plainText = (html: string) =>
  html
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();

// Schema.org data for Google: the brand, the site name, the 8 tests and the FAQs.
const STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'STI Test Kit',
      url: SITE_URL,
      logo: `${SITE_URL}/favicon/web-app-manifest-512x512.png`,
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email: CONTACT_EMAIL,
        areaServed: 'GB',
      },
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: 'STI Test Kit',
      url: SITE_URL,
      publisher: { '@id': `${SITE_URL}/#organization` },
    },
    {
      '@type': 'ItemList',
      name: 'All home test kits',
      itemListElement: SHOP_PRODUCTS.map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: product.title,
        url: `${SITE_URL}/rapid-tests/${product.slug}`,
      })),
    },
    {
      '@type': 'FAQPage',
      mainEntity: HOME_FAQ.tabs
        .flatMap((tab) => tab.questions)
        .map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: plainText(item.answer) },
        })),
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(STRUCTURED_DATA).replace(/</g, '\\u003c'),
        }}
      />
      <HomePage />
    </>
  );
}
