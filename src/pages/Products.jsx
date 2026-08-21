import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { products, productCategories } from '../data/products';
import { useSeo, breadcrumbLd } from '../lib/seo';
import PageHeader from '../components/layout/PageHeader';
import Container from '../components/primitives/Container';
import Reveal from '../components/primitives/Reveal';
import Button from '../components/primitives/Button';
import Icon from '../components/primitives/Icon';

export default function Products() {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter(p => p.category === activeCategory);

  useSeo({
    title: 'Products | MR Print World',
    description: 'Explore our high-quality printing products. Built to your specification.',
    path: '/products',
    schema: [
      breadcrumbLd([
        { name: 'Home', url: '/' },
        { name: 'Products', url: '/products' }
      ])
    ]
  });

  return (
    <>
      <PageHeader 
        eyebrow="Our Products"
        title="Quality products, built to your specification."
        description="Browse our comprehensive range of printing products designed to meet your specific needs."
      />
      <section className="section-y bg-surface">
        <Container>
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-12">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-[var(--radius-card)] text-sm font-medium transition-colors ${
                activeCategory === 'all'
                  ? 'bg-primary text-white shadow-soft'
                  : 'bg-white text-ink-soft hover:text-ink hover:bg-gray-50 border border-line'
              }`}
            >
              All Products
            </button>
            {productCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-[var(--radius-card)] text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? 'bg-primary text-white shadow-soft'
                    : 'bg-white text-ink-soft hover:text-ink hover:bg-gray-50 border border-line'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {filteredProducts.map((product, idx) => (
              <Reveal key={product.id} delay={idx * 0.1}>
                <div className="bg-white rounded-[var(--radius-lg)] border border-line shadow-sm overflow-hidden hover:shadow-card transition-shadow flex flex-col h-full">
                  <div className="aspect-[4/3] bg-gray-100 relative group overflow-hidden">
                    {product.image ? (
                      <img referrerPolicy="no-referrer" 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Icon name="Image" size={48} strokeWidth={1} />
                      </div>
                    )}
                  </div>
                  <div className="p-4 md:p-6 flex flex-col flex-grow">
                    <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                      {product.category}
                    </div>
                    <h3 className="text-lg font-bold text-ink mb-2 line-clamp-1">{product.name}</h3>
                    <p className="text-sm text-ink-soft mb-6 line-clamp-2 flex-grow">{product.shortDescription}</p>
                    
                    <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                      <Button to={`/products/${product.slug}`} variant="outline" size="sm" className="w-full justify-center">
                        View Details
                      </Button>
                      <Button to={`/request-quote?product=${product.id}`} variant="primary" size="sm" className="w-full justify-center">
                        Request Quote
                      </Button>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
