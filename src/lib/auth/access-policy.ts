export function requiresAdministrativeAuth(
  environment: Record<string, string | undefined> = process.env
): boolean {
  return (
    environment.NODE_ENV === 'production' ||
    environment.HUB_AI_REQUIRE_AUTH === 'true'
  )
}

export function canAccessAdministration(
  value: object | null,
  role?: string,
  now = Date.now()
): boolean {
  const session = value as {
    access_token?: unknown
    error?: unknown
    roles?: unknown
    expires_at?: unknown
  } | null

  if (
    !session ||
    session.error ||
    typeof session.access_token !== 'string' ||
    !session.access_token
  )
    return false

  if (
    typeof session.expires_at === 'number' &&
    session.expires_at * 1000 <= now
  )
    return false

  return !role || (Array.isArray(session.roles) && session.roles.includes(role))
}
