import { NextRequest } from 'next/server'
import { clientRequest } from '@/lib/clientes/api'

type Context = { params: Promise<{ codigo: string }> }

export async function PUT(request: NextRequest, context: Context) {
  const { codigo } = await context.params
  return clientRequest(request, 'PUT', codigo)
}

export async function DELETE(request: NextRequest, context: Context) {
  const { codigo } = await context.params
  return clientRequest(request, 'DELETE', codigo)
}
