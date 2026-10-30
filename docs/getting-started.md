# Comece aqui — Hub AI

O **hub-ai** tem dois usos diferentes: **painel administrativo Next.js** e **ferramentas de Code Reviewer frontend**. Este roteiro ajuda a escolher o caminho certo, configurar o ambiente e executar uma primeira revisão. Para APIs, BFFs, NestJS, Lambdas e eventos, utilize o projeto backend independente.

## 1. Qual ferramenta devo usar?

| Preciso de... | Onde começar |
| --- | --- |
| Executar o painel administrativo | [Passo 2 — Painel](#2-executar-o-painel-localmente) |
| Revisar o código deste próprio hub-ai | [Passo 3 — Reviewer no hub-ai](#3-revisar-o-próprio-hub-ai) |
| Instalar reviewer em outra aplicação React/Next.js/Angular/Vue | [Passo 4 — Instalar em outra aplicação](#4-instalar-o-reviewer-em-outra-aplicação) |
| Revisar APIs, BFFs, Node/NestJS, Lambdas ou eventos | [Manual Backend Code Reviewer](https://github.com/thataspinola/backend-code-reviewer/blob/main/docs/getting-started.md) |
| Usar o reviewer frontend independente do painel | [Manual Frontend Code Reviewer](https://github.com/thataspinola/frontend-code-reviewer/blob/main/docs/getting-started.md) |

A CLI **distribui agentes e skills**; não executa IA sozinha, não publica comentários no GitLab e não altera o CI/Jenkins. A revisão acontece com o agente no editor. Use Git Bash no Windows e respeite VDI, proxy, certificados e acessos corporativos.

## 2. Executar o painel localmente

Requisitos: Node compatível com `package.json` (>=20.12.2), Git, dependências aprovadas e variáveis de ambiente autorizadas. **Para a CLI do reviewer, use Node 22+.**

No Git Bash:

```bash
git clone https://github.com/thataspinola/hub-ai.git
cd hub-ai
cp .env.example .env.local
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Copie o segredo gerado para `NEXTAUTH_SECRET` em `.env.local` e configure os demais valores permitidos (como Keycloak) conforme o ambiente. **Não versione `.env.local`, tokens ou certificados.** Depois, no ambiente corporativo autorizado:

```bash
npm ci
npm run dev
```

Acesse `http://localhost:3000/react-ssr-corp-hubv-painel-administrativo/`. Sem serviços e credenciais válidos, login e integrações podem não funcionar. Veja o [README](../README.md) para detalhes de autenticação, testes, build e E2E.

## 3. Revisar o próprio hub-ai

Os agentes ficam em `.github/agents/`. Abra **a raiz do hub-ai** no editor com suporte a agentes Copilot.

1. Confirme a descoberta de **Copilot Setup** e **Web Code Reviewer**.
2. Selecione **Copilot Setup** e peça: «Confira as instruções, AGENTS.md e skills instaladas para este Next.js/React; preserve as regras existentes e mostre o diff antes de modificar».
3. Selecione **Web Code Reviewer** e informe a base real (`main`, commit ou MR), os arquivos alterados e o escopo.

Exemplo de pedido ao reviewer:

> Revise minha branch em relação à main, incluindo diff, arquivos completos e consumidores. Verifique bugs, contratos server/client, segurança, acessibilidade, SOLID, Clean Code, duplicações, código morto e testes. Use as skills compartilhadas pertinentes e as específicas de Next.js/React. Para cada achado informe severidade, arquivo/linha, cenário, impacto, evidência e correção mínima. Separe hipóteses e validações pendentes.

Solicite `web-code-review.md` e confira os achados. Execute os checks reais do painel:

```bash
npm run lint
npm run typecheck
npm test -- --runInBand
```

Testes e cobertura só são comprovados por execução instrumentada; o agente não garante 90% nem valida produção por si só.

## 4. Instalar o reviewer em outra aplicação

Requisitos: **Node 22+**, Git e um projeto frontend existente. Em monorepo, aponte para a aplicação específica. A partir do checkout do `hub-ai`, por exemplo, no Git Bash:

```bash
node tools/code-reviewer.cjs version
node tools/code-reviewer.cjs setup --project /c/projetos/minha-app --source "$PWD" --dry-run
```

Confira o preview e, se aprovado:

```bash
node tools/code-reviewer.cjs setup --project /c/projetos/minha-app --source "$PWD"
node tools/code-reviewer.cjs doctor --project /c/projetos/minha-app --source "$PWD"
```

O perfil é detectado automaticamente. Se necessário, use `--profile nextjs`, `react`, `angular` ou `vue`. Abra **a aplicação consumidora** no editor, selecione Copilot Setup e depois Web Code Reviewer. Não confunda o terminal do toolkit com a pasta do projeto que será revisado.

Para instalações reproduzíveis por Git, fixe um SHA completo aprovado com `--ref`; veja o [README](../README.md). Não coloque credenciais em URLs.

## 5. Fluxo rápido

```text
Escolher painel ou reviewer
         |
         +-- Painel → .env.local → npm ci → npm run dev
         |
         +-- Reviewer no hub → abrir hub no editor → Copilot Setup → Web Code Reviewer
         |
         +-- Reviewer externo → setup --dry-run → setup → doctor
                                                   |
                                           abrir app no editor
                                                   |
                                       Copilot Setup → Web Code Reviewer
                                                   |
                                         validar achados e testes
```

## 6. Atualização e problemas comuns

Para um consumidor instalado a partir do checkout local do hub:

```bash
node tools/code-reviewer.cjs doctor --project /c/projetos/minha-app --source "$PWD"
node tools/code-reviewer.cjs update --project /c/projetos/minha-app --source "$PWD" --dry-run
node tools/code-reviewer.cjs update --project /c/projetos/minha-app --source "$PWD"
```

- **Agente não aparece:** confirme que abriu a pasta correta no editor e verifique `.github/agents/`.
- **Perfil incorreto:** use `--profile` e revise o `--dry-run` antes de aplicar.
- **Conflito de customização:** não apague `.github/hub-ai-lock.json` nem force sobrescrita; preserve arquivos locais e consulte o diagnóstico.
- **Erro de autenticação no painel:** confirme variáveis e acessos autorizados; não compartilhe segredos em logs.
- **Instalação interrompida:** consulte `recover` e `rollback` no [README](../README.md); não remova journals manualmente.
- **Backend já instalado pelo hub antigo:** siga o [roteiro de migração](reviewer-migration.md) antes de instalar o toolkit backend independente.

## 7. Perguntas frequentes

**Preciso do painel para revisar código?** Não. O reviewer pode ser instalado em outras aplicações usando a CLI, sem iniciar Next.js.

**O reviewer envia automaticamente comentários ao GitLab?** Não. A revisão é feita no editor; o relatório e sua publicação dependem do fluxo autorizado.

**Funciona no Windows?** Os exemplos utilizam Git Bash; confirme Node 22+ para a CLI e permissões de escrita.

**Posso usar para Node/NestJS?** Use o [Backend Code Reviewer](https://github.com/thataspinola/backend-code-reviewer/blob/main/docs/getting-started.md). Next.js continua no escopo frontend para suas fronteiras server/client.

**Preciso trocar Jest por Vitest?** Não. O hub-ai usa Jest/React Testing Library; respeite o runner real de cada consumidor.

## 8. Exemplo de achado (ilustrativo, não resultado real)

```text
Severidade: Alta
Arquivo/linha: src/components/forms/SaveButton.tsx:27
Cenário: clique repetido enquanto a requisição está pendente
Impacto: envio duplicado do formulário
Evidência: handler permite reentrada durante o estado de loading
Correção mínima: bloquear reenvio enquanto aguarda a resposta
Validação: criar teste de interação; não executado neste exemplo
```

Referências: [README do hub-ai](../README.md) · [Frontend Code Reviewer](https://github.com/thataspinola/frontend-code-reviewer/blob/main/docs/getting-started.md) · [Backend Code Reviewer](https://github.com/thataspinola/backend-code-reviewer/blob/main/docs/getting-started.md) · [Migração](reviewer-migration.md) · [Automação e changelog](automation.md).
