import FitText from './FitText'

/**
 * Meridian — visiting card, 89 x 51 mm plus 3 mm bleed.
 * Every co-ordinate is in millimetres: the viewBox is the real artboard, so
 * one drawing serves both the on-screen preview and the print file.
 */
export default function CardMeridian({ v, theme, fonts, logo, side = 'front' }) {
  if (side === 'back') {
    return (
      <svg viewBox="0 0 95 57" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="95" height="57" fill={theme} />
        {logo ? (
          <image href={logo} x="33" y="16" width="29" height="12" preserveAspectRatio="xMidYMid meet" />
        ) : (
          <FitText
            maxWidth="75" x="47.5" y="27" textAnchor="middle" fontFamily={fonts.display} fontSize="6.2" fill="#ffffff"
          >
            {v.company}
          </FitText>
        )}
        <line x1="40" y1="32" x2="55" y2="32" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="0.3" />
        <FitText
          maxWidth="75" x="47.5" y="38" textAnchor="middle" fontFamily={fonts.body} fontSize="2.6"
          fill="#ffffff" fillOpacity="0.85"
        >
          {v.tagline}
        </FitText>
        <FitText
          maxWidth="70" x="47.5" y="45" textAnchor="middle" fontFamily={fonts.body} fontSize="2.4"
          fill="#ffffff" fillOpacity="0.7"
        >
          {v.website}
        </FitText>
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 95 57" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="95" height="57" fill="#ffffff" />
      <rect x="0" y="0" width="7" height="57" fill={theme} />

      {logo ? (
        <image href={logo} x="71" y="8" width="18" height="9" preserveAspectRatio="xMaxYMin meet" />
      ) : (
        <FitText maxWidth="40" x="89" y="14" textAnchor="end" fontFamily={fonts.display} fontSize="3.4" fill="#141A21">
          {v.company}
        </FitText>
      )}

      <FitText maxWidth="70" x="15" y="27" fontFamily={fonts.display} fontSize="6.4" fill="#141A21">
        {v.name}
      </FitText>
      <FitText maxWidth="70" x="15.3" y="32" fontFamily={fonts.body} fontSize="2.4" letterSpacing="0.35" fill={theme}>
        {String(v.role || '').toUpperCase()}
      </FitText>
      <line x1="15" y1="35.5" x2="44" y2="35.5" stroke="#DADEDC" strokeWidth="0.3" />

      <FitText maxWidth="45" x="15" y="40.2" fontFamily={fonts.body} fontSize="2.5" fill="#34403b">{v.phone}</FitText>
      <FitText maxWidth="45" x="15" y="44" fontFamily={fonts.body} fontSize="2.5" fill="#34403b">{v.email}</FitText>
      <FitText maxWidth="45" x="15" y="47.8" fontFamily={fonts.body} fontSize="2.5" fill="#34403b">{v.website}</FitText>
      <FitText maxWidth="27" x="89" y="47.8" textAnchor="end" fontFamily={fonts.body} fontSize="2.3" fill="#8b9491">
        {v.address}
      </FitText>
    </svg>
  )
}
