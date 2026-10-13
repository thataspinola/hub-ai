# Avaliar o Code Reviewer

Os casos frontend ficam em resources/frontend/evaluations/review e clean. Contêm código sintético para avaliação, fora do lint/build do produto. Os arquivos não devem ser importados nem implantados pela aplicação.

1. Obter uma versão fixa dos agentes/skills e registrar o SHA, versão do editor/modelo e data.
2. Apresentar cada caso separadamente ao reviewer com o mesmo prompt. Não fornecer o rubric, lista de erros esperados nem relatório anterior.
3. Guardar o resultado bruto em tooling/web-code-reviewer/evaluations/results, sem editar os achados.
4. Um avaliador humano deve relacionar os achados ao código, contar falsos positivos e preencher a adjudicação JSON.
5. Executar a pontuação e registrar também as falhas omitidas. Sugestões opcionais não são necessariamente bugs.

```sh
node tools/evaluate-reviewer.cjs list
node tools/evaluate-reviewer.cjs score /caminho/adjudicacao.json
```

Estrutura do JSON, substituindo os campos pela avaliação real:

```json
{
  "scenario": "frontend-review",
  "matched_expected": [],
  "false_positives": 0,
  "adjudicator": "NOME_DO_AVALIADOR",
  "raw_report": "evaluations/results/frontend-review.raw.md"
}
```

As rubricas frontend-review/frontend-clean estão em tooling/web-code-reviewer/evaluations/rubric.json. O script exige relatório bruto existente dentro do toolkit, rejeita IDs inventados e calcula recall, precision e omissões. Para o caso limpo sem achados, métricas sem denominador são null; isso não representa precisão 100% comprovada.

Os testes do script verificam os cálculos e as validações de entrada. Não certificam o comportamento semântico do modelo. A nova avaliação frontend no editor permanece pendente; avaliações backend pertencem ao backend-code-reviewer. Não foram inventados relatórios ou notas de qualidade para esta versão.
