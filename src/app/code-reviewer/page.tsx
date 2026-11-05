import { ResourceCatalog } from '@/components/portal-admin/ResourceCatalog'

const reviewer = 'https://github.com/thataspinola/code-reviewer-plug-and-play'

export default function CodeReviewerPage() {
  return (
    <section className="flex-1 p-8 space-y-6">
      <h1 className="text-2xl font-bold">Code Reviewer</h1>
      <p>
        As revisões de frontend e backend são realizadas pelo agente pessoal
        code-reviewer no GitHub Copilot. Nenhuma skill é instalada neste painel.
      </p>
      <p>
        Instale uma única vez o agente no seu perfil seguindo o guia do projeto
        centralizado. Depois, selecione code-reviewer no Copilot Chat e solicite
        a revisão do workspace atual.
      </p>
      <a
        className="underline"
        href={reviewer}
        target="_blank"
        rel="noopener noreferrer"
      >
        Abrir Code Reviewer Plug and Play
      </a>
      <ResourceCatalog />
    </section>
  )
}
