import { describe, it, expect } from 'vitest'
import { resolveApiState } from '~/utils/apiHelpers'

describe('resolveApiState', () => {
  it('retourne "loading" quand isPending est true', () => {
    expect(resolveApiState(true, false, false)).toBe('loading')
  })

  it('retourne "error" quand isError est true', () => {
    expect(resolveApiState(false, true, false)).toBe('error')
  })

  it('retourne "empty" quand isEmpty est true', () => {
    expect(resolveApiState(false, false, true)).toBe('empty')
  })

  it('retourne "data" quand tout est false', () => {
    expect(resolveApiState(false, false, false)).toBe('data')
  })

  it('loading a priorité sur error', () => {
    expect(resolveApiState(true, true, false)).toBe('loading')
  })

  it('error a priorité sur empty', () => {
    expect(resolveApiState(false, true, true)).toBe('error')
  })
})
