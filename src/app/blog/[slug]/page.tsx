import rehypeShiki from '@shikijs/rehype';
import { MDXComponents } from 'mdx/types';
import type { Metadata } from 'next';
import Image, { ImageProps } from 'next/image';
import { notFound } from 'next/navigation';
import { compileMDX } from 'next-mdx-remote/rsc';
import { ComponentPropsWithoutRef } from 'react';

import { Pre } from '@/components/mdx/code-block';
import {
  ArticleHero,
  MoreEntries,
  TableOfContents,
} from '@/components/sections/article';
import ProductGrid from '@/components/sections/product-grid';
import {
  getAllArticles,
  getArticleBySlug,
  getArticleSlugs,
} from '@/lib/articles';
import { socialMetadata } from '@/lib/metadata';
import { ArticleFrontmatter } from '@/lib/types';
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

const mdxComponents: MDXComponents = {
  pre: Pre,
  img: MdxImage as MDXComponents['img'],
  h2: H2,
  p: P,
  ul: Ul,
  Lead,
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
      <ProductGrid heading="Ready to test?" />
    </>
  );
}
