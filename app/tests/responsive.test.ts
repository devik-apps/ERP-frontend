import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const css = readFileSync(resolve(__dirname, '../assets/css/main.css'), 'utf-8')

function block(selector: string): string {
  const idx = css.indexOf(selector)
  if (idx < 0) return ''
  const start = css.indexOf('{', idx)
  if (start < 0) return ''
  let depth = 1
  let i = start + 1
  while (i < css.length && depth > 0) {
    if (css[i] === '{') depth++
    else if (css[i] === '}') depth--
    i++
  }
  return css.slice(start, i)
}

describe('Responsive — breakpoints et règles', () => {
  describe('breakpoints media queries', () => {
    it('définit un breakpoint tablet (≤ 1024px)', () => {
      expect(css).toMatch(/@media\s*\(max-width:\s*1024px\)/)
    })

    it('définit un breakpoint mobile (≤ 768px)', () => {
      expect(css).toMatch(/@media\s*\(max-width:\s*768px\)/)
    })
  })

  describe('viewport horizontal — pas de débordement', () => {
    it('html et body ont overflow-x hidden', () => {
      expect(css).toMatch(/html,\s*body\s*\{[^}]*overflow-x:\s*hidden/s)
    })
  })

  describe('app shell — sidebar off-canvas en mobile', () => {
    it('passe en colonne unique sous 1024px', () => {
      const tablet = css.match(/@media\s*\(max-width:\s*1024px\)\s*\{[\s\S]*?\n\}/)
      expect(tablet?.[0]).toMatch(/\.app\s*\{[^}]*grid-template-columns:\s*1fr/)
    })

    it('la sidebar devient fixed et off-canvas (translateX -100%) sous 1024px', () => {
      const tablet = css.match(/@media\s*\(max-width:\s*1024px\)\s*\{[\s\S]*?\n\}/)
      expect(tablet?.[0]).toMatch(/\.sb\s*\{[^}]*position:\s*fixed/)
      expect(tablet?.[0]).toMatch(/\.sb\s*\{[^}]*transform:\s*translateX\(-100%\)/)
    })

    it('la sidebar avec is-open est visible (translateX 0)', () => {
      expect(css).toMatch(/\.sb\.is-open[^{]*\{[^}]*transform:\s*translateX\(0\)/)
    })

    it('définit un backdrop .sb-backdrop affiché quand la sidebar est ouverte', () => {
      expect(css).toMatch(/\.sb-backdrop\s*\{/)
    })
  })

  describe('main — padding adapté', () => {
    it('réduit le padding main sous 768px', () => {
      const mobile = css.match(/@media\s*\(max-width:\s*768px\)\s*\{[\s\S]*?\n\}/)
      expect(mobile?.[0]).toMatch(/\.main\s*\{[^}]*padding:/)
    })
  })

  describe('grilles — repliage en mobile', () => {
    it('metric-grid passe à 2 colonnes sous 1024px', () => {
      const tablet = css.match(/@media\s*\(max-width:\s*1024px\)\s*\{[\s\S]*?\n\}/)
      expect(tablet?.[0]).toMatch(/\.metric-grid\s*\{[^}]*grid-template-columns:\s*repeat\(2,\s*1fr\)/)
    })

    it('metric-grid passe à 1 colonne sous 768px', () => {
      const mobile = css.match(/@media\s*\(max-width:\s*768px\)\s*\{[\s\S]*?\n\}/)
      expect(mobile?.[0]).toMatch(/\.metric-grid\s*\{[^}]*grid-template-columns:\s*1fr/)
    })

    it('movement-grid passe à 1 colonne sous 1024px', () => {
      const tablet = css.match(/@media\s*\(max-width:\s*1024px\)\s*\{[\s\S]*?\n\}/)
      expect(tablet?.[0]).toMatch(/\.movement-grid\s*\{[^}]*grid-template-columns:\s*1fr/)
    })

    it('stock-items passe à 1 colonne sous 768px', () => {
      const mobile = css.match(/@media\s*\(max-width:\s*768px\)\s*\{[\s\S]*?\n\}/)
      expect(mobile?.[0]).toMatch(/\.stock-items\s*\{[^}]*grid-template-columns:\s*1fr/)
    })

    it('product-meta passe à 1 colonne sous 768px', () => {
      const mobile = css.match(/@media\s*\(max-width:\s*768px\)\s*\{[\s\S]*?\n\}/)
      expect(mobile?.[0]).toMatch(/\.product-meta\s*\{[^}]*grid-template-columns:\s*1fr/)
    })

    it('field-row passe à 1 colonne sous 768px', () => {
      const mobile = css.match(/@media\s*\(max-width:\s*768px\)\s*\{[\s\S]*?\n\}/)
      expect(mobile?.[0]).toMatch(/\.field-row\s*\{[^}]*grid-template-columns:\s*1fr/)
    })
  })

  describe('tableaux — scroll horizontal en mobile', () => {
    it('table-card devient scrollable horizontalement sous 768px', () => {
      const mobile = css.match(/@media\s*\(max-width:\s*768px\)\s*\{[\s\S]*?\n\}/)
      expect(mobile?.[0]).toMatch(/\.table-card\s*\{[^}]*overflow-x:\s*auto/)
    })
  })

  describe('topbar — adaptée en mobile', () => {
    it('définit un bouton .sb-toggle (hamburger) caché en desktop par défaut', () => {
      const def = block('.sb-toggle')
      expect(def).toMatch(/display:\s*none/)
    })

    it('rend .sb-toggle visible sous 1024px', () => {
      const tablet = css.match(/@media\s*\(max-width:\s*1024px\)\s*\{[\s\S]*?\n\}/)
      expect(tablet?.[0]).toMatch(/\.sb-toggle\s*\{[^}]*display:\s*(inline-flex|flex)/)
    })

    it('masque la date dans la topbar sous 768px', () => {
      const mobile = css.match(/@media\s*\(max-width:\s*768px\)\s*\{[\s\S]*?\n\}/)
      expect(mobile?.[0]).toMatch(/\.topbar-tools\s+\.small[^{]*\{[^}]*display:\s*none/)
    })
  })

  describe('catalog-grid — déjà fluide', () => {
    it('utilise auto-fill avec minmax pour adapter le nombre de colonnes', () => {
      const def = block('.catalog-grid')
      expect(def).toMatch(/grid-template-columns:\s*repeat\(auto-fill,\s*minmax\(/)
    })
  })
})
