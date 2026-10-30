# Auditoria de limpeza e compatibilidade — 2026-10-30

## Escopo e evidências

Revisão estática da árvore `main` do hub-ai e da adoção do `code-reviewer-plug-and-play`. O projeto é **um painel Next.js com autenticação e integração corporativa**, e não deve receber migração destrutiva de funcionalidades de produção. O reviewer central agora é instalado no perfil pessoal; não depende de arquivos instalados em cada consumidor.

## Recursos legados ainda presentes

| Área | Arquivos/raízes | Decisão |
| --- | --- | --- |
| CLI antiga | `tools/code-reviewer.cjs`, `tooling/web-code-reviewer/scripts/install.js`, `doctor.js` | **Manter por compatibilidade**: os guias antigos, testes de toolkit e instalações anteriores ainda dependem dessas interfaces |
| Avaliação humana | `tools/evaluate-reviewer.cjs`, `tooling/web-code-reviewer/scripts/score-evaluation.js`, `resources/frontend/evaluations` | **Manter**: pontuação de relatórios e fixtures ainda estão documentadas |
| Copilot Setup e agentes locais | `.github/agents`, `.github/copilot-instructions.md`, `.github/skills` | **Manter**: configuração do painel e recursos de editor existentes, não substituir silenciosamente |
| Skills fonte do toolkit antigo | `resources/frontend/skills`, `tooling/web-code-reviewer/resources/skills` | **Manter por ora**: toolkit legado ainda lê os recursos; o novo reviewer global é independente |
| Referências geradas | `docs/generated/reference.md` | **Manter e regenerar** após alterações |
| Reviewer pessoal | `tools/check-global-reviewer.cjs` | **Manter**: apenas leitura, não modifica consumidor |

Essas duplicações são **reais na distribuição de ferramentas**, mas removê-las sem migrar/aposentar formalmente as APIs legadas quebraria consumidores e testes. A coexistência está documentada; não se deve afirmar que os arquivos estão mortos só por existir um reviewer novo.

## Limpeza e proteções aplicadas

- Incluído `npm run audit:repo` para conferir scripts Node e arquivos essenciais, sinalizar links locais potencialmente quebrados e listar duplicações de skills entre diretórios fonte e instalados.
- Incluído o audit em `npm run check:local`, com testes em `__tests__/config` e documentação do resultado.
- Não foram removidos módulos do painel, autenticação, integração com Keycloak, componentes, fluxos, variáveis de ambiente ou configurações corporativas.
- `npm run reviewer:doctor` continua sendo verificação de instalação pessoal, não homologação real do Copilot.

## Pendências para uma remoção segura do legado

Antes de remover `tools/code-reviewer.cjs` ou `tooling/web-code-reviewer`, é necessário verificar dependências de consumidores e histórico de instalações; executar todos os testes do toolkit, revisar lock e instruções locais, comparar relatórios de avaliação e obter aprovação de aposentadoria. Sem isso, remover seria regressão, não limpeza.

## Validação

Executar `npm run check:config`, `npm run audit:repo`, `npm run docs:check`, `npm run lint`, `npm run typecheck`, `npm test -- --runInBand`, `npm run build` e, quando disponível, `npm run test:e2e`. Testes corporativos reais só dentro da VDI autorizada. Esta auditoria não comprova ausência de todos os code smells nem cobertura >=90%; isso requer execução e inspeção semântica do código em ambiente adequado.
