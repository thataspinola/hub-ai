# Code Reviewer Plug and Play

O hub-ai consome o agente pessoal do [Code Reviewer Plug and Play](https://gitportoprd.portoseguro.brasil/portocom/hub-vendas/common/code-reviewer-plug-and-play). Não há instalação, skills nem ferramentas de revisão dentro do hub-ai.

No Windows/Git Bash, clone o projeto independente e execute:

```bash
git clone https://gitportoprd.portoseguro.brasil/portocom/hub-vendas/common/code-reviewer-plug-and-play.git
cd code-reviewer-plug-and-play
npm run check
node tools/install.cjs --dry-run
node tools/install.cjs
```

Abra o hub-ai no VS Code, selecione `code-reviewer` no Copilot Chat e solicite uma revisão das alterações contra a branch base, respeitando o `AGENTS.md`. Para atualizar o reviewer, faça `git pull --ff-only` no clone independente e execute `node tools/install.cjs --update`.

A integração real no Copilot deve ser validada no ambiente autorizado. O hub-ai não modifica o perfil pessoal do desenvolvedor.

O painel apresenta um catálogo informativo de áreas de revisão na rota `/code-reviewer`, com filtros por categoria e busca. Os itens são descrições mantidas pelo hub-ai, não um inventário dinâmico das skills instaladas.

## Gerar backend Carbon

O mesmo checkout central do reviewer oferece agora a geração da app-skeleton como novo backend Node/CommonJS. Atualize o reviewer para uma revisão que inclua tools/cli.cjs e consulte docs/backend.md nesse checkout. Não copie a pasta app-skeleton manualmente nem instale outro CLI no hub-ai.

```sh
# Execute no checkout central do code-reviewer-plug-and-play
node tools/cli.cjs backend create ../minha-api --name minha-api --dry-run
node tools/cli.cjs backend create ../minha-api --name minha-api
node tools/cli.cjs backend doctor ../minha-api
cd ../minha-api
npm ci --ignore-scripts
npm run check
npm start
```

A geração funciona offline, exige pasta nova/vazia e não altera o painel, skills pessoais ou backends existentes. O pai do destino deve existir. O pacote recebe testes, lint, cobertura e documentação próprios. Não há autenticação, integração comercial, infraestrutura ou NestJS gerados automaticamente. Revisar NestJS/frontend continua sendo outra capacidade do reviewer. O instalador pessoal legado permanece disponível; para atualizar as instruções do agente use node tools/cli.cjs install --dry-run --update e depois sem --dry-run.
