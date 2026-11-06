'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Activity,
  ArrowUpRight,
  ClipboardList,
  FileText,
  Flag,
  ScanSearch,
  Star,
  Users,
  WandSparkles,
} from 'lucide-react'
import { getFormsIndex } from '@/lib/form-wizard/forms-storage'
import { useFeatureFlags } from '@/lib/feature-flags/client'

const modules = [
  {
    title: 'Feature Flags',
    description: 'Gerencie ativações e configurações',
    href: '/feature-flags',
    icon: Flag,
  },
  {
    title: 'Form Wizard',
    description: 'Crie e visualize jornadas',
    href: '/form-wizard',
    icon: WandSparkles,
  },
  {
    title: 'Code Reviewer',
    description: 'Acesse recursos de revisão',
    href: '/code-reviewer',
    icon: ScanSearch,
  },
  {
    title: 'Recomendações',
    description: 'Explore recomendações',
    href: '/recommendations',
    icon: Star,
  },
  {
    title: 'Clientes',
    description: 'Consulte o módulo de clientes',
    href: '/clientes',
    icon: Users,
  },
]

export function Dashboard() {
  const { flags, isLoading, error } = useFeatureFlags()
  const [forms, setForms] = useState<ReturnType<typeof getFormsIndex>>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setForms(getFormsIndex())
    setLoaded(true)
  }, [])

  const active = Object.values(flags).filter((flag) => flag.enabled).length
  const total = Object.keys(flags).length

  const recent = [...forms]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 4)

  const bar = (value: number, max: number) =>
    max ? Math.round((value / max) * 100) : 0

  const stats = [
    {
      label: 'Formulários criados',
      value: loaded ? String(forms.length) : '—',
      icon: FileText,
      hint: 'Neste navegador',
    },
    {
      label: 'Etapas configuradas',
      value: loaded
        ? String(forms.reduce((sum, form) => sum + form.stepsCount, 0))
        : '—',
      icon: ClipboardList,
      hint: 'Em formulários locais',
    },
    {
      label: 'Flags disponíveis',
      value: isLoading ? '—' : error ? 'Indisponível' : String(total),
      icon: Flag,
      hint: error ? 'Erro ao carregar provedor' : 'No provedor configurado',
    },
    {
      label: 'Flags habilitadas',
      value: isLoading ? '—' : error ? 'Indisponível' : String(active),
      icon: Activity,
      hint: 'No provedor configurado',
    },
  ]

  return (
    <div className="min-h-[80vh] bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-sky-700">
              Visão geral
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Painel administrativo
            </h1>

            <p className="mt-2 text-sm text-slate-600">
              Acompanhe seus formulários, configurações e ferramentas em um só
              lugar.
            </p>
          </div>

          <Link
            href="/form-wizard/new"
            className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-sky-700"
          >
            <WandSparkles size={17} /> Criar formulário
          </Link>
        </header>

        <section
          aria-label="Indicadores"
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          {stats.map(({ label, value, icon: Icon, hint }) => (
            <div
              key={label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">
                  {label}
                </span>

                <span className="rounded-xl bg-sky-50 p-2 text-sky-700">
                  <Icon size={19} />
                </span>
              </div>

              <p className="text-3xl font-bold text-slate-900">{value}</p>
              <p className="mt-2 text-xs text-slate-500">{hint}</p>
            </div>
          ))}
        </section>

        <div className="grid gap-6 lg:grid-cols-5">
          <section
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-3"
            aria-label="Gráfico de formulários"
          >
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-slate-900">
                Etapas por formulário
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Distribuição dos formulários salvos localmente
              </p>
            </div>

            {recent.length ? (
              <div className="space-y-5">
                {recent.map((form) => (
                  <div key={form.id}>
                    <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                      <Link
                        href={`/form-wizard/${form.slug}`}
                        className="truncate font-medium text-slate-700 hover:text-sky-700"
                      >
                        {form.name}
                      </Link>

                      <span className="shrink-0 font-semibold text-slate-800">
                        {form.stepsCount} etapas
                      </span>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-sky-500"
                        style={{
                          width: `${bar(form.stepsCount, Math.max(...recent.map((f) => f.stepsCount), 1))}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex min-h-48 items-center justify-center rounded-xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
                {loaded
                  ? 'Nenhum formulário criado ainda. Comece pelo Form Wizard.'
                  : 'Carregando formulários…'}
              </div>
            )}
          </section>

          <section
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2"
            aria-label="Gráfico de feature flags"
          >
            <h2 className="text-lg font-semibold text-slate-900">
              Distribuição de flags
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Ativadas e desativadas no provedor atual
            </p>

            {isLoading ? (
              <p className="mt-12 text-sm text-slate-500">Carregando flags…</p>
            ) : error ? (
              <p role="alert" className="mt-12 text-sm text-amber-700">
                Não foi possível consultar as flags.
              </p>
            ) : total ? (
              <div className="mt-8 space-y-6">
                <div className="flex h-5 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="bg-sky-600"
                    style={{ width: `${bar(active, total)}%` }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500">Habilitadas</p>
                    <p className="text-2xl font-bold text-sky-700">{active}</p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">Desabilitadas</p>
                    <p className="text-2xl font-bold text-slate-700">
                      {total - active}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="mt-12 text-sm text-slate-500">
                Nenhuma flag disponível no provedor.
              </p>
            )}
            <Link
              href="/feature-flags"
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-sky-700 hover:underline"
            >
              Gerenciar flags <ArrowUpRight size={16} />
            </Link>
          </section>
        </div>

        <section aria-label="Módulos disponíveis">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              Acesso rápido
            </h2>

            <span className="text-xs text-slate-500">
              Ferramentas do painel
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {modules.map(({ title, description, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="group flex items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-sky-200 hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  <span className="rounded-xl bg-sky-50 p-3 text-sky-700">
                    <Icon size={21} />
                  </span>

                  <div>
                    <h3 className="font-semibold text-slate-900">{title}</h3>
                    <p className="mt-1 text-sm text-slate-500">{description}</p>
                  </div>
                </div>

                <ArrowUpRight
                  size={17}
                  className="shrink-0 text-slate-400 group-hover:text-sky-700"
                />
              </Link>
            ))}
          </div>
        </section>

        <p className="text-xs text-slate-500">
          Os dados de formulários vêm do armazenamento deste navegador.
          Indicadores de flags dependem do provedor configurado; não representam
          métricas de produção sem integração.
        </p>
      </div>
    </div>
  )
}
