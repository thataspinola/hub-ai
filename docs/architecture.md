# Responsabilidades e dependências

A arquitetura usa composição e contratos pequenos. Os caminhos públicos dos componentes e `useRecommendationStore` foram preservados; telas, schemas JSON, chaves de armazenamento e protocolo de preview continuam compatíveis.

| Área                       | Composição/apresentação                                                | Comportamento e regras                                                                               |
| -------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Propriedades de formulário | properties-panel.tsx escolhe o editor                                  | properties/ agrupa editores de etapa, conteúdo, campos, documentos, ações e planos                   |
| CRUD de flags              | FeatureFlagCrud.tsx e feature-flag-crud/ compõem tabelas/modais        | use-flag-crud.ts concentra estado, filtros e operações; recebe storage e sincronização por parâmetro |
| Regras de recomendações    | RecommendationRules.tsx e recommendation-rules/                        | Editores separados por defaults, afinidade, popularidade, campanhas, slots e histórico               |
| Estado de recomendações    | store.ts compõe a instância Zustand                                    | actions/ separa operações por capacidade; data-model.ts contém defaults e migração                   |
| Persistência e preview     | browser-adapters.ts integra IndexedDB, localStorage e BroadcastChannel | persistence.ts define contratos e coordena gravação; não conhece o browser                           |

## SOLID aplicado ao projeto

- **Responsabilidade única:** componentes de seleção, editores, regras, coordenação de gravação e adapters têm motivos de alteração diferentes e ficam separados.
- **Extensão:** outro repositório ou preview pode implementar os contratos de persistence.ts e ser composto na criação do store, sem alterar os editores ou regras.
- **Substituição:** adapters devem manter o comportamento do contrato, inclusive propagação de falhas; testes usam repositórios em memória e falhas controladas. Tipagem sozinha não prova equivalência de comportamento.
- **Interfaces pequenas:** carregamento/gravação e publicação de preview têm contratos separados. Os editores recebem somente dados e callbacks pertinentes.
- **Inversão de dependência:** regras recebem um contexto tipado; o hook de flags recebe o storage e a sincronização. O acesso concreto ao browser fica na composição/adapters.

Não é necessário introduzir classes ou hierarquias para aplicar esses princípios. Os contratos extras existem nas fronteiras com I/O; funções locais simples continuam funções.

## Persistência de recomendações

`createRecommendationStore` aceita efeitos injetáveis e preserva a instância pública `useRecommendationStore`. Cada instância de efeitos possui seu próprio debounce e fila de gravações. Gravações assíncronas são serializadas, e callbacks de revisões antigas não marcam a revisão atual como sincronizada.

A publicação no preview acontece após a gravação. Falha deixa o estado `syncStatus` como `error`, mantendo os dados em memória; não é reportada como sucesso. `dispose` cancela callbacks pendentes da instância, mas não desfaz uma gravação já iniciada.

A criação de campanha é idempotente: cria uma campanha ausente e preserva campanhas existentes, incluindo seus alvos. Export/import e formatos persistidos continuam os mesmos.

## Evolução e validação

Novos tipos de editor ficam no agrupamento correspondente; alterações de schema exigem migração e testes. Evitar adicionar I/O diretamente aos editores ou duplicar a coordenação de gravação em cada ação.

Os testes de interface existentes protegem os contratos públicos. Testes do store cobrem migração, debounce, isolamento de instâncias, ordem de gravação, falhas, campanhas e export/import. Build e testes locais não substituem homologação no editor, navegadores, VDI ou serviços corporativos reais.
