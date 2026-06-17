import Eyebrow from './Eyebrow'

export default function SectionHeading({
  eyebrow,
  title,
  intro,
  align = 'left',
  light = false,
  as: Tag = 'h2',
  className = '',
}) {
  return (
    <div
      className={`${align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'} ${className}`}
    >
      {eyebrow && (
        <Eyebrow light={light} className="mb-5">
          {eyebrow}
        </Eyebrow>
      )}
      <Tag className={`text-display ${light ? 'text-white' : 'text-ink'}`}>{title}</Tag>
      {intro && (
        <p
          className={`mt-5 text-lg leading-relaxed ${light ? 'text-white/70' : 'text-muted'}`}
        >
          {intro}
        </p>
      )}
    </div>
  )
}
