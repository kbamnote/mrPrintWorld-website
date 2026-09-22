import { Link } from 'react-router-dom'
import logo from '../../assets/logo-green.webp'
import logoStill from '../../assets/logo-green-still.webp'
import logoWhite from '../../assets/logo-white.webp'
import logoWhiteStill from '../../assets/logo-white-still.webp'

/**
 * Company logo, animated. Over dark contexts (transparent hero navbar, dark
 * footer) it uses the white version so it reads cleanly without a backing
 * plate; on light surfaces it uses the green one.
 *
 * The animation is an animated WebP made from the designer's GIFs
 * (assets/Logo_green.gif, Logo_white.gif — kept as the source, not shipped):
 * the same 49 frames at the size the header needs, about 180 KB instead of
 * 1.5 MB. Visitors who ask their device for reduced motion get a still.
 */
export default function Logo({ light = false, className = '' }) {
  return (
    <Link
      to="/"
      aria-label="MRPrint World Pvt. Ltd. — home"
      className={`inline-flex items-center ${className}`}
    >
      <picture>
        <source media="(prefers-reduced-motion: reduce)" srcSet={light ? logoWhiteStill : logoStill} />
        <img
          src={light ? logoWhite : logo}
          alt="MRPrint World Pvt. Ltd."
          width={686}
          height={150}
          className="h-9 w-auto md:h-10"
        />
      </picture>
    </Link>
  )
}
