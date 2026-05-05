import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const css = readFileSync(resolve(__dirname, '../assets/css/main.css'), 'utf-8')

describe('thème CSS — palette maquette', () => {
  it('charge Inter Tight', () => {
    expect(css).toContain('Inter Tight')
  })

  it('définit la couleur primaire slate', () => {
    expect(css).toContain('--color-slate:')
  })

  it('définit la couleur secondaire coral', () => {
    expect(css).toContain('--color-coral:')
  })

  it('définit les variantes slate (ink, soft, tint)', () => {
    expect(css).toContain('--color-slate-ink:')
    expect(css).toContain('--color-slate-soft:')
    expect(css).toContain('--color-slate-tint:')
  })

  it('définit les variantes coral (ink, soft)', () => {
    expect(css).toContain('--color-coral-ink:')
    expect(css).toContain('--color-coral-soft:')
  })

  it('définit les teintes de fond et surface', () => {
    expect(css).toContain('--color-bg:')
    expect(css).toContain('--color-surface:')
    expect(css).toContain('--color-salmon-tint:')
    expect(css).toContain('--color-pearl:')
  })

  it('définit les couleurs d\'encre (ink, ink-2, ink-3)', () => {
    expect(css).toContain('--color-ink:')
    expect(css).toContain('--color-ink-2:')
    expect(css).toContain('--color-ink-3:')
  })

  it('définit les variables de bordure (line, line-strong)', () => {
    expect(css).toContain('--color-line:')
    expect(css).toContain('--color-line-strong:')
  })

  it('définit les rayons de bordure', () => {
    expect(css).toContain('--radius:')
    expect(css).toContain('--radius-lg:')
  })
})
