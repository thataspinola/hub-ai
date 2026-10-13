# Changelog do toolkit

## 2.0.0 — separação de escopo

- Ferramentas movidas para tooling/web-code-reviewer; antiga pasta de transcrição eliminada.
- Perfil, recursos, exemplos e avaliações backend retirados em favor do backend-code-reviewer.
- CLI mantém fontes 1.x para rollback/recover aprovados; perfil backend recebe orientação sem escrita.
- Catálogo e documentação passam a frontend; roteiro manual de migração preserva customizações.

## 1.8.0

- Recuperação restrita aos recursos gerenciados; coexistência com backend-code-reviewer.
- Regressão contra journal adulterado que aponta para código da aplicação.

## 1.7.0

- CLI version/rollback com proteção de personalizações e fonte explícita.
- Casos frontend de avaliação, controle limpo e cálculo de falsos positivos/omissões.
- Integração do catálogo no painel e validação local ampliada documentadas na raiz.

## 1.6.0 — CLI para o editor

- Setup/update/doctor/recover em tools/code-reviewer.cjs, sem registry npm ou pipeline.
- Fonte Git fixada por SHA completo, cache reutilizável e modo local offline.
- Atualização segura de arquivos gerenciados intactos; personalizações continuam protegidas.
- Testes de instalação remota com Git local, cache offline e atualização/conflictos.

## 1.5.0

- Pacote independente em tooling/web-code-reviewer, sem substituir a aplicação Next.js da raiz.
- Restaurados VERSION, manifest/lock de desenvolvimento e testes das ferramentas no escopo do módulo.
- Instalação com perfil auto pela stack do destino e inspeção read-only do contexto atual.
- Catálogo JSON determinístico de recursos para consumo pelo painel.
- CI opcional, documentação contextualizada e isolamento de Jest/TypeScript da aplicação.

O CHANGELOG histórico do repositório permanece na raiz. Resultados anteriores em evaluations/examples são evidência histórica; a versão do toolkit é independente da versão da aplicação.
