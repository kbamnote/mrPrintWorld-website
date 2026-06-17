import { Link } from 'react-router-dom'
import logo from '../../assets/logo.png'

/**
 * Company logo. The artwork is built for light backgrounds, so over dark
 * contexts (transparent hero navbar, dark footer) we sit it on a white plate
 * via `light` so it always reads.
 */
export default function Logo({ light = false, className = '' }) {
  return (
    <Link
      to="/"
      aria-label="MR Print World — home"
      className={`inline-flex items-center ${className}`}
    >
      <img
        src={logo}
        alt="MR Print World"
        width={615}
        height={110}
        className={`h-9 w-auto md:h-10 ${
          light ? 'rounded-md bg-white p-1.5 shadow-sm' : ''
        }`}
      />
    </Link>
  )
}
