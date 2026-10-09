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
