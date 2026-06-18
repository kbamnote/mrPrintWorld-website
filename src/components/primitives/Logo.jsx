import { Link } from 'react-router-dom'
import logo from '../../assets/logo.png'
import logoWhite from '../../assets/logoWhite.png'

/**
 * Company logo. Over dark contexts (transparent hero navbar, dark footer) it uses
 * the white version so it reads cleanly without a backing plate; on light
 * surfaces it uses the full-colour logo.
 */
export default function Logo({ light = false, className = '' }) {
  return (
    <Link
      to="/"
      aria-label="MR Print World Pvt. Ltd. — home"
      className={`inline-flex items-center ${className}`}
    >
      <img
        src={light ? logoWhite : logo}
        alt="MR Print World Pvt. Ltd."
        className="h-9 w-auto md:h-10"
      />
    </Link>
  )
}
