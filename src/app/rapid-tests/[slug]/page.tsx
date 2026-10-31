import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import ProductPage from '@/components/sections/product/product-page';
import { SHOP_PRODUCTS } from '@/components/sections/product-grid';
import { socialMetadata } from '@/lib/metadata';
import { getProductBySlug, getProductSlugs } from '@/lib/products';
import { ProductPageData } from '@/lib/types';

const SITE_URL = 'https://www.stitestkit.co.uk';

export const dynamic = 'force-static';
export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await getProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) return {};

  const title = product.seo?.title ?? `${product.title} | STI Test Kit`;
  const description =
    product.seo?.description ??
    product.intro.replace(/<[^>]+>/g, '').replace(/\*$/, '');
  const path = `/rapid-tests/${slug}`;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    robots: { index: true, follow: true },
    ...socialMetadata({ title, description, path }),
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  return (
    <>
      {product.seo && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData(product)).replace(
              /</g,
              '\\u003c',
            ),
          }}
        />
      )}
      <ProductPage product={product} />
    </>
  );
}

// Placeholders still to be checked (<mark>) stay out of the schema.
const plainText = (html: string) =>
  html
    .replace(/<mark>.*?<\/mark>/g, '')
    .replace(/<\/(p|li|tr)>/g, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();

// Schema.org data for Google: the product, its breadcrumb, the FAQs and the
// test steps. Only for finished pages (those with their own SEO copy).
function structuredData(product: ProductPageData) {
  const url = `${SITE_URL}/rapid-tests/${product.slug}`;
  const shop = SHOP_PRODUCTS.find((p) => p.handle === product.handle);
  const related = SHOP_PRODUCTS.filter((p) =>
    product.seo?.related?.includes(p.handle),
  );

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product',
        name: product.title,
        description: product.seo?.description,
        url,
        image: product.gallery.map((image) => `${SITE_URL}${image.src}`),
        brand: { '@type': 'Brand', name: 'Test Discreet' },
        ...(related.length > 0 && {
          isRelatedTo: related.map((item) => ({
            '@type': 'Product',
            name: item.title,
            url: `${SITE_URL}/rapid-tests/${item.slug}`,
          })),
        }),
        ...(shop && {
          offers: {
            '@type': 'Offer',
            price: shop.price.replace(/[^0-9.]/g, ''),
            priceCurrency: 'GBP',
            availability: 'https://schema.org/InStock',
            url,
          },
        }),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { name: 'Home', item: SITE_URL },
          { name: product.hero?.breadcrumb ?? product.title, item: url },
        ].map((crumb, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          ...crumb,
        })),
      },
      {
        '@type': 'FAQPage',
        mainEntity: product.faq.tabs
          .flatMap((tab) => tab.questions)
          .map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: { '@type': 'Answer', text: plainText(item.answer) },
          })),
      },
      {
        '@type': 'HowTo',
        name: product.how.stepsHeading ?? product.how.heading,
        description: plainText(product.how.intro),
        step: product.how.steps.map((step, index) => ({
          '@type': 'HowToStep',
          position: index + 1,
          name: step.title,
          text: step.text,
          image: `${SITE_URL}${step.image.src}`,
        })),
      },
      ...(product.seo?.itemList
        ? [
            {
              '@type': 'ItemList',
              name: `Tests in the ${product.title}`,
              itemListElement: product.seo.itemList.map((item, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: item.name,
                url: `${SITE_URL}${item.url}`,
              })),
            },
          ]
        : []),
    ],
  };
}
