import { useEffect } from 'react'
import { GOOGLE_FONTS_HREF } from '../data/designTemplates'

/**
 * Loads the template typefaces, and only on the design pages — the rest of
 * the site uses its own font and should not pay for these.
 */
export function useTemplateFonts() {
  useEffect(() => {
    if (document.getElementById('mrpw-template-fonts')) return
    const link = document.createElement('link')
    link.id = 'mrpw-template-fonts'
    link.rel = 'stylesheet'
    link.href = GOOGLE_FONTS_HREF
    document.head.appendChild(link)
  }, [])
}
