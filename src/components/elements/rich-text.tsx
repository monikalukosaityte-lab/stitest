import { cn } from '@/lib/utils';

/**
 * Renders the small HTML snippets (p, strong, em, ul, li, a) stored in
 * content/products — trusted content copied from the Shopify product pages.
 */
export function RichText({
  html,
  className,
  as: Tag = 'div',
}: {
  html: string;
  className?: string;
  as?: 'div' | 'span';
}) {
  if (!html) return null;

  return (
    <Tag
      className={cn(
        '[&_a]:text-primary hover:[&_a]:text-primary-hover [&_a]:underline [&_a]:underline-offset-3 [&_li]:mt-1 [&_mark]:rounded-xs [&_mark]:px-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_p+p]:mt-3 [&_strong]:font-bold [&_ul]:list-disc [&_ul]:pl-5',
        // Tables (e.g. the stages of an infection): one row per item, lines between.
        '[&_table]:my-4 [&_table]:w-full [&_table]:text-sm [&_td]:border-t [&_td]:py-2.5 [&_td]:pr-3 [&_td]:align-top [&_td:first-child]:font-bold [&_th]:pr-3 [&_th]:pb-2 [&_th]:text-left [&_th]:font-bold',
        className,
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
