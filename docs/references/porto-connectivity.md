# Referência: porto_connectivity

Análise em 2026-10-05 da main no commit `f0bf34e1bd53c1d91acc9e2695f4e2296272349b` do [repositório](https://github.com/thataspinola/porto_connectivity).

| Arquivo examinado | Padrão extraído |
| --- | --- |
| README.md | Quatro aplicações Lambda independentes; EventBridge, SQS e SNS; documentação corporativa |
| app-token-generator/package.json | JavaScript/CommonJS e Jest, scripts por pacote e engine declarada |
| app-token-generator/AGENTS.md | Handler/controller/activity/factory/API/service e domínio opcional |
| app-token-generator/src/api/AGENTS.md | HTTP/TLS isolado, secrets resolvidos e erros sanitizados |
| shared-modules/AGENTS.md | Compartilhamento neutro com consumidores comprovados |
| shared-modules/jest.preset.js | Ambiente Node, mocks e cobertura definida pelo projeto |
| scripts/build-lambda-packages.js | Bundle com shared-modules e npm ci --omit=dev |
| .github/workflows/ci.yml | Checks suplementares de testes, segurança, bundle e Terraform |
| docs/aws-validation-runbook.md | Produção GitLab/Jenkins e acesso corporativo somente pela VDI |

A leitura mostra uma divergência entre runtime descrito no README (>=22.14.0) e engines de um pacote (>=22.4.0); o setup deve reconciliar fontes, não copiar uma versão universal. Imports SDK em devDependencies tornam necessária a conferência do bundle e das layers/runtime; não concluir pela instalação de desenvolvimento.

Essa referência não certifica correção integral ou implantação do porto_connectivity. Falhas parciais, idempotência, disponibilidade de dependências, IAM e TLS são critérios de revisão a verificar em cada projeto. Não copiar configurações de ambiente, credenciais ou nomes de recursos específicos para novos projetos. Não modificar o projeto de referência como parte da criação deste perfil.
