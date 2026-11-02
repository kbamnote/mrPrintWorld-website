import Container from '../primitives/Container'

export default function SeoSpecs({ page }) {
  const { specs } = page

  return (
    <section className="py-20 bg-stone-50 text-stone-900 border-b border-stone-200">
      <Container wide>
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Technical Precision & Substrates</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mt-2">
            Engineered Substrates & Finishing Options
          </h2>
          <p className="text-stone-600 mt-4 leading-relaxed">
            {page.overview}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Substrates / Materials */}
          <div className="p-8 rounded-2xl bg-white border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xl mb-6">
              01
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-4">Supported Substrates</h3>
            <ul className="space-y-3 text-sm text-stone-600">
              {specs.materials.map((mat, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="text-primary mt-0.5 font-bold">&#10003;</span>
                  <span>{mat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Premium Finishes */}
          <div className="p-8 rounded-2xl bg-white border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-accent/20 text-amber-800 flex items-center justify-center font-bold text-xl mb-6">
              02
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-4">Finishing & Treatments</h3>
            <ul className="space-y-3 text-sm text-stone-600">
              {specs.finishes.map((fin, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="text-accent mt-0.5 font-bold">&#10003;</span>
                  <span>{fin}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Production Fleet */}
          <div className="p-8 rounded-2xl bg-white border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-stone-900 text-white flex items-center justify-center font-bold text-xl mb-6">
              03
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-4">In-House Production Machinery</h3>
            <ul className="space-y-3 text-sm text-stone-600">
              {specs.machines.map((mac, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="text-stone-900 mt-0.5 font-bold">&#10003;</span>
                  <span>{mac}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  )
}
