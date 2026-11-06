'use client'

import { useMemo, useState } from 'react'

const REVIEWER_URL =
  'https://gitportoprd.portoseguro.brasil/portocom/hub-vendas/common/code-reviewer-plug-and-play'

const resources = [
  {
    id: 'frontend',
    name: 'Revisão frontend',
    category: 'Frontend',
    description:
      'Revisão de componentes, acessibilidade, estado, qualidade e testes de interfaces.',
  },
  {
    id: 'backend',
    name: 'Revisão backend',
    category: 'Backend',
    description:
      'Revisão de APIs, contratos, autenticação, tratamento de erros e integrações.',
  },
  {
    id: 'security',
    name: 'Segurança',
    category: 'Qualidade',
    description:
      'Análise de riscos, exposição de segredos, validação de entradas e dependências.',
  },
  {
    id: 'testing',
    name: 'Testes e cobertura',
    category: 'Qualidade',
    description:
      'Revisão de testes unitários, integração, E2E e oportunidades de cobertura.',
  },
  {
    id: 'architecture',
    name: 'Arquitetura e manutenção',
    category: 'Qualidade',
    description:
      'Análise de organização, contratos, SOLID, Clean Code e manutenibilidade.',
  },
] as const

type Category = 'Todos' | (typeof resources)[number]['category']

export function ResourceCatalog() {
  const [category, setCategory] = useState<Category>('Todos')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('pt-BR')

    return resources.filter((resource) => {
      const matchesCategory =
        category === 'Todos' || resource.category === category

      const searchable = `${resource.name} ${resource.description} ${resource.category}`

      return (
        matchesCategory &&
        searchable.toLocaleLowerCase('pt-BR').includes(normalized)
      )
    })
  }, [category, query])

  return (
    <section aria-labelledby="catalog-title" className="space-y-6">
      <div className="space-y-2">
        <h2 id="catalog-title" className="text-xl font-semibold">
          Catálogo de capacidades
        </h2>

        <p className="text-sm text-muted-foreground">
          Áreas de revisão que você pode solicitar ao agente pessoal Code
          Reviewer Plug and Play. Este catálogo é informativo: não lista skills
          instaladas nem executa revisões.
        </p>
      </div>

      <div className="flex flex-wrap gap-4">
        <label className="grid gap-1 text-sm">
          Categoria
          <select
            className="rounded border bg-background p-2"
            value={category}
            onChange={(event) => setCategory(event.target.value as Category)}
          >
            <option value="Todos">Todos</option>
            <option value="Frontend">Frontend</option>
            <option value="Backend">Backend</option>
            <option value="Qualidade">Qualidade</option>
          </select>
        </label>

        <label className="grid flex-1 gap-1 text-sm">
          Buscar capacidades
          <input
            className="min-w-48 rounded border bg-background p-2"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Ex.: segurança, testes, API"
          />
        </label>
      </div>

      <p role="status" aria-live="polite" className="text-sm">
        {filtered.length} capacidade(s) encontrada(s)
      </p>

      {filtered.length === 0 ? (
        <p className="rounded border p-4 text-sm">
          Nenhuma capacidade corresponde aos filtros.
        </p>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {filtered.map((resource) => (
            <li key={resource.id} className="space-y-2 rounded border p-4">
              <p className="text-xs text-muted-foreground">
                {resource.category}
              </p>

              <h3 className="font-semibold">{resource.name}</h3>
              <p className="text-sm">{resource.description}</p>
            </li>
          ))}
        </ul>
      )}

      <p className="text-sm">
        Para conhecer as skills e instruções disponíveis na sua versão
        instalada, consulte o{' '}
        <a
          className="underline"
          href={REVIEWER_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          repositório do Code Reviewer Plug and Play
        </a>
        .
      </p>
    </section>
  )
}
