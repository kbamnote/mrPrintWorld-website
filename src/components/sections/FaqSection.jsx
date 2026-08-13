import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Section from '../primitives/Section'
import SectionHeading from '../primitives/SectionHeading'
import Reveal from '../primitives/Reveal'
import Icon from '../primitives/Icon'
import Button from '../primitives/Button'
import { faqs } from '../../data/faq'

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(null);
  const homepageFaqs = faqs.slice(0, 6);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <Section id="faq" tone="surface" container={true}>
      <SectionHeading
        eyebrow="Frequently asked"
        title="Common questions, answered."
        align="center"
      />
      <div className="max-w-3xl mx-auto mt-12 space-y-4">
        {homepageFaqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <Reveal key={index} delay={index * 0.1}>
              <div 
                className="bg-white border border-line rounded-[var(--radius-lg)] overflow-hidden shadow-soft transition-colors hover:border-primary/30"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-opacity-50"
                  aria-expanded={isOpen}
                >
                  <span className="font-display font-medium text-ink text-lg">{faq.question}</span>
                  <span className={`text-primary transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    <Icon name={isOpen ? "minus" : "plus"} size={20} />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <div className="px-6 pb-4 pt-1 text-muted">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          );
        })}
      </div>
      <div className="mt-10 text-center">
        <Button to="/faq" variant="outline" size="md">View all FAQs</Button>
      </div>
    </Section>
  );
}
