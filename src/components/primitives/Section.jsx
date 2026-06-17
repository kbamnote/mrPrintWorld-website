const TONES = {
  default: 'bg-white text-ink-soft',
  surface: 'bg-surface text-ink-soft',
  dark: 'bg-dark text-white/80',
}

/** Standard section shell: vertical rhythm + tone + optional content column. */
export default function Section({
  id,
  tone = 'default',
  className = '',
  container = true,
  wide = false,
  children,
}) {
  return (
    <section id={id} className={`section-y ${TONES[tone]} ${className}`}>
      {container ? (
        <div className={wide ? 'container-wide' : 'container-page'}>{children}</div>
      ) : (
        children
      )}
    </section>
  )
}
