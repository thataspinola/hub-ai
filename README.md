# hub-ai

Agentes, skills e templates reutilizáveis para Copilot em projetos Porto Seguro. Versão dos recursos: **1.1.0**. O hub orienta tarefas; geração de instructions e adaptação de regras dependem do executor e da leitura do projeto alvo.

## Instalar e revisar

Requer Python 3.10+. O instalador e o diagnóstico usam apenas a biblioteca padrão. A validação de desenvolvimento requer `python3 -m pip install -r requirements-dev.txt`.

```bash
python3 scripts/install.py /caminho/do/projeto --profile node --dry-run
python3 scripts/install.py /caminho/do/projeto --profile node
python3 scripts/doctor.py /caminho/do/projeto
```

Selecionar **Node Setup** ou **Copilot Setup** e pedir `full setup`. O diagnóstico aponta instructions ainda não geradas, arquivos faltantes, mudanças locais, recursos antigos, links e placeholders. Ele não modifica arquivos nem certifica comportamento do executor.

| Perfil | Recursos |
| --- | --- |
| [Frontend](profiles/frontend/profile.json) | Copilot Setup, Code Reviewer e oito skills React/Next.js |
| [Node](profiles/node/README.md) | Node Setup, Node Code Reviewer, base backend e capacidades opcionais |

Frontend continua como padrão quando --profile é omitido. Em Node, todas as capacidades são instaladas por padrão para preservar uso anterior. Escolher apenas a base com `--capabilities base` ou adicionar capacidades com `--capabilities security,events,e2e,delivery`. Agents devem consultar somente recursos instalados. CPF, Dynamics, propostas e consentimento são exemplos opcionais de domínio; não integram automaticamente novos projetos.

## Atualizar e migrar

O instalador registra versão, commit quando disponível, perfil, capacidades e SHA-256 dos arquivos em `.github/hub-ai-lock.json`. Não incluir secrets nesse arquivo. Fixar o checkout em um commit revisado para distribuir uma versão reproduzível; VERSION identifica a versão dos recursos, mas não substitui o commit.

```bash
python3 scripts/install.py /caminho/do/projeto --profile node --dry-run --overwrite --migrate
python3 scripts/install.py /caminho/do/projeto --profile node --overwrite --migrate
```

--overwrite substitui conflitos dos recursos selecionados: revisar o diff antes. --migrate remove apenas recursos anteriormente gerenciados e localmente inalterados. Recursos antigos modificados bloqueiam a migração; preservar/adaptar o conteúdo antes de tentar novamente. Sem --migrate, recursos antigos são mantidos e o diagnóstico os sinaliza. Recursos instalados pelo instalador antigo, sem lock, não podem ser identificados como gerenciados: revisar manualmente, não presumir propriedade.

Instructions e AGENTS.md locais não são sobrescritos pelo instalador. Ver [guia de atualização](docs/updating.md), [compatibilidade](docs/compatibility.md) e [changelog](CHANGELOG.md).

## Validar e contribuir

```bash
python3 -m pip install -r requirements-dev.txt
python3 scripts/validate.py
python3 scripts/test_install.py
python3 scripts/test_validation.py
npm --prefix examples/node-backend test
```

A CI executa essas verificações e os scripts automated/E2E local do [exemplo Node](examples/node-backend/README.md). Os testes cobrem instalação, migração, recuperação, metadados e comportamento de exemplos selecionados; não compilam todos os blocos de documentação nem validam produção.

A [avaliação de reviewers](evaluations/README.md) oferece um cenário com defeitos conhecidos e métricas adjudicadas. Usar Conventional Commits, revisar exemplos, não inserir dados reais/credenciais e atualizar testes, catálogo e versão quando o contrato de distribuição mudar.
