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

Playwright inicia um servidor novo em 127.0.0.1:3100 com o basePath real. Não reutiliza uma instância externa. Cada teste usa um contexto limpo, bloqueia service workers e requisições a outros hosts/portas, e intercepta a sessão como anônima. Não há bypass de autenticação no código da aplicação.

As jornadas cobrem catálogo/perfis do reviewer, persistência e busca de flags com fixture local, criação/persistência de formulário e catálogo de recomendações. São quatro casos locais; não substituem testes de autorização, serviços reais e integração corporativa.

O runner exige um Chromium compatível. Instalar pelo Playwright no ambiente autorizado:

```sh
npx playwright install chromium
```

Se um navegador aprovado já estiver instalado, a configuração aceita a variável HUB_AI_E2E_CHROMIUM_PATH com seu executável. Não adicionar caminhos da máquina nem credenciais a arquivos .env do repositório. Não usar uma URL de ambiente real como base dos casos locais.

## Entrega e autenticação

Os pares config/values_dev, values_hml e values_prd .yaml/.yml agora possuem o mesmo conteúdo. Foi preservada a configuração do painel (basePath corporativo, namespace corp-hubv e ingress.enabled). Ambos os nomes permanecem para os consumidores existentes, com teste contra divergência.

KEYCLOAK_CLIENT_SECRET e NEXTAUTH_SECRET correspondem aos nomes usados pelo código. Não há valor de secret versionado nos manifests. As credenciais precisam ser injetadas pelo processo corporativo existente. Caso algum valor histórico tenha sido utilizado de fato, sua substituição/rotação deve ser realizada pelos responsáveis no ambiente autorizado; limpar o arquivo não remove o histórico Git. O provisionamento e a compatibilidade do chart/pipeline não foram executados aqui.

## Evidências

Consultar docs/improvements-status.md para resultados da versão atual e distinção entre verificações locais e externas. Não apresentar testes com mocks como comprovação de integração ou produção.
