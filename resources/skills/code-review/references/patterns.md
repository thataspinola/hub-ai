# Checklist Detalhado de Code Review

## Checklist por Categoria

### 1. Correctness (Funciona Corretamente?)

```markdown
- [ ] A lógica implementada resolve o problema proposto?
- [ ] Edge cases estão tratados?
  - [ ] Arrays vazios
  - [ ] Valores null/undefined
  - [ ] Strings vazias
  - [ ] Números negativos ou zero
- [ ] Condicionais estão corretas? (>, >=, <, <=, ===)
- [ ] Loops terminam corretamente?
- [ ] Async/await usado corretamente?
- [ ] Promises tratam rejection?
```

### 2. Security (É Seguro?)

```markdown
- [ ] Inputs do usuário são sanitizados?
- [ ] Dados sensíveis (CPF, email, telefone) encriptados no storage?
- [ ] Nenhum dado sensível em logs ou console?
- [ ] Tokens não expostos em URLs?
- [ ] XSS prevenido (sem dangerouslySetInnerHTML não sanitizado)?
- [ ] CSRF considerado em forms?
- [ ] reCAPTCHA em ações críticas (submit, pagamento)?
- [ ] Headers de segurança aplicados?
```

### 3. Performance (É Performático?)

```markdown
- [ ] Operações custosas memoizadas (useMemo)?
- [ ] Callbacks estáveis para componentes memoizados (useCallback)?
- [ ] Store acessada com seletores específicos?
- [ ] useShallow usado para múltiplos valores de store?
- [ ] Listas grandes virtualizadas?
- [ ] Imagens otimizadas (next/image)?
- [ ] Code splitting aplicado para rotas/componentes pesados?
- [ ] React Query com staleTime adequado?
- [ ] Debounce em inputs de busca?
```

### 4. Maintainability (É Fácil de Manter?)

```markdown
- [ ] Código auto-explicativo ou bem comentado?
- [ ] Funções pequenas e com responsabilidade única?
- [ ] Nomes descritivos (variáveis, funções, componentes)?
- [ ] Sem código duplicado?
- [ ] Sem código morto (comentado ou não utilizado)?
- [ ] Complexidade ciclomática baixa (<10)?
- [ ] Estrutura de pastas consistente?
- [ ] Tipos reutilizáveis extraídos?
```

### 5. Readability (É Fácil de Ler?)

```markdown
- [ ] Formatação consistente (Biome)?
- [ ] Imports organizados e usando aliases?
- [ ] Indentação correta?
- [ ] Linha não muito longa (<80 chars)?
- [ ] Early returns para reduzir aninhamento?
- [ ] Ternários simples (sem aninhamento)?
- [ ] Comentários claros onde necessário?
```

### 6. Testability (É Testável?)

```markdown
- [ ] Lógica separada de UI (hooks extraídos)?
- [ ] Dependências injetáveis (não hardcoded)?
- [ ] Side effects isolados em hooks?
- [ ] Componentes puros quando possível?
- [ ] Testes acompanham a mudança?
```

### 7. Accessibility (É Acessível?)

```markdown
- [ ] Todos inputs têm label associado?
- [ ] Imagens têm alt text apropriado?
- [ ] Hierarquia de headings correta (h1 > h2 > h3)?
- [ ] Contraste de cores adequado (4.5:1)?
- [ ] Focus visible em elementos interativos?
- [ ] aria-invalid em campos com erro?
- [ ] aria-describedby linkando mensagens de erro?
- [ ] Navegação por teclado funciona?
- [ ] role="alert" em mensagens dinâmicas?
```

## Questões para Discussão

### Arquitetura

```markdown
1. Esta mudança está no lugar certo?
   - Lógica de negócio em hooks?
   - API calls em services?
   - Estado global em stores?
   - Apenas UI em components?

2. Há acoplamento excessivo?
   - Componente depende de muitos outros?
   - Hook acessa muitas stores?

3. A abstração está no nível certo?
   - Muito genérica (difícil de usar)?
   - Muito específica (não reutilizável)?
```

