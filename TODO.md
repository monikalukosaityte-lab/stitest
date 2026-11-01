# To do

Open tasks for stitestkit.co.uk. Remove an item in the same commit that finishes it.

## Launch verification

- Owner review of the signed-in launch-repairs Vercel preview, then owner merge and public deployment verification. Repeat affected public journeys after deployment. Automated browser coverage and its limits are in `docs/launch-checks.md`.
- Provide access to the existing new-domain Search Console property, inspect the sitemap/pages, then log appropriate indexing requests after publication. Its index status is currently unverified.
- Keep analytics disabled until the existing GA stream settings and outgoing requests are checked; activation steps are in `docs/deployment.md`.

## Existing narrow-screen layout

- At 320px, the homepage hero's long 7-in-1 buy label clips at the right edge. Browser comparison on 1 November reproduces the same behaviour on production and the launch branch. Make a targeted wrapping fix without changing the desktop design.

## Herpes guide (`/blog/genital-herpes-symptoms`)

The guide is built from the SEO doc, and the herpes and 7-in-1 product pages and the HIV guide link to it again. Still to do:

- Confirm clinical review, then set `medicallyReviewed: true` in `content/articles/genital-herpes-symptoms.mdx`
- After that, add it first in the homepage guide cards (`GUIDES` in `src/components/sections/home/home-page.tsx`); every card there says "Medically reviewed"

## Branded 404 page

`src/app/not-found.tsx` is still the starter template's notebook design (flipping page, ruled lines, "There's nothing written here yet"). Rebuild it in the site style: a "Page not found" heading, one line of text, and buttons to the homepage, the 7-in-1 kit and STI guides. Afterwards, delete `src/components/elements/journal-container` if nothing else uses it.

## "All tests" category page

A category page listing every test is planned. Until it exists, these links to the old `/#tests` anchor were removed (commit `e0cf78d`). Add them back pointing at the new page:

1. Navbar menu: an "All tests" item in `MENU_LINKS` (`src/components/layout/navbar.tsx`), after "STI guides"
2. Product page breadcrumb: Home / All tests / product (`Breadcrumb` in `src/components/sections/product/buy-box.tsx`)
3. BreadcrumbList schema: the middle "All tests" crumb (`src/app/rapid-tests/[slug]/page.tsx`)
4. Homepage hero: a "See all tests" button (`variant="outline-invert"`) next to "Get the full 7-in-1 kit"
5. Homepage benefits section: a centred "Shop all tests" button under the benefits list (add `mb-10` back to the list)
6. Blog list hero: a "Shop now" button (`variant="light"`) under the intro (add `mb-6` back to the intro)

## Leftover template code

Unused starter-template code is still in the repo (for example `src/components/sections/hero.tsx` and `cta.tsx`, which link to the deleted `/login` and `/signup`). Clean up when convenient.
