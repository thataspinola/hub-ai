# Code Reviewer no editor, sem pipeline

A CLI distribui os agentes/skills para projetos consumidores. Não precisa de GitLab, Jenkins ou registry npm. A revisão é acionada no editor com Copilot; a CLI não chama um modelo nem publica comentários. Requer Node.js 22+ e Git para obter versões remotas. Respeitar o ambiente/VDI e o acesso corporativo aprovado.

## Preparação única

Manter um checkout do hub-ai em uma pasta compartilhada de ferramentas, fora dos projetos consumidores. Não copiar o hub para cada aplicação. Exemplo no terminal, com acesso permitido ao repositório:

```sh
git clone https://github.com/thataspinola/hub-ai.git /caminho/ferramentas/hub-ai
cd /caminho/ferramentas/hub-ai
git rev-parse HEAD
node tools/code-reviewer.cjs help
```

Guardar o SHA completo retornado (40 caracteres), revisar a versão escolhida e usar esse SHA em `--ref`. Branches/tags não são aceitas como revisão de instalação. O checkout inicial precisa conter esta CLI; manter também sua revisão registrada. Não é necessário executar npm install nem scripts da aplicação para usar a CLI.

## Instalar e revisar

A partir do checkout de ferramentas, substituir os caminhos e SHA abaixo pelos valores reais:

```sh
node tools/code-reviewer.cjs setup --project /caminho/aplicacao --ref SHA_COMPLETO --dry-run
node tools/code-reviewer.cjs setup --project /caminho/aplicacao --ref SHA_COMPLETO
node tools/code-reviewer.cjs doctor --project /caminho/aplicacao --ref SHA_COMPLETO
```

O perfil automático prioriza Next.js sobre React e também identifica Angular e Vue. TypeScript usa o perfil do framework; não é um perfil independente. Para pacotes com backend e frontend misturados, indicar o diretório correto ou `--profile nextjs|react|angular|vue|frontend`. Capacidades opcionais podem ser selecionadas com `--capabilities base` ou uma lista separada por vírgulas conforme o manifest.

Em seguida, abrir o projeto no editor, selecionar **Copilot Setup** e pedir que gere/adapte as instruções ao código real. Selecionar **Web Code Reviewer** nos perfis Angular/React/Next.js/Vue, **Frontend Code Reviewer** no perfil frontend. Confirmar que o editor carregou os agentes e skills antes de usar a revisão. O setup da CLI não gera automaticamente instruções específicas de domínio.

## Atualizar sem perder personalizações

Escolher e revisar um novo commit da fonte. A atualização não avança automaticamente para main:

```sh
node tools/code-reviewer.cjs update --project /caminho/aplicacao --ref NOVO_SHA_COMPLETO --dry-run
node tools/code-reviewer.cjs update --project /caminho/aplicacao --ref NOVO_SHA_COMPLETO
```

`update` exige uma instalação existente e mantém perfil/capacidades anteriores, salvo opções explícitas. Substitui apenas arquivos gerenciados cujo conteúdo coincide com o checksum registrado. Alterações locais e colisões com arquivos não gerenciados bloqueiam a operação inteira. `AGENTS.md`, instructions, CI e código da aplicação são preservados. `--overwrite` é uma substituição explícita das colisões nos caminhos selecionados: usar somente após revisar o preview e guardar as personalizações.

Arquivos gerenciados que saíram do perfil ficam preservados por padrão. `--migrate` remove somente os obsoletos sem alterações locais. O estado fica em `.github/hub-ai-lock.json`, com SHA da fonte, perfil, versão e checksums. Não alterar esse lock manualmente para contornar conflitos.

## Cache e operação offline

As fontes remotas são armazenadas por URL+SHA em `~/.cache/hub-ai-code-reviewer`. Usar `--cache /caminho/cache` para outro diretório. Revisões já obtidas funcionam sem nova consulta de rede; cache alterado é recusado. A CLI não atualiza o código da aplicação nem usa credenciais de pipelines. Git usa a autenticação já configurada na máquina, sem prompt interativo; nunca colocar tokens na URL.

Sem acesso remoto, usar um checkout aprovado existente:

```sh
node tools/code-reviewer.cjs setup --project /caminho/aplicacao --source /caminho/ferramentas/hub-ai --dry-run
node tools/code-reviewer.cjs setup --project /caminho/aplicacao --source /caminho/ferramentas/hub-ai
node tools/code-reviewer.cjs update --project /caminho/aplicacao --source /caminho/ferramentas/hub-ai
```

`--source` usa os arquivos locais, inclusive modificações não commitadas; não oferece a mesma fixação/verificação do cache remoto. Para reprodução, manter esse checkout limpo e registrar seu SHA. `--repo` permite uma fonte Git alternativa confiável junto com `--ref`; os scripts dessa fonte serão executados. Não usar repositórios ou commits desconhecidos.

Uma transação interrompida pode ser recuperada após verificar que o processo anterior terminou:

```sh
node tools/code-reviewer.cjs recover --project /caminho/aplicacao --ref SHA_COMPLETO
```

O diagnóstico pode apontar agentes externos como não gerenciados ou instructions ainda não geradas. Isso não autoriza apagá-los. Corrigir as pendências e repetir a validação no editor. A obtenção de uma fonte remota exige Git/rede funcionando; testes locais não certificam conectividade corporativa nem o comportamento do Copilot.

## Evidências desta implementação

Toolkit 1.6.0, Node 24/Linux: 40 testes de ferramentas (7 da CLI), 8 do exemplo Node e 18 do exemplo Nest passaram. Typecheck/build/smoke do exemplo Nest também passaram. A instalação Git foi exercitada com um repositório local, fonte fixada, checkout sem node_modules e SHA registrado no consumidor. Preview, preservação das instruções, colisões e cache offline foram verificados. Acesso de rede ao Git corporativo e descoberta dos agentes no editor permanecem para validação no ambiente autorizado.

## Versão e retorno a uma revisão anterior

O toolkit 1.7.0 acrescenta version e rollback:

```sh
node tools/code-reviewer.cjs version
node tools/code-reviewer.cjs rollback --project /caminho/aplicacao --ref SHA_ANTERIOR_COMPLETO --dry-run
node tools/code-reviewer.cjs rollback --project /caminho/aplicacao --ref SHA_ANTERIOR_COMPLETO
```

Rollback exige estado instalado, escolhe explicitamente a fonte anterior e aplica as mesmas proteções de update. Recursos obsoletos intactos são removidos; alterações locais bloqueiam a transação. Não usa reset no Git do consumidor, não desfaz código da aplicação e não altera suas instructions. A fonte anterior precisa oferecer atualização segura (toolkit 1.6.0+). Perfil/capacidades inexistentes na versão anterior são recusados antes de escrever.

A versão 1.6.0 pode ser reproduzida com o SHA 2a6bd0b1ece7c860d726c57155c2a9ec14fb43d4. Para novas versões, consultar VERSION/CHANGELOG e registrar o SHA completo aprovado. Instalação/update continuam exigindo revisão explícita; não seguem main automaticamente.

## Escopo atual (2.0.0)

Ferramentas em tooling/web-code-reviewer. Perfil node não é mais fornecido; usar backend-code-reviewer para APIs/BFFs/Node/Nest. Evidências 1.x acima são históricas. Não executar check Nest neste checkout. Consultar [migração de consumidores](reviewer-migration.md) antes de atualizar uma instalação backend antiga.
