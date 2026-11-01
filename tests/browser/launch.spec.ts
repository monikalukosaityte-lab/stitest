import { expect, test } from '@playwright/test';

const enabled = process.env.NEXT_PUBLIC_GA_ENABLED === 'true';
const key = 'sti-cookie-choice';
const products = [
  '7-in-1-sti-test-kit',
  'core-4-sti-test-kit',
  'chlamydia-gonorrhoea-home-test-kit',
  'hiv-home-test-kit',
  'syphilis-home-test-kit',
  'herpes-hsv-2-home-test-kit',
  'hepatitis-b-c-home-test-kit',
  'psa-prostate-home-test-kit',
];
const guides = [
  'what-is-an-sti-test',
  'syphilis-symptoms-stages',
  'chlamydia-gonorrhoea-symptoms',
  'hiv-symptoms-stages',
];

// Exercise the real browser gate without sending synthetic health browsing to Google.
// The fixture does not prove Google's own behaviour or GA stream configuration.
test.beforeEach(async ({ context }) => {
  await context.route(
    /https:\/\/[^/]*(?:google-analytics\.com|googletagmanager\.com)\//,
    (route) =>
      route.fulfill({
        contentType: 'application/javascript',
        body: '/* remote analytics deliberately stubbed */',
      }),
  );
});

test('fresh, rejected, accepted, route change and withdrawn choices control the tag', async ({
  page,
  context,
}, info) => {
  const requests: string[] = [];
  page.on('request', (request) => {
    if (/google-analytics\.com|googletagmanager\.com/.test(request.url()))
      requests.push(request.url());
  });
  await page.goto('/');
  const banner = page.getByRole('region', { name: 'Cookie choices' });
  await expect(banner).toBeVisible();
  await expect(page.locator('#sti-analytics')).toHaveCount(0);
  expect(requests).toEqual([]);
  await page.screenshot({ path: info.outputPath('home-banner.png') });
  await banner.getByRole('button', { name: 'Decline', exact: true }).click();
  await expect(banner).toHaveCount(0);
  await page.reload();
  await expect(
    page.getByRole('button', { name: 'Cookie settings', exact: true }),
  ).toBeAttached();
  await expect(banner).toHaveCount(0);
  expect(
    await page.evaluate(
      (k) => JSON.parse(localStorage.getItem(k)!).analytics,
      key,
    ),
  ).toBe(false);
  await page
    .getByRole('button', { name: 'Cookie settings', exact: true })
    .click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByRole('checkbox')).not.toBeChecked();
  await dialog.getByRole('button', { name: 'Accept', exact: true }).click();
  await expect(dialog).toBeHidden();
  await expect(page.locator('#sti-analytics')).toHaveCount(enabled ? 1 : 0);
  // Use client-side navigation to verify that permission survives route changes.
  await page
    .locator('a[href="/rapid-tests/core-4-sti-test-kit"]')
    .first()
    .click();
  await expect(page).toHaveURL(/core-4-sti-test-kit/);
  await expect(page.locator('#sti-analytics')).toHaveCount(enabled ? 1 : 0);
  const exposure = page.getByLabel('Date of possible exposure');
  await exposure.fill('2026-01-03');
  const queue = await page.evaluate(
    () => (window as Window & { dataLayer?: unknown[] }).dataLayer ?? [],
  );
  const serialized = JSON.stringify(queue);
  expect(serialized).not.toContain('2026-01-03');
  expect(serialized).not.toContain('core-4');
  expect(requests).toHaveLength(enabled ? 1 : 0);
  await info.attach('analytics-gate.json', {
    body: JSON.stringify({ enabled, requests, queue }, null, 2),
    contentType: 'application/json',
  });
  // An accessible synthetic GA cookie verifies withdrawal cleanup, not Google delivery.
  await context.addCookies([
    {
      name: '_ga',
      value: 'synthetic-test',
      url: 'https://localhost:3187',
      secure: true,
    },
  ]);
  await page
    .getByRole('button', { name: 'Cookie settings', exact: true })
    .click();
  await dialog.getByRole('button', { name: 'Decline', exact: true }).click();
  await expect
    .poll(() =>
      page.evaluate((k) => JSON.parse(localStorage.getItem(k)!).analytics, key),
    )
    .toBe(false);
  await expect(page.locator('#sti-analytics')).toHaveCount(0);
  expect(
    (await context.cookies()).filter((cookie) => cookie.name === '_ga'),
  ).toEqual([]);
  await page.reload();
  await expect(page.locator('#sti-analytics')).toHaveCount(0);
});

