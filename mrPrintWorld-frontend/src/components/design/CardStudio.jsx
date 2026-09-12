import FitText from './FitText'

/** Studio — visiting card, 89 x 51 mm plus 3 mm bleed. Colour band, two columns. */
export default function CardStudio({ v, theme, fonts, logo, side = 'front' }) {
  if (side === 'back') {
    return (
      <svg viewBox="0 0 95 57" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="95" height="57" fill="#ffffff" />
        <rect x="0" y="0" width="95" height="2.5" fill={theme} />
        <rect x="0" y="54.5" width="95" height="2.5" fill={theme} />
        {logo ? (
          <image href={logo} x="33" y="17" width="29" height="11" preserveAspectRatio="xMidYMid meet" />
        ) : (
          <FitText maxWidth="75" x="47.5" y="26" textAnchor="middle" fontFamily={fonts.display} fontSize="5.4" fill={theme}>
            {v.company}
          </FitText>
        )}
        <FitText maxWidth="75" x="47.5" y="33" textAnchor="middle" fontFamily={fonts.body} fontSize="2.6" fill="#34403b">
          {v.tagline}
        </FitText>
        <FitText maxWidth="70" x="47.5" y="42" textAnchor="middle" fontFamily={fonts.body} fontSize="2.8" fill="#141A21">
          {v.phone}
        </FitText>
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 95 57" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="95" height="57" fill="#ffffff" />
      <rect x="0" y="0" width="95" height="17" fill={theme} />
      {logo ? (
        <image href={logo} x="6" y="4" width="24" height="9" preserveAspectRatio="xMinYMid meet" />
      ) : (
        <FitText maxWidth="46" x="6" y="11.6" fontFamily={fonts.display} fontSize="4.6" fill="#ffffff">
          {v.company}
        </FitText>
      )}
      <FitText
        maxWidth="32" x="89" y="11.4" textAnchor="end" fontFamily={fonts.body} fontSize="2.3" letterSpacing="0.3"
        fill="#ffffff" fillOpacity="0.85"
      >
        {String(v.tagline || '').toUpperCase()}
      </FitText>

      <FitText maxWidth="52" x="6" y="30" fontFamily={fonts.display} fontSize="5.8" fill="#141A21">{v.name}</FitText>
      <FitText maxWidth="52" x="6.2" y="34.8" fontFamily={fonts.body} fontSize="2.4" letterSpacing="0.3" fill={theme}>
        {String(v.role || '').toUpperCase()}
      </FitText>
      <rect x="6" y="40" width="10" height="0.6" fill={theme} />

      <FitText maxWidth="38" x="89" y="27" textAnchor="end" fontFamily={fonts.body} fontSize="2.4" fill="#34403b">
        {v.phone}
      </FitText>
      <FitText maxWidth="38" x="89" y="31.2" textAnchor="end" fontFamily={fonts.body} fontSize="2.4" fill="#34403b">
        {v.email}
      </FitText>
      <FitText maxWidth="38" x="89" y="35.4" textAnchor="end" fontFamily={fonts.body} fontSize="2.4" fill="#34403b">
        {v.website}
      </FitText>
      <FitText maxWidth="38" x="89" y="39.6" textAnchor="end" fontFamily={fonts.body} fontSize="2.2" fill="#8b9491">
        {v.address}
      </FitText>

      <rect x="0" y="54.5" width="95" height="2.5" fill={theme} />
    </svg>
  )
}
