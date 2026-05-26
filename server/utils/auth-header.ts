export function buildAuthHeader(
  session: { access_token?: string } | null,
): Record<string, string> {
  if (!session?.access_token) return {}
  return { Authorization: `Bearer ${session.access_token}` }
}
