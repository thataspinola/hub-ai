'use client'
import { useState } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'

export default function Auth() {
  const { data: session, status } = useSession()
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const logout = async () => {
    setBusy(true)
    setError(null)
    try {
      const response = await fetch('/react-ssr-corp-hubv-painel-administrativo/api/auth/logout', { method: 'POST' })
      if (!response.ok) setError('A sessão local será encerrada, mas o logout no provedor falhou.')
    } catch { setError('A sessão local será encerrada, mas o provedor está indisponível.') }
    finally {
      try { await signOut({ callbackUrl: '/react-ssr-corp-hubv-painel-administrativo' }) }
      catch { setError('Não foi possível encerrar a sessão local. Tente novamente.') }
      setBusy(false)
    }
  }
  if (status === 'loading') return <span>Loading...</span>
  const invalid = (session as { error?: string } | null)?.error
  return <>
    {session && !invalid ? <button type="button" disabled={busy} onClick={logout}>Logout</button> : <button type="button" onClick={() => signIn('keycloak')}>Login</button>}
    {error && <span role="alert">{error}</span>}
  </>
}
