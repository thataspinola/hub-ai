import { getServerSession } from 'next-auth'
import { env } from 'next-runtime-env'

import authOptions from '@/app/api/auth/[...nextauth]/auth-options'
import { Cliente } from '@/types/cliente'
import { getAccessToken } from '@/utils/session-token-accessor'
import Lista from './lista'

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

const demoClientes: Cliente[] = [
  { codigo: 1001, nome: 'Cliente Exemplo A', email: 'cliente.a@example.invalid' },
  { codigo: 1002, nome: 'Cliente Exemplo B', email: 'cliente.b@example.invalid' },
  { codigo: 1003, nome: 'Cliente Exemplo C', email: 'cliente.c@example.invalid' },
]

export default async function Clientes() {
  if (localDemoEnabled) {
    return <section className="mx-auto max-w-5xl space-y-5 px-6 py-8"><div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"><strong>Modo de demonstração local</strong><p>Dados fictícios para testar a interface. Nenhuma chamada à API corporativa será realizada.</p></div><Lista clientes={demoClientes} /></section>
  }

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
