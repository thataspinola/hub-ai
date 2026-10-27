import { getServerSession } from 'next-auth'

import authOptions from '@/app/api/auth/[...nextauth]/auth-options'
import { getFeatureFlags } from '@/lib/feature-flags/server'
import {
  canAccessAdministration,
  requiresAdministrativeAuth
} from '@/lib/auth/access-policy'
import type { ClientSession } from '@/types/client-session'

export async function GET() {
  if (requiresAdministrativeAuth()) {
    const session = (await getServerSession(
      authOptions
    )) as ClientSession | null

    if (!canAccessAdministration(session, process.env.HUB_AI_ADMIN_ROLE)) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  try {
    return Response.json(await getFeatureFlags(), {
      headers: { 'Cache-Control': 'no-store' }
    })
  } catch (error) {
    return Response.json(
      { error: 'Feature flags unavailable' },
      { status: 503 }
    )
  }
}
