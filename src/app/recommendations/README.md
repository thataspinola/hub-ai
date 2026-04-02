# Systasi - Sistema de Recomendacao de Produtos

Sistema completo para gestao e exibicao de recomendacoes de produtos baseado em regras configuráveis. Inclui painel administrativo, motor de recomendacao (engine) e widget injetavel.

## Sumario

- [Visao Geral](#visao-geral)
- [Arquitetura](#arquitetura)
- [Estrutura JSON](#estrutura-json)
- [Regras de Recomendacao](#regras-de-recomendacao)
- [Slots de Contexto](#slots-de-contexto)
- [Painel Administrativo](#painel-administrativo)
- [Widget e Scripts](#widget-e-scripts)
- [Integracao](#integracao)

---

## Visao Geral

O Systasi e um sistema de recomendacao de produtos que funciona de forma totalmente client-side, sem necessidade de backend. Ele utiliza:

- **JSON de configuracao**: Contem o catalogo de produtos e todas as regras de recomendacao
- **Engine (motor)**: Processa as regras e gera as recomendacoes
- **Widget**: Componente visual injetavel que renderiza as recomendacoes

### Caracteristicas Principais

- 100% client-side (funciona sem servidor)
- Configuracao via JSON estatico
- Multiplas estrategias de recomendacao
- Sistema de cascata com fallback
- Persistencia de historico do usuario
- Suporte a campanhas via UTM
- Painel administrativo com storage local

---

## Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                    PAINEL ADMINISTRATIVO                     │
│  (Gerencia catalogo e regras, persiste em IndexedDB)        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      DATA.JSON                               │
│  (Catalogo de produtos + Regras de recomendacao)            │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
┌──────────────────────┐         ┌──────────────────────┐
│      WIDGET.JS       │────────▶│      ENGINE.JS       │
│  (Carrega e renderiza│         │  (Processa regras e  │
│   recomendacoes)     │◀────────│   gera candidatos)   │
└──────────────────────┘         └──────────────────────┘
              │
              ▼
┌──────────────────────────────────────────────────────────────┐
│                    PAGINA DO CLIENTE                          │
│  (Widget injetado renderiza cards de produtos)               │
└──────────────────────────────────────────────────────────────┘
```

---

## Estrutura JSON

O arquivo `data.json` e o coracao do sistema. Ele contem duas secoes principais:

### Catalogo (`catalog`)

```json
{
  "catalog": {
    "products": [
      {
        "url": "/produto/seguro-auto",
        "name": "Seguro Auto",
        "category": "Seguros",
        "description": "Protecao completa para seu veiculo",
        "image": "https://exemplo.com/imagem.jpg",
        "price": {
          "prefix": "A partir de",
          "value": "R$ 89,90",
          "currency": "BRL"
        },
        "cta": {
          "text": "Saiba mais",
          "style": "primary"
        },
        "badges": ["Mais vendido", "Promocao"]
      }
    ],
    "categories": ["Seguros", "Financeiro", "Servicos"]
  }
}
```

#### Campos do Produto

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `url` | string | Sim | Identificador unico (path ou URL completa) |
| `name` | string | Sim | Nome de exibicao do produto |
| `category` | string | Sim | Categoria do produto |
| `description` | string | Nao | Descricao curta |
| `image` | string | Nao | URL da imagem |
| `price` | object | Nao | Informacoes de preco |
| `cta` | object | Nao | Configuracao do botao de acao |
| `badges` | array | Nao | Lista de badges/etiquetas |

### Regras de Recomendacao (`recommendationRules`)

```json
{
  "recommendationRules": {
    "defaults": {
      "limit": 12,
      "minItems": 4,
      "deduplicateByField": "url",
      "excludeCurrentItem": true
    },
    "types": {
      "same_category": { ... },
      "affinity_manual": { ... },
      "history_recent": { ... },
      "popularity_global": { ... },
      "campaign": { ... },
      "context_slot": { ... },
      "profile_static": { ... }
    }
  }
}
```

---

## Regras de Recomendacao

O sistema suporta multiplas estrategias que podem ser combinadas em cascata.

### 1. Mesma Categoria (`same_category`)

Recomenda produtos da mesma categoria do item atual.

```json
{
  "same_category": {
    "description": "Recomenda produtos da mesma categoria",
    "params": {
      "maxCandidates": 50
    }
  }
}
```

**Funcionamento:**
1. Identifica a categoria do produto atual (via URL)
2. Busca todos os produtos da mesma categoria
3. Retorna ate `maxCandidates` produtos

**Exemplo:** Usuario visualiza "Seguro Auto" (categoria: Seguros) → Recomenda outros seguros.

---

### 2. Afinidade Manual (`affinity_manual`)

Permite definir relacoes explicitas entre categorias e/ou URLs especificas.

```json
{
  "affinity_manual": {
    "description": "Afinidade curada entre categorias e URLs",
    "maps": {
      "byCategory": {
        "Seguros": [
          { "targetType": "category", "targetId": "Financeiro", "weight": 90 },
          { "targetType": "url", "targetId": "/produto/consorcio", "weight": 85 }
        ]
      },
      "byUrl": {
        "/produto/seguro-auto": [
          { "targetType": "url", "targetId": "/produto/seguro-residencial", "weight": 95 },
          { "targetType": "category", "targetId": "Assistencia", "weight": 80 }
        ]
      }
    },
    "params": {
      "expandCategoryToUrlsTake": 10
    }
  }
}
```

#### Tipos de Afinidade

**Por Categoria (`byCategory`):**
- Define afinidades para todos os produtos de uma categoria
- Quando usuario visita qualquer produto de "Seguros", aplica as afinidades configuradas

**Por URL (`byUrl`):**
- Define afinidades especificas para um produto
- Maior precisao, prioridade sobre categoria

#### Tipos de Destino

| `targetType` | Descricao |
|--------------|-----------|
| `category` | Expande para todas as URLs da categoria destino |
| `url` | URL especifica de um produto |

#### Peso (`weight`)

- Valor de 0 a 100
- Maior peso = maior prioridade na ordenacao
- Usado para priorizar recomendacoes

**Exemplo:** Usuario em "Seguro Auto" → Recomenda "Seguro Residencial" (peso 95) antes de produtos de "Assistencia" (peso 80).

---

### 3. Historico Recente (`history_recent`)

Recomenda baseado no historico de navegacao do usuario.

```json
{
  "history_recent": {
    "description": "Baseado no historico do usuario",
    "params": {
      "maxRecent": 5,
      "excludeCurrent": true
    }
  }
}
```

**Funcionamento:**
1. Widget armazena URLs visitadas em `localStorage`
2. Engine consulta historico e aplica afinidades dos itens visitados
3. Combina afinidades para gerar recomendacoes personalizadas

**Persistencia:** O historico e armazenado em `localStorage` com a chave `systasi_recent_urls` (ate 20 URLs).

---

### 4. Popularidade Global (`popularity_global`)

Ranking manual de produtos mais populares.

```json
{
  "popularity_global": {
    "description": "Ranking global de URLs mais populares",
    "ranking": {
      "urls": [
        "/produto/seguro-auto",
        "/produto/cartao-credito",
        "/produto/consorcio"
      ],
      "windowDays": 7,
      "metric": "sortWeight"
    },
    "metadata": {
      "source": "admin-panel",
      "computedAt": "2024-01-15T10:00:00Z"
    }
  }
}
```

**Funcionamento:**
- Lista ordenada de URLs (primeiro = mais popular)
- Usado como fallback quando outras estrategias nao geram candidatos suficientes
- Ranking pode ser definido manualmente no painel

---

### 5. Campanha (`campaign`)

Recomendacoes personalizadas por campanha de marketing.

```json
{
  "campaign": {
    "description": "Recomenda produtos baseados no utm_campaign",
    "campaigns": {
      "black-friday-2024": {
        "description": "Campanha Black Friday",
        "targets": [
          { "targetType": "category", "targetId": "Promocoes", "weight": 100 },
          { "targetType": "url", "targetId": "/produto/seguro-promo", "weight": 95 }
        ]
      },
      "lancamento-produto": {
        "description": "Lancamento novo produto",
        "targets": [
          { "targetType": "url", "targetId": "/produto/novo", "weight": 100 }
        ]
      }
    },
    "params": {
      "expandCategoryToUrlsTake": 10,
      "sessionStorageKey": "reco_campaign_id"
    }
  }
}
```

#### Captura de Campanha

O widget captura automaticamente o parametro `utm_campaign` da URL:

```
https://site.com/pagina?utm_campaign=black-friday-2024
```

#### Persistencia em Sessao

- Campanha e armazenada em `sessionStorage`
- Persiste durante toda a sessao de navegacao
- Se usuario entrar via nova campanha, a anterior e substituida

#### Override Manual

Pode ser definido diretamente no script:

```html
<script 
  src="widget.js"
  data-reco-campaign="black-friday-2024">
</script>
```

---

## Slots de Contexto

Slots permitem configurar diferentes comportamentos por pagina/contexto.

```json
{
  "context_slot": {
    "description": "Configuracao por slot/pagina",
    "slots": {
      "pdp_related": {
        "name": "Produtos Relacionados (PDP)",
        "cascade": ["affinity_manual", "same_category", "campaign", "popularity_global"],
        "limit": 12,
        "minItems": 4
      },
      "home_trending": {
        "name": "Em Alta (Home)",
        "cascade": ["campaign", "popularity_global"],
        "limit": 8,
        "minItems": 4
      },
      "cart_upsell": {
        "name": "Upsell (Carrinho)",
        "cascade": ["history_recent", "affinity_manual", "popularity_global"],
        "limit": 4,
        "minItems": 2
      }
    }
  }
}
```

### Configuracao do Slot

| Campo | Descricao |
|-------|-----------|
| `name` | Nome descritivo do slot |
| `cascade` | Lista ordenada de estrategias a aplicar |
| `limit` | Maximo de recomendacoes a exibir |
| `minItems` | Minimo de itens (fallback para popular se nao atingir) |

### Sistema de Cascata

A cascata define a ordem de prioridade das estrategias:

```
┌─────────────────┐
│ affinity_manual │ ← Primeira tentativa
└────────┬────────┘
         │ Se nao atingir limite...
         ▼
┌─────────────────┐
│  same_category  │ ← Segunda tentativa
└────────┬────────┘
         │ Se nao atingir limite...
         ▼
┌─────────────────┐
│    campaign     │ ← Terceira tentativa
└────────┬────────┘
         │ Se nao atingir limite...
         ▼
┌─────────────────────┐
│ popularity_global   │ ← Fallback final
└─────────────────────┘
```

**Deduplicacao:** Produtos ja adicionados por estrategias anteriores sao automaticamente excluidos.

---

## Painel Administrativo

Interface web para gerenciar catalogo e regras sem necessidade de editar JSON manualmente.

### Armazenamento Local

O painel utiliza **IndexedDB** para persistencia:

- Dados salvos automaticamente a cada alteracao (debounce de 500ms)
- Persiste entre sessoes e atualizacoes de pagina
- Nao requer backend ou banco de dados

```
┌─────────────────────────────────────────┐
│           PAINEL ADMIN                   │
│  ┌─────────────────────────────────┐    │
│  │  Edita catalogo e regras       │    │
│  └──────────────┬──────────────────┘    │
│                 │                        │
│                 ▼                        │
│  ┌─────────────────────────────────┐    │
│  │  Zustand Store (memoria)        │    │
│  └──────────────┬──────────────────┘    │
│                 │ debounce 500ms        │
│                 ▼                        │
│  ┌─────────────────────────────────┐    │
│  │  IndexedDB (persistencia)       │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

### Funcionalidades

#### Catalogo
- Adicionar/editar/remover produtos
- Gerenciar categorias
- Configurar precos, imagens, badges

#### Regras
- Configurar afinidades por categoria e URL
- Definir pesos de priorizacao
- Gerenciar ranking de popularidade
- Criar campanhas com regras especificas
- Configurar slots de contexto

#### Import/Export
- Importar JSON existente
- Exportar configuracao atual
- Visualizar estrutura JSON
- Resetar para valores padrao

#### Preview
- Visualizar recomendacoes em tempo real
- Testar diferentes slots
- Simular campanhas
- Configurar URL de contexto

### Sincronizacao com Preview

O painel sincroniza automaticamente com abas de preview abertas via `BroadcastChannel`:

```
┌─────────────┐    BroadcastChannel    ┌─────────────┐
│ Painel Admin│ ──────────────────────▶│   Preview   │
│             │                        │             │
│ Edita regra │ ───── "DATA_UPDATE" ──▶│ Atualiza    │
│             │                        │ widget      │
└─────────────┘                        └─────────────┘
```

---

## Widget e Scripts

### Arquivos

| Arquivo | Descricao |
|---------|-----------|
| `widget.js` | Script principal que carrega e renderiza recomendacoes |
| `engine.js` | Motor de recomendacao (processa regras) |
| `style.css` | Estilos do widget |
| `data.json` | Configuracao (catalogo + regras) |

### Integracao Basica

```html
<script 
  async 
  src="https://seu-cdn.com/widget.js"
  data-reco-instance="2.0.0"
  data-reco-engine="https://seu-cdn.com/engine.js"
  data-reco-data="https://seu-cdn.com/data.json"
  data-reco-css="https://seu-cdn.com/style.css"
  data-reco-slot="pdp_related"
  data-reco-anchor="#recommendations-container"
  data-reco-anchor-mode="append"
  data-reco-limit="12"
  data-reco-title="Produtos Relacionados">
</script>
```

### Atributos do Script

#### Obrigatorios

| Atributo | Descricao |
|----------|-----------|
| `data-reco-engine` | URL do engine.js |
| `data-reco-data` | URL do data.json |
| `data-reco-slot` | ID do slot de contexto |
| `data-reco-anchor` | Seletor CSS do elemento ancora |

#### Opcionais

| Atributo | Default | Descricao |
|----------|---------|-----------|
| `data-reco-instance` | - | Versao/ID da instancia |
| `data-reco-css` | - | URL do arquivo de estilos |
| `data-reco-anchor-mode` | `after` | `append` (dentro) ou `after` (apos) |
| `data-reco-anchor-retry` | `2000` | Tempo (ms) para aguardar ancora |
| `data-reco-limit` | `12` | Maximo de recomendacoes |
| `data-reco-loading-ms` | `300` | Tempo de loading antes de render |
| `data-reco-title` | `Recomendacoes` | Titulo do bloco |
| `data-reco-layout` | `grid` | Layout (`grid` ou `carousel`) |
| `data-reco-cta-text` | `Saiba mais` | Texto do botao |
| `data-reco-cta-style` | `primary` | Estilo do botao |
| `data-reco-max-width` | `1336px` | Largura maxima do widget |
| `data-reco-margin-bottom` | `48px` | Margem inferior |
| `data-reco-history` | `true` | Habilitar historico (`0` para desligar) |
| `data-reco-use-query` | `0` | Incluir query string na URL |
| `data-reco-context-url` | - | URL de contexto manual (override) |
| `data-reco-campaign` | - | ID de campanha manual (override) |

### Fluxo de Execucao

```
1. Widget.js carrega
       │
       ▼
2. Aguarda ancora (elemento DOM)
       │
       ▼
3. Carrega engine.js + data.json em paralelo
       │
       ▼
4. Registra URL atual no historico (localStorage)
       │
       ▼
5. Detecta campanha (utm_campaign ou sessionStorage)
       │
       ▼
6. Engine processa cascata de regras
       │
       ▼
7. Resolve candidatos para produtos completos
       │
       ▼
8. Renderiza cards no container
```

### URL de Contexto (`data-reco-context-url`)

Permite exibir recomendacoes baseadas em um produto especifico, mesmo estando em outra pagina:

```html
<!-- Em qualquer pagina, mostra recomendacoes como se estivesse em /produto/seguro-auto -->
<script 
  src="widget.js"
  data-reco-slot="pdp_related"
  data-reco-context-url="/produto/seguro-auto"
  data-reco-anchor="#container">
</script>
```

**Casos de uso:**
- Sites parceiros exibindo recomendacoes de produtos
- Landing pages com contexto especifico
- Emails com recomendacoes personalizadas

### Layouts

#### Grid (padrao)
```
┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐
│     │ │     │ │     │ │     │
│ P1  │ │ P2  │ │ P3  │ │ P4  │
│     │ │     │ │     │ │     │
└─────┘ └─────┘ └─────┘ └─────┘
┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐
│     │ │     │ │     │ │     │
│ P5  │ │ P6  │ │ P7  │ │ P8  │
│     │ │     │ │     │ │     │
└─────┘ └─────┘ └─────┘ └─────┘
```

#### Carousel
```
     ◀ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ▶
       │     │ │     │ │     │ │     │
       │ P1  │ │ P2  │ │ P3  │ │ P4  │
       │     │ │     │ │     │ │     │
       └─────┘ └─────┘ └─────┘ └─────┘
```

---

## Integracao

### Exemplo Completo

```html
<!DOCTYPE html>
<html>
<head>
  <title>Minha Loja</title>
</head>
<body>
  <main>
    <h1>Detalhes do Produto</h1>
    <!-- Conteudo da pagina -->
    
    <!-- Container para recomendacoes -->
    <div id="recommendations"></div>
  </main>

  <!-- Widget de recomendacoes -->
  <script 
    async 
    src="https://cdn.exemplo.com/systasi/widget.js"
    data-reco-engine="https://cdn.exemplo.com/systasi/engine.js"
    data-reco-data="https://cdn.exemplo.com/systasi/data.json"
    data-reco-css="https://cdn.exemplo.com/systasi/style.css"
    data-reco-slot="pdp_related"
    data-reco-anchor="#recommendations"
    data-reco-anchor-mode="append"
    data-reco-limit="8"
    data-reco-title="Voce tambem pode gostar">
  </script>
</body>
</html>
```

### Multiplos Widgets na Mesma Pagina

```html
<!-- Recomendacoes do PDP -->
<div id="pdp-reco"></div>
<script src="widget.js" data-reco-slot="pdp_related" data-reco-anchor="#pdp-reco"></script>

<!-- Upsell no carrinho -->
<div id="cart-reco"></div>
<script src="widget.js" data-reco-slot="cart_upsell" data-reco-anchor="#cart-reco"></script>
```

### Debugging

Adicione `?debug=1` na URL para ativar logs no console:

```
https://site.com/produto?debug=1
```

Logs incluem:
- Configuracao carregada
- Input do engine
- Candidatos gerados por cada estrategia
- Produtos resolvidos
- Campanha ativa

---

## Retrocompatibilidade

O sistema migra automaticamente JSONs antigos:

- Estruturas ausentes sao criadas com valores padrao
- Novos campos (como `campaign`) sao adicionados automaticamente
- Dados existentes sao preservados

---

## Versionamento

Os scripts seguem versionamento semantico:

- **widget.js**: v2.5.0
- **engine.js**: v2.2.0

Changelog e mantido nos comentarios dos arquivos usando conventional commits.

---

## Suporte

Para duvidas ou problemas:

1. Verifique os logs de debug (`?debug=1`)
2. Confirme que todos os arquivos estao acessiveis (CORS)
3. Valide a estrutura do JSON no painel administrativo
4. Consulte a aba de rede do DevTools para erros de carregamento
