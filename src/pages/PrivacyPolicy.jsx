import React from 'react';
import { privacyPolicy } from '../data/legal';
import { useSeo, breadcrumbLd } from '../lib/seo';
import PageHeader from '../components/layout/PageHeader';
import Container from '../components/primitives/Container';
import Reveal from '../components/primitives/Reveal';

export default function PrivacyPolicy() {
  useSeo({
    title: `${privacyPolicy.title} | MR Print World`,
    description: 'Learn about how MR Print World collects, uses, and protects your personal information.',
    path: '/privacy-policy',
    schema: [
      breadcrumbLd([
        { name: 'Home', url: '/' },
        { name: 'Privacy Policy', url: '/privacy-policy' }
      ])
    ]
  });

  return (
    <>
      <PageHeader 
        title={privacyPolicy.title}
        description={`Last Updated: ${privacyPolicy.lastUpdated}`}
      />
      <section className="section-y bg-surface">
        <Container>
          <Reveal>
            <div className="max-w-4xl mx-auto bg-white rounded-[var(--radius-lg)] border border-line shadow-sm p-8 md:p-12">
              <div className="prose prose-p:text-ink-soft prose-headings:text-ink prose-a:text-primary max-w-none">
                {privacyPolicy.sections.map((section, idx) => (
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
