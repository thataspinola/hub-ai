---
name: web-testing
description: 'Criar testes unitários, de componentes, automatizados e E2E web em Angular, React, Next.js e Vue. Usar para regressão, jornada de usuário, testes e gates GitLab/Jenkins.'
---

# web-testing

Descobrir runner e scripts existentes, não instalar um runner por preferência. Testar comportamento e queries acessíveis, carregamento/erro e autorização no servidor. Separar testes unitários/componentes, integração e E2E de navegador. Usar Playwright/Cypress somente se adotados ou a escolha fizer parte do escopo. E2E requer servidor/build real, baseURL e autenticação sintética; registrar comandos e contexto. Definir isolamento, teardown e polling com prazo, sem sleeps arbitrários. Mock de API não comprova integração real. Não publicar cookies/tokens/PII em screenshots, traces ou relatórios. Artefatos GitLab podem conter dados sensíveis: habilitar retenção/acesso conforme política. Manter exit code de falha e validar testes encontrados. Não presumir que o comando npm test serve a todo workspace.
