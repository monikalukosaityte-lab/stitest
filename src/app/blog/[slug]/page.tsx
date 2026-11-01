import rehypeShiki from '@shikijs/rehype';
import { MDXComponents } from 'mdx/types';
import type { Metadata } from 'next';
import Image, { ImageProps } from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { compileMDX } from 'next-mdx-remote/rsc';
import { ComponentPropsWithoutRef } from 'react';

import {
  ArrowRightIcon,
  CheckIcon,
  ChevronRightIcon,
} from '@/components/icons/shop';
import { Pre } from '@/components/mdx/code-block';
import StickyBuyBar from '@/components/mdx/sticky-buy-bar';
import {
  ArticleHero,
  MoreEntries,
  TableOfContents,
} from '@/components/sections/article';
import { SHOP_PRODUCTS } from '@/components/sections/product-grid';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  getAllArticles,
  getArticleBySlug,
  getArticleSlugs,
} from '@/lib/articles';
import { socialMetadata } from '@/lib/metadata';
import {
  ArticleFrontmatter,
  TestNowPreset,
  TestOption,
  TestOptionsPreset,
} from '@/lib/types';
import { cn } from '@/lib/utils';

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function MdxImage(props: ImageProps) {
  return (
    <div className="not-prose col-span-full my-10">
      <Image {...props} className="w-full rounded-2xl" alt={props.alt || ''} />
    </div>
  );
}

function H2({ className, children, ...props }: ComponentPropsWithoutRef<'h2'>) {
  const text = typeof children === 'string' ? children : '';
  return (
    <h2 id={slugify(text)} className={cn('scroll-mt-28', className)} {...props}>
      {children}
    </h2>
  );
}

function P(props: ComponentPropsWithoutRef<'p'>) {
  return <p {...props} />;
}

function Ul(props: ComponentPropsWithoutRef<'ul'>) {
  return <ul {...props} />;
}

function Lead({ children }: { children: React.ReactNode }) {
  return <p className="lead text-muted-foreground">{children}</p>;
}

// "Test now" box placed in articles with <TestNow preset="hiv" />, plus a
// mobile buy bar that appears once the box has scrolled away. The buttons open
// the product page.
const TEST_NOW_PRESETS: Record<'hiv' | 'herpes', TestNowPreset> = {
  hiv: {
    handle: 'hiv',
    productName: 'HIV Home Test',
    title: 'Test for HIV privately, in your own time',
    text: 'Easy to use, with results in about 15 minutes.',
    points: [
      {
        desktop: 'Simple finger-prick test',
        mobile: 'Simple finger-prick test at home',
      },
      { desktop: 'Checks HIV-1 & HIV-2', mobile: null },
      {
        desktop: 'Plain, discreet packaging',
        mobile: 'Plain, discreet packaging',
      },
      { desktop: 'Ships in 1 working day', mobile: 'Ships in 1 working day' },
    ],
    note: 'Exposed in the last 72 hours? Contact a sexual health clinic or A&E now about PEP.',
    stickySubtitle: 'results in 15 min',
  },
  herpes: {
    handle: 'hsv-2',
    productName: 'Herpes (HSV-2) Test',
    title: 'Check for herpes privately, in your own time',
    text: 'A simple finger-prick test, with results in about 15 minutes.',
    points: [
      {
        desktop: 'Checks for HSV-2 antibodies',
        mobile: 'Checks for HSV-2 antibodies',
      },
      { desktop: 'No clinic visit', mobile: 'No clinic visit' },
      {
        desktop: 'Plain, discreet packaging',
        mobile: 'Plain, discreet packaging',
      },
      { desktop: 'Ships in 1 working day', mobile: 'Ships in 1 working day' },
    ],
    stickySubtitle: 'results in 15 min',
  },
};

