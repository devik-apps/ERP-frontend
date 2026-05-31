export function buildAuthHeader(
  session: { access_token?: string } | null,
): Record<string, string> {
  if (!session?.access_token) return {}
  return { Authorization: `Bearer ${session.access_token}` }
}

/**
 * Headers à transmettre au backend ERP par le proxy Nitro.
 *
 * Le backend s'authentifie uniquement via `Authorization: Bearer`. Le header
 * `Cookie` du navigateur (session Supabase en base64 + éventuels cookies tiers)
 * est volumineux et fait rejeter la requête par le backend en `431 Request
 * Header Fields Too Large`. On le neutralise (`cookie: ''`) avant de relayer.
 */
export function buildProxyHeaders(
  session: { access_token?: string } | null,
): Record<string, string> {
  return { ...buildAuthHeader(session), cookie: '' }
}
