import Image from 'next/image';
import Link from 'next/link';

import {
  ArrowRightIcon,
  CheckIcon,
  ClockIcon,
  HomeIcon,
  InfoIcon,
  LockIcon,
  PackageIcon,
  VerifiedIcon,
} from '@/components/icons/shop';
import ProductFaq from '@/components/sections/product/product-faq';
import ProductGrid from '@/components/sections/product-grid';
import { Button } from '@/components/ui/button';
import { ProductPageData } from '@/lib/types';
import { shopUrl } from '@/lib/utils';

// Copy from the STI Test Kit homepage SEO doc. Sections follow the doc's order.
const BUNDLE_URL = '/rapid-tests/7-in-1-sti-test-kit';
const CORE_4_URL = '/rapid-tests/core-4-sti-test-kit';

const PILLS = [
  'Results in 15 minutes',
  'No clinic visit',
  'Discreet packaging',
  'Ships within 1 working day',
];

const BENEFITS = [
  {
    icon: ClockIcon,
    title: 'Results in 15 minutes',
    text: 'Read your result at home, the same day. No posting samples to a lab and no waiting days.',
  },
  {
    icon: CheckIcon,
    title: 'Simple to use',
    text: 'A small finger-prick or a quick swab. Everything you need is in the box, with clear instructions.',
  },
  {
    icon: PackageIcon,
    title: 'Completely discreet',
    text: 'Plain parcel with nothing on the outside, and your bank statement won’t show the name of the test.',
  },
  {
    icon: HomeIcon,
    title: 'No clinic visit',
    text: 'No appointment, no waiting room. Test when and where suits you.',
  },
];

const CHOOSER = [
  {
    title: 'I want a full check',
    text: 'Test for 7 STIs in one kit.',
    link: { label: '7-in-1 STI test kit', href: BUNDLE_URL, price: '£64.95' },
  },
  {
    title: 'I want the essentials',
    text: 'Chlamydia, gonorrhoea, HIV and syphilis.',
    link: { label: 'Core 4 STI test kit', href: CORE_4_URL, price: '£44.95' },
  },
  {
    title: 'I’m worried about one infection',
    text: 'Choose a single test below.',
  },
];

const FEATURED_POINTS = [
  '7 STIs, 5 tests, 1 order',
  '4 finger-prick tests and 1 swab',
];

const STEPS = [
  {
    title: 'Take your sample',
    text: 'A small finger-prick of blood, or a quick swab for chlamydia and gonorrhoea. Each test comes with everything you need.',
  },
  {
    title: 'Add it to the test',
    text: 'Follow the leaflet to add your sample and a few drops of test liquid.',
  },
  {
    title: 'Read your result',
    text: 'Most tests are read between 15 and 20 minutes. Check your test’s leaflet for its exact time.',
  },
];

const WINDOWS = [
  {
    infection: 'Chlamydia and gonorrhoea',
    href: '/rapid-tests/chlamydia-gonorrhoea-home-test-kit',
    retest: '2 weeks after possible exposure',
  },
  {
    infection: 'Syphilis',
    href: '/rapid-tests/syphilis-home-test-kit',
    retest: '12 weeks',
  },
  {
    infection: 'Hepatitis B',
    href: '/rapid-tests/hepatitis-b-c-home-test-kit',
    retest: '12 weeks',
  },
  {
    infection: 'HIV',
    href: '/rapid-tests/hiv-home-test-kit',
    retest: '90 days',
  },
  { infection: 'Hepatitis C', retest: '6 months' },
  {
    infection: 'Genital herpes (HSV-2)',
    href: '/rapid-tests/herpes-hsv-2-home-test-kit',
    retest:
      'No reliable conclusive window. If you have sores, a clinic can swab them.',
  },
];

