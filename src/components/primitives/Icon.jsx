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

  // — Extended Services —
  laser: (
    <>
      <path d="M12 3v6" />
      <path d="M5.6 7.5 10 11" />
      <path d="M18.4 7.5 14 11" />
      <circle cx="12" cy="13" r="2.5" />
      <path d="M7 17.5h10" />
      <path d="M9 20.5h6" />
    </>
  ),
  cnc: (
    <>
      <path d="M4.5 4.5h15v15h-15z" />
      <path d="M4.5 9h15" />
      <path d="M9 9v10.5" />
      <path d="M12 12.5l3 3-3 3" />
    </>
  ),
  'uv-print': (
    <>
      <path d="M5 14a7 7 0 0 1 14 0" />
      <path d="M12 3v4" />
      <path d="M19.1 7 16.4 9" />
      <path d="M4.9 7l2.7 2" />
      <path d="M3 17h18" />
      <path d="M5 20h14" />
    </>
  ),
  'metal-mark': (
    <>
      <path d="M14.5 3.5 4.5 13.5l6 6 10-10z" />
      <path d="M3 20.5h7" />
      <path d="M11 9.5l4 4" />
    </>
  ),
  craft: (
    <>
      <path d="M9 3.5v17" />
      <path d="M15 3.5v17" />
      <path d="M3.5 9h17" />
      <path d="M3.5 15h17" />
    </>
  ),
  acrylic: (
    <>
      <path d="M4 6l8-2.5L20 6v10l-8 4.5L4 16z" />
      <path d="M4 6l8 4.5L20 6" />
      <path d="M12 10.5V20.5" />
    </>
  ),
  interior: (
    <>
      <path d="M3.5 20.5V10L12 4l8.5 6v10.5" />
      <path d="M8 20.5v-5h8v5" />
      <path d="M3.5 20.5h17" />
    </>
  ),
  offset: (
    <>
      <path d="M6 5h12v5H6z" />
      <path d="M4 10h16v4H4z" />
      <path d="M7 14h10v5H7z" />
      <circle cx="17" cy="12" r="1" />
    </>
  ),
  'flex-print': (
    <>
      <path d="M5 4h14v16H5z" />
      <path d="M5 8.5h14" />
      <path d="M5 13h14" />
      <path d="M5 17.5h14" />
    </>
  ),

  // — Process / workflow —
  'pen-tool': (
    <>
      <path d="M12 19.5 4.5 12 12 4.5 19.5 12z" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M12 2v2.5" />
      <path d="M12 19.5V22" />
    </>
  ),
  'shield-check': (
    <>
      <path d="M12 3.5 19 6v5.5c0 4.6-3.1 7.6-7 8.9-3.9-1.3-7-4.3-7-8.9V6z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  package: (
    <>
      <path d="M3.5 8l8.5 4.5L20.5 8 12 3.5z" />
      <path d="M3.5 8v8l8.5 4.5V12.5" />
      <path d="M20.5 8v8l-8.5 4.5V12.5" />
    </>
  ),

  // — Social —
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="17.5" cy="6.5" r="1" />
    </>
  ),
  facebook: (
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  ),
  linkedin: (
    <>
      <path d="M4.5 8.5v11M4.5 4.5v.01" />
      <path d="M9.5 19.5v-5.5c0-2 .7-3.5 3-3.5s2.5 1.5 2.5 3.5v5.5" />
      <path d="M9.5 8.5v11" />
      <rect x="3" y="3" width="18" height="18" rx="2" />
    </>
  ),

  // — Extended UI —
  star: (
    <path d="M12 3l2.5 5.2 5.7.8-4.1 4 1 5.7L12 16l-5.1 2.7 1-5.7-4.1-4 5.7-.8z" />
  ),
  faq: (
    <>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M9.5 9.5a2.5 2.5 0 0 1 5 0c0 1.5-2.5 2-2.5 3.5" />
      <path d="M12 16h.01" />
    </>
  ),
  document: (
    <>
      <path d="M6 3.5h8l4 4v13h-12z" />
      <path d="M14 3.5v4h4" />
      <path d="M9 11h6M9 14h6M9 17h3" />
    </>
  ),
  download: (
    <>
      <path d="M12 3v12" />
      <path d="M8 11l4 4 4-4" />
      <path d="M4 17v2h16v-2" />
    </>
  ),
  calendar: (
    <>
      <path d="M4 7.5h16v12H4z" />
      <path d="M8 4.5v3M16 4.5v3" />
      <path d="M4 11.5h16" />
    </>
  ),
  'file-upload': (
    <>
      <path d="M6 3.5h8l4 4v13h-12z" />
      <path d="M14 3.5v4h4" />
      <path d="M12 17v-6" />
      <path d="M9 14l3-3 3 3" />
    </>
  ),
  grid: (
    <>
      <path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" />
    </>
  ),
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M15.5 15.5 21 21" />
    </>
  ),
  filter: (
    <>
      <path d="M3 5h18M6 10h12M9 15h6M11 20h2" />
    </>
  ),
  briefcase: (
    <>
      <path d="M3 8.5h18v11H3z" />
      <path d="M8 8.5V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2.5" />
      <path d="M3 13h18" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5.5" />
      <circle cx="12" cy="12" r="2" />
    </>
  ),
  lightbulb: (
    <>
      <path d="M9 18h6" />
      <path d="M10 21h4" />
      <path d="M12 3a6 6 0 0 0-4 10.5V16h8v-2.5A6 6 0 0 0 12 3z" />
    </>
  ),
  handshake: (
    <>
      <path d="M3 11l4-4 4 2 5-5 5 4" />
      <path d="M7 11l5 5 5-5" />
      <path d="M9 18l3 3 3-3" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </>
  ),
  ruler: (
    <>
      <path d="M4 20 20 4" />
      <path d="M7.5 20l-.5-3M11 20l-.5-5M14.5 20l-.5-3" />
      <path d="M4 16.5l3-.5M4 13l5-.5M4 9.5l3-.5" />
    </>
  ),
  layers: (
    <>
      <path d="M12 3.5 3 8l9 4.5L21 8z" />
      <path d="M3 12l9 4.5L21 12" />
      <path d="M3 16l9 4.5L21 16" />
    </>
  ),
  palette: (
    <>
      <path d="M12 3a9 9 0 0 0 0 18 3 3 0 0 0 3-3v-1a2 2 0 0 1 2-2h1a3 3 0 0 0 3-3 9 9 0 0 0-9-9z" />
      <circle cx="7.5" cy="11.5" r="1" />
      <circle cx="10" cy="7.5" r="1" />
      <circle cx="15" cy="7.5" r="1" />
    </>
  ),
  award: (
    <>
      <circle cx="12" cy="9" r="5.5" />
      <path d="M8.5 13.5 7 21l5-2.5L17 21l-1.5-7.5" />
    </>
  ),
  'trending-up': (
    <>
      <path d="M3 17l5-5 4 4 9-9" />
      <path d="M16 7h5v5" />
    </>
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
