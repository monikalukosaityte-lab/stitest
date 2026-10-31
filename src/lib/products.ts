import fs from 'fs/promises';
import path from 'path';

import { ProductPageData } from '@/lib/types';

// Product page content mirrors the live testdiscreet.co.uk product pages.
const productsDirectory = path.join(process.cwd(), 'content/products');

export async function getProductSlugs(): Promise<string[]> {
  const files = await fs.readdir(productsDirectory);
  return files
    .filter((file) => file.endsWith('.json'))
    .map((file) => file.replace('.json', ''));
}

export async function getProductBySlug(
  slug: string,
): Promise<ProductPageData | null> {
  try {
    const file = await fs.readFile(
      path.join(productsDirectory, `${slug}.json`),
      'utf8',
    );
    return JSON.parse(file) as ProductPageData;
  } catch {
    return null;
  }
}
