import type { Metadata } from 'next';

const OG_IMAGE = {
  url: '/og-image.jpg',
  width: 1200,
  height: 630,
  alt: 'STI Test Kit',
};

/**
 * Open Graph and Twitter tags for one page. Next replaces the layout's
 * `openGraph` and `twitter` objects rather than merging them, so every page
 * passes the full set here: its own title, description and URL, plus the
 * shared site name and image.
 */
export function socialMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Pick<Metadata, 'openGraph' | 'twitter'> {
  return {
    openGraph: {
      type: 'website',
      locale: 'en_GB',
      siteName: 'STI Test Kit',
      url: path,
      title,
      description,
      images: [OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      creator: '@testdiscreet',
      title,
      description,
      images: [OG_IMAGE.url],
    },
  };
}
