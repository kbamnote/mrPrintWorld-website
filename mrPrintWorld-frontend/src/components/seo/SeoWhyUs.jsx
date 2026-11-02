import Container from '../primitives/Container'

export default function SeoWhyUs({ page }) {
  const { whyChoose } = page

  return (
    <section className="py-20 bg-stone-900 text-white">
      <Container wide>
        <div className="max-w-3xl mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">The MRPRINT WORLD Advantage</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mt-2">
            Why Nagpur Enterprises Trust MRPRINT WORLD
          </h2>
          <p className="text-stone-300 mt-3 text-base font-light">
            We operate one of Vidarbha's most comprehensive brand-execution factories, eliminating brokers and delivering true manufacturer guarantees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyChoose.map((item, i) => (
            <div key={i} className="p-6 rounded-2xl bg-white/[0.05] border border-white/10 hover:border-white/20 transition-all">
              <div className="w-10 h-10 rounded-xl bg-primary/20 text-emerald-400 flex items-center justify-center font-bold mb-4">
                &bull;
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-stone-300 leading-relaxed font-light">{item.desc}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
