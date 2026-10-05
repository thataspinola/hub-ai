# Matriz de automação

| Suite | Exemplos | Gate |
| --- | --- | --- |
| Unit | Expiração, normalização, validação | Runner existente por pacote |
| Integration com mocks | SDK send, HTTP/TLS, erro sanitizado | Sem cloud/registry privado fora do ambiente autorizado |
| Automated/contract | Export handler, payload produtor contra consumidor | Contrato público observado |
| Bundle | Imports transitivos e runtime dependencies | Artefato de produção real |
| E2E local | Fluxo completo simulado | Não comprova operação implantada |
| E2E real | Jornadas, retries, DLQ e OAuth/mTLS | Ambiente autorizado e recursos de teste |

Exemplo de comando somente se o script existir: `npm --prefix <pacote> run test:automated`. Em Jest, limitar a suíte pelo testMatch/config ou diretório existente para evitar “sucesso” com zero testes. Relatórios de CI devem falhar se a suíte esperada não for encontrada.

Revalidar consumidores quando shared-modules ou contratos mudarem. Registrar lista de pacotes, comandos e resultado; não inferir cobertura por nome de pasta. Invariantes de configuração estática não substituem testes funcionais ou validação Terraform.
