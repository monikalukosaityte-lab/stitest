import type { Metadata } from 'next';

import { BlogListing } from '@/components/sections/blog/blog-page';
import { getAllArticles } from '@/lib/articles';

export const metadata: Metadata = {
  title: { absolute: 'STI & Sexual Health Blog | STI Test Kit' },
  description:
    'Medically reviewed articles on STI symptoms, testing and sexual health - clear answers to the questions people are often too embarrassed to ask.',
  alternates: { canonical: '/blog' },
  robots: { index: true, follow: true },
};

export default async function BlogPage() {
  const articles = await getAllArticles();

  return <BlogListing articles={articles} />;
}
