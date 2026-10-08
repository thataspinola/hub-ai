# Compatibilidade verificada

| Componente | Evidência | Limite |
| --- | --- | --- |
| Node.js/Linux | Suítes locais de instalação, diagnóstico, recuperação e validação | Windows/macOS ainda não executados |
| Node 24/Linux | Exemplo executável local e suites automated/E2E | Não comprova Lambda |
| Node 22/Linux | Checks Node 22/24 passaram no workflow histórico da 1.1.0; matriz atual preparada para GitLab CI | Execução do novo pipeline em runner GitLab pendente |
| GitHub Copilot | Arquivos de configuração e templates preparados | Descoberta, tools e execução no Copilot ainda pendentes |
| Reviewer por agente nesta sessão | Cenário sintético avaliado com recursos do hub | Não certifica Copilot nem todos os modelos |

O projeto não fixa uma versão de Copilot como “compatível” sem executar um teste nela. Ao validar um executor, registrar versão/extensão, ambiente, recursos detectados, setup gerado, revisão executada, comandos e saída sanitizada. Conferir nomes de ferramentas reconhecidos pelo executor e adaptar o frontmatter ao seu contrato quando necessário.

O pacote `yaml` é dependência apenas de validação/desenvolvimento. Installer/doctor usam módulos nativos de Node.js. Escolher runtime do projeto consumidor a partir do código, engines, documentação e pipeline; não copiar a versão do exemplo como requisito corporativo universal.

Perfis Angular/React/Next.js/Vue foram validados quanto a YAML, catálogo e instalação independente. Não foram executados builds de aplicações reais desses frameworks nem descoberta de agentes no editor. A compatibilidade é guiada pelo framework/versão detectado no consumidor, não por uma versão universal.

O [exemplo NestJS](../../examples/nest-backend/validation.md) passou em Node 22.23.3 e 24.19.0/Linux com Nest 11.2.7, TypeScript, Jest e Supertest: 18 testes, build, smoke do artefato compilado e gates de cobertura. Essa evidência não certifica outras versões Nest, adapter Fastify ou aplicações corporativas. A matriz GitLab foi preparada; execução em runner autorizado permanece pendente.
