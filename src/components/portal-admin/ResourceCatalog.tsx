'use client'

import { useState } from 'react'
import catalog from '@/data/ai-resources.json'

export function ResourceCatalog() {
  const [profile, setProfile] = useState('nextjs')
  const [query, setQuery] = useState('')
  const selected = catalog.profiles.find((item) => item.name === profile)

  const items = catalog.resources.filter((item) => {
    const belongs = selected?.files.some((file) =>
      item.kind === 'skills'
        ? file.startsWith(`.github/skills/${item.id}`)
        : file ===
          `.github/${item.kind}/${item.id}.${item.kind === 'agents' ? 'agent' : 'template'}.md`
    )

    return (
      belongs &&
      `${item.name} ${item.description || ''}`
        .toLowerCase()
        .includes(query.toLowerCase())
    )
  })

  return (
    <section className="flex-1 p-8 space-y-6">
      <header>
        <h2 className="text-2xl font-bold">Code Reviewer</h2>
        <p>
          Recursos de revisão para uso no Copilot. Toolkit {catalog.version}.
        </p>
      </header>

      <div className="flex flex-wrap gap-4">
        <label className="grid gap-1">
          Perfil
          <select
            className="border rounded p-2"
            value={profile}
            onChange={(event) => setProfile(event.target.value)}
          >
            {catalog.profiles.map((item) => (
              <option key={item.name} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1">
          Buscar recursos
          <input
            className="border rounded p-2"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
      </div>

      <p role="status">{items.length} recurso(s) encontrado(s)</p>

      <ul className="grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <li key={item.id} className="border rounded p-4 space-y-2">
            <h3 className="font-semibold">{item.name}</h3>

            <p className="text-sm">
              {item.description ||
                'Template de configuração para adaptar ao projeto'}
            </p>

            <span className="text-xs text-slate-600">{item.kind}</span>
          </li>
        ))}
      </ul>

      <aside className="border rounded p-4 space-y-2">
        <h3 className="font-semibold">Como usar</h3>

        <p>
          No checkout de ferramentas, execute setup com o perfil escolhido e um
          SHA completo da versão aprovada. Revise o preview antes de instalar.
        </p>

        <pre className="overflow-auto bf-slate-100 p-3 rounded">
          <code>{`node tools/code-reviewer.cjs setup --project /caminho/aplicacao --profile ${profile} --sha <SHA_COMPLETO> --dry-run`}</code>
        </pre>

        <p>
          Depois, selecione Copilot Setup e o Code Reviewer no editor. Esta tela
          não executa revisão nem envia código a um modelo.
        </p>
      </aside>
    </section>
  )
}
