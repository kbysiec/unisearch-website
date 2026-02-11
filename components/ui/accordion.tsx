'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';

interface AccordionItemProps {
  question: string;
  answer: string;
  defaultOpen?: boolean;
}

export function AccordionItem({ question, answer, defaultOpen = false }: AccordionItemProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div className="last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-5 text-left transition-colors hover:text-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:text-slate-100"
        aria-expanded={isOpen}
      >
        <span className="text-lg font-medium">{question}</span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-primary-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${
          isOpen ? 'mb-5 max-h-96' : 'max-h-0'
        }`}
      >
        <p className="text-gray-600 leading-relaxed dark:text-slate-300">{answer}</p>
      </div>
    </div>
  );
}

interface AccordionProps {
  items: AccordionItemProps[];
}

export function Accordion({ items }: AccordionProps) {
  return (
    <div className="divide-y divide-gray-200 dark:divide-white/10">
      {items.map((item, index) => (
        <AccordionItem key={index} {...item} />
      ))}
    </div>
  );
}
