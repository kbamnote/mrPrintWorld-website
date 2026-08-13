import React from 'react';
import { shippingPolicy } from '../data/legal';
import { useSeo, breadcrumbLd } from '../lib/seo';
import PageHeader from '../components/layout/PageHeader';
import Container from '../components/primitives/Container';
import Reveal from '../components/primitives/Reveal';

export default function ShippingPolicy() {
  useSeo({
    title: `${shippingPolicy.title} | MR Print World`,
    description: 'Shipping and delivery policy for MR Print World orders.',
    path: '/shipping-policy',
    schema: [
      breadcrumbLd([
        { name: 'Home', url: '/' },
        { name: 'Shipping Policy', url: '/shipping-policy' }
      ])
    ]
  });

  return (
    <>
      <PageHeader 
        title={shippingPolicy.title}
        description={`Last Updated: ${shippingPolicy.lastUpdated}`}
      />
      <section className="section-y bg-surface">
        <Container>
          <Reveal>
            <div className="max-w-4xl mx-auto bg-white rounded-[var(--radius-lg)] border border-line shadow-sm p-8 md:p-12">
              <div className="prose prose-p:text-ink-soft prose-headings:text-ink prose-a:text-primary max-w-none">
                {shippingPolicy.sections.map((section, idx) => (
                  <div key={idx} className="mb-8 last:mb-0">
                    <h2 className="text-2xl font-bold mb-4">{section.heading}</h2>
                    {Array.isArray(section.content) ? (
                      section.content.map((paragraph, pIdx) => (
                        <p key={pIdx} className="mb-4 leading-relaxed">{paragraph}</p>
                      ))
                    ) : (
                      <p className="mb-4 leading-relaxed">{section.content}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
