import { getServerSession } from 'next-auth'
import { env } from 'next-runtime-env'

import authOptions from '@/app/api/auth/[...nextauth]/auth-options'
import { Cliente } from '@/types/cliente'
import { getAccessToken } from '@/utils/session-token-accessor'
import Lista from './lista'
import LocalClientes from './local-clientes'

async function getAllClients(): Promise<Cliente[]> {
  const url = `${env('NEXT_PUBLIC_API')}/cliente`
  const accessToken = await getAccessToken()

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (response.ok) {
    return response.json()
  }

  throw new Error('Failed to fetch data. Status: ' + response.status)
}

const localDemoEnabled = process.env.NODE_ENV === 'development' && process.env.HUB_AI_LOCAL_DEMO_AUTH === 'true'

export default async function Clientes() {
  if (localDemoEnabled) return <LocalClientes />

  const session = await getServerSession(authOptions)

  if (session) {
    let clientes: Cliente[]
    try {
      clientes = await getAllClients()
    } catch {
      return <p>Ops! Houve um erro ao buscar a lista de clientes</p>
    }
    return <Lista clientes={clientes} />
  } else {
    return <p>Para buscar os clientes você precisa estar autenticado</p>
  }
}
