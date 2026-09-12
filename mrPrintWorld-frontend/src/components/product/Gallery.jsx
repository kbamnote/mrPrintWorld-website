import { useState } from 'react'
import Icon from '../primitives/Icon'

/**
 * Product photographs: one large, the rest as thumbnails beneath.
 *
 * Holds its own selection, so the product page stays a plain render and the
 * choice resets naturally when a different product mounts.
 */
export default function Gallery({ images = [], name }) {
  const [active, setActive] = useState(0)
  const shown = images[active] ?? images[0] ?? null

  return (
    <div>
      <div className="flex aspect-square items-center justify-center overflow-hidden rounded-[var(--radius-lg)] border border-line bg-white shadow-sm">
        {shown?.url ? (
          <img
            referrerPolicy="no-referrer"
            src={shown.url}
            alt={shown.alt ?? name}
            className="h-full w-full object-cover"
          />
        ) : (
          <Icon name="Image" size={64} className="text-gray-300" />
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-5 gap-3">
          {images.map((img, i) => (
            <button
              key={img.url}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Photograph ${i + 1} of ${images.length}`}
              aria-current={i === active}
              className={`aspect-square overflow-hidden rounded-[var(--radius-card)] border bg-white transition-colors ${
                i === active ? 'border-primary ring-2 ring-primary/30' : 'border-line hover:border-line-strong'
              }`}
            >
              <img
                referrerPolicy="no-referrer"
                src={img.url}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
