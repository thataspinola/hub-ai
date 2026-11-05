# Changelog

## 2026-10-30 — Hub AI

- Corrigidos os caminhos de build do Next.js 16 para `.next`, incluindo pós-build, servidor standalone, smoke test e testes de configuração.

- Integrado catálogo visual e filtrável de capacidades de revisão na rota /code-reviewer, sem dependências do toolkit local ou instalação de skills.

- Mantidas as funcionalidades do painel administrativo Next.js: autenticação, clientes, feature flags, formulários e recomendações.
- A rota `/code-reviewer` apresenta a integração informativa com o projeto independente `code-reviewer-plug-and-play`.
- Simplificadas as configurações, testes e documentação do aplicativo.
- Scripts essenciais de preparação e verificação standalone organizados em `scripts/`.
- O repositório contém apenas o código e a documentação necessários ao painel e sua integração externa de revisão.
- Testes completos, build e homologação corporativa dependem de execução no ambiente autorizado.
