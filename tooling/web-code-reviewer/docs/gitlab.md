# GitLab, Jenkins e validação do toolkit

Os recursos mantêm suporte a consumidores GitLab/Jenkins. O repositório de trabalho atual continua sendo o GitHub autorizado pelo usuário. Não inferir acesso a um GitLab corporativo nem alterar o caminho de entrega existente.

A aplicação atual contém pom.xml/config/, mas não versiona .gitlab-ci.yml ou Jenkinsfile nesta revisão. O toolkit não depende de um CI inexistente: sua validação YAML de .gitlab-ci.yml só ocorre quando esse arquivo existir dentro do módulo. Não recriar a pipeline antiga na raiz nem afirmar que um runner executou verificações locais.

Gates locais preparados para serem chamados no pipeline aprovado:

```sh
npm --prefix tooling/web-code-reviewer run validate
npm --prefix tooling/web-code-reviewer test
npm --prefix tooling/web-code-reviewer run check
```

Instalar dependências do toolkit com seu próprio package.json/lockfile antes de check. A aplicação usa seu package.json e scripts separados. Manter registry, certificado, VDI e aprovações corporativas; não contornar restrições de acesso.

`.github/agents`, `.github/skills` e `.github/copilot-instructions.md` são convenções do editor, não provedor Git. O instalador preserva agentes existentes e não substitui CI/Jenkins dos consumidores. MR GitLab exige base/head reais e integração autorizada; não converter número de MR em PR GitHub. Relatórios de reviewers são locais por padrão.
