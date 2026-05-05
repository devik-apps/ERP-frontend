import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const css = readFileSync(resolve(__dirname, '../assets/css/main.css'), 'utf-8')

describe('UI de base — classes partagées', () => {
  describe('cards', () => {
    it('définit .card', () => {
      expect(css).toMatch(/\.card\s*\{/)
    })
    it('définit .card-title et .card-sub', () => {
      expect(css).toMatch(/\.card-title\s*\{/)
      expect(css).toMatch(/\.card-sub\s*\{/)
    })
  })

  describe('boutons', () => {
    it('définit .btn de base', () => {
      expect(css).toMatch(/\.btn\s*\{/)
    })
    it('définit .btn-primary', () => {
      expect(css).toMatch(/\.btn-primary\s*\{/)
    })
    it('définit .btn-ghost', () => {
      expect(css).toMatch(/\.btn-ghost\s*\{/)
    })
    it('définit .btn-sm', () => {
      expect(css).toMatch(/\.btn-sm\s*\{/)
    })
  })

  describe('tableaux', () => {
    it('définit .tbl', () => {
      expect(css).toMatch(/\.tbl\s*\{/)
    })
    it('définit .table-card et .table-head', () => {
      expect(css).toMatch(/\.table-card\s*\{/)
      expect(css).toMatch(/\.table-head\s*\{/)
    })
  })

  describe('badges', () => {
    it('définit .badge et .badge-dot', () => {
      expect(css).toMatch(/\.badge\s*\{/)
      expect(css).toMatch(/\.badge-dot\s*\{/)
    })
    it('définit les états is-active, is-inactive, is-low', () => {
      expect(css).toMatch(/\.badge\.is-active/)
      expect(css).toMatch(/\.badge\.is-inactive/)
      expect(css).toMatch(/\.badge\.is-low/)
    })
  })

  describe('mouvements', () => {
    it('définit .mv-pill avec variants is-in et is-out', () => {
      expect(css).toMatch(/\.mv-pill\s*\{/)
      expect(css).toMatch(/\.mv-pill\.is-in/)
      expect(css).toMatch(/\.mv-pill\.is-out/)
    })
    it('définit .mv-dot', () => {
      expect(css).toMatch(/\.mv-dot\s*\{/)
    })
  })

  describe('chips et segmented', () => {
    it('définit .chip avec is-active', () => {
      expect(css).toMatch(/\.chip\s*\{/)
      expect(css).toMatch(/\.chip\.is-active/)
    })
    it('définit .seg et .seg-btn', () => {
      expect(css).toMatch(/\.seg\s*\{/)
      expect(css).toMatch(/\.seg-btn\s*\{/)
      expect(css).toMatch(/\.seg-btn\.is-on/)
    })
  })

  describe('section headers', () => {
    it('définit .sec, .sec-head, .sec-title, .sec-sub', () => {
      expect(css).toMatch(/\.sec\s*\{/)
      expect(css).toMatch(/\.sec-head\s*\{/)
      expect(css).toMatch(/\.sec-title\s*\{/)
      expect(css).toMatch(/\.sec-sub\s*\{/)
    })
    it('définit .eyebrow', () => {
      expect(css).toMatch(/\.eyebrow\s*\{/)
    })
  })

  describe('utilitaires', () => {
    it('définit .muted et .small', () => {
      expect(css).toMatch(/\.muted\s*\{/)
      expect(css).toMatch(/\.small\s*\{/)
    })
  })
})
