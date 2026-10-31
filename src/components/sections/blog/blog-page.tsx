import Image from 'next/image';
import Link from 'next/link';

import ProductGrid from '@/components/sections/product-grid';
import { Button } from '@/components/ui/button';
import { ArticleFrontmatter } from '@/lib/types';
import { formatPublishDate } from '@/lib/utils';

export function BlogListing({ articles }: { articles: ArticleFrontmatter[] }) {
  return (
    <>
      <BlogHero />

      {articles.length > 0 && (
        <section className="section-padding">
          <div className="container">
            <h2 className="mb-8 text-3xl md:text-4xl">
              Latest <em>guides</em>
            </h2>
            <ul className="grid gap-5 md:grid-cols-3">
              {articles.map((article) => (
                <li key={article.slug}>
                  <PostCard article={article} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <ProductGrid />
    </>
  );
}

// The testdiscreet.co.uk hero: navy band with a soft glow and the kit in hand.
function BlogHero() {
  return (
    <section
      id="home"
      className="bg-accent-deep text-accent-foreground relative flex min-h-130 items-start overflow-hidden md:min-h-112 md:items-center"
    >
      <div className="from-primary absolute inset-0 bg-radial-[90%_50%_at_50%_35%] to-transparent md:bg-radial-[45%_85%_at_72%_50%]" />
      <Image
        src="/images/home/hero-mobile.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover md:hidden"
      />
      <div className="absolute inset-0 container hidden pt-6 md:block">
        <div className="relative size-full">
          <Image
            src="/images/home/hero-desktop.webp"
            alt=""
            fill
            priority
            sizes="(min-width: 1248px) 1200px, 100vw"
            className="object-contain object-right-bottom"
          />
        </div>
      </div>

      <div className="relative z-10 container py-8 md:py-12">
        <div className="max-w-3xl text-center md:text-left">
          <h1 className="mb-6 text-4xl leading-none md:text-5xl lg:text-6xl">
            <span className="block font-normal">
              Everything you need to know
            </span>
            <span className="mt-2 block font-serif text-2xl font-bold md:text-3xl">
              about STI
            </span>
          </h1>
          <p className="mb-6 max-w-xl text-lg">
            Straightforward guides to STI testing, infection symptoms and more —
            what to know, what to look for, and what to do next.
          </p>
          <Button asChild variant="light">
            <Link href="/#tests">Shop now</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export function PostCard({ article }: { article: ArticleFrontmatter }) {
  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group flex flex-col no-underline"
    >
      <div className="bg-secondary relative mb-3.5 aspect-3/2 overflow-hidden rounded-lg">
        {article.image && (
          <Image
            src={article.image}
            alt={article.title}
            fill
            sizes="(min-width: 750px) 33vw, 100vw"
            className="object-cover"
          />
        )}
      </div>
      <time
        dateTime={article.date}
        className="text-muted-foreground mb-1 text-xs"
      >
        {formatPublishDate(article.date)}
      </time>
      <h3 className="mb-1.5 text-lg">{article.title}</h3>
      <p className="text-muted-foreground mb-2">{article.description}</p>
      <span className="text-primary group-hover:text-primary-hover text-sm font-bold transition-colors">
        Read more
      </span>
    </Link>
  );
}
