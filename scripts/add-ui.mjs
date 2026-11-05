// Adiciona componentes ao design system pelo CLI oficial do shadcn e corrige o que ele deixa para trás.
//
// Uso: pnpm add-ui dialog select table
//
// O CLI gera os componentes no padrão do design system (components.json). Dois acertos são sempre necessários:
//   1. ele instala um pacote chamado "cn" por engano (confunde o alias do utilitário);
//   2. ele escreve os imports como "@/...", mas o design system é consumido como código-fonte por projetos
//      que têm o próprio "@/" (Next.js no PMO), então os imports internos precisam ser relativos.
// Os textos gerados em inglês (por exemplo "Close") continuam sendo traduzidos à mão.

import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const components = process.argv.slice(2)

if (components.length === 0) {
  console.error('Informe os componentes. Exemplo: pnpm add-ui dialog select')
  process.exit(1)
}

function run(command, args) {
  const result = spawnSync(command, args, { cwd: ROOT_DIR, stdio: 'inherit', shell: true })
  if (result.status !== 0) process.exit(result.status ?? 1)
}

function hasWrongCnPackage() {
  const manifest = JSON.parse(readFileSync(path.join(ROOT_DIR, 'package.json'), 'utf8'))
  return Boolean({ ...manifest.dependencies, ...manifest.devDependencies }.cn)
}

run('pnpm', ['dlx', 'shadcn@latest', 'add', ...components, '-y'])
if (hasWrongCnPackage()) run('pnpm', ['remove', 'cn'])
run('node', ['scripts/relativize-imports.mjs'])
console.log('Pronto. Traduza os textos em inglês dos componentes novos e crie a história no Storybook.')
