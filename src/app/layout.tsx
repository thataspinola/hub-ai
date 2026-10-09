import type { Metadata } from 'next'
import { PublicEnvScript } from 'next-runtime-env'

import { PortalSidebar } from "@/components/portal-admin/PortalSidebar";
import SessionProviderWrapper from "@/components/session-provider-wrapper";
import { FeatureFlagProvider } from "@/lib/feature-flags/client";
import "./globals.css";

export const metadata: Metadata = {
  title: "PortalAdm - Painel Administrativo",
  description: "Painel Administrativo - Feature Flags, Pilotos, Promoções e Recomendações",
};

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
          <FeatureFlagProvider providerName={process.env.FEATURE_FLAGS_PROVIDER === 'appconfig' ? 'appconfig' : 'localStorage'}>
            <div className="flex min-h-screen bg-slate-50">
              <PortalSidebar />
              <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {children}
              </main>
            </div>
          </FeatureFlagProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  )
}
