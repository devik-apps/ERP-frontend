import { describe, it, expect } from 'vitest'
import { buildAuthHeader, buildProxyHeaders } from '~~/server/utils/auth-header'

describe('buildAuthHeader', () => {
  it('renvoie un Bearer quand un access_token est présent', () => {
    expect(buildAuthHeader({ access_token: 'jwt-xyz' } as any)).toEqual({
      Authorization: 'Bearer jwt-xyz',
    })
  })

  it('renvoie un objet vide quand la session est nulle', () => {
    expect(buildAuthHeader(null)).toEqual({})
  })

  it('renvoie un objet vide quand l\'access_token manque', () => {
    expect(buildAuthHeader({} as any)).toEqual({})
  })
})

describe('buildProxyHeaders', () => {
  // Le backend s'authentifie via Authorization: Bearer uniquement. Le header
  // Cookie du navigateur (session Supabase base64 + cookies tiers) est énorme et
  // fait rejeter la requête par le backend en 431. On le neutralise (cookie: '').
  it('ajoute le Bearer et neutralise le Cookie quand la session est présente', () => {
    expect(buildProxyHeaders({ access_token: 'jwt-xyz' } as any)).toEqual({
      Authorization: 'Bearer jwt-xyz',
      cookie: '',
    })
  })

  it('neutralise le Cookie même sans session', () => {
    expect(buildProxyHeaders(null)).toEqual({ cookie: '' })
  })
})
