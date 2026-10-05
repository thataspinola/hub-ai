---
name: node-delivery
description: "Revisar entrega de backends Node.js/Lambda com múltiplos pacotes, dependências de produção, Terraform e CI/CD corporativo. Usar para empacotamento, checks de infraestrutura, runbooks e prontidão."
---

# node-delivery

1. Descobrir pipeline vigente, ambientes, runtime, build, handler e layout do ZIP. Não substituir Jenkins/GitLab por outro sistema de CI.
2. Verificar imports transitivos no artefato final, incluindo shared-modules. Dependências de runtime precisam estar no bundle ou em layer explicitamente verificada; devDependencies disponíveis nos testes não comprovam disponibilidade na Lambda.
3. Inspecionar npm ci --omit=dev e verificar o pacote resultante sem acessar cloud. Não importar um handler para teste de cold start se isso executar efeitos externos no carregamento.
4. Conferir handlers, archive paths, variáveis/schemas, IAM, timeout, DLQ e retry junto ao código. Rodar fmt/validate sem backend conforme ferramentas e políticas locais; init pode exigir rede/providers.
5. Separar evidência local de plan autenticado, cold start implantado, handshake OAuth/mTLS e fluxo real. Não marcar pendência operacional como concluída só por testes com mocks.
6. Registrar pendências em documento existente com evidência, ambiente, responsável e próximo critério de aceite. Preparar runbook sanitizado para VDI, sem copiar credenciais.
7. Não executar plan autenticado, apply, invocação real ou deploy a partir da configuração do Copilot; seguir autorização e pipeline de entrega do projeto.

Consultar [padrões e cenários](references/patterns.md) para adaptar a análise a um projeto concreto.
