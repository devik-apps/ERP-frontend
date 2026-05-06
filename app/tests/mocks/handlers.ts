import { http, HttpResponse } from 'msw'

const MOCK_CATEGORIES = [
  { id: 'cat-1', label: 'Poissons frais', isActive: true },
  { id: 'cat-2', label: 'Préparations',   isActive: true },
  { id: 'cat-3', label: 'Crustacés',      isActive: true },
  { id: 'cat-4', label: 'Coquillages',    isActive: true },
  { id: 'cat-5', label: 'Fumés',          isActive: true },
]

const MOCK_PRODUCTS = [
  { id: 'prod-001', label: 'Thon rouge entier',  category: { id: 'cat-1', label: 'Poissons frais' }, isActive: true,  currentStock: 32.4, activePriceCount: 4 },
  { id: 'prod-002', label: 'Saumon d’Écosse', category: { id: 'cat-1', label: 'Poissons frais' }, isActive: true,  currentStock: 42.6, activePriceCount: 2 },
  { id: 'prod-003', label: 'Daurade royale',     category: { id: 'cat-1', label: 'Poissons frais' }, isActive: true,  currentStock: 18.3, activePriceCount: 2 },
  { id: 'prod-004', label: 'Bar de ligne',       category: { id: 'cat-1', label: 'Poissons frais' }, isActive: true,  currentStock: 21.6, activePriceCount: 2 },
  { id: 'prod-005', label: 'Cabillaud',          category: { id: 'cat-1', label: 'Poissons frais' }, isActive: true,  currentStock: 14.8, activePriceCount: 2 },
  { id: 'prod-006', label: 'Lotte (queue)',      category: { id: 'cat-1', label: 'Poissons frais' }, isActive: false, currentStock: 0,    activePriceCount: 0 },
  { id: 'prod-007', label: 'Filet de saumon',   category: { id: 'cat-2', label: 'Préparations'   }, isActive: true,  currentStock: 8.6,  activePriceCount: 2 },
  { id: 'prod-008', label: 'Filet de bar',       category: { id: 'cat-2', label: 'Préparations'   }, isActive: true,  currentStock: 4.2,  activePriceCount: 2 },
  { id: 'prod-009', label: 'Tartare de thon',   category: { id: 'cat-2', label: 'Préparations'   }, isActive: true,  currentStock: 1.6,  activePriceCount: 2 },
  { id: 'prod-010', label: 'Saumon fumé',        category: { id: 'cat-5', label: 'Fumés'          }, isActive: true,  currentStock: 6.4,  activePriceCount: 2 },
  { id: 'prod-011', label: 'Crevettes roses',   category: { id: 'cat-3', label: 'Crustacés'      }, isActive: true,  currentStock: 3.0,  activePriceCount: 2 },
  { id: 'prod-012', label: 'Langoustines',       category: { id: 'cat-3', label: 'Crustacés'      }, isActive: true,  currentStock: 1.2,  activePriceCount: 2 },
  { id: 'prod-013', label: 'Saint-Jacques',      category: { id: 'cat-4', label: 'Coquillages'    }, isActive: true,  currentStock: 2.8,  activePriceCount: 2 },
  { id: 'prod-014', label: 'Huîtres n°3',        category: { id: 'cat-4', label: 'Coquillages'    }, isActive: true,  currentStock: 24.0, activePriceCount: 2 },
  { id: 'prod-015', label: 'Moules de bouchot', category: { id: 'cat-4', label: 'Coquillages'    }, isActive: true,  currentStock: 11.4, activePriceCount: 2 },
]

const MOCK_PRODUCT_DETAIL = {
  id: 'prod-001',
  label: 'Thon rouge entier',
  category: { id: 'cat-1', label: 'Poissons frais' },
  isActive: true,
  currentStock: 32.4,
  activePriceCount: 4,
  description: 'Thon rouge entier de Méditerranée, pêché à la palangre. Calibre 30–50 kg, livré sous glace. Idéal pour découpe sushi, tartare et longe rôtie.',
}

const MOCK_PRODUCT_STOCK = {
  product: { id: 'prod-001', label: 'Thon rouge entier' },
  totalQuantity: 32.4,
  totalWeightGrams: 32400,
  lastMovementAt: '2026-05-04T10:12:00Z',
}

const MOCK_PRODUCT_PRICES = [
  { id: 'price-1', productId: 'prod-001', packaging: { id: 'pkg-1', label: 'Détail'     }, amount: 3800, weightGrams: 1000, validFrom: '2026-01-01T00:00:00Z', isCurrentlyActive: true },
  { id: 'price-2', productId: 'prod-001', packaging: { id: 'pkg-2', label: 'Pro'        }, amount: 3400, weightGrams: 1000, validFrom: '2026-01-01T00:00:00Z', isCurrentlyActive: true },
  { id: 'price-3', productId: 'prod-001', packaging: { id: 'pkg-3', label: 'Restaurant' }, amount: 3250, weightGrams: 1000, validFrom: '2026-01-01T00:00:00Z', isCurrentlyActive: true },
  { id: 'price-4', productId: 'prod-001', packaging: { id: 'pkg-4', label: 'Gros'       }, amount: 2980, weightGrams: 1000, validFrom: '2026-01-01T00:00:00Z', isCurrentlyActive: true },
]

export const handlers = [
  http.get('https://api.erp.local/v1/categories', () => {
    return HttpResponse.json({
      data: MOCK_CATEGORIES,
      meta: { total: 5, page: 1, limit: 10, totalPages: 1 },
    })
  }),

  http.put('https://api.erp.local/v1/categories/:id', async ({ request, params }) => {
    const body = await request.json() as { label: string; isActive: boolean }
    return HttpResponse.json(
      { id: params['id'], label: body.label, isActive: body.isActive },
      { status: 201 },
    )
  }),

  http.get('https://api.erp.local/v1/products', () => {
    return HttpResponse.json({
      data: MOCK_PRODUCTS,
      meta: { total: 15, page: 1, limit: 50, totalPages: 1 },
    })
  }),

  http.get('https://api.erp.local/v1/products/:id/stock', ({ params }) => {
    void params
    return HttpResponse.json(MOCK_PRODUCT_STOCK)
  }),

  http.get('https://api.erp.local/v1/products/:id/prices', ({ params }) => {
    void params
    return HttpResponse.json({ data: MOCK_PRODUCT_PRICES })
  }),

  http.get('https://api.erp.local/v1/products/:id', ({ params }) => {
    void params
    return HttpResponse.json(MOCK_PRODUCT_DETAIL)
  }),
]
