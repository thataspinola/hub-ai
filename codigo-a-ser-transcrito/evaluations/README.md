# Avaliação de comportamento

O cenário sem defeito intencional em scenarios/node-clean permite medir falsos positivos sem exigir infraestrutura de uma função pura. O cenário em scenarios/node-review fornece pacote sintético com defeitos conhecidos. Não instalar nem executar esse pacote; revisar estaticamente. O exemplo funcional em examples/node-backend é a suíte executável segura.

1. Dar ao reviewer apenas o cenário, agentes e skills; não fornecer rubric.json nem relatórios anteriores.
2. Guardar saída bruta, data, executor/modelo, versão do hub e limitações.
3. Um avaliador confere cada finding contra o código e preenche matched_expected e false_positives usando rubric.json. Não contar sugestões como defeitos comprovados.
4. Executar `node scripts/score-evaluation.js evaluations/results/node-review.json`.
5. Comparar precisão e recall entre versões; incluir casos novos e casos sem defeito antes de usar métricas para adoção corporativa.

O scorer valida e calcula uma adjudicação; ele não executa o Copilot nem comprova sozinho a qualidade semântica. Resultados de uma execução são uma evidência limitada, não certificação de todos os agentes/executores.

A execução registrada em [resultado](results/node-review.raw.md) identificou os quatro critérios esperados (um agrupado à falha parcial), com precisão/recall adjudicados de 1.0 neste cenário. O resultado não deve ser extrapolado para outros projetos.
