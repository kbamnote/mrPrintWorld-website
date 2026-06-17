/**
 * Custom line-icon set — drawn in-house on a 24px grid for a consistent,
 * non-generic look (brief §3 / §12). Stroke icons by default; a few glyphs
 * (whatsapp, spark, quote, health) are filled.
 */

const FILLED = new Set(['whatsapp', 'spark', 'quote', 'health'])

const ICONS = {
  // — UI —
  'arrow-right': (
    <>
      <path d="M4 12h15" />
      <path d="M13 6l6 6-6 6" />
    </>
  ),
  'arrow-up-right': (
    <>
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </>
  ),
  'chevron-down': <path d="m6 9 6 6 6-6" />,
  plus: (
    <>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </>
  ),
  minus: <path d="M5 12h14" />,
  check: <path d="m5 12.5 4.5 4.5L19 7" />,
  close: (
    <>
      <path d="M6 6 18 18" />
      <path d="M18 6 6 18" />
    </>
  ),
  menu: (
    <>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </>
  ),
  phone: (
    <path d="M6.6 3.5h3l1.5 3.8-1.9 1.4a11 11 0 0 0 5 5l1.4-1.9 3.8 1.5v3a2 2 0 0 1-2.1 2A16.2 16.2 0 0 1 4.6 5.6 2 2 0 0 1 6.6 3.5z" />
  ),
  mail: (
    <>
      <path d="M3.5 6.5h17v11h-17z" />
      <path d="m4 7 8 6 8-6" />
    </>
  ),
  'map-pin': (
    <>
      <path d="M12 21s6.5-6 6.5-10.5a6.5 6.5 0 1 0-13 0C5.5 15 12 21 12 21z" />
      <circle cx="12" cy="10.5" r="2.4" />
    </>
  ),
  quote: (
    <path d="M9.4 6.6C6.8 7.4 5 9.7 5 12.8c0 2.5 1.5 4.2 3.6 4.2 1.8 0 3-1.3 3-3 0-1.7-1.1-2.9-2.7-2.9h-.8c.3-1.4 1.5-2.6 3.1-3.1L9.4 6.6zM18.4 6.6c-2.6.8-4.4 3.1-4.4 6.2 0 2.5 1.5 4.2 3.6 4.2 1.8 0 3-1.3 3-3 0-1.7-1.1-2.9-2.7-2.9h-.8c.3-1.4 1.5-2.6 3.1-3.1l-1.8-1.4z" />
  ),
  whatsapp: (
    <>
      <path d="M17.5 14.4c-.3-.15-1.7-.83-2-.93-.26-.1-.45-.15-.64.15-.19.28-.73.92-.9 1.1-.16.2-.33.22-.62.08a8.2 8.2 0 0 1-2.4-1.49 9 9 0 0 1-1.67-2.06c-.17-.3 0-.45.13-.6.13-.13.29-.34.43-.5.15-.18.2-.3.3-.5.09-.2.04-.37-.02-.52-.07-.15-.64-1.56-.88-2.13-.23-.55-.46-.48-.64-.49h-.55c-.19 0-.5.07-.76.36-.27.28-1 .98-1 2.4 0 1.4 1.03 2.76 1.17 2.95.15.2 2.03 3.1 4.92 4.35.69.3 1.22.47 1.64.6.69.23 1.31.2 1.8.12.56-.08 1.7-.69 1.94-1.36.24-.66.24-1.23.17-1.35-.07-.12-.26-.19-.55-.34z" />
      <path d="M12 2.2A9.8 9.8 0 0 0 3.6 17l-1.4 5.1 5.2-1.37A9.8 9.8 0 1 0 12 2.2zm0 17.85a8 8 0 0 1-4.08-1.12l-.3-.17-3 .8.8-2.93-.19-.3A8.05 8.05 0 1 1 12 20.05z" />
    </>
  ),

  // — Services —
  printing: (
    <>
      <path d="M7 9V4h10v5" />
      <path d="M5 9h14v7H5z" />
      <path d="M8 13h8v6H8z" />
      <path d="M16 11.5h1" />
    </>
  ),
  signage: (
    <>
      <path d="M4 5h16v8H4z" />
      <path d="M7 8.5h10" />
      <path d="M7 10.8h6" />
      <path d="M8.5 13v5" />
      <path d="M15.5 13v5" />
      <path d="M6.5 18h11" />
    </>
  ),
  gift: (
    <>
      <path d="M3.5 8h17v4h-17z" />
      <path d="M5.5 12h13v8h-13z" />
      <path d="M12 8v12" />
      <path d="M12 8C10.8 8 9 7.4 9 5.9 9 5 9.7 4.4 10.5 4.6 11.7 5 12 8 12 8z" />
      <path d="M12 8c1.2 0 3-.6 3-2.1 0-.9-.7-1.5-1.5-1.3C12.3 5 12 8 12 8z" />
    </>
  ),
  fabrication: (
    <>
      <path d="M12 3.8 18 7.3v6.9L12 17.7 6 14.2V7.3z" />
      <circle cx="12" cy="10.7" r="2.6" />
    </>
  ),
  event: (
    <>
      <path d="M12 4 3 19h18z" />
      <path d="M12 4v15" />
      <path d="m8.5 19 3.5-5 3.5 5" />
    </>
  ),

  // — Capabilities —
  shield: (
    <>
      <path d="M12 3.5 19 6v5.5c0 4.6-3.1 7.6-7 8.9-3.9-1.3-7-4.3-7-8.9V6z" />
      <path d="m9 11.7 2.2 2.2L15 10" />
    </>
  ),
  cog: (
    <>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 2.5v2.6M12 18.9v2.6M21.5 12h-2.6M5.1 12H2.5M18.7 5.3l-1.8 1.8M7.1 16.9l-1.8 1.8M18.7 18.7l-1.8-1.8M7.1 7.1 5.3 5.3" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 19.5c0-3.3 2.5-5.3 5.5-5.3s5.5 2 5.5 5.3" />
      <path d="M16 5.2a3.2 3.2 0 0 1 0 6.1" />
      <path d="M17.6 14.6c2 .7 3.4 2.4 3.4 4.9" />
    </>
  ),
  clipboard: (
    <>
      <path d="M6 5.6h12v13.9H6z" />
      <path d="M9 4.4h6v2.4H9z" />
      <path d="M9 11h6M9 14.5h6" />
    </>
  ),
  truck: (
    <>
      <path d="M3 7.5h11v8H3z" />
      <path d="M14 10.5h4l3 3v2h-7z" />
      <circle cx="7" cy="17" r="1.7" />
      <circle cx="17.5" cy="17" r="1.7" />
    </>
  ),
  sliders: (
    <>
      <path d="M4 8h8M16 8h4" />
      <circle cx="14" cy="8" r="2" />
      <path d="M4 16h4M12 16h8" />
      <circle cx="10" cy="16" r="2" />
    </>
  ),
  bolt: <path d="M13 2.5 5.5 13H11l-1.5 8.5L18 10h-5.5z" />,
  spark: (
    <path d="M12 2.5l1.8 6.4 6.4 1.8-6.4 1.8L12 18.9l-1.8-6.4L3.8 10.7l6.4-1.8z" />
  ),

  // — Industries —
  retail: (
    <>
      <path d="M6 8h12l-1 11.5H7z" />
      <path d="M9 8V6.2a3 3 0 0 1 6 0V8" />
    </>
  ),
  health: <path d="M10 3.2h4v6.8h6.8v4H14v6.8h-4V14H3.2v-4H10z" />,
  education: (
    <>
      <path d="M2.5 9 12 5l9.5 4-9.5 4z" />
      <path d="M6.5 11v4.2c0 1.2 2.6 2.3 5.5 2.3s5.5-1.1 5.5-2.3V11" />
      <path d="M21.5 9.2v4.3" />
    </>
  ),
  factory: (
    <>
      <path d="M3 20.5V11l5 3.2V11l5 3.2V8.5h6v12z" />
      <path d="M3 20.5h18" />
    </>
  ),
  hospitality: (
    <>
      <path d="M4.5 16a7.5 7.5 0 0 1 15 0z" />
      <path d="M3 16h18" />
      <path d="M12 5.5v2.6" />
    </>
  ),
  building: (
    <>
      <path d="M5 20.5V5.5h9v15" />
      <path d="M14 20.5V10h5v10.5" />
      <path d="M8 9h.01M11 9h.01M8 12.5h.01M11 12.5h.01M8 16h.01M11 16h.01" />
      <path d="M3.5 20.5h17" />
    </>
  ),
  government: (
    <>
      <path d="m3.5 9.5 8.5-5 8.5 5z" />
      <path d="M5 9.5v8M9 9.5v8M15 9.5v8M19 9.5v8" />
      <path d="M3.5 17.5h17M4.5 20.5h15" />
    </>
  ),
  realestate: (
    <>
      <path d="m4 11 8-6 8 6" />
      <path d="M6 9.8V19.5h12V9.8" />
      <path d="M10 19.5V14h4v5.5" />
    </>
  ),
}

export default function Icon({ name, size = 24, strokeWidth = 1.5, className = '', title }) {
  const glyph = ICONS[name]
  if (!glyph) return null
  const filled = FILLED.has(name)
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? 'img' : 'presentation'}
      aria-hidden={title ? undefined : 'true'}
      aria-label={title}
    >
      {title ? <title>{title}</title> : null}
      {glyph}
    </svg>
  )
}
