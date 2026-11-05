import { ClientSession } from '@/types/client-session'
import { AuthOptions } from 'next-auth'
import KeycloakProvider from 'next-auth/providers/keycloak'
import CredentialsProvider from 'next-auth/providers/credentials'
import { env } from 'next-runtime-env'
import { refreshAccessToken } from '@/lib/auth/refresh-token'

const authOptions: AuthOptions = {
  providers: [
    ...(process.env.NODE_ENV === 'development' && process.env.HUB_AI_LOCAL_DEMO_AUTH === 'true'
      ? [CredentialsProvider({
          id: 'local-demo',
          name: 'Usuário de demonstração',
          credentials: {},
          async authorize() {
            if (process.env.NODE_ENV !== 'development' || process.env.HUB_AI_LOCAL_DEMO_AUTH !== 'true') return null
            return { id: 'local-demo', name: 'Usuário de demonstração', email: 'demo@localhost.invalid' }
          },
        })]
      : []),
    KeycloakProvider({
      clientId: env('KEYCLOAK_CLIENT_ID') || '',
      clientSecret: env('KEYCLOAK_CLIENT_SECRET') || '',
      issuer: env('KEYCLOAK_ISSUER') || '',
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account?.provider === 'local-demo' && process.env.NODE_ENV === 'development' && process.env.HUB_AI_LOCAL_DEMO_AUTH === 'true') {
        token.local_demo = true
        token.roles = ['demo']
        return token
      }
      if (token.local_demo) return token
      if (account) {
        token.access_token = account.access_token
        token.id_token = account.id_token
        token.expires_at = account.expires_at
        token.refresh_token = account.refresh_token
        token.error = undefined
        const claims = profile as
          | {
              realm_access?: { roles?: unknown }
              resource_access?: Record<string, { roles?: unknown }>
            }
          | undefined
        const roles = [
          claims?.realm_access?.roles,
          claims?.resource_access?.[env('KEYCLOAK_CLIENT_ID') || '']?.roles,
        ].flatMap((value) =>
          Array.isArray(value)
            ? value.filter((role): role is string => typeof role === 'string')
            : []
        )
        token.roles = [...new Set(roles)]
      }

      if (token.error) return token
      if (
        typeof token.expires_at === 'number' &&
        Date.now() >= token.expires_at * 1000 - 30_000
      ) {
        return refreshAccessToken(token, {
          issuer: env('KEYCLOAK_ISSUER') || '',
          clientId: env('KEYCLOAK_CLIENT_ID') || '',
          clientSecret: env('KEYCLOAK_CLIENT_SECRET') || '',
        })
      }
      return token
    },
    async session({ session, token }) {
      // Send properties to client
      const clientSession: ClientSession = {
        ...session,
        access_token: token.access_token as string,
        id_token: token.id_token as string,
        roles: Array.isArray(token.roles)
          ? token.roles.filter((role): role is string => typeof role === 'string')
          : [],
        error: typeof token.error === 'string' ? token.error : undefined,
        ...(process.env.NODE_ENV === 'development' && process.env.HUB_AI_LOCAL_DEMO_AUTH === 'true' && token.local_demo === true ? { local_demo: true } : {}),
      }

      return clientSession
    },
  },
}

export default authOptions
