import type { Metadata } from 'next'
import { PublicEnvScript } from 'next-runtime-env'

import Footer from '@/components/footer'
import Navbar from '@/components/navbar'
import SessionProviderWrapper from '@/components/session-provider-wrapper'

// @ts-ignore Next.js processes this global stylesheet import.
import './globals.css'
import React from 'react'

export const metadata: Metadata = {
  title: 'HUB AI - Next.js',
  description: '...',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
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
