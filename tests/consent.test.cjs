const assert = require('node:assert/strict');
const { after, afterEach, test } = require('node:test');
const { setup } = require('./source.cjs');
const { dom, React, setPathname } = setup();
const { act } = React;
const { createRoot } = require('react-dom/client');
const consent = require('../src/lib/cookie-consent.ts');
const {
  default: CookieConsent,
  CookieSettingsButton,
} = require('../src/components/layout/cookie-consent.tsx');

let root;
async function mount() {
  const host = document.createElement('div');
  document.body.append(host);
  root = createRoot(host);
  await act(async () =>
    root.render(
      React.createElement(
        React.Fragment,
        null,
        React.createElement(CookieConsent),
        React.createElement(CookieSettingsButton),
      ),
    ),
  );
  await act(async () => new Promise((resolve) => setTimeout(resolve, 10)));
}
async function click(text) {
  const button = [...document.querySelectorAll('button')].find(
    (node) => node.textContent === text,
  );
  assert.ok(button, `Button exists: ${text}`);
  await act(async () => {
    button.focus();
    button.click();
  });
}
afterEach(async () => {
  if (root) await act(async () => root.unmount());
  root = null;
  document.body.innerHTML = '';
  consent.stopAnalytics();
  localStorage.clear();
  delete process.env.NEXT_PUBLIC_GA_ENABLED;
  setPathname('/');
});
after(() => dom.window.close());

test('missing, malformed, expired and unsupported choices never grant permission', () => {
  for (const value of [
    null,
    '{',
    'true',
    '{}',
    JSON.stringify({
      version: 1,
      analytics: 'true',
      expiresAt: Date.now() + 10000,
    }),
    JSON.stringify({
      version: 2,
      analytics: true,
      expiresAt: Date.now() + 10000,
    }),
    JSON.stringify({ version: 1, analytics: true, expiresAt: Date.now() - 1 }),
    JSON.stringify({
      version: 1,
      analytics: true,
      expiresAt: Date.now() + 181 * 86400000,
    }),
  ]) {
    if (value === null) localStorage.clear();
    else localStorage.setItem(consent.CONSENT_KEY, value);
    assert.equal(consent.readCookieChoice(), null);
  }
});

test('blocked storage fails closed; a current-page choice is still possible', () => {
  const original = globalThis.localStorage;
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    get() {
      throw Error('blocked');
    },
  });
  try {
    assert.equal(consent.readCookieChoice(), null);
    assert.equal(consent.saveCookieChoice(false).analytics, false);
  } finally {
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      value: original,
    });
  }
});

test('fresh/rejected visits load no Google tag; rejecting survives remount', async () => {
  process.env.NEXT_PUBLIC_GA_ENABLED = 'true';
  await mount();
  assert.ok(document.querySelector('[aria-label="Cookie choices"]'));
  assert.equal(document.querySelector('script[src*="googletagmanager"]'), null);
  await click('Reject optional');
  assert.equal(consent.readCookieChoice().analytics, false);
  assert.equal(document.querySelector('[aria-label="Cookie choices"]'), null);
  await act(async () => root.unmount());
  root = null;
  await mount();
  assert.equal(document.querySelector('[aria-label="Cookie choices"]'), null);
  assert.equal(document.querySelector('script[src*="googletagmanager"]'), null);
});

test('a failed storage write removes an older acceptance rather than restoring it', () => {
  consent.saveCookieChoice(true);
  const prototype = Object.getPrototypeOf(localStorage);
  const original = prototype.setItem;
  prototype.setItem = () => {
    throw Error('quota');
  };
  try {
    consent.saveCookieChoice(false);
    assert.equal(consent.readCookieChoice(), null);
  } finally {
    prototype.setItem = original;
  }
});

test('an expired choice brings the banner back while the page remains open', async () => {
  localStorage.setItem(
    consent.CONSENT_KEY,
    JSON.stringify({
      version: 1,
      analytics: false,
      expiresAt: Date.now() + 100,
    }),
  );
  await mount();
  assert.equal(document.querySelector('[aria-label="Cookie choices"]'), null);
  await act(async () => new Promise((resolve) => setTimeout(resolve, 110)));
  assert.ok(document.querySelector('[aria-label="Cookie choices"]'));
});

