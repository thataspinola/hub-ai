import { NextRequest } from 'next/server'
import { clientRequest } from '@/lib/clientes/api'

export const dynamic = 'force-dynamic'
export function GET(request: NextRequest) { return clientRequest(request, 'GET') }
export function POST(request: NextRequest) { return clientRequest(request, 'POST') }
