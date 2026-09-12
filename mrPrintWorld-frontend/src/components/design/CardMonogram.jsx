import FitText from './FitText'

/** Monogram — visiting card, 89 x 51 mm plus 3 mm bleed. An initial in a ring. */
function initial(name) {
  return String(name || '').trim().charAt(0).toUpperCase() || 'A'
}

export default function CardMonogram({ v, theme, fonts, logo, side = 'front' }) {
  if (side === 'back') {
    return (
      <svg viewBox="0 0 95 57" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="95" height="57" fill={theme} />
        <text
          x="47.5" y="46" textAnchor="middle" fontFamily={fonts.display} fontSize="34"
          fill="#ffffff" fillOpacity="0.14"
        >
          {initial(v.name)}
        </text>
        {logo ? (
          <image href={logo} x="35" y="15" width="25" height="10" preserveAspectRatio="xMidYMid meet" />
        ) : (
          <FitText maxWidth="70" x="47.5" y="25" textAnchor="middle" fontFamily={fonts.display} fontSize="5.4" fill="#ffffff">
            {v.company}
          </FitText>
        )}
        <FitText
          maxWidth="70" x="47.5" y="32" textAnchor="middle" fontFamily={fonts.body} fontSize="2.5"
          fill="#ffffff" fillOpacity="0.85"
        >
          {v.tagline}
        </FitText>
        <FitText
          maxWidth="70" x="47.5" y="41" textAnchor="middle" fontFamily={fonts.body} fontSize="2.5"
          fill="#ffffff" fillOpacity="0.9"
        >
          {v.phone}
        </FitText>
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 95 57" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="95" height="57" fill="#ffffff" />
      <circle cx="24" cy="28.5" r="12" fill="none" stroke={theme} strokeWidth="0.9" />
      <text x="24" y="33.2" textAnchor="middle" fontFamily={fonts.display} fontSize="12" fill={theme}>
        {initial(v.name)}
      </text>

      <FitText maxWidth="46" x="42" y="26" fontFamily={fonts.display} fontSize="5.6" fill="#141A21">{v.name}</FitText>
      <FitText maxWidth="46" x="42.2" y="31" fontFamily={fonts.body} fontSize="2.4" letterSpacing="0.3" fill={theme}>
        {String(v.role || '').toUpperCase()}
      </FitText>

      <FitText maxWidth="46" x="42" y="38.4" fontFamily={fonts.body} fontSize="2.5" fill="#34403b">{v.phone}</FitText>
      <FitText maxWidth="46" x="42" y="42.2" fontFamily={fonts.body} fontSize="2.5" fill="#34403b">{v.email}</FitText>
      <FitText maxWidth="46" x="42" y="46" fontFamily={fonts.body} fontSize="2.5" fill="#34403b">{v.website}</FitText>

      {logo && <image href={logo} x="6" y="47" width="16" height="6" preserveAspectRatio="xMinYMax meet" />}
    </svg>
  )
}
