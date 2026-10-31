import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatShortDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function formatPublishDate(date: string) {
  const d = new Date(date);
  const day = d.toLocaleDateString('en-GB', { day: 'numeric' });
  const month = d.toLocaleDateString('en-GB', { month: 'long' });
  const year = d.toLocaleDateString('en-GB', { year: 'numeric' });
  return `${day} ${month}, ${year}`;
}

const SHOP_URL = 'https://testdiscreet.co.uk';

/** Link into the Test Discreet Shopify store, tagged so sales are credited to this site. */
export function shopUrl(path = '/', hash?: string) {
  const url = new URL(path, SHOP_URL);
  url.searchParams.set('utm_source', 'stitestkit');
  url.searchParams.set('utm_medium', 'referral');
  if (hash) url.hash = hash;
  return url.toString();
}
