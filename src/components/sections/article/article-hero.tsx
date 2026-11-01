import Image from 'next/image';
import Link from 'next/link';

import { CheckIcon } from '@/components/icons/shop';
import { formatPublishDate } from '@/lib/utils';

interface ArticleHeroProps {
  title: string;
  description: string;
  date: string;
  image?: string;
  medicallyReviewed?: boolean;
  children?: React.ReactNode;
}

export function ArticleHero({
  title,
  description,
  date,
  image,
  medicallyReviewed = false,
  children,
}: ArticleHeroProps) {
  return (
    <section className="hero-padding">
      <div className="container max-w-5xl">
        <nav aria-label="Breadcrumb" className="text-muted-foreground text-sm">
          <Link href="/" className="no-underline hover:underline">
            Home
          </Link>
          <span className="mx-1.5">/</span>
          <Link href="/blog" className="no-underline hover:underline">
            STI guides
          </Link>
        </nav>

        <div className="mt-6 grid gap-8 md:grid-cols-[1fr_280px] md:items-center lg:grid-cols-[1fr_340px] lg:gap-12">
          <div>
            <h1 className="text-4xl md:text-5xl">{title}</h1>
            <p className="text-muted-foreground mt-4 text-lg">{description}</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              <MetaPill>Published {formatPublishDate(date)}</MetaPill>
              {medicallyReviewed && <MetaPill>Medically reviewed</MetaPill>}
            </ul>
          </div>

          {image && (
            <div className="bg-secondary relative aspect-3/2 w-full overflow-hidden rounded-lg">
              <Image
                src={image}
                alt={title}
                fill
                priority
                sizes="(min-width: 1024px) 340px, (min-width: 768px) 280px, 100vw"
                className="object-cover"
              />
            </div>
          )}
        </div>

        <div className="mt-10 border-t" />

        {children && <div className="pt-10">{children}</div>}
      </div>
    </section>
  );
}

function MetaPill({ children }: { children: React.ReactNode }) {
  return (
    <li className="text-muted-foreground inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm">
      <span className="bg-primary text-primary-foreground grid size-4 place-items-center rounded-xs">
        <CheckIcon className="size-3" />
      </span>
      {children}
    </li>
  );
}
