"use client";
import { useState } from 'react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import faqs from './faq-data.json';

export function FaqSection() {
  const [value,setValue] = useState<string[]>(['faq-0']);
  return <section className="faq-section site-container" aria-labelledby="faq-heading">
    <h2 id="faq-heading" className="landing-display">FAQ</h2>
    <Accordion className="pigeon-faq" multiple={false} value={value} onValueChange={next=>{if(next.length)setValue(next as string[])}}>
      {faqs.map(({question,answer},index)=><AccordionItem className="pigeon-faq-item" key={question} value={'faq-'+index}>
        <AccordionTrigger className="pigeon-faq-question">{question}</AccordionTrigger>
        <AccordionContent className="pigeon-faq-answer">{answer.map((paragraph,i)=><p key={i}>{paragraph}</p>)}</AccordionContent>
      </AccordionItem>)}
    </Accordion>
  </section>;
}
