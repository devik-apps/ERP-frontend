// Node 20 n'a pas de WebSocket natif. Supabase Realtime en réclame un
// dans le constructeur du SupabaseClient utilisé par @nuxtjs/supabase, même
// si l'ERP ne consomme jamais Realtime. On polyfill côté serveur avec `ws`.
import { WebSocket } from 'ws'

export default defineNitroPlugin(() => {
  if (typeof globalThis.WebSocket === 'undefined') {
    ;(globalThis as { WebSocket?: unknown }).WebSocket = WebSocket
  }
})
