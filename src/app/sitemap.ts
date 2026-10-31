import { MetadataRoute } from 'next';

import { getAllArticles } from '@/lib/articles';
import { getProductSlugs } from '@/lib/products';

const BASE_URL = 'https://stitestkit.co.uk';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, productSlugs] = await Promise.all([
    getAllArticles(),
    getProductSlugs(),
  ]);

  const productEntries: MetadataRoute.Sitemap = productSlugs.map((slug) => ({
    url: `${BASE_URL}/rapid-tests/${slug}`,
  }));

  const articleEntries: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${BASE_URL}/blog/${article.slug}`,
    lastModified: article.date,
  }));

  return [
    { url: BASE_URL },
    ...productEntries,
    { url: `${BASE_URL}/blog` },
    ...articleEntries,
  ];
}