test('a rejection saved in another tab replaces the current accepted choice', async () => {
  consent.saveCookieChoice(true);
  await mount();
  consent.saveCookieChoice(false);
  await act(async () => window.dispatchEvent(new Event('storage')));
  await click('Cookie settings');
  assert.equal(document.querySelector('input[type="checkbox"]').checked, false);
  assert.equal(document.getElementById('sti-analytics'), null);
});

test('analytics stays disabled by default even after acceptance', async () => {
  await mount();
  await click('Accept analytics');
  assert.equal(consent.readCookieChoice().analytics, true);
  assert.equal(document.querySelector('script[src*="googletagmanager"]'), null);
});

test('enabled analytics starts only on acceptance, without an overflowing expiry timer', async () => {
  process.env.NEXT_PUBLIC_GA_ENABLED = 'true';
  const setTimeoutOriginal = globalThis.setTimeout;
  const delays = [];
  globalThis.setTimeout = (fn, delay, ...args) => {
    delays.push(delay);
    return setTimeoutOriginal(fn, delay, ...args);
  };
  try {
    await mount();
    await click('Accept analytics');
    assert.ok(document.getElementById('sti-analytics'));
    assert.ok(consent.readCookieChoice()?.analytics);
    assert.ok(delays.includes(86400000));
    assert.ok(delays.every((delay) => !(delay > 2147483647)));
    const commands = window.dataLayer;
    assert.equal(commands.filter((row) => row[0] === 'config').length, 1);
    assert.equal(commands.filter((row) => row[1] === 'page_view').length, 1);
    assert.ok(!JSON.stringify(commands).includes('syphilis'));
    assert.ok(!JSON.stringify(commands).includes('private'));
    setPathname('/blog/hiv-symptoms-stages');
    await act(async () => root.render(React.createElement(CookieConsent)));
    const event = window.dataLayer.at(-1);
    assert.equal(event[2].page_location, 'https://www.stitestkit.co.uk/guide');
    assert.equal(document.querySelectorAll('#sti-analytics').length, 1);
  } finally {
    globalThis.setTimeout = setTimeoutOriginal;
  }
});

test('settings reopen the saved choice and saving unchecked rejects analytics', async () => {
  consent.saveCookieChoice(false);
  await mount();
  await click('Cookie settings');
  assert.ok(document.querySelector('[role="dialog"]'));
  assert.equal(document.querySelector('input[type="checkbox"]').checked, false);
  await click('Save choices');
  assert.equal(consent.readCookieChoice().analytics, false);
  assert.equal(document.activeElement.textContent, 'Cookie settings');
});

test('closing initial settings returns focus to its banner button', async () => {
  await mount();
  await click('Settings');
  await click('Close');
  assert.equal(document.activeElement.textContent, 'Settings');
});

test('withdrawal removes the tag, stops queued events and clears GA cookies only', () => {
  process.env.NEXT_PUBLIC_GA_ENABLED = 'true';
  consent.saveCookieChoice(true);
  consent.startAnalytics();
  document.cookie = '_ga=example; Path=/; Secure';
  document.cookie =
    '_ga_90V3D10GNM=example; Path=/; Secure; Domain=stitestkit.co.uk';
  document.cookie = 'essential=preserve; Path=/; Secure';
  assert.equal(consent.stopAnalytics(), true);
  consent.trackPageView('/blog/hiv-symptoms-stages');
  assert.equal(document.getElementById('sti-analytics'), null);
  assert.equal(window['ga-disable-G-90V3D10GNM'], true);
  assert.equal(window.gtag, undefined);
  assert.deepEqual(window.dataLayer, []);
  assert.ok(!document.cookie.includes('_ga'));
  assert.ok(document.cookie.includes('essential=preserve'));
});
