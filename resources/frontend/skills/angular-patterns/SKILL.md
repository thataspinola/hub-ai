---
name: angular-patterns
description: 'Implementar e revisar aplicações Angular. Usar para setup, arquitetura, componentes, dados, testes e correções específicas deste framework.'
---

# Padrões Angular

Detectar angular.json, versão de @angular/core, bootstrap e workspace. Preservar módulos/standalone conforme projeto; não converter arquitetura durante setup. Respeitar DI, providers e escopo dos serviços. Conferir ciclo de vida e encerramento de subscriptions ou mecanismos de cleanup disponíveis na versão real. Preservar Reactive/Template Forms existentes; testar validação, binding e estados. Signals/RxJS e change detection devem seguir versão e necessidade comprovadas. Testar componentes com o runner e TestBed adotados; não impor Jest se o projeto usa outro runner. Validar lazy loading, guards e SSR/hydration somente quando configurados.
