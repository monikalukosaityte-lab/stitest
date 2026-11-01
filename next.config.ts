import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'no-referrer' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy-Report-Only',
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://images.unsplash.com https://*.google-analytics.com; font-src 'self'; connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com; frame-ancestors 'none'; base-uri 'self'; object-src 'none'",
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/product/syphilis',
        destination: '/rapid-tests/syphilis-home-test-kit',
        permanent: true,
      },
      {
        source: '/rapid-tests/syphilis',
        destination: '/rapid-tests/syphilis-home-test-kit',
        permanent: true,
      },
      {
        source: '/tests/chlamydia-gonorrhoea-test',
        destination: '/rapid-tests/chlamydia-gonorrhoea-home-test-kit',
        permanent: true,
      },
      {
        source: '/rapid-tests/chlamydia-gonorrhoea',
        destination: '/rapid-tests/chlamydia-gonorrhoea-home-test-kit',
        permanent: true,
      },
      {
        source: '/tests/hepatitis-b-c-test',
        destination: '/rapid-tests/hepatitis-b-c-home-test-kit',
        permanent: true,
      },
      {
        source: '/rapid-tests/hepatitis-b-c',
        destination: '/rapid-tests/hepatitis-b-c-home-test-kit',
        permanent: true,
      },
      {
        source: '/tests/herpes-test',
        destination: '/rapid-tests/herpes-hsv-2-home-test-kit',
        permanent: true,
      },
      {
        source: '/rapid-tests/herpes',
        destination: '/rapid-tests/herpes-hsv-2-home-test-kit',
        permanent: true,
      },
      {
        source: '/tests/hiv-test',
        destination: '/rapid-tests/hiv-home-test-kit',
        permanent: true,
      },
      {
        source: '/rapid-tests/hiv',
        destination: '/rapid-tests/hiv-home-test-kit',
        permanent: true,
      },
      {
        source: '/tests/psa-test',
        destination: '/rapid-tests/psa-prostate-home-test-kit',
        permanent: true,
      },
      {
        source: '/rapid-tests/psa',
        destination: '/rapid-tests/psa-prostate-home-test-kit',
        permanent: true,
      },
      {
        source: '/tests/syphilis-test',
        destination: '/rapid-tests/syphilis-home-test-kit',
        permanent: true,
      },
      {
        source: '/tests/core-4-bundle',
        destination: '/rapid-tests/core-4-sti-test-kit',
        permanent: true,
      },
      {
        source: '/rapid-tests/core-4-bundle',
        destination: '/rapid-tests/core-4-sti-test-kit',
        permanent: true,
      },
      {
        source: '/tests/sti-test-bundle',
        destination: '/rapid-tests/7-in-1-sti-test-kit',
        permanent: true,
      },
      {
        source: '/rapid-tests/sti-test-bundle',
        destination: '/rapid-tests/7-in-1-sti-test-kit',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
