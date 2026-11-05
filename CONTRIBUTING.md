# Contribuir com o design system

## Regras

1. **Componente antes de tela.** Uma tela só usa componentes que existem aqui. Se faltar um, ele entra primeiro.
2. **Uma story por comportamento.** Cada componente tem uma tabela "Quando… então…" na documentação e pelo menos
   uma story com `play()` para o que é interativo. As stories rodam como teste.
3. **Nenhum dado pessoal real.** Nomes, CPF, e-mail, endereço, banco e fotos são sempre fictícios (`src/mocks`).
4. **Texto provisório fica marcado.** Se uma mensagem (erro, toast) não veio do produto, deixe um comentário
   dizendo isso. Não invente em silêncio.
5. **Fidelidade ao FAROL.** Quando o componente copia uma tela do FAROL, o site vence sobre o Figma e sobre o gosto.
6. **Cursor e foco.** Tudo clicável mostra a mão (já é regra global) e tem foco visível.

## Adicionar um componente

1. Crie o arquivo em `src/components/farol/` (ou na subpasta do tema: `forms/`, `auth/`).
2. Nome de arquivo e de identificadores em **inglês**; textos para o usuário em **português**.
3. Crie `Nome.stories.tsx` ao lado, com o `title` na categoria certa:

   | Categoria | Use para |
   | --- | --- |
   | `Componentes/Navegação/…` | Menus, breadcrumbs, abas, paginação |
   | `Componentes/Formulários/…` | Campos, botões, uploads |
   | `Componentes/Dados/…` | Tabelas, selos, cards de informação |
   | `Componentes/Layout/…` | Quadros de página, cards de página |
   | `Componentes/Feedback/…` | Modais, toasts, estados vazios |

4. Na story, descreva os comportamentos em `parameters.docs.description.component`, em tabela:

   ```md
   | Quando | Então |
   | --- | --- |
   | Clica em X | Acontece Y |
   ```

5. Exporte o componente em `src/index.ts`.
6. Rode `pnpm typecheck && pnpm lint && pnpm test`.

## Adicionar uma tela

1. Crie a página em `src/pages/` usando só componentes da biblioteca e dados de `src/mocks`.
2. Crie a story em `Sistemas/<Sistema>/Páginas/<Módulo>/<Tela>`.
3. Escolha o `frame` do `AppLayout` que combina com a tela (veja *Componentes → Layout → Quadros de página*).
4. Se a tela copia o FAROL, meça: `repo/front/tools/fidelity.mjs` (precisa de uma sessão do Playwright, fora do repositório).

## Antes de entregar

- [ ] `pnpm typecheck`, `pnpm lint` e `pnpm test` sem erros
- [ ] `pnpm build-storybook` conclui
- [ ] Story nova com tabela de comportamento
- [ ] Sem dados pessoais reais e sem segredos no código
- [ ] Itens provisórios marcados e listados no PR

## Armadilhas

| Problema | Causa | Solução |
| --- | --- | --- |
| Componente novo precisa existir | Quando o design system não tem o componente | **Sempre `pnpm add-ui <nome>`** (usa o `shadcn add`). Nunca copie arquivo de outro projeto. O comando já remove o pacote `cn` que o CLI instala por engano e troca os imports `@/` por relativos |
| Texto em inglês nos componentes gerados (`Close`, `Loading`) | O CLI gera em inglês | Traduza para português (`Fechar`, `Carregando`) |
| Botão sem mãozinha | O Tailwind v4 deixa `cursor: default` | Já tratado em `globals.css`; não remova a regra |
| "Dois Reacts" ao consumir | O pacote linkado tem o próprio `node_modules` | `resolve.dedupe` no Vite do sistema |
