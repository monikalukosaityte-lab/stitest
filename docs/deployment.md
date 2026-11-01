# Deployment

- Repository: [monikalukosaityte-lab/stitest](https://github.com/monikalukosaityte-lab/stitest).
- Production: https://www.stitestkit.co.uk. Non-www redirects to www.
- Hosting: Vercel; merges to `main` deploy production.
- Work on a `preview/...` branch, open a pull request and review its Vercel preview. Only the project owner merges. Never push directly to `main`.

Production is public and indexable. Preserve its existing self-canonicals, robots.txt and sitemap. Earlier private/noindex instructions are obsolete. Verify Vercel's preview-deployment indexing headers separately.

## Checks

```bash
npm ci
npm run typecheck
npm run lint
npm test
npm run dev
```

Do not run a local production build unless explicitly requested. Vercel builds the preview. Review mobile/desktop appearance, images, guides, calculator advice, cookie choices and the Shopify handoff before merging. CI runs on pull requests and pushes; repository administrators can make checks required in branch settings.

Production rollback: revert the reviewed change through another pull request, or have the owner restore the preceding Vercel deployment. Record the deployed commit and verify public pages; a preview does not prove production deployment.

## Analytics activation

Optional analytics is disabled by default, including after acceptance. Cookie preferences still work. Before enabling `NEXT_PUBLIC_GA_ENABLED=true` in Vercel:

1. Use the existing `G-90V3D10GNM` web stream. Disable Enhanced Measurement, including history pageviews, forms, outbound clicks and site search. Automatic events can bypass the site's limited manual events. See [Google's guidance](https://developers.google.com/analytics/devguides/collection/ga4/views).
2. Check Google tag settings for additional destinations/advertising features. Keep Google Signals and advertising personalisation disabled. Do not add health inputs, exposure dates, product names or condition-specific URLs to event parameters.
3. Enable the flag on a preview first. Inspect actual network payloads during navigation and date entry. Only generic page types should be sent, with no query, referrer, entered date or condition-specific address/title.
4. Confirm no Google request before a choice or after rejection. Test accept, reload, settings, withdraw and another open tab. Withdrawal must clear accessible GA cookies and reload to remove existing listeners.
5. Enable in production only after checks pass. Rebuild after changing a `NEXT_PUBLIC_` variable and repeat the public network checks.

Choices apply only to this domain. Shopify consent and purchase reporting are separate. Search indexing does not require Google Analytics.

The CSP is report-only, with no report collector: inspect browser console violations in preview. It does not block resources. Check Next.js hydration, images, fonts, navigation and analytics before proposing enforcement.

## Search Console

Use the existing new-domain property where available; an inaccessible property is not evidence that it does not exist. The available Test Discreet reporting identity had no new-domain access on 1 November 2026, so its indexing and submissions remain unverified.

Once owner/full-user access is available:

1. Read submission status for `https://www.stitestkit.co.uk/sitemap.xml`; submit only if absent or incorrect.
2. Inspect the homepage, eight product pages and four guides in that sitemap; also `/blog` if needed. Record index status, Google-selected canonical, last crawl and exclusion reason.
3. After repairs are published, request indexing for new or materially changed pages needing it. Start with the homepage and affected Core 4, 7-in-1 and herpes pages, then others as justified by inspection. Keep existing URLs and self-canonicals.
4. Log requests and read back outcomes later. A request is not proof of indexing. URL Inspection API reads status; it does not submit ordinary webpages for indexing.

See [launch checks](launch-checks.md) for evidence and remaining release checks.
