/**
 * Discourages saving the site's photos: no right-click menu ("Save image
 * as…", "Copy image", "Open image in new tab"), no dragging a photo out to
 * the desktop, and no long-press save menu on phones.
 *
 * Installed once for the whole site, so every photo — including ones added
 * later — is covered without each page remembering to do it. The admin panel
 * is left alone: the team needs to handle the real photos.
 *
 * This stops casual copying, not a determined visitor (screenshots, the
 * browser's developer tools). Product-page photos also carry the watermark
 * for that reason — see lib/watermark.js.
 */

const isAdmin = () => window.location.pathname.startsWith('/admin')
const isPhoto = (target) => target instanceof HTMLImageElement

export function installImageProtection() {
  if (typeof document === 'undefined') return

  // Right-click on desktop, and long-press on Android (which fires contextmenu).
  document.addEventListener('contextmenu', (e) => {
    if (isPhoto(e.target) && !isAdmin()) e.preventDefault()
  })

  document.addEventListener('dragstart', (e) => {
    if (isPhoto(e.target) && !isAdmin()) e.preventDefault()
  })

  // iPhone and iPad ignore contextmenu for images; their long-press save menu
  // is turned off in CSS instead. (This also applies inside the admin panel,
  // where it only affects long-pressing a photo on a phone.)
  const style = document.createElement('style')
  style.textContent = 'img { -webkit-touch-callout: none; -webkit-user-drag: none; user-select: none; }'
  document.head.appendChild(style)
}
