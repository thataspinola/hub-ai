# Melhorias e validações — toolkit 1.7.0

## Implementado

| Item | Resultado |
| --- | --- |
| Lint | ESLint CLI/flat config; corrigidos imports, mocks, valores impuros em render e sincronização de estado |
| TypeScript | Script typecheck e caminhos relativos para tipos gerados; toolkit/Nest/E2E isolados |
| Hidratação | Stores de browser inicializam após hidratação consistente; slug edita/reset sincronizados sem effects redundantes |
| Formulário novo | Uma inicialização por montagem, slug único e persistência antes de navegar |
| Entrega | distDir relativo, postbuild Node com static/public, start via standalone/server.js e smoke HTTP local |
| Configuração | Pares .yaml/.yml idênticos, nomes de variáveis alinhados e secret embutido removido |
| Catálogo | Página /code-reviewer com perfis, busca e instruções de uso, acessível pela sidebar |
| E2E | Quatro jornadas locais, contextos limpos, sessão controlada e bloqueio de requisições externas |
| CLI | version/rollback com SHA explícito, conflitos protegidos e testes de reversão |
| Avaliação | Casos frontend defeituoso/limpo e pontuação humana de recall, precision, omissões e falsos positivos |

## Evidências locais

Ambiente: Node 24.19.0/Linux; dependências públicas instaladas inicialmente em diretório isolado e depois disponibilizadas localmente, sem alterações em .npmrc/certificados. O lock de entrega mantém URLs do registry corporativo; a disponibilidade de todos os novos pacotes nesse mirror não foi verificada. O lock atualizado resolve Next 16.3.8 dentro do range declarado ^16.2.2.

| Verificação | Resultado |
| --- | --- |
| npm run check:local | Passou: configuração, lint sem warnings, typecheck e Jest |
| Jest do painel | 37 suítes, 370 testes passaram |
| Checks de configuração/artefatos | 2 passaram |
| npm run build e postbuild | Passaram, incluindo typecheck do Next |
| Standalone HTTP smoke | Página Code Reviewer e asset static passaram em localhost |
| Playwright | 4 casos passaram em localhost |
| Toolkit + exemplos | 42 ferramentas + 8 Node + 18 Nest = 68 testes passaram |
| Nest | Typecheck/build/smoke passaram |
| Auditoria de dependências de produção | 0 avisos retornados pelo npm audit público nesta execução; não certifica ausência de vulnerabilidades |

O download padrão de Chromium do Playwright retornou um arquivo inválido neste ambiente. Os quatro E2E foram executados usando Chromium 153.0.8010.0 disponível por uma instalação npm isolada de @sparticuz/chromium e HUB_AI_E2E_CHROMIUM_PATH. Esse pacote não é dependência do projeto. O uso com o navegador padrão do Playwright permanece uma verificação de portabilidade no ambiente do consumidor.

## Dependências externas pendentes

- Carregamento/execução dos agentes no editor Copilot e avaliação semântica frontend com relatório bruto e adjudicação humana.
- Provisionamento de credenciais reais e validação de Keycloak, AppConfig, APIs, AWS, chart e fluxo GitLab/Jenkins/VDI.
- Disponibilidade dos novos pacotes/browsers no ambiente corporativo e reprodução usando o registry/certificado autorizado.
- Rotação de qualquer credencial histórica efetivamente utilizada, pelos responsáveis. Alterar os manifests não apaga o histórico Git.

Essas dependências não foram executadas daqui. Os mocks/E2E e a auditoria pública não comprovam autenticação real, autorização administrativa, integração ou produção. Não há novo pipeline nem deploy automático.

## Reprodução e manutenção

Consultar [validação local](local-validation.md), [CLI](code-reviewer-cli.md) e [avaliação do reviewer](reviewer-evaluation.md). Manter uma fonte Git fixada por SHA; revisar preview antes de update/rollback. A combinação ESLint/config Next foi testada em conjunto; uma migração para ESLint 10 exige plugins compatíveis, pois a tentativa nesta execução falhou antes de lintar.

## Correções de 2026-10-09

Implementados: recuperação limitada aos recursos conhecidos, proteção de propriedade entre toolkits, refresh de token, proteção administrativa em produção, logout POST/Origin/timeout, configuração AppConfig no servidor, validação de JSON/localStorage e commit de IndexedDB. Jest: 384 testes/41 suítes; toolkit: 43; Node: 8; Nest: 18. Homologação Keycloak/roles/refresh distribuído, AppConfig real, VDI e avaliação do modelo no editor permanecem pendentes.

