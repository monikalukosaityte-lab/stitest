'use client';

import { RichText } from '@/components/elements/rich-text';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ProductPageData } from '@/lib/types';
import { shopUrl } from '@/lib/utils';

type Faq = ProductPageData['faq'];

// One group shows as a plain list; several groups each get an h3 heading.
export default function ProductFaq({ faq }: { faq: Faq }) {
  const grouped = faq.tabs.length > 1;

  return (
    <section id="faq" className="bg-card py-14 md:py-16">
      <div className="container grid items-start gap-8 md:grid-cols-[1fr_1.7fr] md:gap-x-16">
        <div className="space-y-4 md:sticky md:top-28">
          <h2 className="text-3xl md:text-4xl">{faq.heading}</h2>
          <p className="text-lg">
            Got a question?{' '}
            <a
              href={shopUrl('/pages/contact')}
              className="text-primary hover:text-primary-hover font-bold underline underline-offset-3"
            >
              Ask now
            </a>
          </p>
        </div>

        <div className="space-y-10">
          {faq.tabs.map((group) => (
            <div key={group.label}>
              {grouped && <h3 className="mb-3 text-xl">{group.label}</h3>}
              <FaqList
                questions={group.questions}
                headingAs={grouped ? 'h4' : 'h3'}
              />
            </div>
          ))}
        </div>

        {faq.references && (
          <div className="md:col-start-2">
            <h2 className="mb-3 text-xl">{faq.references.heading}</h2>
            <ol className="text-muted-foreground list-decimal space-y-1.5 pl-5 text-sm">
              {faq.references.items.map((item) => (
                <li key={item}>
                  <RichText as="span" html={item} />
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </section>
  );
}

function FaqList({
  questions,
  headingAs,
}: {
  questions: Faq['tabs'][number]['questions'];
  headingAs: 'h3' | 'h4';
}) {
  return (
    <Accordion type="single" collapsible className="border-t">
      {questions.map((item) => (
        <AccordionItem
          key={item.question}
          value={item.question}
          className="border-b"
        >
          <AccordionTrigger
            headingAs={headingAs}
            className="py-4 text-base font-normal md:text-lg"
          >
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="pb-5 text-base">
            <RichText html={item.answer} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
