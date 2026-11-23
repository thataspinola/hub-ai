# Auditoria de reconciliação do merge — 2026-11-06

## Escopo e evidências
- Base: `main` após commit `e7288b471` (`branch com erro`), que modificou 171 arquivos.
- Revisão estática via GitHub; **não** foram executados npm install, lint, typecheck, Jest, Playwright, build nem testes em Keycloak/API corporativa neste ambiente.
- As PRs #22 e #24 já estavam integradas à `main` antes do commit analisado.

## Falha confirmada e corrigida nesta PR
- `src/app/clientes/page.tsx`: o merge removeu `mode="api"` do componente de Clientes no caminho corporativo. Como o componente assume `mode="local"`, usuários autenticados viam dados do navegador em vez da API. Restaurado o modo explícito em ambos os caminhos.
- `.gitignore`: restaurado o versionamento de `.env.example` e a exclusão dos relatórios gerados.
- `AGENTS.md`: removido placeholder de reviewer, corrigida orientação de validação e preservadas restrições corporativas.

## Riscos ainda abertos
1. **Contrato da API de Clientes**: `GET/POST /cliente`, `PUT/DELETE /cliente/{codigo}` e payload `{nome,email}` para escrita são hipóteses. Validar OpenAPI e autorização no backend antes de homologar escrita.
2. **Proteção de rotas**: conferir autenticação e autorização no proxy e nos handlers, inclusive permissões de criação, edição e exclusão. Testar tokens expirados, sem papéis e inválidos.
3. **Regressão ampla**: o merge modificou autenticação, feature flags, recomendações, form wizard, dashboard e testes. Executar suíte completa e revisão por módulo.
4. **Testes duplicados**: coexistem arquivos `.test.*` e `.spec.*` em `__tests__`; reconciliar as versões antes de eliminar qualquer cobertura.
5. **Cobertura**: `jest.config.ts` exige 80%, abaixo da meta acordada de 90%; elevar somente após medir e adicionar os testes faltantes.
6. **CI**: não há execução de GitHub Actions para o SHA desta correção. A validação corporativa GitLab/Jenkins precisa ser executada na VDI.
7. **BasePath**: validar redirecionamento da raiz, rotas autenticadas e chamadas à API em desenvolvimento e ambiente implantado.

## Plano de verificação (Git Bash / Windows)
```bash
npm ci
npm run check:config
npm run lint
npm run typecheck
npm test -- --runInBand
npm run build
npm run test:standalone
npm run test:e2e:list
npm run test:e2e
```

Validar manualmente: dashboard, login/logout e renovação Keycloak; CRUD de Clientes local e corporativo; feature flags; criação/edição/visualização de formulários; recomendações; exportação/importação; permissões e respostas 400/401/403/404/409/500.

## Critério de conclusão
Não declarar o projeto validado nem fazer deploy de operações de escrita corporativas antes de obter logs de execução, contrato de API confirmado e aprovação de homologação.
