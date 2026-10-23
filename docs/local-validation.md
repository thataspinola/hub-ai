# Validação local sem VDI

A validação técnica pode usar dependências públicas em um ambiente isolado, sem conexão com Keycloak, AppConfig, AWS ou APIs corporativas. Isso não valida o provisionamento corporativo nem autoriza trocar .npmrc/certificados. Para instalações normais do projeto, manter o registry e lock corporativos e usar o ambiente aprovado.

## Comandos do painel

```sh
npm run check:local
npm run build
npm run test:e2e:list
npm run test:e2e
```

check:local executa checks de configuração/artefatos, ESLint, typecheck e Jest. Build também executa postbuild, copiando static e public para a saída standalone. npm start usa o server.js dessa saída. O distDir é relativo ao projeto.

ESLint usa a CLI e flat config do Next, sem next lint/FlatCompat. A combinação validada é ESLint 9.39.4 com eslint-config-next 16.2.2; ESLint 10 não foi adotado porque os plugins desta configuração falharam em sua API. A atualização dessa combinação deve ser testada em conjunto, sem desativar as regras para ocultar incompatibilidades.

## E2E controlados

Playwright inicia um servidor novo em localhost:3100 com o basePath real. Não reutiliza uma instância externa. Cada teste usa um contexto limpo, bloqueia service workers e requisições a outros hosts/portas, e intercepta a sessão como anônima. Não há bypass de autenticação no código da aplicação.

As jornadas cobrem catálogo/perfis do reviewer, persistência e busca de flags com fixture local, criação/persistência de formulário e catálogo de recomendações. São quatro casos locais; não substituem testes de autorização, serviços reais e integração corporativa.

O runner executa WebKit (perfil Desktop Safari), Firefox e os canais instalados Chrome/Edge. Instalar os binários gerenciados pelo Playwright no ambiente autorizado:

```sh
npm run test:e2e:install
```

Usar o WebKit distribuído pela versão fixada do Playwright. A antiga variável HUB_AI_E2E_CHROMIUM_PATH não é utilizada. Não adicionar caminhos nem credenciais a arquivos .env. Em Linux, dependências de sistema devem ser instaladas pelo processo aprovado (npx playwright install-deps webkit firefox). Não usar URL de ambiente real como base dos casos locais.

## Entrega e autenticação

Os pares config/values_dev, values_hml e values_prd .yaml/.yml agora possuem o mesmo conteúdo. Foi preservada a configuração do painel (basePath corporativo, namespace corp-hubv e ingress.enabled). Ambos os nomes permanecem para os consumidores existentes, com teste contra divergência.

KEYCLOAK_CLIENT_SECRET e NEXTAUTH_SECRET correspondem aos nomes usados pelo código. Não há valor de secret versionado nos manifests. As credenciais precisam ser injetadas pelo processo corporativo existente. Caso algum valor histórico tenha sido utilizado de fato, sua substituição/rotação deve ser realizada pelos responsáveis no ambiente autorizado; limpar o arquivo não remove o histórico Git. O provisionamento e a compatibilidade do chart/pipeline não foram executados aqui.

## Evidências

Consultar docs/improvements-status.md para resultados da versão atual e distinção entre verificações locais e externas. Não apresentar testes com mocks como comprovação de integração ou produção.

## Reexecução de 2026-10-09

Jest 384/41 suítes, configuração 2, toolkit 43, Node 8 e Nest 18 passaram. Build com cache limpo e smoke standalone passaram. E2E Playwright não iniciou: o executável alternativo Chromium da execução anterior não existe mais no ambiente. Não houve falha de jornada observada nem aprovação de E2E nesta rodada. Ver README para proteção administrativa, refresh e AppConfig; homologação externa permanece pendente.

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
