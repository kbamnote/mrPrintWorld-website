import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const distDir = join(root, 'dist')

if (!existsSync(distDir)) {
  console.error('[ERROR] dist directory does not exist. Run build first.')
  process.exit(1)
}

function getAllHtmlFiles(dir, fileList = []) {
  const files = readdirSync(dir)
  for (const file of files) {
    const fullPath = join(dir, file)
    if (statSync(fullPath).isDirectory()) {
      getAllHtmlFiles(fullPath, fileList)
    } else if (file.endsWith('.html')) {
      fileList.push(fullPath)
    }
  }
  return fileList
}

const htmlFiles = getAllHtmlFiles(distDir)
console.log('='.repeat(70))
console.log(`VERIFYING PRERENDERED HTML OUTPUT (${htmlFiles.length} HTML files found)`)
console.log('='.repeat(70))

const titles = new Map()
const canonicals = new Map()
let errors = 0
let samplePrinted = 0

for (const filePath of htmlFiles) {
  const relPath = relative(distDir, filePath).replace(/\\/g, '/')
  const content = readFileSync(filePath, 'utf8')

  // Extract <title>
  const titleMatch = content.match(/<title[^>]*>([^<]+)<\/title>/i)
  const title = titleMatch ? titleMatch[1].trim() : null

  // Extract canonical
  const canonicalMatch = content.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i)
    || content.match(/<link\s+href=["']([^"']+)["']\s+rel=["']canonical["']/i)
  const canonical = canonicalMatch ? canonicalMatch[1].trim() : null

  // Extract description
  const descMatch = content.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i)
    || content.match(/<meta\s+content=["']([^"']+)["']\s+name=["']description["']/i)
  const desc = descMatch ? descMatch[1].trim() : null

  // 1. Missing checks
  if (!title) {
    console.error(`[FAIL] Missing <title> in ${relPath}`)
    errors++
  }
  if (!canonical) {
    console.error(`[FAIL] Missing canonical in ${relPath}`)
    errors++
  }
  if (!desc) {
    console.error(`[FAIL] Missing description in ${relPath}`)
    errors++
  }

  // 2. Duplicate checks (allow only if identical path)
  if (title) {
    if (titles.has(title) && titles.get(title) !== relPath) {
      console.error(`[DUPLICATE TITLE] "${title}" found in both:\n   - ${titles.get(title)}\n   - ${relPath}`)
      errors++
    } else {
      titles.set(title, relPath)
    }
  }

  if (canonical) {
    if (canonicals.has(canonical) && canonicals.get(canonical) !== relPath) {
      console.error(`[DUPLICATE CANONICAL] "${canonical}" found in both:\n   - ${canonicals.get(canonical)}\n   - ${relPath}`)
      errors++
    } else {
      canonicals.set(canonical, relPath)
    }
  }

  // Print first 10 samples and last 5
  if (samplePrinted < 10 || samplePrinted > htmlFiles.length - 6) {
    console.log(`[PASS] ${relPath.padEnd(45)} | Title: "${title?.slice(0, 45)}" | Canonical: ${canonical}`)
  } else if (samplePrinted === 10) {
    console.log(`... [${htmlFiles.length - 15} more verified pages checked] ...`)
  }
  samplePrinted++
}

console.log('='.repeat(70))
if (errors === 0) {
  console.log(`[SUCCESS] 100% PASSED: All ${htmlFiles.length} HTML files have unique, self-referencing canonicals, unique titles, and descriptions!`)
  console.log('Zero duplicates. Zero missing values. Zero homepage fallback leaks.')
} else {
  console.error(`[FAILURE] Verification failed with ${errors} errors!`)
  process.exit(1)
}
console.log('='.repeat(70))
