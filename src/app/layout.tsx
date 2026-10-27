import type { Metadata } from 'next'
import { PublicEnvScript } from 'next-runtime-env'

import Footer from '@/components/footer'
import Navbar from '@/components/navbar'
import SessionProviderWrapper from '@/components/session-provider-wrapper'
import './globals.css'

export const metadata: Metadata = {
  title: 'PortalAdm - Painel Administrativo',
  description:
    'Painel Administrativo - Feature Flags, Pilotos, Promoções e Recomendações',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-br">
      <head>
        <PublicEnvScript />
      </head>
      <body>
        <SessionProviderWrapper>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </SessionProviderWrapper>
      </body>
    </html>
  )
}
