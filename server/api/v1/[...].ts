/**
 * Proxy Nitro → backend ERP.
 *
 * Le navigateur appelle ce serveur Nuxt (même origine), qui relaie la requête
 * vers le backend Render. Ça contourne le problème CORS du backend.
 *
 * Lit l'URL du backend depuis `runtimeConfig.erpBackendUrl` (serveur uniquement),
 * surchargée par la variable d'environnement `ERP_BACKEND_URL`.
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const backend = (config.erpBackendUrl as string).replace(/\/$/, '')
  const path = (event.context.params?._ ?? '') as string
  const query = getRequestURL(event).search
  return proxyRequest(event, `${backend}/${path}${query}`)
})
