# Recursos backend

Este diretório mantém [Node Code Reviewer](node-code-reviewer.agent.md). O Copilot Setup compartilhado e os reviewers frontend estão em `resources/frontend/agents` na raiz do repositório. Não copiar referências React/Next.js para esta pasta.

Os manifests Node apontam explicitamente para os recursos compartilhados necessários. As ferramentas resolvem apenas a própria raiz e a árvore autorizada `resources/frontend`; recusam escapes/symlinks. O agente frontend existente no projeto não é substituído.
