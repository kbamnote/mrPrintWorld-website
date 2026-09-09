// Rasterise the branded OG cover (public/og-cover.svg → public/og-cover.jpg).
// Run: npm run og   (regenerate after editing the SVG)
import sharp from 'sharp'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const svgPath = fileURLToPath(new URL('../public/og-cover.svg', import.meta.url))
const outPath = fileURLToPath(new URL('../public/og-cover.jpg', import.meta.url))

await sharp(readFileSync(svgPath), { density: 144 })
  .resize(1200, 630, { fit: 'cover' })
  .jpeg({ quality: 86, progressive: true })
  .toFile(outPath)

console.log('Wrote', outPath)
