import { useSeo } from '../lib/seo'
import HeroSection from '../components/sections/HeroSection'
import AboutSection from '../components/sections/AboutSection'
import ServicesSection from '../components/sections/ServicesSection'
import WorkMarqueeSection from '../components/sections/WorkMarqueeSection'
import WhyChooseSection from '../components/sections/WhyChooseSection'
import CapabilitiesSection from '../components/sections/CapabilitiesSection'
import ProductsPreviewSection from '../components/sections/ProductsPreviewSection'
import PortfolioSection from '../components/sections/PortfolioSection'
import ProcessSection from '../components/sections/ProcessSection'
import MissionVisionSection from '../components/sections/MissionVisionSection'
import IndustriesSection from '../components/sections/IndustriesSection'
import TestimonialsSection from '../components/sections/TestimonialsSection'
import CustomersSection from '../components/sections/CustomersSection'
import FaqSection from '../components/sections/FaqSection'
import ContactSection from '../components/sections/ContactSection'
import CustomSolutionsSection from '../components/sections/CustomSolutionsSection'
import BrandJourney from '../components/journey/BrandJourney'

export default function Home() {
  useSeo({
    title:
      'MRPrint World Pvt. Ltd. — Printing, Signage & Branding Execution Partner | Nagpur',
    description:
      'A complete brand-execution partner in Nagpur — premium printing, signage, fabrication, corporate gifting and large-scale event branding, end-to-end under one roof.',
    path: '/',
  })

  return (
    <>
      <HeroSection />
      {/* Persistent scroll-driven 3D object that travels from About → Contact */}
      <BrandJourney />
      <AboutSection />
      <ServicesSection />
      <WorkMarqueeSection />
      <WhyChooseSection />
      <CapabilitiesSection />
      <ProductsPreviewSection />
      <PortfolioSection />
      <ProcessSection />
      <MissionVisionSection />
      <IndustriesSection />
      <TestimonialsSection />
      <CustomersSection />
      <FaqSection />
      <ContactSection />
      <CustomSolutionsSection />
    </>
  )
}
