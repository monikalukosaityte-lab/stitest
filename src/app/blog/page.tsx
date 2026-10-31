import type { Metadata } from 'next';

import { BlogListing } from '@/components/sections/blog/blog-page';
import { getAllArticles } from '@/lib/articles';
import { socialMetadata } from '@/lib/metadata';

const TITLE = 'STI & Sexual Health Blog | STI Test Kit';
const DESCRIPTION =
  'Medically reviewed articles on STI symptoms, testing and sexual health - clear answers to the questions people are often too embarrassed to ask.';

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: '/blog' },
  robots: { index: true, follow: true },
  ...socialMetadata({ title: TITLE, description: DESCRIPTION, path: '/blog' }),
};

export default async function BlogPage() {
  const articles = await getAllArticles();

  return <BlogListing articles={articles} />;
}
