# Code Reviewer global: um repositório com front e back

## Organização central

Mantenha um único repositório de ferramentas com os dois reviewers:

```text
hub-ai/
├── tools/global-review-poc.cjs
├── front/     # conteúdo do frontend-code-reviewer, incluindo resources/frontend/
└── back/      # conteúdo do backend-code-reviewer, incluindo resources/skills/
```

As pastas `front` e `back` são **fontes de skills e agentes**, não as aplicações consumidoras. O script também aceita `--front-source` e `--backend-source` para caminhos externos. Se as pastas não existirem, mantém o comportamento anterior: frontend do próprio `hub-ai` e backend opcional. Não duplica CLIs nem instala recursos nos projetos revisados.

## Uma única ativação

No Windows/Git Bash, depois de baixar o repositório central e colocar os reviewers nas pastas:

```bash
cd hub-ai
node tools/global-review-poc.cjs --dry-run
node tools/global-review-poc.cjs
```

O agente pessoal `code-reviewer` é criado uma vez em `~/.github/agents/code-reviewer.agent.md`. No VS Code/Copilot Chat, selecione `code-reviewer` e solicite **revisar**. Em cada workspace, o agente deve detectar os pacotes e selecionar as skills frontend/backend, respeitar `AGENTS.md` locais e entregar relatório com evidências. Projetos mistos devem receber análise por pacote e dos contratos entre eles.

Ao atualizar as skills no repositório central, o agente as referencia por caminho e não é necessário instalar novamente nos consumidores. Se o agente gerado precisar mudar de configuração/caminho, execute `node tools/global-review-poc.cjs --update` após revisar a prévia. O `--update` só substitui um arquivo marcado como gerenciado pelo instalador; personalizações não marcadas nunca são sobrescritas.

## Teste de isolamento

```bash
node --test __tests__/config/global-monorepo-review.spec.cjs
```

A simulação cria um repositório central com `front/` e `back/`, um consumidor semelhante ao `porto_connectivity`, instala o agente numa pasta pessoal temporária e verifica ausência de escrita no consumidor, detecção dos recursos, atualização e proteção contra sobrescrita. Ela **não executa o Copilot** e não valida a descoberta do agente no editor. Isso requer abrir o `porto_connectivity` e outro projeto frontend no VS Code e conferir o uso real das skills.

## Restrições

Não acessar AWS, Jenkins, Sensedia nem sistemas corporativos fora da VDI. Não modificar projetos consumidores. Não assumir que um pacote Node de build é backend. Não afirmar cobertura/testes/observabilidade em produção sem evidências. O Copilot deve ter acesso de leitura aos caminhos centrais na máquina; permissões e políticas do editor podem restringir esse acesso.
