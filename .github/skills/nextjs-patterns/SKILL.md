---
name: nextjs-patterns
description: 'Implementar e revisar aplicações Next.js. Usar para setup, arquitetura, componentes, dados, testes e correções específicas deste framework.'
---

# Padrões Next.js

Detectar versão Next.js, App Router/Pages Router e configurações. Preservar router existente; não migrar automaticamente. Separar server/client boundaries: não importar segredo ou API de servidor em componente cliente. Validar autorização em API/ações de servidor, não só esconder UI. Conferir caching/revalidation e uso por usuário conforme versão e contrato real; não presumir defaults de outra versão. Testar SSR/hydration, navegação e erro/loading quando aplicáveis. Usar runner/scripts reais; não impor export estático a app dinâmica. Não assumir nome de middleware/proxy de uma versão sem conferir arquivos e docs do projeto.
