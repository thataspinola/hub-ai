Objetivo da mudança:

Adição de condição na queue SQS do app carbon-payment-credit-lock-cancel-dlq, no qual apenas recursos que comecem com carbon-\* sejam possíveis de interagir com a fila.

A alteração deve ser feita na infra do projeto diretamente nas policies da DLQ.

Benefícios
Fazer com que apenas recursos CARBON se comuniquem com a fila.

Motivo
Vulnerabilidade mostrada por Scan de SI: AWS SQS Queue is Publicly Accessible Through Resource-Based Policies.

Impacto
Recurso "carbon-payment-credit-lock-cancel-dlq" passa a ser acessado apenas por outros recursos AWS CARBON.

Indisponibilidade
Por serem APIs serverless e os deploys serem realizados via pipeline Jenkins, em todos os casos a nova versão substituirá a versão anterior no momento da conclusão do deploy, ou seja, não há indisponibilidade.

Plano de Teste

1. Validar que a policy da DLQ carbon-payment-credit-lock-cancel-dlq passou a restringir acesso somente a recursos com prefixo carbon-\*
2. Confirmar via console AWS que recursos externos não conseguem publicar ou consumir mensagens da fila
3. Validar que o fluxo interno CARBON continua funcionando normalmente (sem regressão)

Evidências: prints do console AWS e logs de teste em HML, em anexo.

JIRA:
Git:
Jenkins:
Branch: feature/HPS2-305

Evidência de HML em Anexo
