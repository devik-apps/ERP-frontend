import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(__dirname, '../..')

describe('PWA — manifest', () => {
  const manifestPath = resolve(root, 'public/manifest.webmanifest')

  it('le manifest existe', () => {
    expect(existsSync(manifestPath)).toBe(true)
  })

  it('est un JSON valide', () => {
    const content = readFileSync(manifestPath, 'utf-8')
    expect(() => JSON.parse(content)).not.toThrow()
  })

  it('contient les champs obligatoires', () => {
    const m = JSON.parse(readFileSync(manifestPath, 'utf-8'))
    expect(m.name).toBeTruthy()
    expect(m.short_name).toBeTruthy()
    expect(m.start_url).toBeTruthy()
    expect(m.display).toBe('standalone')
    expect(m.theme_color).toBeTruthy()
    expect(m.background_color).toBeTruthy()
    expect(m.lang).toBe('fr')
    expect(m.scope).toBe('/')
  })

  it('utilise les couleurs de la maquette', () => {
    const m = JSON.parse(readFileSync(manifestPath, 'utf-8'))
    expect(m.theme_color.toUpperCase()).toBe('#4A6274')
    expect(m.background_color.toUpperCase()).toBe('#F4F5F6')
  })

  it('déclare au moins une icône', () => {
    const m = JSON.parse(readFileSync(manifestPath, 'utf-8'))
    expect(Array.isArray(m.icons)).toBe(true)
    expect(m.icons.length).toBeGreaterThan(0)
  })

  it('inclut une icône avec purpose maskable', () => {
    const m = JSON.parse(readFileSync(manifestPath, 'utf-8'))
    const hasMaskable = m.icons.some((i: { purpose?: string }) =>
      i.purpose?.includes('maskable'),
    )
    expect(hasMaskable).toBe(true)
  })
})

describe('PWA — icônes', () => {
  it('l\'icône SVG source existe', () => {
    expect(existsSync(resolve(root, 'public/icons/icon.svg'))).toBe(true)
  })

  it('l\'apple-touch-icon existe', () => {
    expect(existsSync(resolve(root, 'public/icons/apple-touch-icon.svg'))).toBe(true)
  })
})

describe('PWA — config Nuxt head', () => {
  const nuxtConfig = readFileSync(resolve(root, 'nuxt.config.ts'), 'utf-8')

  it('référence le manifest', () => {
    expect(nuxtConfig).toMatch(/manifest\.webmanifest/)
  })

  it('définit le theme-color', () => {
    expect(nuxtConfig).toMatch(/theme-color/i)
  })

  it('référence apple-touch-icon', () => {
    expect(nuxtConfig).toMatch(/apple-touch-icon/)
  })
})
