import { useSeo, breadcrumbLd } from '../lib/seo'
import PageHeader from '../components/layout/PageHeader'
import Catalogue from '../components/product/Catalogue'

export default function Products() {
  useSeo({
    title: 'Products | MRPrint World',
    description: 'Explore our high-quality printing products. Built to your specification.',
    path: '/products',
    schema: [
      breadcrumbLd([
        { name: 'Home', url: '/' },
        { name: 'Products', url: '/products' },
      ]),
    ],
  })

  return (
    <>
      <PageHeader
        eyebrow="Our Products"
        title="Quality products, built to your specification."
        description="Browse our comprehensive range of printing products designed to meet your specific needs."
      />
      <Catalogue />
    </>
  )
}
