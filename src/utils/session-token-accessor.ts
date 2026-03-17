import { getServerSession } from 'next-auth';

import authOptions from '@/app/api/auth/[...nextauth]/auth-options';
import { ClientSession } from '@/types/client-session';

export async function getAccessToken(): Promise<string | null> {
  const session: ClientSession | null = await getServerSession(authOptions);
  if (session) {
    const accessTokenDecrypted = session.access_token;
    return accessTokenDecrypted;
  }
  return null;
}

export async function getIdToken(): Promise<string | null> {
  const session: ClientSession | null = await getServerSession(authOptions);
  if (session) {
    const idTokenDecrypted = session.id_token;
    return idTokenDecrypted;
  }
  return null;
}
