import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';

import { defineConfig, devices } from '@playwright/test';

// Use HTTPS so WebKit applies the same Secure cookie rules as the real site.
mkdirSync('.browser-certs', { recursive: true });
execFileSync(
  'openssl',
  [
    'req',
    '-x509',
    '-newkey',
    'rsa:2048',
    '-nodes',
    '-keyout',
    '.browser-certs/key.pem',
    '-out',
    '.browser-certs/cert.pem',
    '-subj',
    '/CN=localhost',
    '-days',
    '1',
    '-addext',
    'subjectAltName=DNS:localhost',
  ],
  { stdio: 'ignore' },
);

export default defineConfig({
  testDir: './tests/browser',
  timeout: 90_000,
  expect: { timeout: 15_000 },
  workers: 1,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'https://localhost:3187',
    ignoreHTTPSErrors: true,
    locale: 'en-GB',
    timezoneId: 'Europe/London',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'desktop-chrome',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 900 },
      },
    },
    { name: 'mobile-safari', use: { ...devices['iPhone 13'] } },
  ],
  webServer: {
    command:
      'npm run dev -- --port 3187 --experimental-https --experimental-https-key .browser-certs/key.pem --experimental-https-cert .browser-certs/cert.pem',
    url: 'https://localhost:3187',
    ignoreHTTPSErrors: true,
    reuseExistingServer: false,
    timeout: 180_000,
  },
});
