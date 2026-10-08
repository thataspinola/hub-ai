import { ClientSession } from '@/types/client-session';
import { AuthOptions } from 'next-auth';
import KeycloakProvider from 'next-auth/providers/keycloak';
import { env } from 'next-runtime-env';

const authOptions: AuthOptions = {
  providers: [
    KeycloakProvider({
      clientId: env('KEYCLOAK_CLIENT_ID') || '',
      clientSecret: env('KEYCLOAK_CLIENT_SECRET') || '',
      issuer: env('KEYCLOAK_ISSUER') || '',
    })
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.access_token = account.access_token;
        token.id_token = account.id_token;
        token.expires_at = account.expires_at;
        token.refresh_token = account.refresh_token;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to client
      const clientSession: ClientSession = {
        ...session,
        access_token: token.access_token as string,
        id_token: token.id_token as string,
      };
      return clientSession;
    }
  }
}

export default authOptions;
