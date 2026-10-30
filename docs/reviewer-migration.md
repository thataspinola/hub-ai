# Divisão dos reviewers e migração

| Projeto               | Escopo                                               | CLI                           |
| --------------------- | ---------------------------------------------------- | ----------------------------- |
| hub-ai                | Painel e revisão frontend Angular/React/Next.js/Vue  | node tools/code-reviewer.cjs  |
| backend-code-reviewer | APIs/BFFs, Node vanilla/NestJS, Lambda/eventos/infra | node bin/backend-reviewer.cjs |

Não é necessário GitLab/Jenkins para usar os agentes no editor. CI e código dos consumidores são preservados. Em monorepo, preferir instalação por diretório de aplicação.

## Frontend existente

1. Atualizar o checkout de ferramentas para uma revisão aprovada da 2.0.0.
2. Executar update com --ref SHA_COMPLETO --dry-run; revisar e aplicar sem --dry-run.
3. Executar doctor e conferir Copilot Setup/Web Code Reviewer no editor.

Paths e estado do consumidor (.github/hub-ai-lock.json) continuam iguais; recursos intactos são atualizados, customizações bloqueiam a operação. A CLI atual ainda lê fontes 1.x para rollback/recover quando indicadas explicitamente por SHA.

## Backend anteriormente instalado pelo hub

A versão 2.0.0 recusa profile node antes de escrever. Não converter esse estado para frontend e não apagar .github inteira.

1. Guardar backup/commit do consumidor e inspecionar .github/hub-ai-lock.json; manter a revisão antiga acessível para doctor/recover.
2. Identificar arquivos exclusivamente gerenciados pelo estado antigo. Remover manualmente apenas recursos backend aposentados sem customizações, após conferir hashes/diff. Preservar recursos de outro toolkit e regras locais. Se houver alterações locais, migrar seu conteúdo conscientemente antes da remoção.
3. Arquivar o estado hub antigo somente depois de resolver seus arquivos; não editar o lock para contornar propriedade.
4. Obter backend-code-reviewer numa revisão aprovada, executar setup no pacote com --dry-run, revisar e aplicar. Não usar --overwrite para forçar conflitos com o toolkit antigo.
5. Executar doctor e conferir Backend Copilot Setup/Backend Code Reviewer.

Não há transferência automática entre estados. Os instaladores recusam sobrescrever recursos pertencentes ao outro toolkit; isso evita perda silenciosa de personalizações. O hub-ai não altera instalações consumidoras durante esta limpeza.


## Migração recomendada para uso pessoal único (2026-10-30)

O novo projeto [code-reviewer-plug-and-play](https://github.com/thataspinola/code-reviewer-plug-and-play) consolidou as skills e perfis dos reviewers frontend/backend. Para **novos usos de revisão pelo Copilot**, prefira instalar uma vez o agente e skills pessoais com `node tools/install.cjs` no clone central; não execute as CLIs antigas em cada consumidor. As instruções anteriores nesta página continuam válidas para manutenção e migração cuidadosa de instalações legadas, que **não devem ser removidas automaticamente**. Ver [guia de integração](global-reviewer-integration.md).
