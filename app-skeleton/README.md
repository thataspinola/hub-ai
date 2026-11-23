# App Skeleton — Carbon / Node

Base Node.js/CommonJS integrada ao repositório como **pacote independente** do painel. O fluxo executável é handler HTTP Lambda → controller → activities → validação/factory. Não importa código do Next.js nem substitui as APIs de clientes, autenticação, flags, formulários ou recomendações.

## Instalar e executar

Requer Node.js >= 22.14.0 e npm. Use o registry/certificado aprovado no seu ambiente. O arquivo `.npmrc` recebido foi preservado. Na raiz do hub-ai:

```sh
npm run skeleton:install
npm run skeleton:check
npm run skeleton:start
```

O runner escuta somente `127.0.0.1:3101`. Para outra porta: `npm run skeleton:start -- 3102` (ou `0` para uma porta livre). Funciona com os mesmos comandos no Git Bash/Windows e Linux; não depende de Python, credenciais AWS ou AWS SDK.

```sh
curl http://127.0.0.1:3101/health
curl -X POST http://127.0.0.1:3101/validate -H 'Content-Type: application/json' -H 'carbon-trace-id: teste-local' --data '{}'
```

`GET /health` retorna o estado local. `POST /validate` percorre o handler real e retorna `200` com `{"status":"validated"}` para um objeto JSON. O schema inicial é propositalmente genérico, conforme o código recebido: valida apenas o tipo objeto; refine `src/property/inputSchema.js` antes de implementar um domínio. Não há integração comercial ou processamento de proposta implementado nesse retorno.

JSON inválido, corpo ausente, `null`, arrays e valores primitivos retornam `400`. Falhas internas retornam `500` sem detalhes do erro. O runner limita corpos a 64 KiB (`413`) e responde `404` a rotas desconhecidas. O header `carbon-trace-id` é preservado sem diferenciar maiúsculas/minúsculas quando contém até 128 caracteres seguros; caso contrário é gerado um UUID. Ele também aparece nos erros.

## Extensão e contratos

- `index.handler`: entrada para evento proxy HTTP do API Gateway, com `body` string e suporte a `isBase64Encoded`.
- `index.createHandler({ process, log })`: permite testar/adaptar o processamento e o logger sem rede.
- `src/controller/requestController.js`: compõe as activities e preserva erros de validação.
- `src/error/`: `ValidationError` distingue erro de entrada de falha interna.
- `src/service/`: AJV reutilizável, formatos padrão e CPF; preserva o preenchimento de zeros à esquerda do validador recebido e rejeita entradas inválidas/sequências repetidas. Não atesta identidade nem consulta cadastros.
- `logger/`: Pino estruturado; logs do handler contêm somente correlação e categoria. Não registrar payload, CPF, token ou mensagem bruta de erro. O serializer remove detalhes de request/response do erro; `createLogger(destination)` permite testar o JSON efetivamente emitido.
- `templates/`: arquivos originais com `{name}` preservados como `.js.template`, fora da execução e da descoberta de testes. Para criar um fluxo, copie, substitua os marcadores e registre os exports; não importe templates diretamente.

Regras e credenciais de CPF/Dynamics/propostas/consentimento de outros projetos não são presumidas. Não há publishers/consumers AWS ativos. As amostras SQS/SNS/EventBridge dos AGENTS são referências de extensão, não handlers implementados por este pacote. Ao adicionar um transporte, defina envelopes, política de falha, idempotência e testes próprios.

## Validação e isolamento

```sh
npm run skeleton:test
npm run skeleton:check
npm run verify:all
```

`skeleton:check` executa ESLint Node, smoke do runner em processo separado e Jest com cobertura mínima de 90% para statements, branches, functions e lines do handler, `src/` e logger. Os testes incluem HTTP local, erros e ausência de dados sensíveis nos logs. O runner de desenvolvimento é testado por HTTP, mas não integra o denominador da cobertura do runtime Lambda.

`verify:all` valida primeiro o painel e depois o skeleton. Instale as dependências de ambos antes. Os comandos já existentes (`dev`, `build`, `test`, `verify`) continuam pertencendo ao painel; não passam a depender da instalação do backend. A configuração do Jest/ESLint/TypeScript do painel delimita o pacote; ele mantém lint, testes, lockfile e cobertura próprios. Não há workspaces, mudança de rota ou pacote AWS no bundle frontend.

CI GitLab/Jenkins pode executar `npm run skeleton:install` e `npm run verify:all` no estágio aprovado existente. Nenhum pipeline ou deploy foi alterado. O runner local não oferece autenticação e não deve ser publicado; publicar a Lambda exige contrato, autenticação/autorização, infraestrutura, segredos, políticas IAM e validação no ambiente autorizado. Não usar o demo como backend de produção do painel.

Consulte também o [README do painel](../README.md) e a [arquitetura](../docs/architecture.md).

## Evidências desta integração — 2026-11-23

Base do hub: `24224b2a10b6e909eae05857a93fdb708d0ffef1`. Node 24.22.3/Linux. O pacote passou em 64 testes/7 suítes, lint e smoke localhost em processo separado; cobertura do runtime: 100% statements/lines/functions e 97,01% branches. A auditoria pública de dependências de produção do pacote não reportou vulnerabilidades na data da verificação. Isso não certifica o painel nem o ambiente corporativo.

Todos os arquivos de src/ do painel foram comparados por SHA e preservados. A descoberta Jest do painel exclui o pacote Node. A listagem Playwright voltou a funcionar após corrigir o import defineConfig; não foram executados testes reais em navegadores.

A base recebida do painel já contém falhas: 107 erros TypeScript, iguais ao executar com o tsconfig original; inconsistências de exports/contratos em feature-flags e tipos do form-wizard; referência ao SDK S3 ausente nas dependências. O Jest do painel terminou com 44 suítes aprovadas e 5 reprovadas (434 testes aprovados, 35 reprovados). Lint e build do painel também falham nesses arquivos existentes. O check de configuração espera aliases .yml ausentes; adicionalmente, a verificação de segredos sinaliza configuração recebida com segredo não vazio. Os arquivos corporativos não foram modificados.

Por isso verify/verify:all e build do painel não estão aprovados: não reduzir gates, reintroduzir arquivos removidos ou alterar contratos para encobrir essas falhas. A validação usou dependências públicas em uma cópia temporária do lockfile corporativo, mantendo versões/integridades; package-lock.json e .npmrc da raiz foram preservados. Correção do merge do painel, validação Windows, Safari/navegadores e homologação de AWS/Keycloak/APIs continuam pendentes.
