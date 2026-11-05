# __SYSTEM_TITLE__

Sistema do ecossistema CAIS, criado com `pnpm new-system` a partir do design system (`__DS_PATH__`).

## Rodar

```bash
pnpm --dir __DS_PATH__ install   # uma vez: dependências do design system
pnpm install
pnpm dev                          # http://localhost:5173
```

## Conferir antes de entregar

```bash
pnpm lint
pnpm build
```

## Onde mexer

| Arquivo | Para quê |
| --- | --- |
| `src/App.tsx` | Rotas e itens do menu lateral (`NAV_ITEMS`) |
| `src/index.css` | Importa os tokens do design system; não remova o `@source` |
| `index.html` | Título, favicon e o `#sidebar-portal-root` (não remova) |

Componentes, comportamentos e o passo a passo estão no Storybook do design system
(`pnpm storybook`, em `__DS_PATH__`): veja **Ecossistema CAIS / Como criar um novo sistema**.

## Regras

- Tela nova só usa componentes que já existem no design system. Se faltar um, ele entra primeiro lá (com story).
- Nenhum dado pessoal real em código, mocks ou stories.
