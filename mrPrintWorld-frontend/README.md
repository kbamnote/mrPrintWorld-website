# MR Print World — Website

A premium, mobile-first marketing site for **MR Print World**, a complete
brand-execution partner in Nagpur (printing · signage · fabrication · corporate
gifting · event branding).

Built with **React 19 + Vite + Tailwind CSS v4**, with a lazy WebGL hero
(three.js / react-three-fiber), Framer Motion, and a working lead-capture form.

---

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build → dist/
npm run preview    # preview the production build
npm run og         # regenerate the social/OG cover image (public/og-cover.jpg)
```

> Requires Node 18+ (developed on Node 24).

---

## Before launch — replace the placeholders

The design is complete; a few **real values must be supplied** (the UI shows a
small _"to be confirmed"_ marker wherever data is still pending).

| What | Where | Notes |
|---|---|---|
| Phone, WhatsApp, email, address, GST, Google Map embed | `src/data/company.js` | Fill the fields, then set the matching flags in `pending` to `false`. |
| CRM endpoint for the quote form | `.env` (see `.env.example`) | Set `VITE_CRM_ENDPOINT` (and `VITE_CRM_API_KEY` if needed). Confirm exact URL / method / payload with the CRM team. |
| Project photography | `public/portfolio/` + `src/data/portfolio.js` | Set `image: '/portfolio/<file>.webp'`. Until then a labelled placeholder of the correct aspect ratio is shown. |
| Real testimonials | `src/data/testimonials.js` | Replace the `sample: true` items with named, permission-cleared quotes. |
| Services / industries / capabilities copy | `src/data/*.js` | All content is data-driven and editable without touching components. |

The lead form **never silently drops a submission**: with no `VITE_CRM_ENDPOINT`
set it runs in a simulated mode that logs the payload to the console, so it is
fully testable before the backend is wired.

---

## Project structure

```
public/            favicon, robots.txt, sitemap.xml, og-cover.(svg|jpg), fonts/
src/
  data/            ← editable content (company, services, portfolio, …)
  lib/             crm.js · seo.js · motion.js · useDeviceCapability.js
  components/
    primitives/    Button, Container, Section, SectionHeading, Icon, Counter, …
    layout/        Navbar, Footer, Layout, FloatingActions, ScrollToTop, PageHeader
    sections/      Hero, About, Services, Capabilities, Portfolio, MissionVision,
                   Industries, Testimonials, Contact  (+ HeroParticles, lazy)
  pages/           Home, Services, Portfolio, About, Contact, NotFound
```

## Design system

- **Tokens** live in `src/index.css` under `@theme` (Tailwind v4) — colours,
  type families, shadows, radii. Never hard-code brand colours; use the tokens
  (`bg-primary`, `text-accent`, `text-gold-deep`, `bg-dark`, …).
- **Type**: Clash Display (headings, self-hosted in `public/fonts/`, preloaded)
  + Inter (body, via `@fontsource-variable/inter`, auto-subset by Vite).
- Gold (`#D4AF37`) is used only for large/decorative elements or on dark
  surfaces. For gold **text on light** use `text-gold-deep` (AA-contrast safe).

## Performance & accessibility

- The WebGL hero is **code-split** into its own chunk, **lazy-loaded**, and only
  runs on capable devices (gated by `useDeviceCapability` — disabled on
  low-power/`save-data` devices and under `prefers-reduced-motion`). First paint
  is always the clean static hero.
- All non-essential motion respects `prefers-reduced-motion`
  (`<MotionConfig reducedMotion="user">`).
- Semantic headings, labelled form fields, visible focus states, skip link.

## Deployment notes

- This is a client-side SPA. Configure the host to **rewrite all routes to
  `/index.html`** (so `/services`, `/about`, etc. work on refresh/deep-link).
- `og-cover.jpg` is generated from `og-cover.svg` via `npm run og`. Re-run after
  editing the SVG.
- For the best mobile LCP, consider adding pre-rendering/SSR later (e.g.
  `vite-plugin-ssg` or Netlify/Cloudflare prerendering) — optional.
