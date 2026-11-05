// Cria um sistema novo (um app React + Vite) já ligado a este design system.
// Uso: pnpm new-system <nome-em-minusculas> [--title "Nome Para Exibição"] [--dir <pasta>]
import { cpSync, existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const TEMPLATE_DIRECTORY = path.resolve(import.meta.dirname, '../templates/system')
const DESIGN_SYSTEM_DIRECTORY = path.resolve(import.meta.dirname, '..')
const SYSTEM_NAME_PATTERN = /^[a-z][a-z0-9-]*$/
const TEXT_FILE_PATTERN = /\.(json|html|css|md|ts|tsx|mjs)$|^\.gitignore$/

function readOption(argumentsList, optionName) {
  const index = argumentsList.indexOf(optionName)
  return index >= 0 ? argumentsList[index + 1] : undefined
}

function toDisplayTitle(systemName) {
  return systemName
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function listFilesRecursively(directory) {
  return readdirSync(directory).flatMap((entry) => {
    const fullPath = path.join(directory, entry)
    return statSync(fullPath).isDirectory() ? listFilesRecursively(fullPath) : [fullPath]
  })
}

function fillPlaceholders(directory, values) {
  for (const filePath of listFilesRecursively(directory)) {
    if (!TEXT_FILE_PATTERN.test(path.basename(filePath))) continue
    const original = readFileSync(filePath, 'utf8')
    const filled = Object.entries(values).reduce((text, [placeholder, value]) => text.replaceAll(placeholder, value), original)
    if (filled !== original) writeFileSync(filePath, filled)
  }
}

const argumentsList = process.argv.slice(2)
const OPTIONS_WITH_VALUE = ['--title', '--dir']
const systemName = argumentsList.find(
  (argument, index) => !argument.startsWith('--') && !OPTIONS_WITH_VALUE.includes(argumentsList[index - 1]),
)

if (!systemName || !SYSTEM_NAME_PATTERN.test(systemName)) {
  console.error('Informe o nome em minúsculas, com hífens. Exemplo: pnpm new-system cais-scsp')
  process.exit(1)
}

const title = readOption(argumentsList, '--title') ?? toDisplayTitle(systemName)
const targetDirectory = path.resolve(readOption(argumentsList, '--dir') ?? path.resolve(import.meta.dirname, '../..', systemName))

if (existsSync(targetDirectory)) {
  console.error(`A pasta já existe: ${targetDirectory}\nEscolha outro nome ou apague a pasta.`)
  process.exit(1)
}

cpSync(TEMPLATE_DIRECTORY, targetDirectory, { recursive: true })
// Caminho do sistema até o design system; o molde usa esse valor em vários arquivos (package.json, Vite, TypeScript, CSS).
const designSystemPath = path.relative(targetDirectory, DESIGN_SYSTEM_DIRECTORY).split(path.sep).join('/')
fillPlaceholders(targetDirectory, {
  __SYSTEM_SLUG__: systemName,
  __SYSTEM_TITLE__: title,
  __DS_PATH_FROM_SRC__: `../${designSystemPath}`,
  __DS_PATH__: designSystemPath,
})

console.log(`Sistema "${title}" criado em ${targetDirectory}\n`)
console.log('Próximos passos:')
console.log(`  1. pnpm --dir ${designSystemPath} install   (se ainda não instalou o design system)`)
console.log(`  2. cd ${path.relative(process.cwd(), targetDirectory) || '.'} && pnpm install`)
console.log('  3. pnpm dev')
console.log('\nO passo a passo completo está no Storybook: Ecossistema CAIS / Como criar um novo sistema.')
