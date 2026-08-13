import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { faqs, faqCategories } from '../data/faq';
import { useSeo, breadcrumbLd } from '../lib/seo';
import PageHeader from '../components/layout/PageHeader';
import Container from '../components/primitives/Container';
import Reveal from '../components/primitives/Reveal';
import Button from '../components/primitives/Button';
import Icon from '../components/primitives/Icon';
import { motion, AnimatePresence } from 'framer-motion';

function FaqItem({ faq, isOpen, onToggle }) {
  return (
    <div className="border border-line rounded-[var(--radius-lg)] bg-white overflow-hidden shadow-sm hover:shadow-card transition-shadow mb-4">
      <button 
        onClick={onToggle}
        className="w-full text-left px-6 py-5 flex items-center justify-between focus:outline-none"
      >
        <h3 className="text-lg font-bold text-ink pr-8">{faq.question}</h3>
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-primary text-white' : 'bg-surface text-ink-soft'}`}>
          <Icon name={isOpen ? "Minus" : "Plus"} size={20} className="transition-transform duration-300" />
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="px-6 pb-6 pt-2 border-t border-line text-ink-soft prose prose-p:leading-relaxed">
              <p>{faq.answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Faq() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [openFaqId, setOpenFaqId] = useState(null);

  const filteredFaqs = activeCategory === 'all'
    ? faqs
    : faqs.filter(f => f.category === activeCategory);

  // Generate FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  useSeo({
    title: 'Frequently Asked Questions | MR Print World',
    description: 'Find answers to common questions about our printing services, products, ordering process, and policies.',
    path: '/faq',
    schema: [
      breadcrumbLd([
        { name: 'Home', url: '/' },
        { name: 'FAQ', url: '/faq' }
      ]),
      faqSchema
    ]
  });

  const toggleFaq = (id) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  return (
    <>
      <PageHeader 
        eyebrow="Help Center"
        title="Frequently Asked Questions"
        description="Find answers to common questions about our services, orders, and policies. If you can't find what you're looking for, feel free to contact us."
      />

      <section className="section-y bg-surface">
        <Container>
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Sidebar / Categories */}
            <div className="lg:w-1/4 flex-shrink-0">
              <div className="sticky top-24 bg-white p-6 rounded-[var(--radius-lg)] border border-line shadow-sm">
                <h3 className="text-lg font-bold text-ink mb-4">Categories</h3>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setActiveCategory('all')}
                    className={`text-left px-4 py-2.5 rounded-[var(--radius-card)] text-sm font-medium transition-colors ${
                      activeCategory === 'all'
                        ? 'bg-primary/10 text-primary'
                        : 'text-ink-soft hover:text-ink hover:bg-gray-50'
                    }`}
                  >
                    All Questions
                  </button>
                  {faqCategories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`text-left px-4 py-2.5 rounded-[var(--radius-card)] text-sm font-medium transition-colors ${
                        activeCategory === cat.id
                          ? 'bg-primary/10 text-primary'
                          : 'text-ink-soft hover:text-ink hover:bg-gray-50'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* FAQ List */}
            <div className="lg:w-3/4">
              <Reveal>
                <div className="mb-12">
                  {filteredFaqs.length > 0 ? (
                    filteredFaqs.map((faq, idx) => (
                      <FaqItem 
                        key={faq.id} 
                        faq={faq} 
                        isOpen={openFaqId === faq.id}
                        onToggle={() => toggleFaq(faq.id)}
                      />
                    ))
                  ) : (
                    <div className="text-center py-12 bg-white rounded-[var(--radius-lg)] border border-line">
                      <p className="text-ink-soft">No FAQs found for this category.</p>
                    </div>
                  )}
                </div>

                <div className="bg-primary/5 rounded-[var(--radius-lg)] border border-primary/20 p-8 text-center md:flex md:items-center md:justify-between md:text-left">
                  <div className="mb-6 md:mb-0">
                    <h3 className="text-xl font-bold text-ink mb-2">Still have questions?</h3>
                    <p className="text-ink-soft">Can't find the answer you're looking for? Please chat to our friendly team.</p>
                  </div>
                  <div className="flex gap-4 justify-center md:justify-end">
                    <Button as={Link} to="/contact" variant="primary">
                      Contact Us
                    </Button>
                  </div>
                </div>
              </Reveal>
            </div>
            
          </div>
        </Container>
      </section>
    </>
  );
}
