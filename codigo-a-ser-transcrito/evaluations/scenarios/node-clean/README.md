# Cenário sem defeito intencional

Revisar somente a transformação pura em index.js. Ela recebe identificador e referência, retorna somente esses dois campos e rejeita entrada inválida. Não recebe valores de segredo nem executa transporte, logs ou persistência. Evitar exigir infraestrutura ou novas camadas para este escopo. Não instalar dependências nem alterar arquivos.
