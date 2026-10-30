# Automação de manutenção

Requisitos: Node e Git conforme package.json. Funciona localmente, inclusive no Windows com Git for Windows; não depende de GitHub Actions, GitLab ou Jenkins. Não instala pacotes, acessa serviços, altera versões, cria tags ou publica releases automaticamente.

| Comando | Resultado |
| --- | --- |
| npm run maintenance | Atualiza referência e diário em uma execução |
| npm run docs:generate | Atualiza docs/generated/reference.md com scripts e índice dos guias |
| npm run docs:check | Falha se a referência estiver desatualizada |
| npm run changelog | Gera reports/change-journal.md a partir do histórico Git disponível |
| npm run changelog -- BASE..HEAD | Gera diário apenas do intervalo |
| npm run commits:check -- BASE..HEAD | Valida os commits novos dentro do intervalo informado |
| npm run release:plan -- BASE..HEAD | Sugere major/minor/patch/none; não modifica versão |
| npm run hooks:install | Ativa hooks somente neste clone, sem substituir hooks existentes |
| npm run test:automation | Testa parsing, geração e isolamento dos hooks |
| npm run verify | Executa documentação, testes da automação e checks existentes |

## Fluxo diário

1. Execute npm run hooks:install uma vez após clonar. Não há instalação silenciosa em npm install.
2. Atualize a documentação narrativa quando mudar comportamento, arquitetura ou contratos.
3. Execute npm run docs:generate após adicionar scripts/guias; revise e versione a referência junto da mudança.
4. Use mensagens como feat(api): adicionar contrato de evento ou fix(auth): tratar expiração. Tipos aceitos: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert. Escopo opcional; corpo separado por linha vazia. Use ! ou footer BREAKING CHANGE: descrição para incompatibilidades. Não use fixup!/squash! como mensagem final.
5. pre-commit verifica a referência; commit-msg valida a mensagem; post-commit atualiza o diário ignorado pelo Git; pre-push executa npm run verify. Arquivos não são adicionados ao index automaticamente.

O diário é derivado dos commits e pode ser regenerado, evitando um commit extra após cada commit. CHANGELOG.md permanece editorial e versionado: revisar o diário para registrar efeitos para usuários, migrações e releases. Mensagens ruins geram documentação ruim; a ferramenta não inventa explicações nem certifica contratos.

## GitLab e Jenkins

Acrescente os comandos ao estágio de validação existente; não é necessário criar pipeline novo. Depois da instalação aprovada de dependências, execute npm run verify e npm run commits:check -- BASE..HEAD. Substitua BASE pelo SHA real da base do MR/branch. GitLab pode fornecer CI_MERGE_REQUEST_DIFF_BASE_SHA; em Jenkins use a base calculada pela integração SCM. Garanta histórico/base disponíveis em clones rasos. Merge commits são omitidos; o título/mensagem do squash deve ser validado separadamente com node tools/automation/cli.cjs commit-file caminho-da-mensagem.

Para artefatos de entrega, execute npm run changelog -- BASE..HEAD e arquive reports/change-journal.md com relatórios reais de testes. Hooks locais podem ser ignorados com opções do Git; checks do pipeline são necessários para enforcement compartilhado. Não alegar que pipelines foram configurados apenas por disponibilizar estes comandos.

## Limites e recuperação

Sem histórico Git, exportações ZIP não geram diário. Falhas de Git ou base ausente interrompem a geração; não produzem relatório vazio como sucesso. O diário usa data de commit, SHA e assunto; não coleta arquivos, variáveis de ambiente nem autores. Somente o histórico disponível é coberto. Refatore mensagens sensíveis antes de compartilhar relatórios.

Hooks existentes/core.hooksPath personalizado bloqueiam a instalação: integre os comandos manualmente. Para desativar os hooks instalados aqui: git config --local --unset core.hooksPath. Não sobrescrever hooks corporativos. A validação da mensagem é uma política do projeto baseada em Conventional Commits 1.0.0, com tipos permitidos explícitos. A sugestão de versão deve ser revisada, especialmente em versões 0.x.

Referências: https://www.conventionalcommits.org/en/v1.0.0/ e https://git-scm.com/docs/githooks.
