# Backend Node executável

Exemplo CommonJS sem dependências externas, usando `node:test` em Node 22+. Executar:

```bash
npm --prefix examples/node-backend test
npm --prefix examples/node-backend run test:automated
npm --prefix examples/node-backend run test:e2e
```

O E2E é local: adaptadores em memória simulam publicação, resolução de referência e OAuth. Não acessa AWS, Sensedia, registry, credenciais ou produção. Fixtures são sintéticas. O fluxo testa falha parcial, contrato, validade e duplicata sequencial; idempotência distribuída e entrega real exigem implementação e validação adicionais. A criptografia usa AES-GCM no servidor com chave efêmera de teste; não é código para store de navegador.

Para aplicar o perfil, criar uma cópia do exemplo fora do hub e executar o instalador sobre essa cópia. Depois usar Copilot Setup. O projeto não inclui deploy, infraestrutura ou uma suíte operacional que possa ser confundida com teste local.
