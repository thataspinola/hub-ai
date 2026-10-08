import { getServerSession } from 'next-auth';
import { env } from 'next-runtime-env';

import authOptions from '@/app/api/auth/[...nextauth]/auth-options';
import { Cliente } from '@/types/cliente';
import { getAccessToken } from '@/utils/session-token-accessor';
import Lista from './lista';

async function getAllClients(): Promise<Cliente[]> {

  const url = `${env('NEXT_PUBLIC_API')}/cliente`;
  const accessToken = await getAccessToken();

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (response.ok) {
    return response.json();
  }

  throw new Error("Failed to fetch data. Status: " + response.status);
}

export default async function Clientes() {

  const session = await getServerSession(authOptions);

  if (session) {
    try {
      const clientes = await getAllClients();
      return (
        <Lista clientes={clientes} />
      )
    } catch {
      return (
        <p>Ops! Houve um erro ao buscar a lista de clientes</p>
      )
    }
  } else {
    return (
      <p>Para buscar os clientes você precisa estar autenticado</p>
    )
  }
}
