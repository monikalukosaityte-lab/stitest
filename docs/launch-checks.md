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

## Verification boundaries

Automated tests exercise actual calculator and consent components with React and a DOM: interval boundaries, stale input, missing/expired/blocked storage, rejection persistence, settings, consent-gated loading and cookie removal. They do not execute Google's remote script or prove real browser network behaviour.

Before owner merge, record the preview deployment and checks. The standing browser bridge was unavailable during implementation; the following checks remain required:

- Compare 320–430px mobile and desktop pages with production. Use keyboard navigation in cookie settings. Confirm banner/settings fit the screen and shopping/guide navigation work.
- Test browser storage/network, including withdrawal/reload and another tab. Keep analytics disabled until activation checks pass.
- Open home, eight products, four MDX guides, images, blog list and cookie notice. Check canonical, robots and sitemap separately from Google indexing.
- Verify a single, a two-kit retest pack and an existing Shopify cart still hand off correctly. Do not place a paid order as part of these checks.
- Review report-only CSP console messages; no blocking policy is introduced.

After owner merge, verify the public deployment and repeat affected journeys. Record Search Console access, requests, actual indexing and production deployment separately from source/preview checks.
