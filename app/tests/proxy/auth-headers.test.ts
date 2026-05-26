import { describe, it, expect } from 'vitest'
import { buildAuthHeader } from '~~/server/utils/auth-header'

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
