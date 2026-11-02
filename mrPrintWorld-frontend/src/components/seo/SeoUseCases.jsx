import Container from '../primitives/Container'

export default function SeoUseCases({ page }) {
  const { useCases } = page

  return (
    <section className="py-20 bg-white text-stone-900 border-b border-stone-200">
      <Container wide>
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Applications & Markets</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mt-2">
            Commercial Use Cases in {page.targetLocation}
          </h2>
          <p className="text-stone-600 mt-3 text-sm md:text-base">
            Engineered to deliver high visual impact, brand consistency, and durability for demanding business environments.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {useCases.map((uc, i) => (
            <div key={i} className="p-6 rounded-2xl bg-stone-50 border border-stone-200 hover:border-primary/40 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold mb-4">
                {`0${i + 1}`}
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-2">{uc.title}</h3>
              <p className="text-sm text-stone-600 leading-relaxed">{uc.desc}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
