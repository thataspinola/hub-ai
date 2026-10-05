# Atualização e recuperação

1. Fixar o hub num commit revisado e ler CHANGELOG.md. Commit do checkout fica registrado quando a origem é um clone Git; arquivos baixados sem .git registram origem desconhecida e hashes dos recursos.
2. Executar doctor, depois install --dry-run com o perfil/capabilities desejados. Revisar mudanças e recursos antigos.
3. Usar --overwrite somente para mudanças deliberadas. --migrate remove arquivos gerenciados sem modificações locais; bloqueia remoção dos modificados.
4. Rodar o setup e revisar seu diff antes de commitar no projeto consumidor. Não usar atualização para substituir regras de domínio.

A escrita usa arquivo temporário e os.replace: hard links existentes não são alterados em outras localizações. Symlinks nos destinos são recusados, assim como destino que seja diretório. A transação registra cópias anteriores e restaura arquivos se uma operação falhar. A recuperação pode deixar diretórios vazios recém-criados; não remove diretórios arbitrários.

Em interrupção abrupta, a próxima instalação recusa continuar. Conferir que o processo terminou e executar:

```bash
node scripts/install.js /caminho/do/projeto --recover
```

O instalador recusa recuperação enquanto o PID registrado estiver ativo. Não apagar lock/journal durante instalação. Se o sistema não puder restaurar arquivos (permissão/disco), preservar o journal e corrigir o ambiente antes de repetir recuperação. Journal contém cópias de recursos locais: não commitar e não compartilhar esse arquivo. Symlinks não são usados para contornar restrições.

Nunca executar instaladores concorrentes no mesmo destino. A proteção se destina a uso local cooperativo; não garante integridade contra outro processo hostil alterando a árvore durante a operação. Durabilidade após falha de energia depende das garantias do filesystem.
