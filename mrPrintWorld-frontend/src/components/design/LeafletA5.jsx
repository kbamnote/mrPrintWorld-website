/** Offer A5 — leaflet, 148 x 210 mm plus 3 mm bleed. Photo, offer badge, three points. */
export default function LeafletA5({ v, theme, fonts, logo, photo }) {
  const points = [v.point1, v.point2, v.point3].filter(Boolean)

  return (
    <svg viewBox="0 0 154 216" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="154" height="216" fill="#ffffff" />

      {/* Photograph, full bleed across the top */}
      <clipPath id="a5-photo">
        <rect x="0" y="0" width="154" height="88" />
      </clipPath>
      {photo ? (
        <image
          href={photo} x="0" y="0" width="154" height="88"
          preserveAspectRatio="xMidYMid slice" clipPath="url(#a5-photo)"
        />
      ) : (
        <g clipPath="url(#a5-photo)">
          <rect x="0" y="0" width="154" height="88" fill={theme} fillOpacity="0.12" />
          <circle cx="40" cy="30" r="26" fill={theme} fillOpacity="0.1" />
          <text x="77" y="48" textAnchor="middle" fontFamily={fonts.body} fontSize="4" fill={theme} fillOpacity="0.75">
            Your photograph here
          </text>
        </g>
      )}
      <rect x="0" y="88" width="154" height="3.5" fill={theme} />

      {/* Offer badge */}
      <circle cx="122" cy="62" r="20" fill={theme} />
      <text x="122" y="65" textAnchor="middle" fontFamily={fonts.display} fontSize="7.5" fill="#ffffff">
        {v.offer}
      </text>

      <text x="12" y="112" fontFamily={fonts.display} fontSize="13" fill="#141A21">{v.headline}</text>
      <text x="12" y="123" fontFamily={fonts.body} fontSize="4.4" fill="#34403b">{v.subhead}</text>

      {points.map((point, i) => (
        <g key={i}>
          <rect x="12" y={139 + i * 13} width="3.4" height="3.4" fill={theme} />
          <text x="19.5" y={142.6 + i * 13} fontFamily={fonts.body} fontSize="4.3" fill="#141A21">
            {point}
          </text>
        </g>
      ))}

      <line x1="12" y1="176" x2="142" y2="176" stroke="#E3E7E5" strokeWidth="0.4" />

      {/* Contact bar, full bleed at the foot */}
      <rect x="0" y="182" width="154" height="34" fill={theme} />
      {logo ? (
        <image href={logo} x="108" y="188" width="34" height="14" preserveAspectRatio="xMaxYMid meet" />
      ) : null}
      <text x="12" y="197" fontFamily={fonts.display} fontSize="7" fill="#ffffff">{v.company}</text>
      <text x="12" y="206" fontFamily={fonts.body} fontSize="4" fill="#ffffff" fillOpacity="0.9">
        {v.phone}
      </text>
      <text x="142" y="206" textAnchor="end" fontFamily={fonts.body} fontSize="4" fill="#ffffff" fillOpacity="0.9">
        {v.website}
      </text>
    </svg>
  )
}