### Trade-offs

```markdown
1. Performance vs Legibilidade
   - Otimização prematura?
   - Memoização necessária ou excessiva?

2. DRY vs Clareza
   - Abstração forçada para "não repetir"?
   - Código duplicado que deveria ser extraído?

3. Flexibilidade vs Simplicidade
   - Props demais "para o futuro"?
   - Muito rígido para casos de uso reais?
```

## Review de PRs Específicos

### PR de Nova Feature

```markdown
Verificar:

- [ ] Requisitos atendidos
- [ ] Testes da feature
- [ ] Documentação atualizada (se necessário)
- [ ] Não quebra features existentes
- [ ] Performance aceitável
- [ ] Acessibilidade implementada
```

### PR de Bug Fix

```markdown
Verificar:

- [ ] Root cause identificado
- [ ] Fix resolve o problema
- [ ] Teste que previne regressão
- [ ] Não introduz novos bugs
- [ ] Changelog/comentário explicando o fix
```

### PR de Refactoring

```markdown
Verificar:

- [ ] Comportamento externo não mudou
- [ ] Testes passando (não alterados)
- [ ] Melhoria mensurável (performance, legibilidade)
- [ ] Sem mudanças funcionais misturadas
```

### PR de Dependência

```markdown
Verificar:

- [ ] Versão estável (não alpha/beta para prod)
- [ ] Changelog da dependência revisado
- [ ] Breaking changes tratados
- [ ] Bundle size impactado?
- [ ] Vulnerabilidades conhecidas (npm audit)?
```

## Comunicação Efetiva

### Princípios

```markdown
1. **Seja específico**: Aponte linha exata, sugira alternativa
2. **Seja construtivo**: Foque na solução, não no problema
3. **Seja respeitoso**: Critique o código, não a pessoa
4. **Seja educativo**: Explique o "porquê" quando rejeitar
5. **Seja pragmático**: Não bloqueie por estilo se funciona
```

### Quando Aprovar

```markdown
✅ Aprovar quando:

- Funciona corretamente
- Não tem problemas de segurança
- Segue padrões do projeto
- Tem testes adequados
- Sugestões são opcionais

🔵 Request changes quando:

- Bug identificado
- Problema de segurança
- Violação grave de padrões
- Falta testes críticos
- Performance inaceitável

⚪ Comentar sem bloquear quando:

- Sugestões de melhoria
- Dúvidas sobre decisões
- Oportunidades de refactoring futuro
```

### Anti-Padrões de Review

```markdown
❌ Evitar:

- Nitpicking excessivo (formatação que o linter deveria pegar)
- Bikeshedding (debate infinito sobre nomes)
- Bloquear por preferência pessoal
- Comentários vagos ("isso não está bom")
- Reescrever o PR do autor
- Demorar dias para revisar

✅ Preferir:

- Foco em issues reais
- Sugestões concretas
- Aprovar com sugestões opcionais
- Resposta rápida (< 24h)
- Pair programming se complexo
```

## Automação de Review

### Ferramentas

```bash
# Antes de abrir PR
npm run lint          # Biome
npm run typing:check  # TypeScript
npm run test          # Vitest
npm run build         # Verifica build

# CI deve rodar automaticamente
# Só revisar manualmente se CI passar
```

### O que Automatizar vs Revisar Manualmente

| Automatizar        | Revisar Manualmente |
| ------------------ | ------------------- |
| Formatação (Biome) | Lógica de negócio   |
| Type errors        | Arquitetura         |
| Lint rules         | Naming              |
| Test coverage      | Performance         |
| Build success      | Acessibilidade      |
| Bundle size        | UX decisions        |

## Métricas de Review

### Tempo

| Métrica             | Meta  |
| ------------------- | ----- |
| First response      | < 4h  |
| Review completo     | < 24h |
| Iterações até merge | ≤ 2   |

### Qualidade

| Métrica                    | Meta      |
| -------------------------- | --------- |
| Bugs encontrados em review | Minimizar |
| Bugs escapados para prod   | Zero      |
| PRs revertidos             | Zero      |

