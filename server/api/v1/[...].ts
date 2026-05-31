import { serverSupabaseSession } from '#supabase/server'
import { buildProxyHeaders } from '~~/server/utils/auth-header'

/**
 * Proxy Nitro → backend ERP.
 *
 * Le navigateur appelle ce serveur Nuxt (même origine), qui relaie la requête
 * vers le backend Render. Ça contourne le problème CORS du backend.
 *
 * Injecte le JWT Supabase de l'utilisateur connecté en `Authorization: Bearer`
 * et neutralise le header `Cookie` (sinon le backend rejette en 431).
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const backend = (config.erpBackendUrl as string).replace(/\/$/, '')
  const path = (event.context.params?._ ?? '') as string
  const query = getRequestURL(event).search

  const session = await serverSupabaseSession(event).catch(() => null)

  return proxyRequest(event, `${backend}/${path}${query}`, {
    headers: buildProxyHeaders(session as { access_token?: string } | null),
  })
})