test('settings fit 320px, trap keyboard focus, close with Escape and restore focus', async ({
  page,
}, info) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('/');
  const trigger = page.getByRole('button', {
    name: 'Manage preferences',
    exact: true,
  });
  await trigger.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  expect(
    await dialog.evaluate((el) => getComputedStyle(el).backgroundColor),
  ).toBe('rgb(255, 255, 255)');
  await page.screenshot({ path: info.outputPath('settings-open-320.png') });
  for (let i = 0; i < 10; i++) {
    await page.keyboard.press('Tab');
    expect(
      await dialog.evaluate((el) => el.contains(document.activeElement)),
    ).toBe(true);
  }
  await page.screenshot({ path: info.outputPath('settings-320.png') });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await dialog
    .getByRole('button', { name: 'Save choices', exact: true })
    .scrollIntoViewIfNeeded();
  await expect(
    dialog.getByRole('button', { name: 'Save choices', exact: true }),
  ).toBeInViewport();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('withdrawal is synchronised to an already open second tab', async ({
  context,
  page,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Accept', exact: true }).click();
  const other = await context.newPage();
  await other.goto('/cookies');
  await expect(other.locator('#sti-analytics')).toHaveCount(enabled ? 1 : 0);
  await page
    .getByRole('button', { name: 'Cookie settings', exact: true })
    .click();
  await page
    .getByRole('dialog')
    .getByRole('button', { name: 'Decline', exact: true })
    .click();
  await expect
    .poll(() =>
      other
        .evaluate((k) => JSON.parse(localStorage.getItem(k)!).analytics, key)
        .catch(() => null),
    )
    .toBe(false);
  await expect(other.locator('#sti-analytics')).toHaveCount(0);
  await other
    .getByRole('button', { name: 'Cookie settings', exact: true })
    .click();
  await expect(
    other.getByRole('dialog').getByRole('checkbox'),
  ).not.toBeChecked();
});

for (const mode of ['expired', 'invalid', 'blocked'] as const) {
  test(`${mode} storage fails closed`, async ({ context, page }) => {
    await context.addInitScript(
      ({ mode, key }) => {
        if (mode === 'blocked') {
          for (const method of ['getItem', 'setItem', 'removeItem'])
            Object.defineProperty(Storage.prototype, method, {
              value: () => {
                throw new DOMException('Blocked', 'SecurityError');
              },
            });
        } else
          localStorage.setItem(
            key,
            mode === 'invalid'
              ? '{broken'
              : JSON.stringify({
                  version: 1,
                  analytics: true,
                  expiresAt: Date.now() - 1,
                }),
          );
      },
      { mode, key },
    );
    await page.goto('/');
    await expect(
      page.getByRole('region', { name: 'Cookie choices' }),
    ).toBeVisible();
    await expect(page.locator('#sti-analytics')).toHaveCount(0);
    await page.getByRole('button', { name: 'Decline', exact: true }).click();
    await page.reload();
    await expect(page.locator('#sti-analytics')).toHaveCount(0);
  });
}

test('all public pages render, images load and existing self-canonicals remain', async ({
  page,
}, info) => {
  test.setTimeout(240_000);
  const errors: string[] = [];
  const csp: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (/Content Security Policy|violates.*directive/i.test(message.text()))
      csp.push(message.text());
  });
  const paths = [
    '/',
    '/blog',
    '/cookies',
    ...products.map((slug) => `/rapid-tests/${slug}`),
    ...guides.map((slug) => `/blog/${slug}`),
  ];
  for (const path of paths) {
    const response = await page.goto(path);
    expect(response?.status(), path).toBe(200);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `https://www.stitestkit.co.uk${path === '/' ? '' : path}`,
    );
    const banner = page.getByRole('region', { name: 'Cookie choices' });
    if (await banner.isVisible())
      await banner
        .getByRole('button', { name: 'Decline', exact: true })
        .click();
    await page.evaluate(async () => {
      await document.fonts.ready;
    });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      path,
    ).toBe(true);
    await expect
      .poll(
        () =>
          page
            .locator('img')
            .evaluateAll(
              (images) =>
                (images as HTMLImageElement[]).filter(
                  (image) =>
                    image.loading !== 'lazy' &&
                    (!image.complete || image.naturalWidth === 0),
                ).length,
            ),
        { message: path },
      )
      .toBe(0);
    if (
      [
        '/',
        '/rapid-tests/core-4-sti-test-kit',
        '/blog/what-is-an-sti-test',
        '/cookies',
      ].includes(path)
    )
      await page.screenshot({
        path: info.outputPath(
          `${path.replaceAll('/', '-') || 'home'}-page.png`,
        ),
        fullPage: true,
        scale: 'css',
      });
  }
  expect(errors).toEqual([]);
  await info.attach('report-only-csp.json', {
    body: JSON.stringify(csp, null, 2),
    contentType: 'application/json',
  });
  expect((await page.request.get('/robots.txt')).status()).toBe(200);
  expect((await page.request.get('/sitemap.xml')).status()).toBe(200);
});

