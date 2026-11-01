import { expect, test } from '@playwright/test';

// These cases use fresh anonymous browser contexts and never enter customer or
// payment data. The Ajax readback observes the same Shopify cookie jar as the click.
const shop = 'https://testdiscreet.co.uk';
const cases = [
  {
    slug: 'hiv-home-test-kit',
    variant: 63780178592074,
    quantity: 1,
    total: 1595,
  },
  {
    slug: 'core-4-sti-test-kit',
    variant: 63780180492618,
    quantity: 2,
    total: 8092,
  },
  {
    slug: '7-in-1-sti-test-kit',
    variant: 63780179870026,
    quantity: 2,
    total: 11692,
  },
];
for (const scenario of cases) {
  test(`${scenario.slug}: browser click preserves quantity and Shopify total`, async ({
    page,
    context,
  }, info) => {
    test.skip(
      process.env.NEXT_PUBLIC_GA_ENABLED === 'true',
      'Provider journey is independent of the analytics enable flag.',
    );
    // Keep the main store's optional analytics out of synthetic browser sessions.
    await context.route(
      /https:\/\/[^/]*(?:google-analytics\.com|googletagmanager\.com|posthog\.com)\//,
      (route) => route.abort(),
    );
    await page.goto(`/rapid-tests/${scenario.slug}`);
    await page.getByRole('button', { name: 'Decline', exact: true }).click();
    if (scenario.quantity === 2)
      await page.locator('input[name="quantity"]').nth(1).locator('..').click();
    const buy = page
      .locator(
        `a[href*="/cart/add?id=${scenario.variant}&quantity=${scenario.quantity}"]`,
      )
      .first();
    const quantity = page
      .locator('input[name="quantity"]')
      .nth(scenario.quantity - 1)
      .locator('..');
    await expect(quantity).toContainText(
      `£${(scenario.total / 100).toFixed(2)}`,
    );
    await buy.scrollIntoViewIfNeeded();
    await page.screenshot({ path: info.outputPath('buy-box.png') });
    await buy.click();
    await expect(page).toHaveURL(
      /^https:\/\/testdiscreet\.co\.uk\/cart(?:\?|$)/,
    );
    const response = await context.request.get(`${shop}/cart.js`);
    expect(response.ok()).toBe(true);
    const cart = await response.json();
    expect(cart.currency).toBe('GBP');
    expect(cart.item_count).toBe(scenario.quantity);
    expect(cart.total_price).toBe(scenario.total);
    expect(
      cart.items.map((item: { variant_id: number; quantity: number }) => [
        item.variant_id,
        item.quantity,
      ]),
    ).toEqual([[scenario.variant, scenario.quantity]]);
    await info.attach('cart-summary.json', {
      body: JSON.stringify({
        variant: scenario.variant,
        quantity: cart.item_count,
        total: cart.total_price,
        currency: cart.currency,
      }),
      contentType: 'application/json',
    });
    await page.screenshot({ path: info.outputPath('shopify-cart.png') });
    if (scenario.quantity === 1) {
      // This is the actual cart control. Stop as soon as the checkout is rendered.
      await page.getByRole('main').locator('button[name="checkout"]').click();
      await expect(page).toHaveURL(/\/checkouts\//);
      await expect(
        page.getByRole('heading', { name: /Contact|Delivery/i }).first(),
      ).toBeVisible();
      await page.screenshot({ path: info.outputPath('shopify-checkout.png') });
    }
    expect((await context.request.post(`${shop}/cart/clear.js`)).ok()).toBe(
      true,
    );
  });
}

test('existing anonymous basket is retained by the cross-domain buy link', async ({
  page,
  context,
}, info) => {
  test.skip(
    process.env.NEXT_PUBLIC_GA_ENABLED === 'true',
    'Provider journey is independent of the analytics enable flag.',
  );
  await context.request.post(`${shop}/cart/add.js`, {
    data: { items: [{ id: 63780180820298, quantity: 1 }] },
  });
  await page.goto('/rapid-tests/hiv-home-test-kit');
  await page.getByRole('button', { name: 'Decline', exact: true }).click();
  await page
    .locator('a[href*="/cart/add?id=63780178592074&quantity=1"]')
    .first()
    .click();
  await expect(page).toHaveURL(/^https:\/\/testdiscreet\.co\.uk\/cart(?:\?|$)/);
  const cart = await (await context.request.get(`${shop}/cart.js`)).json();
  expect(cart.item_count).toBe(2);
  expect(
    cart.items
      .map((item: { variant_id: number; quantity: number }) => [
        item.variant_id,
        item.quantity,
      ])
      .sort(),
  ).toEqual(
    [
      [63780180820298, 1],
      [63780178592074, 1],
    ].sort(),
  );
  await info.attach('existing-basket.json', {
    body: JSON.stringify({
      count: cart.item_count,
      variants: cart.items.map(
        (item: { variant_id: number }) => item.variant_id,
      ),
    }),
    contentType: 'application/json',
  });
  expect((await context.request.post(`${shop}/cart/clear.js`)).ok()).toBe(true);
});
