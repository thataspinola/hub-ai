# Matriz de testes backend

| Nível | Escopo | Limite |
| --- | --- | --- |
| Unitário | Factory, validação, decisão | Sem infraestrutura |
| Integração com mocks | SDK/HTTP e orquestração | Não prova serviço externo |
| Contrato | Produtor contra schema consumidor | Não prova roteamento implantado |
| Bundle | Imports e handler no artefato | Não prova cold start na AWS |
| Operacional | OAuth/mTLS e fluxo implantado | Ambiente autorizado necessário |

Em repositórios com pacotes independentes, usar `npm --prefix <pacote> run <script-existente>` após conferir package.json. Só exigir coverage, lint ou typing se forem configurados. Testar timestamp e TTL com relógio controlado, não esperas reais.
