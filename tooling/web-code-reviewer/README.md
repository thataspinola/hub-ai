# Ferramentas do Web Code Reviewer

Módulo interno do hub-ai para instalar, diagnosticar e validar recursos frontend. Perfis: frontend, Angular, React, Next.js e Vue. Recursos ficam em resources/frontend na raiz; entrega/RDM compartilhados ficam neste módulo. A aplicação Next.js usa seu package.json e seus testes próprios.

A partir da raiz:

```sh
npm ci --prefix tooling/web-code-reviewer --ignore-scripts
npm --prefix tooling/web-code-reviewer run check
npm --prefix tooling/web-code-reviewer run catalog:export
node tools/code-reviewer.cjs setup --project /caminho/frontend --source /caminho/ferramentas/hub-ai --dry-run
```

A CLI usa módulos nativos; npm ci é necessário apenas para validar YAML e gerar catálogo. Para instalação por SHA, atualizações, recuperação e rollback, consultar o [guia de uso](../../docs/code-reviewer-cli.md).

Backend Node/Nest, APIs/BFFs, eventos e Lambda ficam no [backend-code-reviewer](https://github.com/thataspinola/backend-code-reviewer). A versão 2.0.0 recusa perfil node sem alterar instalações existentes. Para frontend, update mantém perfil/capacidades/customizações. Para backend anteriormente instalado pelo hub, seguir a [migração](../../docs/reviewer-migration.md).
