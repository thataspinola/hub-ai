# Changelog do toolkit

## 1.6.0 — CLI para o editor

- Setup/update/doctor/recover em tools/code-reviewer.cjs, sem registry npm ou pipeline.
- Fonte Git fixada por SHA completo, cache reutilizável e modo local offline.
- Atualização segura de arquivos gerenciados intactos; personalizações continuam protegidas.
- Testes de instalação remota com Git local, cache offline e atualização/conflictos.

## 1.5.0

- Pacote independente em codigo-a-ser-transcrito, sem substituir a aplicação Next.js da raiz.
- Restaurados VERSION, manifest/lock de desenvolvimento e testes das ferramentas no escopo do módulo.
- Instalação com perfil auto pela stack do destino e inspeção read-only do contexto atual.
- Catálogo JSON determinístico de recursos para consumo pelo painel.
- CI opcional, documentação contextualizada e isolamento de Jest/TypeScript da aplicação.

O CHANGELOG histórico do repositório permanece na raiz. Resultados anteriores em evaluations/examples são evidência histórica; a versão do toolkit é independente da versão da aplicação.