function TestNow({ preset }: { preset: keyof typeof TEST_NOW_PRESETS }) {
  const { handle, productName, title, text, points, note, stickySubtitle } =
    TEST_NOW_PRESETS[preset];
  const product = SHOP_PRODUCTS.find((p) => p.handle === handle);
  if (!product) return null;

  const id = `test-now-${preset}`;
  const productHref = `/rapid-tests/${product.slug}`;

  return (
    <>
      <aside
        id={id}
        className="not-prose bg-accent-light my-10 rounded-xl p-5 md:p-8"
      >
        <div className="md:grid md:grid-cols-[1fr_13rem] md:items-center md:gap-8">
          <div>
            <p className="font-display text-xl leading-tight font-extrabold md:text-3xl">
              {title}
            </p>
            <p className="text-muted-foreground mt-2 text-sm md:text-base">
              {text}
            </p>
            <ul className="mt-4 space-y-2 text-sm md:mt-5 md:grid md:grid-cols-2 md:space-y-0 md:gap-x-6 md:gap-y-3">
              {points.map((point) => (
                <li
                  key={point.desktop}
                  className={cn(
                    'flex items-start gap-2',
                    !point.mobile && 'hidden md:flex',
                  )}
                >
                  <CheckIcon className="text-accent mt-0.5 size-4 shrink-0" />
                  <span className="md:hidden">{point.mobile}</span>
                  <span className="hidden md:inline">{point.desktop}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 grid md:hidden">
              <Button asChild variant="brand">
                <Link href={productHref}>Get your kit · {product.price}</Link>
              </Button>
            </div>
          </div>

          <div className="bg-card hidden rounded-lg p-6 text-center md:block">
            <p className="text-sm font-semibold">{productName}</p>
            <p className="font-display mt-1 text-4xl font-extrabold">
              {product.price}
            </p>
            <div className="mt-4 grid">
              <Button asChild size="sm" variant="brand">
                <Link href={productHref}>
                  Get your kit
                  <ArrowRightIcon />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {note && (
          <p className="text-muted-foreground mt-5 text-xs md:mt-6 md:border-t md:pt-4 md:text-sm">
            {note}
          </p>
        )}
      </aside>
      <StickyBuyBar
        targetId={id}
        title={productName}
        subtitle={`${product.price} · ${stickySubtitle}`}
        href={productHref}
        label="Get your kit"
      />
    </>
  );
}

// "Test for more" box placed in articles with <TestOptions preset="hiv" />.
// MDX here only accepts plain-text props, so each preset's copy lives below.
// Prices, samples and links come from SHOP_PRODUCTS so they stay in sync.
const TEST_OPTION_PRESETS: Record<'hiv' | 'herpes', TestOptionsPreset> = {
  hiv: {
    eyebrow: 'Testing for HIV?',
    title: {
      desktop: 'Check for other common STIs at the same time',
      mobile: 'Check for other STIs at the same time',
    },
    text: {
      desktop:
        'Many STIs have no symptoms. Every kit gives results at home in about 15 minutes.',
      mobile:
        'Many STIs have no symptoms. Results at home in about 15 minutes.',
    },
    note: 'Plain packaging · Ships in 1 working day · HIV result most accurate 90 days after exposure.',
    options: [
      {
        handle: 'hiv',
        title: { desktop: 'HIV Test', mobile: 'HIV Test' },
        badge: { desktop: 'Just HIV', mobile: null },
        summary: 'Just HIV',
        details: 'HIV-1 and HIV-2 · finger-prick',
        infections: 1,
        tags: ['HIV-1', 'HIV-2'],
        priceNote: 'Fast and focused',
        featured: false,
      },
      {
        handle: 'sti-bundle',
        title: { desktop: '7-in-1 STI Test', mobile: '7-in-1' },
        badge: { desktop: '7-in-1 · Best value', mobile: 'Best value' },
        summary: 'HIV + 6 more',
        details:
          'HIV, syphilis, chlamydia, gonorrhoea, herpes, hepatitis B and C',
        infections: 7,
        tags: [
          'HIV',
          'Syphilis',
          'Chlamydia',
          'Gonorrhoea',
          'Herpes',
          'Hepatitis B',
          'Hepatitis C',
        ],
        priceNote: null,
        featured: true,
      },
      {
        handle: 'core-4',
        title: { desktop: 'Core 4 STI Test', mobile: 'Core 4 (4-in-1)' },
        badge: { desktop: '4-in-1 · Better value', mobile: null },
        summary: 'HIV + 3 more',
        details: 'HIV, syphilis, chlamydia, gonorrhoea',
        infections: 4,
        tags: ['HIV', 'Syphilis', 'Chlamydia', 'Gonorrhoea'],
        priceNote: null,
        featured: false,
      },
    ],
  },
  herpes: {
    title: {
      desktop: 'Want to check for more than herpes?',
      mobile: 'Want to check for more than herpes?',
    },
    text: {
      desktop:
        'Herpes isn’t included in most standard STI tests. Our 7-in-1 checks for it alongside 6 other common STIs.',
      mobile:
        'Herpes isn’t included in most standard STI tests. Our 7-in-1 checks for it alongside 6 other common STIs.',
    },
    note: 'Plain packaging · Ships in 1 working day · Results in about 15 minutes',
    options: [
      {
        handle: 'hsv-2',
        title: {
          desktop: 'Herpes (HSV-2) Test',
          mobile: 'Herpes (HSV-2) Test',
        },
        badge: { desktop: 'Just herpes', mobile: null },
        summary: 'Just herpes',
        details: 'Genital herpes (HSV-2) · finger-prick',
        infections: 1,
        tags: ['Genital herpes (HSV-2)'],
        priceNote: 'Fast and focused',
        featured: false,
      },
      {
        handle: 'sti-bundle',
        title: { desktop: '7-in-1 STI Test', mobile: '7-in-1 STI Test' },
        badge: { desktop: '7-in-1 · Best value', mobile: 'Best value' },
        summary: 'Herpes + 6 more',
        details:
          'Herpes, HIV, syphilis, chlamydia, gonorrhoea, hepatitis B and C',
        infections: 7,
        meta: 'Herpes + 6 more',
        tags: [
          'Herpes (HSV-2)',
          'HIV',
          'Syphilis',
          'Chlamydia',
          'Gonorrhoea',
          'Hepatitis B',
          'Hepatitis C',
        ],
        highlightTag: 'Herpes (HSV-2)',
        priceNote: null,
        showSaving: true,
        featured: true,
      },
    ],
  },
};

function TestOptions({ preset }: { preset: keyof typeof TEST_OPTION_PRESETS }) {
  const { eyebrow, title, text, note, options } = TEST_OPTION_PRESETS[preset];

  return (
    <aside className="not-prose bg-accent-light my-10 rounded-xl p-5 md:p-8">
      {eyebrow && (
        <p className="font-display text-accent mb-2 text-xs font-bold tracking-widest uppercase">
          {eyebrow}
        </p>
      )}
      <p className="font-display text-xl leading-tight font-extrabold md:text-2xl">
        <span className="md:hidden">{title.mobile}</span>
        <span className="hidden md:inline">{title.desktop}</span>
      </p>
      <p className="text-muted-foreground mt-2 text-sm md:text-base">
        <span className="md:hidden">{text.mobile}</span>
        <span className="hidden md:inline">{text.desktop}</span>
      </p>

      <ul className="mt-5 space-y-3 md:hidden">
        {options.map((option) => (
          <TestOptionRow key={option.handle} option={option} />
        ))}
      </ul>
      <ul
        className={cn(
          'mt-6 hidden gap-4 md:grid',
          options.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3',
        )}
      >
        {options.map((option) => (
          <TestOptionCard key={option.handle} option={option} />
        ))}
      </ul>

      <p className="text-muted-foreground mt-5 text-xs md:text-sm">{note}</p>
    </aside>
  );
}

function TestOptionCard({ option }: { option: TestOption }) {
  const product = SHOP_PRODUCTS.find((p) => p.handle === option.handle);
  if (!product) return null;

  return (
    <li
      className={cn(
        'bg-card flex flex-col rounded-lg border p-4',
        option.featured && 'border-accent-deep ring-accent-deep ring-1',
      )}
    >
      {option.badge.desktop && (
        <Badge
          variant={option.featured ? 'default' : 'secondary'}
          size="sm"
          className={cn(
            'font-text self-start font-semibold',
            option.featured && 'bg-accent-deep',
          )}
        >
          {option.badge.desktop}
        </Badge>
      )}
      <p className="font-display mt-3 text-lg leading-tight font-bold">
        {option.title.desktop}
      </p>
      <p className="text-muted-foreground mt-1 text-xs">
        {option.meta ??
          `Checks ${option.infections} ${option.infections === 1 ? 'infection' : 'infections'}`}{' '}
        · <span className="whitespace-nowrap">{product.sample}</span>
      </p>
      <ul className="mt-3 flex flex-wrap gap-1.5">
        {option.tags.map((tag) => (
          <li
            key={tag}
            className={cn(
              'rounded-full px-2 py-0.5 text-xs font-medium',
              tag === option.highlightTag
                ? 'bg-accent-light text-accent'
                : 'bg-muted',
            )}
          >
            {tag}
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-6">
        <div className="border-t pt-4">
          <p className="font-display text-2xl font-extrabold">
            {product.price}
            {option.showSaving && product.compareAt && (
              <s className="font-text text-muted-foreground ml-2 text-sm font-normal">
                {product.compareAt}
              </s>
            )}
          </p>
          {option.showSaving && product.compareAt ? (
            <p className="text-accent text-xs font-semibold">
              Save {saving(product.price, product.compareAt)}
            </p>
          ) : (
            <p className="text-muted-foreground text-xs">
              {option.priceNote ??
                `About ${perInfection(product.price, option.infections)} per infection`}
            </p>
          )}
        </div>
        <div className="mt-4 grid">
          <Button
            asChild
            size="sm"
            variant={option.featured ? 'brand-deep' : 'outline'}
          >
            <Link href={`/rapid-tests/${product.slug}`}>
              View test
              <ArrowRightIcon />
            </Link>
          </Button>
        </div>
      </div>
    </li>
  );
}

function TestOptionRow({ option }: { option: TestOption }) {
  const product = SHOP_PRODUCTS.find((p) => p.handle === option.handle);
  if (!product) return null;

  return (
    <li>
      <Link
        href={`/rapid-tests/${product.slug}`}
        className={cn(
          'bg-card flex items-center justify-between gap-4 rounded-lg border p-4 no-underline',
          option.featured && 'border-accent-deep ring-accent-deep ring-1',
        )}
      >
        <div className="space-y-1">
          <p className="font-display leading-tight font-bold">
            {option.title.mobile}
          </p>
          {option.badge.mobile && (
            <Badge size="sm" className="font-text bg-accent-deep font-semibold">
              {option.badge.mobile}
            </Badge>
          )}
          <p className="text-xs font-bold">{option.summary}</p>
          <p className="text-muted-foreground text-xs">{option.details}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="font-display text-lg font-extrabold">{product.price}</p>
          {option.showSaving && product.compareAt && (
            <s className="text-muted-foreground block text-xs">
              {product.compareAt}
            </s>
          )}
          <span className="font-display text-primary inline-flex items-center gap-1 text-xs font-bold tracking-wider uppercase">
            View
            <ChevronRightIcon className="size-3" />
          </span>
        </div>
      </Link>
    </li>
  );
}

function toPence(price: string) {
  return Math.round(parseFloat(price.replace(/[^0-9.]/g, '')) * 100);
}

function formatPence(pence: number) {
  return `£${(pence / 100).toFixed(2)}`;
}

function perInfection(price: string, infections: number) {
  return formatPence(Math.round(toPence(price) / infections));
}

function saving(price: string, compareAt: string) {
  return formatPence(toPence(compareAt) - toPence(price));
}

const mdxComponents: MDXComponents = {
  pre: Pre,
  img: MdxImage as MDXComponents['img'],
  h2: H2,
  p: P,
  ul: Ul,
  Lead,
  TestNow,
  TestOptions,
};

export const dynamic = 'force-static';
export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await getArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) return {};

  const title = article.frontmatter.metaTitle ?? article.frontmatter.title;
  const description =
    article.frontmatter.metaDescription ?? article.frontmatter.description;
  const path = `/blog/${slug}`;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    robots: { index: true, follow: true },
    ...socialMetadata({ title, description, path }),
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [article, allArticles] = await Promise.all([
    getArticleBySlug(slug),
    getAllArticles(),
  ]);

  if (!article) {
    notFound();
  }

  const otherArticles = allArticles.filter((a) => a.slug !== slug);

  const { content } = await compileMDX<ArticleFrontmatter>({
    source: article.content,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        rehypePlugins: [
          [
            rehypeShiki,
            {
              themes: {
                light: 'github-light',
                dark: 'github-dark',
              },
              defaultColor: false,
            },
          ],
        ],
      },
    },
    components: mdxComponents,
  });

  return (
    <>
      <article>
        <ArticleHero
          title={article.frontmatter.title}
          description={article.frontmatter.description}
          date={article.frontmatter.date}
          image={article.frontmatter.image}
          medicallyReviewed={article.frontmatter.medicallyReviewed}
        >
          {/* Article body */}
          <div className="grid gap-8 lg:grid-cols-[1fr_220px] lg:gap-12">
            <div className="prose prose-base prose-headings:font-display prose-headings:text-foreground prose-h2:font-extrabold prose-h3:font-bold prose-p:text-foreground prose-li:text-foreground prose-strong:text-foreground prose-a:text-primary prose-a:font-medium prose-a:underline prose-a:underline-offset-3 hover:prose-a:text-primary-hover prose-li:marker:text-primary max-w-none [&>h2]:mt-14 [&>h2]:text-2xl [&>h2]:leading-tight [&>h2:first-child]:mt-0 [&>p+p]:mt-4 [&>ul]:mt-4">
              {content}
            </div>
            <TableOfContents items={article.frontmatter.toc ?? []} />
          </div>
        </ArticleHero>
      </article>

      <MoreEntries articles={otherArticles} />
    </>
  );
}
