export interface TocItem {
  label: string;
  id: string;
}

export interface ArticleFrontmatter {
  title: string;
  slug: string;
  description: string;
  date: string;
  image?: string;
  tags?: string[];
  pinned?: boolean;
  toc?: TocItem[];
  metaTitle?: string;
  metaDescription?: string;
}

export interface Article {
  slug: string;
  content: string;
  frontmatter: ArticleFrontmatter;
}

export interface ShopProduct {
  handle: string;
  slug: string;
  title: string;
  price: string;
  /** Bundles only: the price of the tests bought separately. */
  compareAt?: string;
  variantId: number;
  badge?: string;
  /** What the card says it checks for. */
  checks: string;
  includes: string[];
  sample: 'Blood + swab' | 'Swab' | 'Finger-prick';
  image: { src: string; alt: string };
}

export interface ProductImage {
  src: string;
  alt: string;
}

export interface ProductBundleOption {
  title: string;
  badge: string | null;
  includes: string | null;
  price: string;
  was: string | null;
  save: string | null;
  variantId: number | null;
  buttonLabel: string | null;
}

export interface ProductAccordion {
  heading: string;
  open: boolean;
  content: string;
  after: string;
  checklist: string[];
}

export interface ProductResultItem {
  image: ProductImage;
  title: string;
  text: string;
}

export type ProductIconName =
  | 'clock'
  | 'drop'
  | 'home'
  | 'lock'
  | 'package'
  | 'search'
  | 'swab'
  | 'tag'
  | 'users'
  | 'verified';

/** Rewritten hero copy for stitestkit; pages without it show the Shopify copy. */
export interface ProductHeroContent {
  breadcrumb: string;
  /** Small label above the H1, e.g. "Best value · Our most complete test". */
  badge?: string;
  heading: string;
  intro: string;
  highlights: { icon: ProductIconName; label: string }[];
  specs: { icon: ProductIconName; label: string; value: string }[];
  /** "What's in the box" line under the specs (HTML). */
  inBox?: string;
  /** Shows the price block (price, was-price, saving), with this line under it if not empty. */
  priceNote?: string;
  /** HTML under the discreet delivery box, e.g. a mini comparison table. */
  after?: string;
}

/** "About [test] and testing" section shown straight after the hero. */
export interface ProductAboutContent {
  /** Without a heading, each question is an h2 of its own. */
  heading?: string;
  questions: { question: string; answer: string; open: boolean }[];
  link?: { label: string; href: string };
  aside: {
    heading: string;
    text?: string;
    items: { icon: ProductIconName; title: string; text: string }[];
    buttonLabel: string;
  };
}

/** "Other available tests and bundles" — replaces the plain product grid. */
export interface ProductOtherTestsContent {
  heading: string;
  /** Chips to highlight on bundle cards: the test(s) this page is about. */
  highlight: string | string[];
  /** Line under the heading, e.g. "All results in around 15 minutes." */
  note?: string;
  bundles: { handle: string; name: string }[];
  singles: { handle: string; name: string; sample: string }[];
}

export interface ProductPageData {
  slug: string;
  handle: string;
  /** Meta title and description; without it they come from the title and intro. */
  seo?: {
    title: string;
    description: string;
    /** Schema ItemList, e.g. the tests inside a bundle. */
    itemList?: { name: string; url: string }[];
    /** Handles of related products (schema isRelatedTo). */
    related?: string[];
  };
  /** Comparison table that replaces the "Other tests" cards (bundles). */
  compare?: {
    heading: string;
    html: string;
    buttonLabel: string;
  };
  title: string;
  hero?: ProductHeroContent;
  about?: ProductAboutContent;
  otherTests?: ProductOtherTestsContent;
  gallery: ProductImage[];
  intro: string;
  footnote: string;
  keyFacts: string[];
  shipping: string;
  bundleChoice: {
    heading: string;
    intro: string;
    options: ProductBundleOption[];
  } | null;
  variantId: number;
  retest: {
    heading: string;
    badge: string;
    discount: number;
    note: string;
    /** What one of these is called in the quantity picker; defaults to "test". */
    unit?: string;
  } | null;
  buyLabel: string;
  trust: string;
  reassurance: { title: string; text: string } | null;
  accordions: ProductAccordion[];
  benefits: {
    heading: string;
    text: string;
    items: { icon: string; label: string }[];
  };
  how: {
    heading: string;
    intro: string;
    stepsHeading?: string;
    steps: { image: ProductImage; title: string; text: string }[];
    link?: { label: string; href: string };
    /** HTML after the steps, e.g. a reading-times table. */
    after?: string;
  };
  windows?: {
    heading: string;
    subheading: string;
    days: number;
    initialTitle: string | null;
    strings: Record<string, string> | null;
    /**
     * Retest plan for kits with several windows: the first stage whose `until`
     * (days since exposure) hasn't passed wins; null means "any time after".
     * __DATE_<n>__ in the text becomes the exposure date plus n days.
     */
    stages?: { until: number | null; title: string; body: string }[];
    /** HTML after the date checker. */
    after?: string;
    /** A second, longer window (e.g. hepatitis C) checked after `days`. */
    secondDays?: number;
    /** Shown instead of the date checker for tests with no window period. */
    cards?: { title: string; text: string }[];
    notes?: string;
    scope?: string;
  } | null;
  results?: {
    heading: string;
    groups: {
      title: string | null;
      intro: string;
      items: ProductResultItem[];
    }[];
    notes: { title?: string; text: string }[];
    /** Button under the results; defaults to "Shop now" (scrolls to the hero). */
    buttonLabel?: string;
  } | null;
  reviews?: {
    heading: string;
    items: { image: ProductImage; title: string; text: string }[];
  };
  faq: {
    heading: string;
    tabs: {
      label: string;
      questions: { question: string; answer: string }[];
    }[];
    references?: { heading: string; items: string[] };
  };
  otherProducts: string[];
}
