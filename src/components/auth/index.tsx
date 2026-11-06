'use client'

import { useState } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'

export default function Auth() {
  const { data: session, status } = useSession()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isDemo =
    (session as { local_demo?: boolean } | null)?.local_demo === true

  const demoEnabled =
    process.env.NODE_ENV === 'development' &&
    process.env.NEXT_PUBLIC_HUB_AI_LOCAL_DEMO_AUTH === 'true'

  const logout = async () => {
    setBusy(true)
    setError(null)

    try {
      if (!isDemo) {
        const response = await fetch(
          '/react-ssr-corp-hubv-painel-administrativo/api/auth/logout',
          { method: 'POST' }
        )

        if (!response.ok)
          setError('O logout no provedor falhou; encerrando a sessão local.')
      }

      await signOut({
        callbackUrl: '/react-ssr-corp-hubv-painel-administrativo',
      })
    } catch {
      setError('Não foi possível encerrar a sessão. Tente novamente.')
    } finally {
      setBusy(false)
    }
  }

  if (status === 'loading')
    return <span className="text-sm text-slate-500">Verificando sessão…</span>

  const authenticated = Boolean(
    session && !(session as { error?: string }).error
  )

  return (
    <div className="flex flex-wrap items-center gap-2">
      {authenticated ? (
        <>
          <span className="max-w-44 truncate text-sm text-slate-600">
            {session?.user?.name ?? 'Usuário'}
            {isDemo ? ' · Demo' : ''}
          </span>

          <button
            type="button"
            disabled={busy}
            onClick={logout}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Sair
          </button>
        </>
      ) : (
        <>
          {demoEnabled && (
            <button
              type="button"
              onClick={() => signIn('local-demo')}
              className="rounded-lg bg-sky-600 px-3 py-2 text-sm font-semibold text-white hover:bg-sky-700"
            >
              Entrar como demo
            </button>
          )}

          <button
            type="button"
            onClick={() => signIn('keycloak')}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Login corporativo
          </button>
        </>
      )}

      {error && (
        <span role="alert" className="text-xs text-red-700">
          {error}
        </span>
      )}
    </div>
  )
}
