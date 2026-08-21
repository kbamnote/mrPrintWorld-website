import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { products, productCategories } from '../data/products';
import { company, whatsappLink } from '../data/company';
import { useSeo, breadcrumbLd } from '../lib/seo';
import Container from '../components/primitives/Container';
import Reveal from '../components/primitives/Reveal';
import Button from '../components/primitives/Button';
import Icon from '../components/primitives/Icon';

export default function ProductDetail() {
  const { slug } = useParams();
  const product = products.find(p => p.slug === slug);
  
  if (!product) {
    return <Navigate to="/products" replace />;
  }

  const categoryName = productCategories.find(c => c.id === product.category)?.name || product.category;
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const whatsappUrl = whatsappLink({ product: product.name });

  useSeo({
    title: `${product.name} | MR Print World`,
    description: product.shortDescription,
    path: `/products/${product.slug}`,
    schema: [
      breadcrumbLd([
        { name: 'Home', url: '/' },
        { name: 'Products', url: '/products' },
        { name: product.name, url: `/products/${product.slug}` }
      ])
    ]
  });

  return (
    <>
      <section className="pt-24 pb-12 md:pt-32 md:pb-20 bg-surface border-b border-line">
        <Container>
          <div className="flex items-center text-sm text-ink-soft mb-8 flex-wrap gap-2">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
            <span>/</span>
            <span className="text-ink font-medium">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <Reveal>
              <div className="aspect-square bg-white rounded-[var(--radius-lg)] border border-line overflow-hidden shadow-sm flex items-center justify-center">
                {product.image ? (
                  <img referrerPolicy="no-referrer" src={product.image} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <Icon name="Image" size={64} className="text-gray-300" />
                )}
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="flex flex-col h-full">
                <div className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
                  {categoryName}
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-ink mb-6">
                  {product.name}
                </h1>
                
                <div className="prose prose-p:text-ink-soft prose-p:leading-relaxed mb-8">
                  <p>{product.description}</p>
                </div>

                <div className="space-y-6 mb-8">
                  {product.specifications && (
                    <div>
                      <h3 className="text-lg font-bold text-ink mb-3">Specifications</h3>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {product.specifications.map((spec, i) => (
                          <li key={i} className="flex items-start text-sm text-ink-soft">
                            <Icon name="CheckCircle2" size={16} className="text-primary mt-1 mr-2 flex-shrink-0" />
                            <span>{spec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {product.applications && (
                    <div>
                      <h3 className="text-lg font-bold text-ink mb-3">Common Applications</h3>
                      <div className="flex flex-wrap gap-2">
                        {product.applications.map((app, i) => (
                          <span key={i} className="px-3 py-1 bg-gray-100 text-ink-soft text-sm rounded-[var(--radius-card)]">
                            {app}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {product.moq && (
                    <div>
                      <h3 className="text-lg font-bold text-ink mb-1">Minimum Order Quantity</h3>
                      <p className="text-sm text-ink-soft">{product.moq}</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-auto pt-6 border-t border-line">
                  <Button to={`/request-quote?product=${product.id}`} variant="primary" size="lg" className="flex-1 justify-center">
                    Request Quote for {product.name}
                  </Button>
                  <Button href={whatsappUrl} target="_blank" rel="noopener noreferrer" variant="outline" size="lg" className="flex-1 justify-center border-green-500 text-green-600 hover:bg-green-50">
                    <Icon name="MessageCircle" size={20} className="mr-2" />
                    WhatsApp Us
                  </Button>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {relatedProducts.length > 0 && (
        <section className="section-y bg-white">
          <Container>
            <div className="mb-12">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-ink">Related Products</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {relatedProducts.map((p, idx) => (
                <Reveal key={p.id} delay={idx * 0.1}>
                  <Link to={`/products/${p.slug}`} className="group block bg-surface rounded-[var(--radius-lg)] border border-line shadow-sm overflow-hidden hover:shadow-card transition-shadow">
                    <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                      {p.image ? (
                        <img referrerPolicy="no-referrer" src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Icon name="Image" size={40} strokeWidth={1} />
                        </div>
                      )}
                    </div>
                    <div className="p-4 md:p-6">
                      <h3 className="text-lg font-bold text-ink mb-2 group-hover:text-primary transition-colors">{p.name}</h3>
                      <p className="text-sm text-ink-soft line-clamp-2">{p.shortDescription}</p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
