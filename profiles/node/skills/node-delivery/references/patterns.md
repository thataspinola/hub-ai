# Matriz de prontidão

| Evidência | Local/mocks | Ambiente autorizado |
| --- | --- | --- |
| Testes por pacote | Sim | Repetir conforme pipeline |
| Bundle com dependências reais | Sim, se registry disponível | Confirmar artefato entregue |
| Terraform sem backend | Sim, se providers disponíveis | Não substitui plan |
| Plan/estado IAM e rede | Não | Sim |
| Lambda cold start e OAuth/mTLS | Não | Sim |

Antes de npm ci --omit=dev, conferir imports do SDK, bibliotecas e módulos compartilhados. Se depender de layer/runtime, registrar versão e verificar sua existência no ambiente. Não concluir pelo conteúdo de node_modules de desenvolvimento. Manter Jenkins como caminho de produção quando previsto e GitHub Actions como evidência suplementar.
