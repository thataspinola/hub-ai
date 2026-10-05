# Diretrizes — {{SCOPE}}

## Escopo e evidências

{{LOCAL_README_DOCS_CONTRACTS_AND_PARENT_GUIDANCE}}

## Arquitetura

{{MODULE_SYSTEM_LAYERS_PUBLIC_EXPORTS_AND_DEPENDENCIES}}

## Validação

{{EXISTING_TEST_SCRIPTS_CONTRACT_AND_BUNDLE_CHECKS}}

## Segurança

Validar entrada antes de efeitos. Não expor credenciais, tokens, CPF, certificados ou chaves em logs, eventos e fixtures. Usar referências de segredo; manter TLS peer verification e erros sanitizados. Confirmar semântica de retry do transporte.

## Domínio e entrega

{{DOMAIN_RULES_PIPELINE_AND_ENVIRONMENT_RESTRICTIONS}}

Concluir com código, contratos, testes, infraestrutura e documentação coerentes; registrar validações reais pendentes separadamente.
