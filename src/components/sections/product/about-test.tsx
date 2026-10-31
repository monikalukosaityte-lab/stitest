import Link from 'next/link';

import { RichText } from '@/components/elements/rich-text';
import { PRODUCT_ICONS } from '@/components/icons/shop';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { ProductAboutContent } from '@/lib/types';

export default function AboutTest({
  about,
  buyHref,
  price,
}: {
  about: ProductAboutContent;
  buyHref: string;
  price: string;
}) {
  return (
    <section className="bg-card py-12 md:py-16">
      <div className="container grid items-start gap-10 md:grid-cols-[minmax(0,1fr)_18rem] md:gap-14 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-20">
        <div>
          {about.heading && (
            <h2 className="mb-6 text-3xl md:text-4xl">
              <RichText as="span" html={about.heading} />
            </h2>
          )}
          <Accordion
            type="multiple"
            defaultValue={about.questions
              .filter((q) => q.open)
              .map((q) => q.question)}
            className="border-t"
          >
            {about.questions.map((item) => (
              <AccordionItem
                key={item.question}
                value={item.question}
                className="border-b"
              >
                <AccordionTrigger
                  headingAs={about.heading ? 'h3' : 'h2'}
                  className="py-4 text-base font-extrabold md:text-lg"
                >
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 text-base">
                  <RichText html={item.answer} />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          {about.link && (
            <Link
              href={about.link.href}
              className="text-primary hover:text-primary-hover mt-6 inline-block text-sm font-bold underline underline-offset-3"
            >
              {about.link.label} &rarr;
            </Link>
          )}
        </div>

        <WhyTestCard aside={about.aside} buyHref={buyHref} price={price} />
      </div>
    </section>
  );
}

function WhyTestCard({
  aside,
  buyHref,
  price,
}: {
  aside: ProductAboutContent['aside'];
  buyHref: string;
  price: string;
}) {
  return (
    <aside className="bg-muted rounded-2xl p-6 md:sticky md:top-28">
      <h3 className="mb-4 text-lg">{aside.heading}</h3>
      {aside.text && (
        <p className="text-muted-foreground -mt-2 mb-5 text-sm">{aside.text}</p>
      )}
      <ul className="mb-6 space-y-4">
        {aside.items.map((item) => {
          const Icon = PRODUCT_ICONS[item.icon];
          return (
            <li key={item.title} className="flex items-start gap-3">
              <span className="bg-card text-accent grid size-8 shrink-0 place-items-center rounded-full">
                <Icon className="size-4" />
              </span>
              <span className="text-sm">
                <strong className="block font-bold">{item.title}</strong>
                <span className="text-muted-foreground">{item.text}</span>
              </span>
            </li>
          );
        })}
      </ul>
      <div className="grid">
        <Button asChild variant="brand" size="lg">
          <a href={buyHref}>
            {aside.buttonLabel} – {price}
          </a>
        </Button>
      </div>
    </aside>
  );
}
