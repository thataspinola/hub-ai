---
name: rdm-description
description: "Gera descrição de RDM (Requisição de Mudança) a partir de uma branch git. Use quando criar RDM, descrever mudança, requisição de mudança, change request, mudança de infra, mudança de código, branch feature, histórico git para RDM."
argument-hint: "Nome da branch (ex: feature/HPS2-305) [ticket Jira opcional, ex: HPS2-305]"
---

# Gerador de RDM (Requisição de Mudança)

Analisa o histórico e os diffs de uma branch git para gerar automaticamente uma descrição de RDM padronizada.


> Referência reutilizável: confirme stack, versões, scripts e arquivos no projeto alvo antes de aplicar. Os caminhos e exemplos abaixo não comprovam uma implementação existente.

## Quando Usar

- Criar ou redigir uma RDM (Requisição de Mudança)
- Descrever alterações de código, infra ou configuração para aprovação
- Transformar commits/diffs de uma branch em linguagem de negócio

## Procedimento

### 1. Identificar a branch e o ticket Jira

O argumento pode conter:

- **Somente a branch** → `feature/HPS2-305`
- **Branch + ticket Jira** → `feature/HPS2-305 HPS2-305` ou `feature/HPS2-305 jira:HPS2-305`

Se a branch não for fornecida, pergunte ao usuário. O ticket Jira é **opcional** — se não informado, a RDM será gerada apenas com base no histórico git.

### 2. Coletar contexto do Jira (se ticket fornecido)

Se um ticket Jira foi informado, use a ferramenta `mcp_atlassian-mcp_getJiraIssue` para buscar os detalhes do ticket:

```
mcp_atlassian-mcp_getJiraIssue({ issueKey: "<TICKET>" })
```

Extraia do ticket:

| Campo Jira                          | Uso na RDM                                |
| ----------------------------------- | ----------------------------------------- |
| `summary`                           | Complementa o **Objetivo**                |
| `description`                       | Contexto para **Motivo** e **Benefícios** |
| `priority` / `labels`               | Urgência e natureza da mudança            |
| `acceptance criteria` / comentários | Detalhes de **Impacto**                   |

O conteúdo do Jira tem **prioridade sobre as inferências do git** — use os dados do ticket para enriquecer e validar o que foi extraído dos commits. Se houver conflito, prefira a descrição do Jira.

Se a ferramenta Jira não estiver disponível ou o ticket não existir, prossiga apenas com o histórico git e indique `[a confirmar via Jira]` nos campos que dependiam dessa informação.

### 3. Coletar contexto da branch via git

Execute os comandos abaixo em sequência para obter o histórico completo da branch em relação à branch base (`main`, `master` ou `develop` — detecte qual existe):

```bash
# Detectar branch base
git remote show origin | grep "HEAD branch"

# Listar commits exclusivos da branch
git log origin/<base>..<branch> --oneline --no-merges

# Ver diff completo (arquivos alterados e conteúdo)
git diff origin/<base>...<branch> --stat
git diff origin/<base>...<branch>

# Mensagens completas dos commits
git log origin/<base>..<branch> --no-merges --pretty=format:"%h %s%n%b"
```

Se a branch ainda não foi publicada no remote, use a versão local:

```bash
git log <base>..<branch> --oneline --no-merges
git diff <base>...<branch>
```

### 4. Analisar as alterações

Com base nos commits e diffs, identifique:

| Dimensão                       | O que extrair                                                                         |
| ------------------------------ | ------------------------------------------------------------------------------------- |
| **O que mudou**                | Arquivos/recursos alterados, tipo de mudança (feature, fix, config, infra, segurança) |
| **Por que mudou**              | Mensagens de commit, referências a tickets, contexto de segurança/bug                 |
| **Impacto**                    | Recursos afetados, ambientes, integrações, usuários/sistemas impactados               |
| **Risco de indisponibilidade** | Deploy zero-downtime? Precisa de janela? Lambda/serverless? Rollback possível?        |

### 5. Preencher o template de RDM

Use o [template](./assets/template-rdm.md) abaixo e preencha cada seção com linguagem clara e objetiva (evite jargões técnicos excessivos; o destinatário pode ser não-técnico):

```
Objetivo da mudança:
<Descreva em 1-3 frases O QUE está sendo alterado e EM QUE recurso/sistema.
Mencione o tipo de mudança: código, configuração, infra, política de segurança, etc.>

<Descreva onde a alteração será aplicada (ex: "A alteração deve ser feita na infra do projeto
diretamente nas policies da DLQ.")>


Benefícios
<O que melhora com esta mudança? Seja direto e orientado ao resultado.>


Motivo
<Por que esta mudança é necessária agora? (ex: vulnerabilidade identificada, requisito de negócio,
bug em produção, demanda de compliance)>


Impacto
<Quais recursos, sistemas, usuários ou fluxos são afetados após a mudança ser aplicada?>


Indisponibilidade
<Haverá indisponibilidade? Qual a estratégia de deploy?
- Para APIs serverless com pipeline Jenkins: "[a confirmar: verificar estratégia de deploy, tráfego, compatibilidade e rollback]"
- Para alterações de banco/infra: descreva a janela necessária.>


Plano de Teste
<Liste os cenários a serem validados em HML antes da aprovação:
- Passo 1: o que validar e onde
- Passo 2: critério de aceite>


JIRA: <ticket informado ou em branco>
Git:
Jenkins:
Branch: <branch informada>

Evidência de HML em Anexo
```

### 6. Revisar e entregar

- Confirme com o usuário se a descrição está correta antes de finalizar
- Deixe **JIRA, Git e Jenkins em branco** — serão preenchidos manualmente
- Preencha o campo **Branch** com o nome da branch informada
- Se alguma informação não puder ser inferida do histórico, indique com `[a confirmar]`

## Regras de escrita

- **Objetivo**: descrever ação + recurso afetado (ex: "Adição de condição na queue SQS X...")
- **Benefícios**: foco no resultado de negócio/segurança (ex: "Garantir que apenas recursos Y se comuniquem com a fila")
- **Motivo**: mencionar origem se houver (vulnerabilidade, ticket, incidente, requisito)
- **Impacto**: citar o nome exato do recurso/sistema impactado
- **Indisponibilidade**: não inferir zero-downtime apenas por usar serverless/Lambda ou Jenkins; validar a estratégia real
- **Plano de Teste**: listar cenários concretos a validar em HML com critério de aceite claro; não deixar em branco

## Exemplo de saída esperada

Veja [exemplo-rdm.md](./assets/exemplo-rdm.md) para referência de uma RDM bem preenchida.

