# Validação da integração — 2026-10-08

Base remota: main 48304b7. Ferramentas do toolkit 1.5.0 executadas em Node 24.19.0/Linux, com dependências locais previamente preparadas; instalação corporativa da aplicação não foi executada.

| Check | Resultado |
| --- | --- |
| YAML/frontmatter, nomes, perfis, links e catálogo | Passou |
| Testes das ferramentas, auto profile e preservação do consumidor | 33 passaram |
| Exemplo Node | 8 passaram |
| Exemplo Nest local HTTP | 18 passaram |
| Typecheck/build/smoke do exemplo Nest | Passaram |
| Gates de cobertura do exemplo Nest | Passaram, 100% apenas no pequeno exemplo |
| Avaliação sintética histórica | Recall/precision 1, sem nova avaliação semântica |
| Inspeção da aplicação da raiz | nextjs; lock inicialmente vazio, recuperado posteriormente da HPC; scripts declarados |
| Preview de instalação na aplicação atual | Selecionou nextjs, não escreveu arquivos |

Comandos a partir da raiz:

```sh
npm --prefix codigo-a-ser-transcrito run check
npm --prefix examples/nest-backend run test:cov
npm --prefix codigo-a-ser-transcrito run project:inspect
node codigo-a-ser-transcrito/scripts/install.js . --dry-run
```

O novo código em src/, __tests__/, config/, public/ e o agente frontend existente permanece preservado. Além das exclusões de escopo em tsconfig.json/jest.config.ts, foram adicionados recursos frontend, configurações Copilot/AGENTS/instructions e catálogo JSON. O material anterior foi movido para esses caminhos; dependências, scripts e lockfile da aplicação não foram substituídos.

Pendente: npm test/build da aplicação, registry/certificado corporativo, Keycloak/AppConfig reais, descoberta no editor e GitLab/Jenkins. Executar essas verificações na VDI/ambiente autorizado. Estes resultados não certificam deploy nem a aplicação Next completa. O catálogo JSON é uma interface de dados preparada; não há nova tela/endpoint conectada a ele.
