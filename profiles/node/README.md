# Perfil Node.js

Recursos para backends JavaScript/TypeScript, com atenção a pacotes independentes e integrações assíncronas. A referência inicial é o porto_connectivity; outros projetos devem adaptar módulos, transporte, runner e entrega à sua realidade.

## Instalação

Na raiz do hub:

```bash
node scripts/install.js /caminho/do/projeto --profile node
```

Depois selecionar **Node Setup** e pedir `full setup`. São instalados dois agentes, sete skills Node, as skills compartilhadas de RDM e GitLab e quatro templates. Instructions e AGENTS.md são gerados pelo agente após ler o projeto; o instalador não os sobrescreve nem executa npm, AWS ou Terraform.

| Recurso | Uso |
| --- | --- |
| [Node Setup](agents/node-setup.agent.md) | Adaptar instructions, skills e AGENTS.md |
| [Node Code Reviewer](agents/node-code-reviewer.agent.md) | Revisar backend e contratos |
| [Arquitetura](skills/node-architecture/SKILL.md) | Organização e compartilhamento |
| [Segurança](skills/node-security/SKILL.md) | OAuth/mTLS, secrets e logs |
| [Eventos](skills/node-event-contracts/SKILL.md) | Schemas, falhas parciais e retries |
| [Testes](skills/node-testing/SKILL.md) | Runner e checks reais por pacote |
| [E2E](skills/node-e2e/SKILL.md) | Jornadas, isolamento e limites operacionais |
| [Automatizados](skills/node-automated-testing/SKILL.md) | Regressão, contratos e gates de CI |
| [Entrega](skills/node-delivery/SKILL.md) | Bundle, Terraform e CI/CD |
| [RDM](../../skills/rdm-description/SKILL.md) | Descrição da mudança |

Exemplos de pedido: “Configure Copilot para este backend sem alterar os AGENTS existentes”; “Revise a branch de renovação de tokens”; “Verifique falhas parciais SQS e EventBridge”; “Confira dependências de produção no bundle”.

Consultar [a referência de origem](references/porto-connectivity.md) para os padrões observados e os limites dessa evidência. Usar --dry-run para revisar mudanças e --migrate para remover recursos gerenciados antigos sem alterações locais. Consultar [guia de atualização](../../docs/updating.md).

A base contém arquitetura, testes, automação, RDM e entrega GitLab. Capabilities opcionais: security, events, delivery e e2e. O padrão instala todas; usar --capabilities base ou uma lista separada por vírgulas para limitar a instalação. Consultar [exemplo executável](../../examples/node-backend/README.md) e [avaliação](../../evaluations/README.md).

Projetos NestJS continuam no perfil `node`. A skill node-testing inclui [orientações NestJS](skills/node-testing/references/nestjs.md); consultar o [exemplo executável Nest](../../examples/nest-backend/README.md) para unitários, integração, E2E HTTP, build e cobertura.
