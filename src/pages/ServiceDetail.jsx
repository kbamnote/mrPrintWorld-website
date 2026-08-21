import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { services } from '../data/services';
import { products } from '../data/products';
import { company, whatsappLink } from '../data/company';
import { useSeo, breadcrumbLd } from '../lib/seo';
import Container from '../components/primitives/Container';
import Reveal from '../components/primitives/Reveal';
import Button from '../components/primitives/Button';
import Icon from '../components/primitives/Icon';

export default function ServiceDetail() {
  const { slug } = useParams();
  const service = services.find(s => s.slug === slug);
  
  if (!service || slug === 'custom-solutions') {
    return <Navigate to="/services" replace />;
  }

  const relatedServices = services
    .filter(s => s.id !== service.id && s.slug !== 'custom-solutions')
    .slice(0, 3);

  const whatsappUrl = whatsappLink({ service: service.title });

  // Map service ID to related product categories
  const serviceToCategoryMap = {
    'printing': ['Printing Products', 'Business Branding', 'Promotional Products'],
    'signage': ['Signage & Boards', 'Acrylic Products'],
    'corporate': ['Corporate Gifts', 'Promotional Products'],
    'fabrication': ['Laser-Cut Products', 'CNC Products', 'Custom Products'],
    'event': ['Promotional Products', 'Signage & Boards'],
    'laser-cutting': ['Laser-Cut Products'],
    'cnc-cutting': ['CNC Products'],
    'metal-marking': ['UV Printed Products', 'Corporate Gifts'],
    'uv-printing': ['UV Printed Products'],
    'diy-craft': ['DIY Craft Products', 'Laser-Cut Products'],
    'acrylic-creations': ['Acrylic Products'],
    'interior-solutions': ['Interior & Decor', 'CNC Products']
  };

  const targetCategories = serviceToCategoryMap[service.id] || [];
  const relatedProducts = products
    .filter(p => targetCategories.includes(p.category))
    .slice(0, 6);

  useSeo({
    title: service.seo?.title || `${service.title} | MR Print World`,
    description: service.seo?.description || service.description,
    path: `/services/${service.slug}`,
    schema: [
      breadcrumbLd([
        { name: 'Home', url: '/' },
        { name: 'Services', url: '/services' },
        { name: service.title, url: `/services/${service.slug}` }
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
            <Link to="/services" className="hover:text-primary transition-colors">Services</Link>
            <span>/</span>
            <span className="text-ink font-medium">{service.title}</span>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Header / Intro */}
            <Reveal>
              <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
                <div className="w-16 h-16 md:w-24 md:h-24 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0 text-primary">
                  <Icon name={service.icon || "Settings"} size={40} className="md:w-12 md:h-12" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-ink mb-4">
                    {service.title}
                  </h1>
                  <p className="text-lg text-ink-soft leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Service Image Block */}
            {service.image && (
              <Reveal delay={0.05}>
                <div className="relative aspect-[16/9] w-full rounded-[var(--radius-lg)] overflow-hidden border border-line mb-12 shadow-sm">
                  <img referrerPolicy="no-referrer" src={service.image} alt={service.title} className="absolute inset-0 h-full w-full object-cover" />
                </div>
              </Reveal>
            )}

            {/* Core Capabilities & Machines Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {service.items && (
                <Reveal delay={0.1}>
                  <div className="bg-white p-6 md:p-8 rounded-[var(--radius-lg)] border border-line shadow-sm h-full">
                    <h3 className="text-lg font-bold text-ink mb-6 flex items-center">
                      <Icon name="layers" size={20} className="mr-3 text-primary" />
                      Capabilities & Offerings
                    </h3>
                    <ul className="space-y-4">
                      {service.items.map((item, i) => (
                        <li key={i} className="flex items-start">
                          <Icon name="Check" size={16} className="text-primary mt-1 mr-3 flex-shrink-0" />
                          <span className="text-ink-soft text-sm leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              )}

              {service.machines && (
                <Reveal delay={0.2}>
                  <div className="bg-white p-6 md:p-8 rounded-[var(--radius-lg)] border border-line shadow-sm h-full">
                    <h3 className="text-lg font-bold text-ink mb-6 flex items-center">
                      <Icon name="cog" size={20} className="mr-3 text-primary" />
                      Machines & Technology Used
                    </h3>
                    <ul className="space-y-4">
                      {service.machines.map((machine, i) => (
                        <li key={i} className="flex items-start">
                          <Icon name="bolt" size={16} className="text-gold-deep mt-1 mr-3 flex-shrink-0" />
                          <span className="text-ink-soft text-sm leading-relaxed">{machine}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              )}
            </div>

            {/* Target Applications & Industries Panels */}
            {(service.applications || service.industries) && (
              <Reveal delay={0.3}>
                <div className="bg-white p-6 md:p-8 rounded-[var(--radius-lg)] border border-line shadow-sm mb-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {service.applications && (
                      <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-ink mb-4">Target Applications</h4>
                        <div className="flex flex-wrap gap-2">
                          {service.applications.map((app, i) => (
                            <span key={i} className="px-3 py-1.5 bg-surface text-ink-soft border border-line rounded-lg text-xs font-medium">
                              {app}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {service.industries && (
                      <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-ink mb-4">Industries Served</h4>
                        <div className="flex flex-wrap gap-2">
                          {service.industries.map((ind, i) => (
                            <span key={i} className="px-3 py-1.5 bg-primary/5 text-primary border border-primary/10 rounded-lg text-xs font-medium">
                              {ind}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Reveal>
            )}
            
            {/* Call to Action Banner */}
            <Reveal delay={0.4}>
              <div className="bg-white p-8 md:p-10 rounded-[var(--radius-lg)] border border-line shadow-sm text-center max-w-2xl mx-auto">
                <h3 className="text-xl md:text-2xl font-display font-bold text-ink mb-3">Ready to start your custom project?</h3>
                <p className="text-ink-soft text-sm mb-8">Get in touch with our factory experts to discuss specifications, quantities, and obtain a custom commercial quotation.</p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button to={`/request-quote?service=${service.id}`} variant="primary" size="lg">
                    Request a Quote
                  </Button>
                  <Button href={whatsappUrl} target="_blank" rel="noopener noreferrer" variant="outline" size="lg" className="border-green-500 text-green-600 hover:bg-green-50">
                    <Icon name="MessageCircle" size={20} className="mr-2" />
                    WhatsApp Consultation
                  </Button>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="section-y bg-surface border-b border-line">
          <Container>
            <div className="mb-12 text-center">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-ink">Related Products</h2>
              <p className="mt-2 text-sm text-muted">Explore custom products manufactured using this service</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {relatedProducts.map((p, idx) => (
                <Reveal key={p.id} delay={idx * 0.1}>
                  <Link to={`/products/${p.slug}`} className="group block overflow-hidden rounded-[var(--radius-lg)] border border-line bg-white shadow-soft hover:shadow-card transition-all h-full">
                    <div className="relative aspect-[4/3] overflow-hidden bg-surface">
                      {p.image ? (
                        <img referrerPolicy="no-referrer" src={p.image} alt={p.name} className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                          <Icon name="package" size={28} className="text-line-strong" />
                          <span className="mt-3 text-xs uppercase tracking-[0.18em] text-muted">{p.category}</span>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <p className="text-[0.65rem] uppercase tracking-[0.16em] text-gold-deep font-semibold">{p.category}</p>
                      <h3 className="mt-2 font-display text-base font-bold text-ink group-hover:text-primary transition-colors">{p.name}</h3>
                      <p className="mt-2 text-xs text-muted line-clamp-2">{p.shortDescription}</p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}

      {relatedServices.length > 0 && (
        <section className="section-y bg-white">
          <Container>
            <div className="mb-12 text-center">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-ink">Other Services</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
              {relatedServices.map((s, idx) => (
                <Reveal key={s.id} delay={idx * 0.1}>
                  <Link to={`/services/${s.slug}`} className="group block bg-surface rounded-[var(--radius-lg)] border border-line p-6 shadow-sm hover:shadow-card transition-all h-full">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                      <Icon name={s.icon || "Settings"} size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-ink mb-3 group-hover:text-primary transition-colors">{s.title}</h3>
                    <p className="text-sm text-ink-soft line-clamp-3">{s.description}</p>
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
