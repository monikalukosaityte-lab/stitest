# 1 November launch repairs

Scope: plan steps 1–4. Shared price/stock/policy synchronisation is step 5 and is not implemented here. Preserve both sites' pages and SEO choices. The Shopify theme is a read-only reference.

## Changes

- Prior-choice controls for optional analytics, footer settings and a domain-specific cookie notice. Analytics stays off until stream settings and outgoing requests are verified; see [deployment](deployment.md).
- Full configured calculator intervals, calendar-day-3 PEP assessment advice, invalid/cleared/future-date reset and a year on dates outside the current year. Existing HIV and text-only herpes/PSA presentation is preserved.
- Static two-kit totals corrected to £80.92 for Core 4 and £116.92 for 7-in-1, matching previously verified per-item Shopify rounding. Interactive calculations, variant IDs, prices, UTM tags and checkout URLs are preserved.
- Ten links to the unpublished herpes guide now use the existing NHS genital herpes page. The planned article stays on TODO; surrounding product copy is preserved.
- Four existing guides have `medicallyReviewed: true`, on Robin's instruction to assume review completed. No reviewer identity/date is invented. New articles get no badge unless the field is explicitly set after review.
- Dependency patches, removal of the unused StyleGlide provider, response protections and CI around owner review.

The 1 November dependency audit after patching reported zero production findings. Development tooling retained 22 findings (20 moderate, 2 low; no high/critical), mainly minimatch and deepmerge dependency chains. The unused SF Symbols packages were also removed: one brought a second Next.js installation into production dependencies. Targeted overrides keep selector-parser and brace-expansion on patched versions within their existing major versions; no forced major upgrades were applied.

## Browser verification

`npm run test:browser` runs real Chromium at 1280px and WebKit with iPhone 13 settings against the branch's disposable HTTPS development server. CI runs analytics off and on; the Google script is stubbed to exercise the consent gate without sending synthetic health browsing to Google. Site-generated requests and queued parameters are checked, but Google's delivery and the live GA stream settings are not established by this fixture.

The suite exercises:

- Fresh, rejected, accepted and withdrawn choices, reload persistence, invalid/expired/blocked storage, another open tab, accessible GA-cookie removal and absence of a tag while analytics is disabled.
- Cookie settings at 320px, keyboard focus containment, Escape, focus restoration and an opaque background using the site's existing card token. Screenshot inspection caught and corrected a transparent settings panel.
- Home, all eight products, all four MDX guides, the blog list and cookie notice: responses, self-canonicals, eager images, horizontal overflow and browser exceptions. Robots and sitemap endpoints are checked separately from Google indexing.
- Full calculator boundaries through actual date inputs, including PEP day 3, separate bundle intervals and clearing/future-date resets. The fixture waits for hydration before entering dates and preserves each product's approved unknown-date advice.
- Actual clicks to Shopify for a single HIV kit (£15.95), Core 4 retest pack (£80.92), 7-in-1 retest pack (£116.92), preservation of an existing anonymous basket and opening checkout. No customer details or payment are entered.
- Production/branch screenshots at 320px, 430px and 1280px, plus settings, product/cart and guide captures. The pre-existing homepage buy-label clipping at 320px appears on both production and branch and is recorded on TODO.

CI uploads the HTML report, screenshots, traces for failures and request/cart summaries for 14 days. Consult the latest PR checks for the exact tested commit and result. The 19 React/DOM tests remain useful for interval and storage fault cases; they complement the browser suite.

The report-only CSP logs development `unsafe-eval` warnings from Next's development runtime. It does not block resources and has no collector. This is not evidence for enforcing the policy in production.

## Owner release checks

Review the signed-in Vercel preview before merging; isolated CI renders do not establish the state of that deployment. Only the owner merges. After merge, verify the deployed commit and public consent, calculator, images and Shopify journeys. Record Search Console access, requests, actual indexing and production deployment separately from source/CI checks. Keep analytics disabled until its activation checks in [deployment](deployment.md) pass.