// Newest first. The homepage shows four, so the oldest drops off when a
// guide is added (all guides stay on /blog).
const GUIDES = [
  {
    title: 'What are the symptoms of genital herpes?',
    text: 'How first and repeat outbreaks differ, what triggers them and how it’s treated.',
    href: '/blog/genital-herpes-symptoms',
    image: '/images/blog/genital-herpes-symptoms.webp',
  },
  {
    title: 'What are the symptoms of HIV?',
    text: 'The 3 stages of HIV, and why most people on treatment never develop AIDS.',
    href: '/blog/hiv-symptoms-stages',
    image: '/images/blog/hiv-symptoms-stages.webp',
  },
  {
    title: 'What is an STI test?',
    text: 'How STI testing works, what it checks for and what happens next.',
    href: '/blog/what-is-an-sti-test',
    image: '/images/blog/what-is-an-sti-test.webp',
  },
  {
    title: 'What are the symptoms of chlamydia and gonorrhoea?',
    text: 'Symptoms in men and women, and why most people have none.',
    href: '/blog/chlamydia-gonorrhoea-symptoms',
    image: '/images/blog/chlamydia-gonorrhoea-symptoms.webp',
  },
];

const TRUST = [
  { icon: LockIcon, label: 'Private payment' },
  { icon: PackageIcon, label: 'Discreet delivery' },
  { icon: CheckIcon, label: 'Confidential results' },
  { icon: VerifiedIcon, label: 'Medically reviewed guides' },
];

