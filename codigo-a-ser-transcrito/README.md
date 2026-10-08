# Toolkit backend e ferramentas compartilhadas

Versão **1.6.0**, Node.js 22+. Esta pasta conserva os recursos backend Node, cenários de avaliação e ferramentas de instalação/validação/inspeção. React, Next.js, templates frontend, perfis frontend e o Copilot Setup foram integrados fora dela, em `resources/frontend` e nas configurações ativas `.github` do projeto.

O exemplo TypeScript/NestJS foi movido para `examples/nest-backend` na raiz. A aplicação continua em src/, com sua suíte __tests__/ e dependências próprias. Não remover ou substituir código novo para fazer a migração.

Comandos abaixo partem da raiz do repositório:

```sh
npm ci --prefix codigo-a-ser-transcrito --ignore-scripts --no-audit --no-fund
npm --prefix codigo-a-ser-transcrito run project:inspect
npm --prefix codigo-a-ser-transcrito run check
npm --prefix codigo-a-ser-transcrito run catalog:export
```

`check` também exige as dependências próprias de `examples/nest-backend`. O catálogo frontend é gerado em `src/data/ai-resources.json`, ao lado dos dados já existentes. Não contém credenciais/configurações do consumidor. Os scripts inspecionam apenas package.json/configuração e não invocam serviços corporativos.

Os manifests referenciam recursos frontend pela árvore explícita `resources/frontend` da raiz. O pacote faz parte deste repositório; não é mais uma cópia portátil isolada dessa árvore. Instalar dependências com o registry/certificado/ambiente autorizado. Não editar .npmrc ou .env da aplicação para contornar restrições.

A aplicação usa Next.js e Jest; exemplos backend não são serviços implantados do painel. TypeScript/Jest excluem este toolkit e o exemplo Nest. A documentação funcional do frontend fica em docs/ na raiz. Arquivos como AGENTS.md/copilot-instructions são consumidos pelo editor; validar descoberta/execução no Copilot continua pendente.

Não adicionar arquivos .py ou dependências Python. Testes locais do toolkit não certificam o build, a sessão Keycloak, o AppConfig ou o deploy da aplicação.

Para instalar/atualizar o reviewer sem copiar esta pasta para cada consumidor, usar `tools/code-reviewer.cjs` na raiz do checkout de ferramentas. Guia: `docs/code-reviewer-cli.md`. A CLI não requer dependências npm; a suíte de desenvolvimento deste toolkit continua exigindo suas dependências.
