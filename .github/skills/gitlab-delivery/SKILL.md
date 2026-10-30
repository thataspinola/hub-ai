---
name: gitlab-delivery
description: 'Revisar merge requests, pipelines GitLab CI e entrega Jenkins. Usar para CI/CD, diffs de MR, evidências de validação e integração de checks.'
---

# gitlab-delivery

Tratar GitLab como fonte de merge requests e CI; Jenkins pode permanecer o caminho de entrega documentado. Ler .gitlab-ci.yml, includes acessíveis e Jenkinsfile quando presente; não substituir pipeline corporativo por outro sistema de CI. Obter base/head real do MR via integração autorizada ou git fetch/git diff local; não assumir base main ou depender de API GitHub. Se faltar acesso, registrar limitação. Configurar checks pelos scripts reais, runners/imagens disponíveis e regras merge_request_event, evitando pipeline duplicado de branch/MR. Revisar exit codes, cache, artefatos, expiração e variáveis protegidas; não executar código de MR não confiável com secrets de produção. Não copiar token GitLab, chave ou certificado para arquivo versionado. Separar CI Lint/estrutura YAML de execução no runner e de deploy. Usar VDI para recursos corporativos quando exigido. Não gerar Jenkinsfile ou deploy automaticamente quando a integração existente for externa.
