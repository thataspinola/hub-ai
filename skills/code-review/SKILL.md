---
name: code-review
description: "Code review para frontend React/Next.js. Use para: revisar PRs, analisar código, feedback de qualidade, checklist de revisão, identificar problemas. Keywords: review, revisão, PR, pull request, merge request, análise, feedback, code review."
---

# Code Review

## Modo de Resposta

**Default**: diagnóstico em até 8 bullets, sem blocos de código extensos. Só expandir quando o usuário pedir implementação detalhada ou correção completa.

## Quando Usar

- Revisar Pull Requests ou arquivos específicos
- Dar feedback estruturado sobre qualidade
- Identificar blockers antes de merge

## Quando NÃO Usar

- Para gerar código novo (use `code-standards`)
- Para criar testes (use `unit-testing`)
- Para investigar performance profunda (use `performance`)

## Fluxo em 5 Passos

1. **Escopo**: entender o que mudou e por quê
2. **Validação automática**: `npm run lint && npm run typing:check && npm run test`
3. **Checklist rápido**: qualidade, estrutura, segurança, a11y
4. **Findings**: listar issues com severidade
5. **Veredicto**: APPROVE, REQUEST CHANGES ou BLOCK

## Checklist Rápido

| Área        | Verificar                                        |
| ----------- | ------------------------------------------------ |
| Qualidade   | Lint passa, sem `any` injustificado, naming ok   |
| Estrutura   | Componente/hook/service segue padrão do projeto  |
| Performance | Memoização onde necessário, useShallow em stores |
| Segurança   | Dados sensíveis encriptados, sem logs expostos   |
| A11y        | Labels, ARIA, keyboard navigation                |
| Testes      | Casos principais cobertos                        |

## Severidades

| Prefixo       | Significado            | Ação          |
| ------------- | ---------------------- | ------------- |
| 🔴 BLOCKER    | Segurança, bug crítico | Deve corrigir |
| 🟡 ISSUE      | Problema de qualidade  | Deve corrigir |
| 🔵 SUGGESTION | Melhoria opcional      | Considerar    |
| ⚪ QUESTION   | Dúvida                 | Responder     |
| 🌟 NICE       | Elogio                 | Informativo   |

## Anti-Padrões a Identificar

- `any` sem justificativa
- Ternários aninhados
- Magic numbers
- Código duplicado
- useEffect com muitas responsabilidades
- Props drilling (>3 níveis)
- Estado derivado não memoizado

## Formato de Saída

```markdown
## Resumo

[1-2 frases sobre a mudança]

## Findings

🔴 BLOCKER: [título]
[descrição curta]

🟡 ISSUE: [título]
[descrição curta]

## Veredicto

[ ] ✅ APPROVE | [ ] 🔵 REQUEST CHANGES | [ ] 🔴 BLOCK
```

## Referências

Para templates de feedback, exemplos de código e checklist detalhado por tipo de arquivo, consulte [patterns.md](./references/patterns.md).