export const HOME_FAQ: ProductPageData['faq'] = {
  heading: 'Home STI testing FAQs',
  tabs: [
    {
      label: 'All',
      questions: [
        {
          question: 'Which STI test should I get?',
          answer: `<p>If you want to check everything at once, choose the <a href="${BUNDLE_URL}">7-in-1 STI test kit</a>. For the most commonly tested STIs, choose the <a href="${CORE_4_URL}">Core 4</a>. If you’re only worried about one infection, pick a single test.</p>`,
        },
        {
          question: 'Are home STI tests accurate?',
          answer:
            '<p>When used correctly and read at the right time, our rapid tests are a reliable way to screen for STIs at home. Testing too soon after exposure can affect results, and any positive result should be confirmed by a sexual health clinic or GP. Each product page lists its own accuracy details.</p>',
        },
        {
          question: 'How soon after sex can I test?',
          answer:
            '<p>You can test at any time, but each STI takes a different time to show up, from 2 weeks for chlamydia and gonorrhoea to 6 months for hepatitis C. See “When can I test?” above, and read more about <a href="/blog/what-is-an-sti-test">how STI testing works</a>.</p>',
        },
        {
          question: 'Do I need to send anything to a lab?',
          answer:
            '<p>No. Our rapid tests are read at home, with results in around 15 minutes. There’s nothing to post.</p>',
        },
        {
          question: 'How do I read my result?',
          answer:
            '<p>For the STI tests, C only means negative. Lines at C and T mean positive, even if T is faint. No C line means the test hasn’t worked. Read within the time shown in your test’s instructions. The PSA test is interpreted differently: see its <a href="/rapid-tests/psa-prostate-home-test-kit">product page</a>.</p>',
        },
        {
          question: 'What if my result is positive?',
          answer:
            '<p>Don’t panic. Take a photo of the test and contact a sexual health clinic or your GP for a confirmation test and treatment. Many STIs are curable, and the rest can be treated or managed. For a positive PSA result, contact your GP to discuss further testing.</p>',
        },
        {
          question: 'Can you have an STI without symptoms?',
          answer:
            '<p>Yes, it’s very common. Most people with chlamydia have no symptoms, and HIV, hepatitis and herpes can cause no symptoms for years. Testing is the only way to know.</p>',
        },
        {
          question: 'What does the parcel look like?',
          answer:
            '<p>A plain box with a standard shipping label. There’s nothing on the outside naming the product or the shop, and your bank statement won’t show the name of the test.</p>',
        },
        {
          question: 'How fast is delivery?',
          answer:
            '<p>We ship within 1 working day, with discreet delivery across the UK.</p>',
        },
        {
          question: 'Can I return my test?',
          answer: `<p>You can cancel within 14 days of delivery by emailing us, then return unopened kits within 14 days. The sealed inner pouch must be unopened. Faulty or wrongly described kits aren’t affected. See our <a href="${shopUrl('/policies/refund-policy')}">Returns Policy</a> for details.</p>`,
        },
        {
          question: 'Is free STI testing available?',
          answer:
            '<p>Yes. NHS sexual health clinics offer free, confidential testing, and some areas offer free postal kits. Our home tests are an option if you’d like results in minutes, with no appointment.</p>',
        },
      ],
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <WhyTestAtHome />
      <Chooser />
      <ProductGrid heading="All home test kits" featureFirst={false} />
      <Featured />
      <HowItWorks />
      <WhenToTest />
      <Guides />
      <ProductFaq faq={HOME_FAQ} />
      <TrustStrip />
    </>
  );
}

// Navy band with a soft glow and the kit in hand, as on testdiscreet.co.uk.
function Hero() {
  return (
    <section className="bg-accent-deep text-accent-foreground relative overflow-hidden">
      <div className="from-primary absolute inset-0 bg-radial-[90%_50%_at_50%_35%] to-transparent md:bg-radial-[45%_85%_at_72%_50%]" />
      <div className="absolute inset-0 container hidden pt-6 md:block">
        <div className="relative size-full">
          <Image
            src="/images/home/hero-desktop.webp"
            alt="Hand holding a home STI test kit"
            fill
            priority
            sizes="(min-width: 1248px) 1200px, 100vw"
            className="object-contain object-right-bottom"
          />
        </div>
      </div>

      <div className="relative z-10 container py-10 md:py-16">
        <div className="max-w-xl space-y-6 text-center md:text-left">
          <h1 className="text-4xl leading-none md:text-5xl">
            <span className="block">Home STI Test Kits</span>
            <span className="sr-only"> – </span>
            <span className="mt-2 block font-serif text-2xl font-bold md:text-3xl">
              Private Results in 15 Minutes
            </span>
          </h1>
          <p className="text-lg">
            Test for HIV, syphilis, chlamydia, gonorrhoea, herpes and hepatitis
            at home. Simple finger-prick and swab tests, results in around 15
            minutes, and nothing to post to a lab.
          </p>
          <ul className="flex flex-wrap justify-center gap-2 md:justify-start">
            {PILLS.map((pill) => (
              <li
                key={pill}
                className="inline-flex items-center gap-1.5 rounded-full border border-current/30 px-3 py-1 text-sm"
              >
                <CheckIcon className="size-4" />
                {pill}
              </li>
            ))}
          </ul>
          <div className="grid gap-3 sm:flex sm:justify-center md:justify-start">
            <Button asChild variant="light">
              <Link href={BUNDLE_URL}>Get the full 7-in-1 kit – £64.95</Link>
            </Button>
          </div>
          <p className="text-sm opacity-85">
            Free, confidential testing is also available from NHS sexual health
            services.
          </p>
        </div>
      </div>

      <div className="relative aspect-4/3 md:hidden">
        <Image
          src="/images/home/hero-mobile.webp"
          alt="Hand holding a home STI test kit"
          fill
          priority
          sizes="100vw"
          className="object-cover object-bottom"
        />
      </div>
    </section>
  );
}

function WhyTestAtHome() {
  return (
    <section className="bg-muted">
      <div className="container py-12 md:py-16">
        <div className="mx-auto mb-10 max-w-2xl space-y-3 text-center">
          <h2 className="text-3xl md:text-4xl">
            Why test for STIs <em>at home?</em>
          </h2>
          <p className="text-lg">
            Many STIs have no symptoms, so testing is the only way to know. Our
            rapid home tests make it simple to check, privately and on your own
            schedule.
          </p>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map(({ icon: Icon, title, text }) => (
            <li
              key={title}
              className="bg-background space-y-3 rounded-lg p-6 text-center"
            >
              <span className="bg-muted mx-auto grid size-13 place-items-center rounded-full">
                <Icon aria-hidden className="text-primary size-1/2" />
              </span>
              <h3 className="text-lg">{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Chooser() {
  return (
    <section className="pt-12 md:pt-16">
      <div className="container">
        <div className="mx-auto mb-8 max-w-2xl space-y-3 text-center">
          <h2 className="text-3xl md:text-4xl">
            Which STI test do I <em>need?</em>
          </h2>
          <p className="text-lg">
            Not sure where to start? Pick the option that fits you best.
          </p>
        </div>
        <ul className="grid gap-4 md:grid-cols-3">
          {CHOOSER.map((option) => (
            <li
              key={option.title}
              className="bg-card flex flex-col gap-2 rounded-lg border p-6"
            >
              <h3 className="text-xl">{option.title}</h3>
              <p className="flex-1">{option.text}</p>
              {option.link && (
                <p className="flex flex-wrap items-center justify-between gap-2 pt-2">
                  <Link
                    href={option.link.href}
                    className="text-primary hover:text-primary-hover inline-flex items-center gap-1.5 font-bold underline underline-offset-3"
                  >
                    {option.link.label}
                    <ArrowRightIcon aria-hidden className="size-4" />
                  </Link>
                  <span className="font-bold">{option.link.price}</span>
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// A short feature box rather than the full 7-in-1 product section, so the
// homepage doesn't compete with the 7-in-1 page in search.
function Featured() {
  return (
    <section className="bg-muted py-12 md:py-16">
      <div className="container grid items-center gap-8 md:grid-cols-2 md:gap-14">
        <Link
          href={BUNDLE_URL}
          tabIndex={-1}
          aria-hidden
          className="bg-secondary relative block aspect-10/9 rounded-lg"
        >
          <Image
            src="/images/products/shop-sti-bundle.webp"
            alt="7-in-1 STI home test kit"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-contain p-4"
          />
        </Link>
        <div className="space-y-5">
          <h2 className="text-3xl md:text-4xl">
            Our most complete <em>STI test</em>
          </h2>
          <p className="text-lg">
            Check for 7 infections in one private order: HIV, syphilis,
            chlamydia, gonorrhoea, genital herpes, hepatitis B and hepatitis C.
            Five rapid tests, results in around 15 minutes each.
          </p>
          <ul className="space-y-2">
            {FEATURED_POINTS.map((point) => (
              <li key={point} className="flex items-start gap-2">
                <span className="bg-primary text-primary-foreground mt-1 grid size-4 shrink-0 place-items-center rounded-xs">
                  <CheckIcon className="size-3" />
                </span>
                {point}
              </li>
            ))}
          </ul>
          <p className="text-lg">
            <s className="text-muted-foreground">£98.75</s>{' '}
            <strong className="text-2xl">£64.95</strong>, save £33.80
          </p>
          <div className="grid sm:inline-grid">
            <Button asChild>
              <Link href={BUNDLE_URL}>See the 7-in-1 kit</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-12 md:py-16">
      <div className="container max-w-5xl space-y-8">
        <div className="mx-auto max-w-2xl space-y-3 text-center">
          <h2 className="text-3xl md:text-4xl">
            How does a home STI test <em>work?</em>
          </h2>
          <p className="text-lg">
            Our rapid tests work in a similar way to a home pregnancy test. You
            add a small sample, and lines appear on the test to show your
            result.
          </p>
        </div>
        <ol className="grid gap-4 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <li
              key={step.title}
              className="bg-card space-y-2 rounded-lg border p-6"
            >
              <span className="bg-primary text-primary-foreground font-display grid size-9 place-items-center rounded-full font-bold">
                {index + 1}
              </span>
              <h3 className="text-lg">{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="bg-muted space-y-2 rounded-lg p-6">
            <h3 className="text-lg">Reading your result</h3>
            <p>
              C is the control line and T is the test line. One line at C
              usually means negative. Lines at C and T usually mean positive,
              even if T is faint. No line at C means the test hasn&apos;t
              worked. (The PSA test is read differently.{' '}
              <Link
                href="/rapid-tests/psa-prostate-home-test-kit"
                className="text-primary hover:text-primary-hover underline underline-offset-3"
              >
                See its page
              </Link>
              .)
            </p>
            <p>
              <a
                href={shopUrl('/pages/how-to-test')}
                className="text-primary hover:text-primary-hover inline-flex items-center gap-1.5 font-bold underline underline-offset-3"
              >
                How to test and read your results
                <ArrowRightIcon aria-hidden className="size-4" />
              </a>
            </p>
          </div>
          <div className="bg-muted space-y-2 rounded-lg p-6">
            <h3 className="text-lg">If a result is positive</h3>
            <p>
              Take a photo of the test and contact a sexual health clinic or
              your GP for a confirmation test and treatment. NHS sexual health
              services are free and confidential.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhenToTest() {
  return (
    <section id="when-to-test" className="bg-muted scroll-mt-24 py-12 md:py-16">
      <div className="container max-w-4xl space-y-8">
        <div className="space-y-3 text-center">
          <h2 className="text-3xl md:text-4xl">
            How soon after sex can I test for <em>STIs?</em>
          </h2>
          <p className="text-lg">
            You can test at any time, but testing too early can give a negative
            result even if you have an infection. Each STI takes a different
            amount of time to show up. If you test early and get a negative
            result, test again once the window period has passed.
          </p>
        </div>
        <table className="bg-card w-full overflow-hidden rounded-lg text-left">
          <thead>
            <tr>
              <th className="p-4 font-bold">Infection</th>
              <th className="p-4 font-bold">Retest an early negative at</th>
            </tr>
          </thead>
          <tbody>
            {WINDOWS.map((row) => (
              <tr key={row.infection} className="border-t">
                <td className="p-4 font-bold">
                  {row.href ? (
                    <Link
                      href={row.href}
                      className="text-primary hover:text-primary-hover underline underline-offset-3"
                    >
                      {row.infection}
                    </Link>
                  ) : (
                    row.infection
                  )}
                </td>
                <td className="p-4">{row.retest}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="grid gap-4 md:grid-cols-2">
          <p className="bg-card rounded-lg p-6">
            <strong>Need help now?</strong> If you have symptoms or a partner
            has tested positive, contact a sexual health clinic now.
          </p>
          <p className="bg-card border-l-primary flex gap-3 rounded-lg border-l-4 p-6">
            <InfoIcon aria-hidden className="text-primary size-6 shrink-0" />
            <span>
              <strong>PEP alert:</strong> Possible HIV exposure in the last 72
              hours? Contact a sexual health clinic or A&amp;E straight away and
              ask about PEP, medicine that can help prevent HIV. Don&apos;t wait
              for a test result.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}

function Guides() {
  return (
    <section className="py-12 md:py-16">
      <div className="container space-y-8">
        <div className="mx-auto max-w-2xl space-y-3 text-center">
          <h2 className="text-3xl md:text-4xl">
            STI guides, <em>medically reviewed</em>
          </h2>
          <p className="text-lg">
            Clear, simple guides to symptoms, testing and treatment.
          </p>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {GUIDES.map((guide) => (
            <li
              key={guide.href}
              className="bg-card relative flex flex-col overflow-hidden rounded-lg border"
            >
              <div className="bg-muted relative aspect-3/2">
                <Image
                  src={guide.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col gap-2 p-5">
                <h3 className="text-lg">
                  <Link
                    href={guide.href}
                    className="no-underline after:absolute after:inset-0"
                  >
                    {guide.title}
                  </Link>
                </h3>
                <p className="flex-1">{guide.text}</p>
                <p className="text-muted-foreground text-xs">
                  Medically reviewed
                </p>
                <p className="text-primary inline-flex items-center gap-1.5 font-bold">
                  Read guide
                  <ArrowRightIcon aria-hidden className="size-4" />
                </p>
              </div>
            </li>
          ))}
        </ul>
        <div className="grid sm:flex sm:justify-center">
          <Button asChild variant="outline">
            <Link href="/blog">See all guides</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function TrustStrip() {
  return (
    <section className="bg-muted py-6">
      <ul className="container grid grid-cols-2 gap-4 md:grid-cols-4">
        {TRUST.map(({ icon: Icon, label }) => (
          <li
            key={label}
            className="font-display flex items-center justify-center gap-2 text-sm font-bold"
          >
            <Icon aria-hidden className="text-primary size-5 shrink-0" />
            {label}
          </li>
        ))}
      </ul>
    </section>
  );
}
