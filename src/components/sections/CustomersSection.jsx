import Section from '../primitives/Section'
import SectionHeading from '../primitives/SectionHeading'
import Reveal from '../primitives/Reveal'
import trustedCustomer from '../../assets/trustedCustomer.jpeg'

export default function CustomersSection() {
  return (
    <Section id="customers" tone="surface">
      <SectionHeading
        align="center"
        eyebrow="Trusted by"
        title="Our Valuable Customers"
        intro="From national brands to fast-growing regional businesses — a few of the names that trust MR Print World Pvt. Ltd. with their branding."
        className="mb-10"
      />
      <Reveal className="mx-auto max-w-5xl overflow-hidden rounded-[var(--radius-lg)] border border-line bg-white p-5 shadow-soft sm:p-8">
        <img
          src={trustedCustomer}
          alt="Customers who trust MR Print World Pvt. Ltd. — including Ambuja Cement, ACC, Lupin, Axis Bank, Suzuki, Swiggy, Whirlpool, Pidilite and Larsen & Toubro"
          loading="lazy"
          className="w-full"
        />
      </Reveal>
    </Section>
  )
}
