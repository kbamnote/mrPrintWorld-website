import { useParams } from 'react-router-dom'
import { useSeo } from '../lib/seo'
import { useActiveStore } from '../lib/useActiveStore'
import Container from '../components/primitives/Container'
import Catalogue from '../components/product/Catalogue'

/**
 * A reseller's store: /store/:code. The whole catalogue, under the
 * reseller's name, and nothing else. Every product link stays inside the
 * store, so the code never drops out of the address bar.
 */
export default function StoreHome() {
  const { code } = useParams()
  const { store } = useActiveStore()
  const storeCode = store?.code ?? String(code).toUpperCase()
  const name = store?.storeName

  useSeo({
    title: `${name ?? 'Online store'} | MRPrint World`,
    description: `Order printing, signage and branding online from ${name ?? 'this store'}.`,
    path: `/store/${storeCode}`,
    // A store repeats the main catalogue under another name — not for search.
    robots: 'noindex, follow',
  })

  return (
    <>
      <section className="border-b border-line bg-white">
        <Container>
          <div className="py-8 md:py-10">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">Online store</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-ink md:text-4xl">{name ?? 'Loading…'}</h1>
            <p className="mt-2 max-w-2xl text-ink-soft">
              Choose a product, see your price and order online. Every order is printed and delivered by
              MRPrint World.
            </p>
          </div>
        </Container>
      </section>
      <Catalogue productHref={(slug) => `/store/${storeCode}/products/${slug}`} showContact={false} />
    </>
  )
}
