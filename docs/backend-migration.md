# Contextos do painel e do backend

O runtime Carbon, os testes Node e os templates pertencem ao **code-reviewer-plug-and-play**. A duplicação em `hub-ai/app-skeleton` foi removida após comparação dos 39 arquivos executáveis/configuráveis com o manifesto do CLI. A fonte única é `back/templates/carbon-node` no reviewer.

Os AGENTS e modelos originais com marcadores foram preservados em `back/reference/carbon-node`, fora do runtime e da geração. A configuração `.npmrc` recebida foi movida, sem alteração de bytes, para `config/backend/npmrc.reference`: é referência histórica, não configuração ativa nem arquivo distribuído para consumidores. O `.npmrc` da raiz, variáveis, certificados e arquivos de entrega não foram alterados.

## Comandos substituídos

| Comando antigo neste painel | Local correto |
| --- | --- |
| skeleton:install / skeleton:start | Gere o backend pelo CLI; execute npm ci / npm start no projeto gerado |
| skeleton:test / skeleton:check | npm test / npm run check no projeto gerado |
| verify:all | npm run verify no painel; npm run check e npm run test:consumer no reviewer |

No checkout central: `node tools/cli.cjs backend create ../minha-api --name minha-api --dry-run`, seguido da geração sem --dry-run após revisar o plano. Não é necessário copiar arquivos nem instalar outro CLI no painel. Consulte [o guia do reviewer](global-reviewer.md).

## Evidências e limites

Na integração anterior (base `24224b2a10b6e909eae05857a93fdb708d0ffef1`), o pacote Node passou em 64 testes, lint e smoke HTTP, com cobertura do runtime de 100% statements/lines/functions e 97,01% branches. Esses testes permanecem no template do CLI e são executados no projeto gerado. A remoção da cópia não representa retirada de proteção de testes do backend.

O painel recebido já apresentou 107 erros TypeScript também com a configuração original, além de falhas de testes/lint/build relacionadas a contratos/exportações de flags e formulários e dependência S3 ausente. O check de configuração ainda espera aliases .yml ausentes; sua verificação de segredos também sinalizou configuração recebida. Esta organização não altera esses contratos nem configurações para esconder falhas. Os relatórios antigos não significam aprovação atual de produção, Windows, Copilot ou integrações corporativas.
