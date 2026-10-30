# Migração para instalação única

**Para novas instalações:** utilizar [code-reviewer-plug-and-play](https://github.com/thataspinola/code-reviewer-plug-and-play) com um único agente pessoal e skills front/back. Consultar [o guia de adoção no hub-ai](global-reviewer.md). Não instalar skills em cada consumidor nem modificar projetos para revisão.

## Instalações anteriores

O hub-ai preserva as CLIs e configurações anteriores em `tools/code-reviewer.cjs`, `tooling/web-code-reviewer`, `resources/frontend` e `.github/agents` para compatibilidade. O backend-code-reviewer original também permanece disponível como referência, mas novas instalações devem usar o repositório consolidado.

Para migrar, não apagar a pasta `.github` do consumidor e não alterar locks existentes manualmente. Instalar o agente pessoal pelo novo repositório e validar no Copilot. Recursos antigos instalados no consumidor só devem ser removidos após backup e comparação de propriedade e customizações. A instalação global não remove recursos legados automaticamente.

O `hub-ai` não deve tentar instalar ou atualizar o perfil pessoal silenciosamente. Use `npm run reviewer:doctor` para verificar a instalação pessoal e `npm run verify` para os checks próprios do painel.
