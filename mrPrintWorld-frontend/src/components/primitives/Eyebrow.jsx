/** Thin uppercase label with a gold tick — sits above section titles. */
export default function Eyebrow({ children, light = false, className = '' }) {
  return (
    <span
      className={`eyebrow inline-flex items-center gap-2.5 ${
        light ? 'text-white/70' : 'text-muted'
      } ${className}`}
    >
      <span className="h-px w-7 bg-accent" aria-hidden="true" />
      {children}
    </span>
  )
}
