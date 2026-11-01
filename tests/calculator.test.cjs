const assert = require('node:assert/strict');
const { after, afterEach, test } = require('node:test');
const { setup } = require('./source.cjs');
const { dom, React } = setup();
const { act } = React;
const { createRoot } = require('react-dom/client');
const Calculator =
  require('../src/components/sections/product/window-calculator.tsx').default;
const NativeDate = Date;
class FixedDate extends NativeDate {
  constructor(...args) {
    super(...(args.length ? args : ['2026-11-01T12:00:00Z']));
  }
  static now() {
    return new NativeDate('2026-11-01T12:00:00Z').getTime();
  }
}
globalThis.Date = FixedDate;
let root;
async function render(slug) {
  const product = require(`../content/products/${slug}.json`);
  const host = document.createElement('div');
  document.body.append(host);
  root = createRoot(host);
  await act(async () =>
    root.render(React.createElement(Calculator, { windows: product.windows })),
  );
}
async function enter(value) {
  const input = document.querySelector('#exposure-date');
  await act(async () => {
    Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      'value',
    ).set.call(input, value);
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });
  return document.querySelector('[role="status"]').textContent;
}
async function daysAgo(days) {
  const date = new NativeDate(2026, 10, 1 - days);
  return enter(
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`,
  );
}
afterEach(async () => {
  if (root) await act(async () => root.unmount());
  root = null;
  document.body.innerHTML = '';
});
after(() => {
  globalThis.Date = NativeDate;
  dom.window.close();
});

test('chlamydia repeat advice remains on days 11 and 13; changes at day 14', async () => {
  await render('chlamydia-gonorrhoea-home-test-kit');
  for (const day of [0, 10, 11, 13])
    assert.match(await daysAgo(day), /If negative, test again on/);
  assert.equal(await daysAgo(14), 'You can test now.');
});

test('syphilis never claims 12 weeks have passed at 11 weeks or day 83', async () => {
  await render('syphilis-home-test-kit');
  for (const day of [76, 77, 83]) {
    assert.match(await daysAgo(day), /If negative, test again on/);
    assert.doesNotMatch(
      document.querySelector('[role="status"]').textContent,
      /12 weeks have passed/,
    );
  }
  assert.match(await daysAgo(84), /12 weeks have passed/);
});

for (const slug of ['core-4-sti-test-kit', '7-in-1-sti-test-kit']) {
  test(`${slug}: PEP includes calendar day 3; individual intervals remain separate`, async () => {
    await render(slug);
    for (const day of [0, 1, 2, 3])
      assert.match(await daysAgo(day), /ask about PEP/);
    assert.doesNotMatch(await daysAgo(4), /ask about PEP/);
    assert.match(await daysAgo(13), /repeat chlamydia and gonorrhoea/);
    assert.doesNotMatch(await daysAgo(14), /repeat chlamydia and gonorrhoea/);
    assert.match(await daysAgo(83), /repeat syphilis/);
    assert.doesNotMatch(await daysAgo(84), /repeat syphilis/);
    assert.match(await daysAgo(89), /repeat HIV/);
    assert.doesNotMatch(await daysAgo(90), /repeat HIV/);
    if (slug === '7-in-1-sti-test-kit') {
      for (const day of [175, 181])
        assert.match(await daysAgo(day), /repeat hepatitis C/);
      assert.match(
        await daysAgo(182),
        /no reliable conclusive window period for the herpes IgM test/,
      );
    } else
      assert.match(await daysAgo(90), /all three testing windows have passed/);
  });
}

test('hepatitis C retains its full 182-day interval', async () => {
  await render('hepatitis-b-c-home-test-kit');
  assert.match(await daysAgo(83), /for hepatitis B and/);
  assert.doesNotMatch(await daysAgo(84), /for hepatitis B and/);
  for (const day of [175, 181])
    assert.match(await daysAgo(day), /hepatitis C result is negative/);
  assert.doesNotMatch(await daysAgo(182), /test again on/);
});

test('clearing, invalid and future dates replace stale advice with the unknown-date path', async () => {
  await render('syphilis-home-test-kit');
  for (const value of ['', 'not-a-date', '2026-11-02']) {
    assert.match(await daysAgo(84), /12 weeks have passed/);
    assert.equal(
      await enter(value),
      'Test now. If negative, test again in 12 weeks.',
    );
    assert.equal(document.querySelector('#exposure-date').value, '');
  }
});

test('retest dates crossing into the following year include the year', async () => {
  await render('hepatitis-b-c-home-test-kit');
  assert.match(await daysAgo(0), /2027/);
});

test('herpes and PSA retain their text-only advice', async () => {
  for (const slug of [
    'herpes-hsv-2-home-test-kit',
    'psa-prostate-home-test-kit',
  ]) {
    await render(slug);
    assert.equal(document.querySelector('#exposure-date'), null);
    await act(async () => root.unmount());
    root = null;
  }
});