test('full calculator boundaries and clearing work through actual date inputs', async ({
  page,
  context,
}, info) => {
  await context.addInitScript((k) => localStorage.removeItem(k), key);
  await page.clock.setFixedTime(new Date('2026-11-01T12:00:00Z'));
  const cases: [string, [number, RegExp, boolean?][]][] = [
    [
      'chlamydia-gonorrhoea-home-test-kit',
      [
        [11, /If negative, test again on/],
        [13, /If negative, test again on/],
        [14, /You can test now/],
      ],
    ],
    [
      'syphilis-home-test-kit',
      [
        [77, /If negative, test again on/],
        [83, /If negative, test again on/],
        [84, /12 weeks have passed/],
      ],
    ],
    [
      'core-4-sti-test-kit',
      [
        [3, /ask about PEP/],
        [4, /ask about PEP/, false],
        [83, /repeat syphilis/],
        [84, /repeat syphilis/, false],
        [89, /repeat HIV/],
        [90, /all three testing windows have passed/],
      ],
    ],
    [
      '7-in-1-sti-test-kit',
      [
        [181, /repeat hepatitis C/],
        [182, /no reliable conclusive window period/],
      ],
    ],
    [
      'hepatitis-b-c-home-test-kit',
      [
        [175, /hepatitis C result is negative/],
        [181, /hepatitis C result is negative/],
        [182, /test again on/, false],
      ],
    ],
  ];
  for (const [slug, checks] of cases) {
    await page.goto(`/rapid-tests/${slug}`);
    const banner = page.getByRole('region', { name: 'Cookie choices' });
    // The banner appears after hydration; do not fill an inert server input.
    await expect(banner).toBeVisible();
    await banner.getByRole('button', { name: 'Decline', exact: true }).click();
    const input = page.getByLabel('Date of possible exposure');
    const status = page.getByRole('status');
    for (const [days, pattern, matches = true] of checks) {
      const date = new Date(Date.UTC(2026, 10, 1 - days))
        .toISOString()
        .slice(0, 10);
      await input.fill(date);
      await expect(input).toHaveValue(date);
      if (matches) await expect(status).toContainText(pattern);
      else await expect(status).not.toContainText(pattern);
    }
    await input.fill('');
    await expect(input).toHaveValue('');
    const unknownAdvice =
      slug === 'core-4-sti-test-kit' || slug === '7-in-1-sti-test-kit'
        ? /^Contact a sexual health clinic for advice about when to test\./
        : slug === 'hepatitis-b-c-home-test-kit'
          ? /^You can test now\./
          : /^Test now\./;
    await expect(status).toContainText(unknownAdvice);
    await input.fill('2026-01-01');
    await expect(input).toHaveValue('2026-01-01');
    await input.fill('2026-11-02');
    await expect(input).toHaveValue('');
    await expect(status).toContainText(unknownAdvice);
    if (slug === 'core-4-sti-test-kit') {
      await input.scrollIntoViewIfNeeded();
      await page.screenshot({ path: info.outputPath('calculator.png') });
    }
  }
});

test('production comparison screenshots at desktop and narrow mobile widths', async ({
  page,
}, info) => {
  test.setTimeout(180_000);
  for (const width of [320, 430, 1280]) {
    await page.setViewportSize({ width, height: width === 1280 ? 900 : 844 });
    await page.goto('https://www.stitestkit.co.uk');
    await page.evaluate(async () => {
      await document.fonts.ready;
    });
    await page.screenshot({ path: info.outputPath(`production-${width}.png`) });
    await page.goto('/');
    await page.evaluate(async () => {
      await document.fonts.ready;
    });
    await page.screenshot({ path: info.outputPath(`branch-${width}.png`) });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
});
