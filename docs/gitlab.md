# GitLab e Jenkins

GitLab é o provedor de repositório, merge requests e CI deste hub. `.gitlab-ci.yml` executa validações dos recursos e exemplos Node. Não faz deploy nem instala pipelines nos projetos consumidores; Jenkins pode continuar sendo o caminho de entrega já utilizado.

O workflow cria pipelines de MR e evita duplicação de push quando a branch tem MR aberto. A validação de YAML local não substitui CI Lint do GitLab ou execução num runner autorizado. Imagens Node e registry precisam estar disponíveis no ambiente corporativo; adaptar ao registry aprovado quando necessário. Nunca mover credenciais para fora da VDI.

## Customização do editor

`.github/agents`, `.github/skills` e `.github/copilot-instructions.md` são convenções do executor Copilot. Seu nome não define o provedor Git. Não renomear essas pastas para .gitlab esperando descoberta automática pelo editor. Se usarem outro assistente, adaptar o formato para seu executor; descoberta no editor continua pendente de validação.

## Merge requests

Usar base e head reais do MR, via integração autorizada GitLab ou git local. Não converter um número de MR em PR GitHub. Comentários automáticos no MR exigem autorização e integração próprias; os agentes do hub geram relatórios locais por padrão.

## Publicação

Alterações precisam ser enviadas ao remote GitLab correto. Não inferir uma URL corporativa ou usar o antigo remote GitHub como destino. Se GitLab/Jenkins estiverem restritos à VDI, aplicar o commit/patch no checkout autorizado e publicar de lá. Não substituir definições externas de Jenkins nem instalar deploys para resolver a ausência de acesso nesta sessão.
