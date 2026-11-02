import { useState } from 'react'
import Container from '../primitives/Container'

export default function SeoFaq({ faqs, serviceName, targetLocation }) {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section className="py-20 bg-white text-stone-900 border-b border-stone-200">
      <Container wide>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Frequently Asked Questions</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mt-2">
              Common Questions About {serviceName} in {targetLocation}
            </h2>
            <p className="text-stone-600 mt-3 text-sm md:text-base">
              Transparent answers regarding production timelines, technical file specs, and delivery logistics.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => {
              const isOpen = openIndex === i
              return (
                <div
                  key={i}
                  className="rounded-xl border border-stone-200 overflow-hidden bg-stone-50/50 transition-colors"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? -1 : i)}
                    className="w-full text-left px-6 py-4.5 flex items-center justify-between gap-4 font-semibold text-stone-900 hover:text-primary transition-colors"
                    aria-expanded={isOpen}
                  >
                    <span className="text-base">{faq.question}</span>
                    <span className={`text-xl font-bold transition-transform duration-200 text-stone-400 ${isOpen ? 'rotate-45' : ''}`}>
                      +
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-sm text-stone-600 leading-relaxed border-t border-stone-100">
                      {faq.answer}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </Container>
    </section>
  )
}
