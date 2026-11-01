import type { Metadata } from 'next';
import Link from 'next/link';

import { shopUrl } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Cookies',
  description: 'How STI Test Kit uses cookies and how to change your choice.',
  alternates: { canonical: '/cookies' },
};

export default function CookiesPage() {
  return (
    <article className="section-padding">
      <div className="container max-w-3xl space-y-8">
        <h1 className="text-4xl">Cookies</h1>
        <p>
          This notice covers www.stitestkit.co.uk. You can open Cookie settings
          in the footer of any page to accept, reject or change your analytics
          choice. Rejecting analytics does not prevent you from using this site.
        </p>
        <section className="space-y-3">
          <h2 className="text-2xl">Remembering your choice</h2>
          <p>
            We use essential browser storage called{' '}
            <code>sti-cookie-choice</code> to remember your choice for up to 180
            days. It contains your choice and its expiry, not your exposure date
            or browsing history. If storage is blocked, you may be asked again
            on a later visit.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-2xl">Optional Google Analytics</h2>
          <p>
            With your permission, we may use Google Analytics to measure visits
            and general page types, such as products and guides. Google tags are
            not loaded until you accept analytics. Advertising personalisation
            and Google Signals are disabled.
          </p>
          <p>
            Google Analytics can set cookies named <code>_ga</code> and{' '}
            <code>_ga_90V3D10GNM</code>, with a configured lifetime of up to 180
            days. They help distinguish visits. We configure measurement to omit
            condition-specific page addresses, page titles, query strings and
            referrers when analytics is enabled. We do not send the date entered
            into the testing checker.
          </p>
          <p>
            If you withdraw permission, we disable analytics, remove accessible
            analytics cookies and reload this page to stop the previously loaded
            tag. Withdrawal stops future collection; it does not automatically
            erase data already collected.
          </p>
          <p>
            Read{' '}
            <a href="https://policies.google.com/privacy" className="underline">
              Google&apos;s privacy policy
            </a>{' '}
            for information about its processing.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-2xl">Shopping and privacy</h2>
          <p>
            Buying a kit takes you to Test Discreet&apos;s Shopify shop, which
            has its own cookie settings. A choice on this site does not
            automatically change your choice there. See the{' '}
            <a href={shopUrl('/policies/privacy-policy')} className="underline">
              Test Discreet privacy policy
            </a>{' '}
            for wider privacy information and contact details.
          </p>
        </section>
        <Link href="/" className="inline-block underline">
          Back to STI Test Kit
        </Link>
      </div>
    </article>
  );
}
