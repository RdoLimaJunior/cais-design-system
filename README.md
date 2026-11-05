# @cais/design-system

Design system do ecossistema CAIS (FAROL, CAIS PMO, CAIS SCSP): tokens, componentes React e Storybook.
Base **shadcn/ui + Tailwind v4**, ícones **Tabler**, fonte **Inter**.

## Começar

Requisitos: Node 20+ e [pnpm](https://pnpm.io).

```bash
pnpm install
pnpm storybook        # http://localhost:6006
```

## Comandos

| Comando | O que faz |
| --- | --- |
| `pnpm storybook` | Abre o Storybook |
| `pnpm build-storybook` | Gera `storybook-static/` para publicar |
| `pnpm typecheck` | Confere os tipos (TypeScript) |
| `pnpm lint` | Roda o oxlint |
| `pnpm test` | Roda as stories como testes (Vitest + Playwright) |
| `pnpm new-system <nome>` | **Cria um sistema novo** já ligado ao design system |

Na primeira vez que rodar os testes: `pnpm exec playwright install chromium`.

## Criar um sistema novo

```bash
pnpm new-system cais-scsp --title "CAIS SCSP"
cd ../cais-scsp
pnpm install
pnpm dev
```

O comando cria `../cais-scsp` com Vite, React, React Router, Toaster, menu lateral próprio e uma página de exemplo,
tudo configurado (CSS, alias `@`, portal da sidebar). Passo a passo e armadilhas:
**Storybook → Ecossistema CAIS → Como criar um novo sistema**.

## Usar em um sistema existente

Sem publicar em registro: o pacote é consumido pelo código-fonte, via `link:`.

```json
{ "dependencies": { "@cais/design-system": "link:../storybook" } }
```

```css
/* src/index.css do sistema */
@import '@cais/design-system/globals.css';
@source '../../storybook/src';
```

```tsx
import { AppLayout, PageCard } from '@cais/design-system'
```

Todos os componentes, utilitários e páginas públicos saem de `src/index.ts`. O CSS **não** é importado por ele.

## Estrutura

```
src/components/ui/      Componentes do shadcn/ui usados (Button, AlertDialog)
src/components/farol/   Componentes do ecossistema, organizados por categoria nas stories
src/pages/              Telas completas do FAROL (cada uma com stories e testes)
src/mocks/              Dados fictícios (nunca dados pessoais reais)
src/lib/                Utilitários (cn, máscara de CPF, regra de senha, armazenamento)
src/styles/globals.css  Tokens do tema, fonte e regras globais (cursor de mão)
src/docs/               Páginas de documentação (MDX)
templates/system/       Molde usado pelo `pnpm new-system`
scripts/                Gerador de sistema novo
```

## Organização do Storybook

| Seção | Conteúdo |
| --- | --- |
| **Ecossistema CAIS** | Apresentação, guia de sistema novo, inventário e lacunas do Figma |
| **Fundamentos** | Cores, tipografia, ícones, espaçamento e layout, acessibilidade |
| **Componentes** | Navegação, Formulários, Dados, Layout, Feedback |
| **Sistemas** | Uma pasta por sistema (FAROL, CAIS PMO, CAIS SCSP) com visão geral e páginas |

## Contribuir

Leia o [CONTRIBUTING.md](./CONTRIBUTING.md): como adicionar um componente, o que a story precisa ter e como medir
fidelidade contra o site.
