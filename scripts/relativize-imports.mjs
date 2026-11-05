// Troca os imports "@/..." de src/ por caminhos relativos.
//
// Por quê: o design system é consumido como código-fonte por outros projetos (Vite no SCSP, Next.js no PMO).
// O "@/" do consumidor aponta para a pasta dele, não para a do design system, então os imports internos
// precisam ser relativos. O CLI do shadcn gera "@/...", por isso este script roda depois de cada `shadcn add`.
//
// Uso: pnpm fix-imports

import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const SOURCE_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'src')
const EXTENSIONS = new Set(['.ts', '.tsx'])
const ALIAS_IMPORT = /(from\s+|import\s*\(\s*|import\s+)(['"])@\/([^'"]+)\2/g

// O CLI do shadcn às vezes escreve `from "cn"` (confunde o alias do utilitário); o utilitário fica em lib/utils.
const WRONG_CN_IMPORT = /from\s+(['"])cn\1/g

function listSourceFiles(directory) {
  return readdirSync(directory).flatMap((name) => {
    const fullPath = path.join(directory, name)
    if (statSync(fullPath).isDirectory()) return listSourceFiles(fullPath)
    return EXTENSIONS.has(path.extname(name)) ? [fullPath] : []
  })
}

function toRelativeImport(fromFile, target) {
  const relative = path.relative(path.dirname(fromFile), path.join(SOURCE_DIR, target)).split(path.sep).join('/')
  return relative.startsWith('.') ? relative : `./${relative}`
}

let changedFiles = 0
for (const file of listSourceFiles(SOURCE_DIR)) {
  const original = readFileSync(file, 'utf8')
  const updated = original.replace(WRONG_CN_IMPORT, "from '@/lib/utils'").replace(
    ALIAS_IMPORT,
    (_match, prefix, quote, target) => `${prefix}${quote}${toRelativeImport(file, target)}${quote}`,
  )
  if (updated === original) continue
  writeFileSync(file, updated)
  changedFiles += 1
}
console.log(`${changedFiles} arquivo(s) atualizado(s).`)
