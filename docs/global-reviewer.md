# Code Reviewer Plug and Play

O hub-ai consome o agente pessoal do [Code Reviewer Plug and Play](https://gitportoprd.portoseguro.brasil/portocom/hub-vendas/common/code-reviewer-plug-and-play). Não há instalação, skills nem ferramentas de revisão dentro do hub-ai.

No Windows/Git Bash, clone o projeto independente e execute:

```bash
git clone https://gitportoprd.portoseguro.brasil/portocom/hub-vendas/common/code-reviewer-plug-and-play.git
cd code-reviewer-plug-and-play
npm run check
node tools/install.cjs --dry-run
node tools/install.cjs
```

Abra o hub-ai no VS Code, selecione `code-reviewer` no Copilot Chat e solicite uma revisão das alterações contra a branch base, respeitando o `AGENTS.md`. Para atualizar o reviewer, faça `git pull --ff-only` no clone independente e execute `node tools/install.cjs --update`.

A integração real no Copilot deve ser validada no ambiente autorizado. O hub-ai não modifica o perfil pessoal do desenvolvedor.

O painel apresenta um catálogo informativo de áreas de revisão na rota `/code-reviewer`, com filtros por categoria e busca. Os itens são descrições mantidas pelo hub-ai, não um inventário dinâmico das skills instaladas.
