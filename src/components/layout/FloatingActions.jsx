import { company, whatsappLink } from '../../data/company'
import Icon from '../primitives/Icon'

/** Persistent, single-tap WhatsApp + click-to-call (brief §13). */
export default function FloatingActions() {
  return (
    <div className="fixed bottom-5 right-4 z-40 flex flex-col gap-3 sm:bottom-6 sm:right-6">
      <a
        href={whatsappLink()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with MR Print World Pvt. Ltd. on WhatsApp"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_-8px_rgba(37,211,102,0.6)] transition-transform duration-300 hover:scale-105 focus-visible:scale-105"
      >
        <Icon name="whatsapp" size={28} />
      </a>
      <a
        href={company.phoneHref}
        aria-label="Call MR Print World Pvt. Ltd."
        className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-float transition-transform duration-300 hover:scale-105 focus-visible:scale-105"
      >
        <Icon name="phone" size={24} />
      </a>
    </div>
  )
}
