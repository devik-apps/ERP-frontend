import { describe, it, expect } from 'vitest'
import { generateUUID } from '~/utils/uuid'

describe('generateUUID', () => {
  it('retourne une chaîne au format UUID v4', () => {
    const id = generateUUID()
    expect(id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    )
  })

  it('génère des identifiants uniques à chaque appel', () => {
    const ids = Array.from({ length: 20 }, generateUUID)
    const unique = new Set(ids)
    expect(unique.size).toBe(20)
  })
})
