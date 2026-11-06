import { getServerSession } from 'next-auth'
import authOptions from '@/app/api/auth/[...nextauth]/auth-options'
import LocalClientes from './local-clientes'

export default async function Clientes() {
  if (
    process.env.NODE_ENV === 'development' &&
    process.env.HUB_AI_LOCAL_DEMO_AUTH === 'true'
  )
    return <LocalClientes />

  const session = await getServerSession(authOptions)
  if (
    !session ||
    (session as { error?: string; access_token?: string }).error ||
    !(session as { access_token?: string }).access_token
  )
    return (
      <p className="p-8">
        Para gerenciar clientes, faça login com sua conta corporativa.
      </p>
    )

  return <LocalClientes />
}
