# Project Rules

## Scope & Deployment

- This repo is stitestkit.co.uk only. td-site-prod (`~/Documents/td-site-prod`, `~/orca/workspaces/td-site-prod/`) is the separate Shopify theme for testdiscreet.co.uk — it is read-only reference: you may read its files and copy assets out of it, but never edit, write, commit, push, or run commands that change anything there
- The live address is `https://www.stitestkit.co.uk` (non-www redirects to www). Use the www URL in canonicals, the sitemap, schema and robots.txt
- `main` auto-deploys to production on Vercel. Never commit or push to `main`
- Always work on a branch (e.g. `preview/<feature>`) and push it so Vercel builds a preview URL for review
- Never merge into `main` — the user reviews the preview and merges themselves

## Team Workflow

- Several people edit this repo. Start each piece of work from the latest `main` (or the open preview branch if it hasn't been merged yet), on your own `preview/<feature>` branch
- Commit and push often so work is saved on GitHub; open a pull request for review. Only the project owner merges into `main`
- Open tasks live in `TODO.md`. When you finish one, remove it there in the same commit; add new ones there too

## Styling

- always use shadcn components
- Use Tailwind CSS utility classes - prefer utilities over custom CSS
- Use `space-y-*` for vertical spacing instead of flex with gap when appropriate
- Use utility classes like `hero-padding`, `section-padding`, `container`, `bigger-container` defined in globals.css
- For grids, use shorthand `gap-*` when X and Y gaps are equal. Only use explicit `gap-x-*` and `gap-y-*` when they need to be different
- Never use arbitrary color values like `bg-[#09090b]` - always check globals.css first and use semantic tokens (`bg-foreground`, `bg-primary`, `bg-muted`, etc.)
- Use shadcn-standard color token names — never invent custom color names like `grain-amber`. The brand/accent color uses `accent` tokens: `bg-accent`, `text-accent`, `text-accent-foreground`, `bg-accent-hover`, `bg-accent-light`, `bg-accent-subtle`
- For custom utilities with `@apply`, use `@layer utilities { .class { @apply ... } }` - not `@utility` which only accepts raw CSS
- `border-border` is already applied globally via `* { @apply border-border }` in globals.css — never add it to elements. Just use `border`, `border-t`, `border-b`, `border-l`, `border-r` directly
- Avoid arbitrary values — use Tailwind's standard scale whenever possible:
  - Font sizes: `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`... (arbitrary like `text-[0.625rem]` is fine for sub-xs sizes)
  - Line heights: `leading-none`, `leading-tight`, `leading-snug`, `leading-normal`, `leading-relaxed`, `leading-loose`
  - Max widths: `max-w-sm`, `max-w-md`, `max-w-lg`, `max-w-xl`, `max-w-2xl`...
  - Font weights: `font-normal`, `font-medium`, `font-semibold`, `font-bold`
  - Shadows: `shadow-sm`, `shadow`, `shadow-md`, `shadow-lg`, `shadow-xl`
  - Rotations: `rotate-1`, `rotate-2`, `rotate-3`, `rotate-6`
  - Sizing: use `size-*` for equal width/height (e.g. `size-2` not `h-2 w-2`)
- For responsive headings, use Tailwind breakpoints: `text-4xl md:text-5xl lg:text-6xl` instead of `text-[clamp(...)]`
- No inline `style={{}}` for colors — use semantic tokens

## Components

- Button component has built-in tooltip support via `tooltip` and `tooltipSide` props
- Use `asChild` prop with Button when wrapping Link components
- Never pass `className` to Button for styling — use the existing `variant` and `size` props instead.
- Use Next.js `Link` from `next/link` instead of `<a>` tags for all internal navigation
- Icons should be placed in `src/components/icons/` with proper SVG props typing:
  ```tsx
  export const IconName = (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      ...
    </svg>
  );
  ```

## Structure

- Section components go in `src/components/sections/`
- Layout components go in `src/components/layout/`
- UI components go in `src/components/ui/`
- Provider components go in `src/components/providers/`
- Custom hooks go in `src/hooks/`
- Colocate data constants in the component file where they're used, not in a shared constants file
- Type definitions go in `src/lib/types.ts`
- Images organized by page: `public/images/home/`, `public/images/about/`, etc.

## Typography

- Look and feel mirrors the testdiscreet.co.uk Shopify theme (colours, buttons, header, footer, cards)
- Fonts: Montserrat (text + display), Libre Baskerville (`font-serif` accent), Inter Tight (`font-logo`, logo only), JetBrains Mono (mono)
- Montserrat and Libre Baskerville stand in for the Shopify theme's Proxima Nova and Bookmania — those are commercial fonts and must never be committed here (this repo is public)
- already font-text and font-weight-text set in globals.css body — don't need to set it again
- Headings automatically use `font-display` and `font-weight-display` (800) via base layer (h1-h6); h3-h6 are bold (700)
- `<em>` inside h1-h3 switches to the serif accent (and primary colour in h1/h2), e.g. `Latest <em>guides</em>`
- For non-heading elements that need the display font, use `font-display` explicitly
- Body text uses `font-text` utility (default via body, no need to specify)
- Data, labels, and small caps use `font-mono` utility

## Product Pages

- `content/products/hiv-home-test-kit.json` is the template for every product page. New or updated pages copy its structure; only the copy changes
- URL: `/rapid-tests/<keyword>` (e.g. `hiv-home-test-kit`). The JSON `slug` and the file name match it, `SHOP_PRODUCTS` in `product-grid.tsx` uses the same slug, and every old URL gets a permanent redirect in `next.config.ts`
- `seo.title` and `seo.description` carry the meta title and description from the copy doc
- Sections, in order:
  1. Hero: gallery (product shot first, privacy promise second), breadcrumb, H1, intro, pills, spec table, "Choose your test" (single, Core 4, 7-in-1, with the "exposed to one STI" note after the single), quantity (test + retest), "Get my test", trust line, discreet delivery
  2. About: four questions as H2 accordions (first open), a link to a bundle, and the "Why test for ... at home?" card with a buy button
  3. How the test works: H2, intro, H3 over the steps, link to the test's Shopify how-to-test page
  4. When to test: the window calculator, with notes. PSA has no date checker (`days: 0`, `strings: null`). HIV has no When to test section at all (no `windows`), by request. Tests with no window period can use `windows.cards` instead of the date checker (herpes now uses text and a note only); tests with two windows (hepatitis B and C) add `windows.secondDays` and `middle_*` strings
  5. How to read your result
  6. FAQs, with references underneath
  7. Other tests: bundles first, then single tests with short names, leaving out the page's own test
- Tests not in any bundle (PSA) set `bundleChoice` to null and leave out the bundle link; an optional `hero.inBox` adds a "What's in the box" line under the specs
- Bundle pages (`content/products/7-in-1-sti-test-kit.json` is the bundle template; Core 4 follows it) use the same sections with: `hero.badge` and `hero.priceNote` (price block), `hero.after` (mini comparison), the what's-included table inside the first About question, `how.after` (reading times), `windows.stages` (a retest plan per infection), a results table with no images, and `compare` (comparison table) in place of Other tests. `seo.itemList` and `seo.related` add ItemList and isRelatedTo schema.
- No reviews section on product pages
- The homepage (`home-page.tsx`, schema and meta in `src/app/page.tsx`) follows the homepage SEO doc: a short 7-in-1 feature box links to the 7-in-1 page instead of repeating its product section, so the homepage doesn't compete with it in search. Brand name is "STI Test Kit"
- FAQ groups (H3s in the copy doc) become separate `faq.tabs`; a single group shows no heading. Tables in the copy (e.g. infection stages) go into the answer HTML as a `<table>`
- Dropdown (accordion) answers are always in the HTML, hidden with CSS when closed, so search engines can read them. Keep it that way: never let closed content unmount
- Pages with `seo` automatically get Product, BreadcrumbList, FAQPage and HowTo schema. Copy-doc notes such as "(New)" are left out of the page
- Copy arrives as an SEO doc (.docx). Use its wording exactly and keep its internal links: guide links go to `/blog/...` anchors on this site, product links go to this site's `/rapid-tests/...` pages, and only buy buttons go to the Shopify checkout
- Wrap anything the copy says still needs checking in `<mark>`
- About section H2: set `about.heading` to the copy doc's section 2 label (e.g. "2. About PSA and prostate testing" → "About PSA and prostate testing"); the About questions then render as H3s
- When to test date checker: keep the 1-week grace logic in `window-calculator.tsx` on every page, including bundles. Update the message wording from the doc, but don't switch to the doc's exact cut-offs; if a doc's ranges differ, just mention it
- Never invent medical claims or accuracy figures; use only what the copy doc gives

## MDX / Articles

### Setup

- Use `@tailwindcss/typography` plugin - import with `@plugin "@tailwindcss/typography"` in globals.css
- Keep MDX component definitions in the article page file, not in separate files
- Exception: Client components (e.g., code block with copy button) must be in separate files with `'use client'`

### Container Width Patterns

- When different elements need different max-widths (e.g., text narrower, code blocks wider):
  - Wrap text elements (h2, p, ul) in a container div: `<div className="container"><p>...</p></div>`
  - Never apply container classes directly to semantic elements - it overrides prose margin styles
  - Use `not-prose` on elements that break out to wider containers
  - Prose wrapper needs `max-w-none` to allow children to control their own widths
- Don't use arbitrary Tailwind values for breakouts - use existing container utilities

### Styling

- Use prose element modifiers for customization: `prose-a:`, `prose-lead:`, `prose-headings:`, etc.
- Use `not-prose` class to exclude elements from typography plugin styling
- MDX components should pass through `className` prop to allow custom styling per article

## Code Style

- When a file has multiple components, the parent/exported component goes at the top; child/helper components go below it — the more parent a component is, the higher it sits in the file
- Always use `cn()` from `@/lib/utils` for conditional class names — never use template literals with ternaries like ``className={`foo ${condition ? 'bar' : ''}`}``
- Use `&apos;` for apostrophes in JSX text
- Prefer named exports for icons, default exports for components
- Keep components clean and focused
- No Co-Authored-By in commits
- Don't run build unless explicitly asked
- Use semantic HTML elements whenever possible (`ul`/`li` for lists, `section` for sections, `nav` for navigation, etc.)
- When refactoring components to be reusable, preserve the original layout structure (flex direction, alignment, spacing) - only add props for configurability
- Use nested object structures for constants with related properties:

  ```tsx
  // Good
  const items = [
    {
      image: { src: '', alt: '', classname: '' },
      emoji: { text: '', classname: '' },
    },
  ];

  // Bad
  const items = [
    {
      src: '',
      alt: '',
      className: '',
      emoji: '',
      emojiClassName: '',
    },
  ];
  ```
