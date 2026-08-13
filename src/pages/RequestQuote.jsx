import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSeo, breadcrumbLd } from '../lib/seo';
import { submitLead } from '../lib/crm';
import { services } from '../data/services';
import { products } from '../data/products';
import { company } from '../data/company';
import PageHeader from '../components/layout/PageHeader';
import Container from '../components/primitives/Container';
import Reveal from '../components/primitives/Reveal';
import Button from '../components/primitives/Button';
import Icon from '../components/primitives/Icon';

export default function RequestQuote() {
  const [searchParams] = useSearchParams();
  const preselectedService = searchParams.get('service') || '';
  const preselectedProduct = searchParams.get('product') || '';

  const [formState, setFormState] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    serviceInterest: preselectedService,
    productInterest: preselectedProduct,
    quantity: '',
    dimensions: '',
    material: '',
    timeline: '',
    message: '',
    bot_field: '' // honeypot
  });

  const [mathChallenge, setMathChallenge] = useState({ a: 0, b: 0, answer: '' });
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setMathChallenge({
      a: Math.floor(Math.random() * 10) + 1,
      b: Math.floor(Math.random() * 10) + 1,
      answer: ''
    });
  }, []);

  useSeo({
    title: 'Request a Quote | MR Print World',
    description: 'Get a custom quote for your printing project. Tell us about your requirements and we will get back to you with a competitive price.',
    path: '/request-quote',
    schema: [
      breadcrumbLd([
        { name: 'Home', url: '/' },
        { name: 'Request Quote', url: '/request-quote' }
      ])
    ]
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Honeypot check
    if (formState.bot_field) {
      setStatus('success'); // Fake success for bots
      return;
    }

    // Math challenge check
    if (parseInt(mathChallenge.answer) !== mathChallenge.a + mathChallenge.b) {
      setErrorMsg('Incorrect math answer. Please try again.');
      return;
    }

    setStatus('submitting');
    setErrorMsg('');

    try {
      const dataToSubmit = { ...formState };
      delete dataToSubmit.bot_field;
      
      const success = await submitLead(dataToSubmit);
      
      if (success) {
        setStatus('success');
      } else {
        throw new Error('Failed to submit form');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
      setErrorMsg('Something went wrong. Please try again or contact us directly.');
    }
  };

  return (
    <>
      <PageHeader 
        eyebrow="Get a Quote"
        title="Tell us about your project."
        description="Fill out the form below with as much detail as possible, and our team will get back to you within 24 hours."
      />
      
      <section className="section-y bg-surface">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Form Column */}
            <div className="lg:col-span-8">
              <Reveal>
                <div className="bg-white rounded-[var(--radius-lg)] border border-line shadow-card p-6 md:p-8 md:p-10">
                  {status === 'success' ? (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Icon name="CheckCircle" size={40} />
                      </div>
                      <h3 className="text-2xl font-bold text-ink mb-4">Quote Request Sent!</h3>
                      <p className="text-ink-soft mb-8 max-w-md mx-auto">
                        Thank you for reaching out. Our team has received your request and will contact you shortly with an estimate.
                      </p>
                      <Button onClick={() => window.location.reload()} variant="outline">
                        Submit Another Request
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Honeypot */}
                      <input 
                        type="text" 
                        name="bot_field" 
                        value={formState.bot_field} 
                        onChange={handleChange} 
                        className="hidden" 
                        tabIndex="-1" 
                        autoComplete="off" 
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label htmlFor="name" className="text-sm font-medium text-ink">Full Name *</label>
                          <input required type="text" id="name" name="name" value={formState.name} onChange={handleChange} className="w-full px-4 py-3 rounded-[var(--radius-card)] border border-line focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow bg-surface" placeholder="John Doe" />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="company" className="text-sm font-medium text-ink">Company / Organization</label>
                          <input type="text" id="company" name="company" value={formState.company} onChange={handleChange} className="w-full px-4 py-3 rounded-[var(--radius-card)] border border-line focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow bg-surface" placeholder="Your Company Ltd." />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label htmlFor="email" className="text-sm font-medium text-ink">Email Address *</label>
                          <input required type="email" id="email" name="email" value={formState.email} onChange={handleChange} className="w-full px-4 py-3 rounded-[var(--radius-card)] border border-line focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow bg-surface" placeholder="john@example.com" />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="phone" className="text-sm font-medium text-ink">Phone Number *</label>
                          <input required type="tel" id="phone" name="phone" value={formState.phone} onChange={handleChange} className="w-full px-4 py-3 rounded-[var(--radius-card)] border border-line focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow bg-surface" placeholder="+91 98765 43210" />
                        </div>
                      </div>

                      <div className="border-t border-line pt-6 mt-6">
                        <h4 className="text-lg font-bold text-ink mb-4">Project Details</h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div className="space-y-2">
                            <label htmlFor="serviceInterest" className="text-sm font-medium text-ink">Service Needed</label>
                            <select id="serviceInterest" name="serviceInterest" value={formState.serviceInterest} onChange={handleChange} className="w-full px-4 py-3 rounded-[var(--radius-card)] border border-line focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow bg-surface appearance-none">
                              <option value="">Select a service</option>
                              {services.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="productInterest" className="text-sm font-medium text-ink">Product Interest</label>
                            <select id="productInterest" name="productInterest" value={formState.productInterest} onChange={handleChange} className="w-full px-4 py-3 rounded-[var(--radius-card)] border border-line focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow bg-surface appearance-none">
                              <option value="">Select a product (optional)</option>
                              {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div className="space-y-2">
                            <label htmlFor="quantity" className="text-sm font-medium text-ink">Quantity</label>
                            <input type="text" id="quantity" name="quantity" value={formState.quantity} onChange={handleChange} className="w-full px-4 py-3 rounded-[var(--radius-card)] border border-line focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow bg-surface" placeholder="e.g. 1000 pcs" />
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="timeline" className="text-sm font-medium text-ink">Expected Timeline</label>
                            <select id="timeline" name="timeline" value={formState.timeline} onChange={handleChange} className="w-full px-4 py-3 rounded-[var(--radius-card)] border border-line focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow bg-surface appearance-none">
                              <option value="">Select timeline</option>
                              <option value="Urgent">Urgent (ASAP)</option>
                              <option value="1-2 weeks">1-2 weeks</option>
                              <option value="2-4 weeks">2-4 weeks</option>
                              <option value="1+ month">1+ month</option>
                              <option value="Flexible">Flexible</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div className="space-y-2">
                            <label htmlFor="dimensions" className="text-sm font-medium text-ink">Size / Dimensions</label>
                            <input type="text" id="dimensions" name="dimensions" value={formState.dimensions} onChange={handleChange} className="w-full px-4 py-3 rounded-[var(--radius-card)] border border-line focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow bg-surface" placeholder="e.g. A4, 8x10 inch" />
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="material" className="text-sm font-medium text-ink">Material Preference</label>
                            <input type="text" id="material" name="material" value={formState.material} onChange={handleChange} className="w-full px-4 py-3 rounded-[var(--radius-card)] border border-line focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow bg-surface" placeholder="e.g. Glossy paper, Acrylic" />
                          </div>
                        </div>

                        <div className="space-y-2 mb-6">
                          <label htmlFor="message" className="text-sm font-medium text-ink">Additional Details *</label>
                          <textarea required id="message" name="message" value={formState.message} onChange={handleChange} rows={4} className="w-full px-4 py-3 rounded-[var(--radius-card)] border border-line focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow bg-surface resize-y" placeholder="Describe your project, finishing requirements, etc."></textarea>
                        </div>
                        
                        <div className="space-y-2 mb-6">
                          <label className="text-sm font-medium text-ink">Upload Reference File (Optional)</label>
                          <input type="file" className="w-full px-4 py-3 rounded-[var(--radius-card)] border border-line focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow bg-surface file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                          <p className="text-xs text-ink-soft mt-1">Max size 10MB. PDF, JPG, PNG only.</p>
                        </div>

                        <div className="space-y-2 mb-6 bg-gray-50 p-4 rounded-[var(--radius-card)]">
                          <label htmlFor="math" className="text-sm font-medium text-ink">Spam Protection: What is {mathChallenge.a} + {mathChallenge.b}? *</label>
                          <input 
                            required 
                            type="number" 
                            id="math" 
                            value={mathChallenge.answer} 
                            onChange={(e) => setMathChallenge(prev => ({ ...prev, answer: e.target.value }))} 
                            className="w-full md:w-32 px-4 py-2 rounded-[var(--radius-card)] border border-line focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow bg-white" 
                          />
                        </div>

                        {errorMsg && (
                          <div className="p-4 bg-red-50 text-red-700 text-sm rounded-[var(--radius-card)] mb-6 border border-red-100">
                            {errorMsg}
                          </div>
                        )}

                        <Button type="submit" variant="primary" size="lg" className="w-full justify-center" disabled={status === 'submitting'}>
                          {status === 'submitting' ? 'Submitting...' : 'Request Quote'}
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              </Reveal>
            </div>

            {/* Contact Info Column */}
            <div className="lg:col-span-4 space-y-6">
              <Reveal delay={0.2}>
                <div className="bg-white rounded-[var(--radius-lg)] border border-line shadow-sm p-6">
                  <h3 className="text-lg font-bold text-ink mb-6">Direct Contact</h3>
                  
                  <div className="space-y-6">
                    <a href={`https://wa.me/${company.contact.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-start group">
                      <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-4 group-hover:bg-green-600 group-hover:text-white transition-colors">
                        <Icon name="MessageCircle" size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-ink mb-1">WhatsApp</p>
                        <p className="text-sm text-ink-soft group-hover:text-green-600 transition-colors">{company.contact.whatsapp}</p>
                      </div>
                    </a>

                    <a href={`mailto:${company.contact.email}`} className="flex items-start group">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-4 group-hover:bg-primary group-hover:text-white transition-colors">
                        <Icon name="Mail" size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-ink mb-1">Email</p>
                        <p className="text-sm text-ink-soft group-hover:text-primary transition-colors">{company.contact.email}</p>
                      </div>
                    </a>

                    <a href={`tel:${company.contact.phone.primary.replace(/\D/g, '')}`} className="flex items-start group">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-4 group-hover:bg-primary group-hover:text-white transition-colors">
                        <Icon name="Phone" size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-ink mb-1">Call Us</p>
                        <p className="text-sm text-ink-soft group-hover:text-primary transition-colors">{company.contact.phone.primary}</p>
                      </div>
                    </a>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.3}>
                <div className="bg-surface rounded-[var(--radius-lg)] border border-line p-6">
                  <h3 className="text-lg font-bold text-ink mb-3">Office Hours</h3>
                  <div className="space-y-2 text-sm text-ink-soft">
                    <div className="flex justify-between">
                      <span>Mon - Sat</span>
                      <span className="font-medium text-ink">{company.businessHours.weekdays}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday</span>
                      <span className="font-medium text-ink">{company.businessHours.weekend}</span>
                    </div>
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
