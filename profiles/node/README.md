# Perfil Node.js

Recursos para backends JavaScript/TypeScript, com atenção a pacotes independentes e integrações assíncronas. A referência inicial é o porto_connectivity; outros projetos devem adaptar módulos, transporte, runner e entrega à sua realidade.

## Instalação

Na raiz do hub:

```bash
python3 scripts/install.py /caminho/do/projeto --profile node
```

Depois selecionar **Node Setup** e pedir `full setup`. São instalados dois agentes, cinco skills Node, a skill compartilhada de RDM e quatro templates. Instructions e AGENTS.md são gerados pelo agente após ler o projeto; o instalador não os sobrescreve nem executa npm, AWS ou Terraform.

| Recurso | Uso |
| --- | --- |
| [Node Setup](agents/node-setup.agent.md) | Adaptar instructions, skills e AGENTS.md |
| [Node Code Reviewer](agents/node-code-reviewer.agent.md) | Revisar backend e contratos |
| [Arquitetura](skills/node-architecture/SKILL.md) | Organização e compartilhamento |
| [Segurança](skills/node-security/SKILL.md) | OAuth/mTLS, secrets e logs |
| [Eventos](skills/node-event-contracts/SKILL.md) | Schemas, falhas parciais e retries |
| [Testes](skills/node-testing/SKILL.md) | Runner e checks reais por pacote |
| [Entrega](skills/node-delivery/SKILL.md) | Bundle, Terraform e CI/CD |
| [RDM](../../skills/rdm-description/SKILL.md) | Descrição da mudança |

Exemplos de pedido: “Configure Copilot para este backend sem alterar os AGENTS existentes”; “Revise a branch de renovação de tokens”; “Verifique falhas parciais SQS e EventBridge”; “Confira dependências de produção no bundle”.

Consultar [a referência de origem](references/porto-connectivity.md) para os padrões observados e os limites dessa evidência. Instalar um perfil não remove recursos de uma instalação anterior; ao mudar de perfil, revisar skills/agentes antigos que possam continuar ativos.
