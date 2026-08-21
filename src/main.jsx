import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import '@fontsource-variable/kumbh-sans'
import './index.css'
import App from './App.jsx'
import { initClickTracking } from './lib/analytics'

// Dynamic Google Analytics initialization from env
const GA_ID = import.meta.env.VITE_GA_ID
if (GA_ID && typeof window !== 'undefined') {
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  document.head.appendChild(script)

  const inlineScript = document.createElement('script')
  inlineScript.textContent = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA_ID}', { page_path: window.location.pathname });
  `
  document.head.appendChild(inlineScript)
}

// Conversion tracking for every WhatsApp / call / email CTA. Safe to call
// unconditionally — trackEvent() no-ops to console.debug when GA isn't loaded.
initClickTracking()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
