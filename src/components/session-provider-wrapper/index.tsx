'use client'

import { SessionProvider } from 'next-auth/react'

export default function SessionProviderWrapper({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SessionProvider basePath="/react-ssr-corp-hubv-painel-administrativo/api/auth">
      {children}
    </SessionProvider>
  )
}