## Limpeza de escopo — 2026-10-13 (2.0.0)

Removidos perfil/agente/skills/templates backend, exemplos Node/Nest e avaliações Node. Ferramentas necessárias movidas para tooling/web-code-reviewer; codigo-a-ser-transcrito eliminada. Catálogo frontend e Setup instalado atualizados. README e guias de uso/migração dos dois projetos revisados.

Validação atual: 42 testes do toolkit frontend, 384 testes/41 suítes Jest do painel, configuração/lint/typecheck, build/postbuild e smoke standalone passaram. Doctor mantém apenas o aviso do agente frontend_engineering_expert externo preservado. E2E/editor/integrações reais não foram reexecutados nesta limpeza. Números e exemplos Node/Nest anteriores são históricos; validação backend pertence ao projeto independente.


## WebKit no Playwright — 2026-10-21

O projeto E2E padrão passou a webkit/Desktop Safari. Instalar com npm run test:e2e:install e executar npm run test:e2e; test:e2e:list lista as jornadas sem abrir navegador. A variável HUB_AI_E2E_CHROMIUM_PATH foi retirada da configuração. BasePath, servidor localhost, isolamento de contexto e bloqueio de rede externa foram preservados.

Validação com Playwright 1.62.1: configuração carregada e quatro jornadas listadas como [webkit]. Binário WebKit baixado, porém a inicialização foi bloqueada por bibliotecas de sistema ausentes (GTK/GStreamer e outras). install-deps webkit também foi bloqueado por permissões do ambiente. As quatro jornadas não foram executadas nesta rodada. Instalar dependências de sistema pelo processo autorizado antes da execução; não confundir descoberta de testes com E2E aprovado.

## Matriz de navegadores — 2026-10-21

O padrão foi ampliado para quatro projetos: webkit (Desktop Safari), firefox (Firefox do Playwright), chrome (canal Google Chrome instalado) e edge (canal Microsoft Edge instalado). WebKit não executa dentro dos outros navegadores, nem equivale ao aplicativo Safari. A homologação no Safari real exige validação separada no ambiente Apple.

npm run test:e2e executa a matriz; comandos test:e2e:webkit, test:e2e:firefox, test:e2e:chrome e test:e2e:edge selecionam um projeto. test:e2e:install instala WebKit/Firefox; Chrome/Edge são provisionados pelo processo autorizado, sem substituição automática.

Configuração carregada com Playwright 1.62.1: 16 casos descobertos (quatro jornadas por projeto). Não foram executados os 16 casos nesta rodada. A limitação de dependências de sistema registrada na etapa WebKit permanece; navegadores e políticas corporativas devem ser validados no ambiente autorizado. Descoberta não equivale à aprovação de E2E.

## Ajustes após a reorganização — 2026-10-23

Base: main 168cb44da67ce3800836e31a08bdd8a387883ed6. Mantidos a formatação, os diretórios __tests__, os runners Jest/Playwright/node:test e a matriz WebKit/Firefox/Chrome/Edge enviados nesta revisão.

- Teste de configuração renomeado para deployment.spec.cjs, de acordo com check:config.
- Validador do toolkit reconhece __tests__ sem liberar nomes arbitrários e mantém a proibição de Python.
- Recuperação volta a ler snapshots do journal e valida caminhos/propriedade antes de restaurar arquivos; instalação protege recursos do outro toolkit.
- Detecção recusa pacotes mistos sem escopo explícito; help não exige projeto; rollback reconhece layouts anteriores seguros.
- Catálogo regenerado a partir dos cinco perfis frontend; E2E usa React e o basePath real, mantendo localhost e bloqueio de rede externa.
- Documentação e instruções do editor alinhadas aos diretórios reais; recurso gerenciado de segurança atualizado sem sobrescrever customizações.

Dependências públicas de validação foram preparadas isoladamente; package-lock, registry, certificados e arquivos de ambiente do projeto foram preservados. Ambiente local: Node 24.19.0 e Next 16.4.3; isso não substitui validação com o lockfile/mirror corporativo. E2E completo e Windows/VDI continuam pendentes; 16 casos descobertos não significam 16 casos aprovados.

Resultados desta rodada: Jest 384 testes em 41 suítes; toolkit 43 testes; configuração 2 testes; lint sem warnings; typecheck, build/postbuild e smoke HTTP standalone passaram. Playwright reconheceu 16 casos no diretório atualizado; não houve execução completa desses casos nem validação de VDI/Windows nesta rodada. Doctor preserva o aviso do agente externo frontend_engineering_expert; nenhuma customização foi removida para silenciá-lo.
