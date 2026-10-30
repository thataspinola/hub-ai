# POC backend: porto_connectivity como consumidor independente

## Objetivo

Validar o chamado global `code-reviewer` para backend sem instalar CLI, `.github/skills` ou agentes dentro de `porto_connectivity`. O `hub-ai` configura o agente pessoal; as skills backend vêm exclusivamente do clone independente de `backend-code-reviewer`.

## Projeto real analisado (main)

Repositório de leitura: https://github.com/thataspinola/porto_connectivity

- Quatro pacotes Node/CommonJS AWS Lambda: `app-token-generator-requirements`, `app-token-generator`, `app-token-generator-error`, `app-credential-usage-failure`.
- Dependências externas e integração: EventBridge Scheduler/EventBridge, SQS, SNS, DynamoDB e OAuth Sensedia. A infraestrutura está em `infra/` com Terraform.
- Não há `package.json` único na raiz. Cada pacote tem scripts Jest; `shared-modules/jest.preset.js` exige 95% por dimensão. Usar a medição real, não confundir limiar de configuração com cobertura comprovada.
- `AGENTS.md` está presente nos pacotes e em subpastas, exigindo instruções locais e preservação da arquitetura Handler → Controller → Activities / Adapters.
- `shared-modules/logger/index.js` utiliza Pino com caminhos de redaction; verificar adequação para estruturas e campos realmente registrados em cada Lambda.

## Preparação no Windows/Git Bash

Manter as três pastas em locais estáveis. Clonar apenas uma vez:

```bash
git clone https://github.com/thataspinola/hub-ai.git
git clone https://github.com/thataspinola/backend-code-reviewer.git
git clone https://github.com/thataspinola/porto_connectivity.git

cd hub-ai
node tools/global-review-poc.cjs --backend-source "../backend-code-reviewer" --dry-run
node tools/global-review-poc.cjs --backend-source "../backend-code-reviewer"
node --test __tests__/config/global-backend-poc.spec.cjs
```

O destino padrão é `~/.github/agents/code-reviewer.agent.md`. O instalador falha ao detectar conteúdo diferente no destino e não sobrescreve a versão pessoal existente. Para migrar de uma instalação frontend anterior, comparar/backup do agente pessoal e substituir conscientemente: **não apagar arquivos indiscriminadamente**. O checkout do backend é referenciado por caminho absoluto no agente gerado; não é copiado ao consumidor.

## Teste manual indispensável

No VS Code, abra **somente** `porto_connectivity` como workspace consumidor. Selecione `code-reviewer` no Copilot Chat e solicite:

> Revise este repositório backend Node.js com quatro Lambdas. Leia os AGENTS.md específicos e as skills backend centrais. Analise contratos EventBridge/SQS/SNS, retries e DLQ, OAuth/segredos, redaction de logs, validação de eventos, testes Jest e infraestrutura Terraform. Não modifique arquivos. Registre arquivos/linhas, severidade, evidências e limites de execução.

Confirme se:

1. O agente pessoal foi descoberto e é selecionável no Copilot Chat.
2. O agente consultou as skills **do backend-code-reviewer**, não apenas as skills frontend.
3. Detectou quatro Lambdas sem inventar NestJS, servidor HTTP central ou package.json de raiz.
4. Respeitou as instruções `AGENTS.md` dos pacotes e não acessou AWS, Sensedia, Jenkins ou VDI.
5. A resposta apresenta constatações fundamentadas em arquivos/linhas e separa recomendações de falhas comprovadas.
6. Não foram criados recursos de reviewer dentro de `porto_connectivity`.
7. O mesmo agente permanece disponível ao trocar para outro workspace.

## Simulação automatizada e limites

`__tests__/config/global-backend-poc.spec.cjs` simula a estrutura multi-Lambda do projeto em diretórios temporários: valida criação única do agente, referência a skills backend, `--dry-run`, idempotência, proteção contra sobrescrita e isolamento do consumidor. A simulação **não executa o Copilot**, nem os testes das Lambdas, nem a AWS; não garante descoberta de skills no editor. Verificação em ambiente corporativo precisa ocorrer na VDI autorizada. Nenhuma alteração é necessária no projeto consumidor para esta POC.

## Resultado da inspeção remota

A arquitetura do consumidor e a existência das instruções por pacote foram verificadas via GitHub. A POC de geração de agente está pronta para teste local; a interação real VS Code/Copilot e a execução Node não foram observadas neste ambiente.
