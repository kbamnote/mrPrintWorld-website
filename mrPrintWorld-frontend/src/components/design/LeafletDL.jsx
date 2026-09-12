/** Services DL — leaflet, 99 x 210 mm plus 3 mm bleed. A rate card, one line per service. */
export default function LeafletDL({ v, theme, fonts, logo }) {
  const rows = [
    { item: v.item1, price: v.price1 },
    { item: v.item2, price: v.price2 },
    { item: v.item3, price: v.price3 },
  ].filter((r) => r.item)

  return (
    <svg viewBox="0 0 105 216" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="105" height="216" fill="#ffffff" />

      {/* Header, full bleed */}
      <rect x="0" y="0" width="105" height="62" fill={theme} />
      {logo ? (
        <image href={logo} x="10" y="16" width="40" height="14" preserveAspectRatio="xMinYMid meet" />
      ) : (
        <text x="10" y="31" fontFamily={fonts.display} fontSize="7.5" fill="#ffffff">{v.company}</text>
      )}
      <text x="10" y="41" fontFamily={fonts.body} fontSize="3.4" fill="#ffffff" fillOpacity="0.85">
        {v.tagline}
      </text>

      <text x="10" y="86" fontFamily={fonts.display} fontSize="9" fill="#141A21">{v.headline}</text>
      <text x="10" y="96" fontFamily={fonts.body} fontSize="3.6" fill="#34403b">{v.subhead}</text>

      {rows.map((row, i) => (
        <g key={i}>
          <text x="10" y={116 + i * 18} fontFamily={fonts.body} fontSize="4" fill="#141A21">{row.item}</text>
          <text
            x="95" y={116 + i * 18} textAnchor="end" fontFamily={fonts.display} fontSize="4.6" fill={theme}
          >
            {row.price}
          </text>
          <line
            x1="10" y1={120.5 + i * 18} x2="95" y2={120.5 + i * 18}
            stroke="#E3E7E5" strokeWidth="0.3" strokeDasharray="0.8 1.4"
          />
        </g>
      ))}

      {/* Contact block */}
      <rect x="0" y="176" width="105" height="40" fill="#F5F7F6" />
      <rect x="0" y="176" width="105" height="1.6" fill={theme} />
      <text x="10" y="190" fontFamily={fonts.display} fontSize="5.4" fill="#141A21">{v.phone}</text>
      <text x="10" y="199" fontFamily={fonts.body} fontSize="3.6" fill={theme}>{v.website}</text>
      <text x="10" y="207" fontFamily={fonts.body} fontSize="3.2" fill="#8b9491">{v.address}</text>
    </svg>
  )
}
