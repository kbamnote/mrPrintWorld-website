/**
 * Small shared primitives for the admin panel.
 *
 * These reuse the site's existing Tailwind theme tokens (--color-primary,
 * --radius-card, border-line …) rather than introducing a second design
 * system, so the admin looks like part of the same product and no token is
 * redefined for it.
 */

export function Field({ label, hint, error, required, children, className = '' }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-medium text-ink">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </span>
      {children}
      {hint && !error && <span className="mt-1 block text-xs text-ink-soft">{hint}</span>}
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  )
}

export const inputClass =
  'w-full rounded-[var(--radius-card)] border border-line bg-white px-3 py-2 text-sm text-ink ' +
  'transition-colors placeholder:text-muted/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30'

export function Input(props) {
  return <input {...props} className={`${inputClass} ${props.className ?? ''}`} />
}

export function Textarea(props) {
  return <textarea {...props} className={`${inputClass} resize-y ${props.className ?? ''}`} />
}

export function Select(props) {
  return <select {...props} className={`${inputClass} ${props.className ?? ''}`} />
}

export function Btn({ variant = 'primary', size = 'md', className = '', ...rest }) {
  const variants = {
    primary: 'bg-primary text-white hover:opacity-90',
    outline: 'border border-line bg-white text-ink hover:bg-gray-50',
    danger: 'border border-red-200 bg-red-50 text-red-700 hover:bg-red-100',
    ghost: 'text-ink-soft hover:bg-gray-100 hover:text-ink',
  }
  const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2 text-sm' }
  return (
    <button
      type="button"
      {...rest}
      className={`inline-flex items-center justify-center gap-2 rounded-[var(--radius-card)] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
    />
  )
}

export function Badge({ tone = 'neutral', children }) {
  const tones = {
    neutral: 'bg-gray-100 text-ink-soft',
    green: 'bg-green-50 text-green-700',
    amber: 'bg-amber-50 text-amber-700',
    red: 'bg-red-50 text-red-700',
    blue: 'bg-blue-50 text-blue-700',
  }
  return (
    <span className={`inline-flex items-center rounded px-2 py-0.5 text-[0.7rem] font-medium ${tones[tone]}`}>
      {children}
    </span>
  )
}

export function Card({ title, description, actions, children, className = '' }) {
  return (
    <section className={`rounded-[var(--radius-lg)] border border-line bg-white ${className}`}>
      {(title || actions) && (
        <header className="flex flex-wrap items-start justify-between gap-3 border-b border-line px-5 py-4">
          <div>
            {title && <h2 className="font-display text-base font-semibold text-ink">{title}</h2>}
            {description && <p className="mt-0.5 text-sm text-ink-soft">{description}</p>}
          </div>
          {actions && <div className="flex gap-2">{actions}</div>}
        </header>
      )}
      <div className="p-5">{children}</div>
    </section>
  )
}

/** Inline error banner — shows validation details from the API when present. */
export function ErrorBanner({ error, onDismiss }) {
  if (!error) return null
  return (
    <div className="mb-4 rounded-[var(--radius-card)] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium">{error.message}</p>
          {Array.isArray(error.details) && error.details.length > 0 && (
            <ul className="mt-1.5 list-disc pl-4 text-xs">
              {error.details.map((d, i) => (
                <li key={i}>
                  <code className="font-mono">{d.field}</code> — {d.message}
                </li>
              ))}
            </ul>
          )}
        </div>
        {onDismiss && (
          <button type="button" onClick={onDismiss} className="text-red-500 hover:text-red-700" aria-label="Dismiss">
            ×
          </button>
        )}
      </div>
    </div>
  )
}

export function EmptyState({ title, description, action }) {
  return (
    <div className="rounded-[var(--radius-card)] border border-dashed border-line bg-surface px-6 py-12 text-center">
      <h3 className="font-display text-base font-semibold text-ink">{title}</h3>
      {description && <p className="mx-auto mt-1 max-w-md text-sm text-ink-soft">{description}</p>}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  )
}

export function Spinner({ className = '' }) {
  return (
    <span
      className={`inline-block h-5 w-5 animate-spin rounded-full border-2 border-line border-t-primary motion-reduce:animate-none ${className}`}
      role="status"
      aria-label="Loading"
    />
  )
}
