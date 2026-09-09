import { Link } from 'react-router-dom'
import Icon from './Icon'

const VARIANTS = {
  primary: 'bg-primary text-white hover:bg-primary-700 shadow-soft hover:shadow-float',
  gold: 'bg-accent text-ink hover:brightness-[0.96]',
  outline: 'border border-ink/15 text-ink hover:border-ink/40 hover:bg-ink/[0.03]',
  'outline-light': 'border border-white/25 text-white hover:border-white/60 hover:bg-white/[0.06]',
  ghost: 'text-ink hover:text-primary',
}

const SIZES = {
  md: 'px-5 py-3 text-[0.95rem]',
  lg: 'px-7 py-4 text-base',
}

/**
 * Polymorphic button: renders a router <Link> (to), an <a> (href) or a <button>.
 * `iconName` appends a custom icon that nudges on hover.
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  to,
  href,
  iconName,
  className = '',
  children,
  ...rest
}) {
  const cls = `group inline-flex items-center justify-center gap-2 rounded-[var(--radius-card)] font-medium tracking-tight transition-all duration-300 ease-[var(--ease-out-soft)] disabled:opacity-50 disabled:pointer-events-none ${VARIANTS[variant]} ${SIZES[size]} ${className}`

  const inner = (
    <>
      {children}
      {iconName && (
        <Icon
          name={iconName}
          size={18}
          className="transition-transform duration-300 group-hover:translate-x-0.5"
        />
      )}
    </>
  )

  if (to)
    return (
      <Link to={to} className={cls} {...rest}>
        {inner}
      </Link>
    )
  if (href)
    return (
      <a href={href} className={cls} {...rest}>
        {inner}
      </a>
    )
  return (
    <button className={cls} {...rest}>
      {inner}
    </button>
  )
}
