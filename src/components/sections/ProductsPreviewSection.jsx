import React from 'react'
import Section from '../primitives/Section'
import SectionHeading from '../primitives/SectionHeading'
import Reveal from '../primitives/Reveal'
import Button from '../primitives/Button'
import { getFeaturedProducts } from '../../data/products'
import { whatsappLink } from '../../data/company'

export default function ProductsPreviewSection() {
  const featuredProducts = getFeaturedProducts().slice(0, 6);

  return (
    <Section id="products" tone="default" container={false}>
      <div className="container-page">
        <SectionHeading
          eyebrow="Our products"
          title="Branded, built and ready to deliver."
          align="center"
        />
      </div>
      
      <div className="mt-12 marquee group relative overflow-hidden" role="region" aria-label="Featured Products">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[var(--color-surface)] to-transparent sm:w-28" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[var(--color-surface)] to-transparent sm:w-28" />

        <div className="marquee-track flex gap-6">
          {[...featuredProducts, ...featuredProducts].map((product, index) => (
            <div key={`${product.id}-${index}`} className="bg-white rounded-[var(--radius-lg)] overflow-hidden shadow-sm border border-line flex flex-col w-[280px] sm:w-[380px] shrink-0 transition-shadow duration-300 hover:shadow-card">
              <div className="aspect-[4/3] bg-gray-100 relative">
                {product.image ? (
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted">
                    Image placeholder
                  </div>
                )}
                {product.category && (
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-medium text-ink-soft rounded-[var(--radius-card)] uppercase tracking-wider shadow-sm">
                    {product.category}
                  </div>
                )}
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-display text-ink mb-2 line-clamp-1">{product.name}</h3>
                <p className="text-muted text-sm mb-6 flex-grow line-clamp-3">
                  {product.description || product.shortDescription}
                </p>
                <div className="pt-4 border-t border-line mt-auto">
                  <Button 
                    href={whatsappLink({ product: product.name })}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outline"
                    size="md" 
                    className="w-full justify-center"
                  >
                    Enquire
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-12 text-center">
        <Button to="/products" variant="primary" size="lg">View All Products</Button>
      </div>
    </Section>
  );
}
