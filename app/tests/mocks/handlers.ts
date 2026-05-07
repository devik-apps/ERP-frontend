import { http, HttpResponse } from 'msw'

export const MOCK_STOCK_SUMMARY = [
  { product: { id: 'prod-001', label: 'Thon rouge entier' }, totalQuantity: 4, totalWeightGrams: 32400, lastMovementAt: '2026-05-04T10:12:00Z' },
  { product: { id: 'prod-007', label: 'Filet de saumon' },   totalQuantity: 6, totalWeightGrams: 8600,  lastMovementAt: '2026-05-04T09:48:00Z' },
]
// total: 41 000 g = 41,0 kg, 2 références

export const MOCK_TRANSFORMATIONS = [
  { id: 'tr-001', transformedAt: '2026-05-04T09:00:00Z', inputs: [], outputs: [], totalInputWeightGrams: 14200, totalOutputWeightGrams: 9800, totalLossGrams: 4400, lossRatio: 0.31, isActive: true },
  { id: 'tr-002', transformedAt: '2026-05-04T10:00:00Z', inputs: [], outputs: [], totalInputWeightGrams: 6400,  totalOutputWeightGrams: 4200, totalLossGrams: 2200, lossRatio: 0.34, isActive: true },
]
// meta.total = 7 (lots ce mois-ci)

export const MOCK_SALES = [
  { id: 'sale-001', saleDate: '2026-05-04T10:08:00Z', segment: 'Comptoir',   top: 'Filet de saumon',   itemCount: 3, totalAmount: 4280,  seller: 'Lea',  status: 'paid',       isActive: true },
  { id: 'sale-002', saleDate: '2026-05-04T09:55:00Z', segment: 'Restaurant', top: 'Thon rouge',        itemCount: 6, totalAmount: 18450, seller: 'Marc', status: 'paid',       isActive: true },
  { id: 'sale-003', saleDate: '2026-05-04T09:38:00Z', segment: 'Comptoir',   top: 'Crevettes roses',   itemCount: 2, totalAmount: 2400,  seller: 'Lea',  status: 'paid',       isActive: true },
  { id: 'sale-004', saleDate: '2026-05-04T09:20:00Z', segment: 'Pro',        top: 'Saumon Ecosse',     itemCount: 4, totalAmount: 7640,  seller: 'Marc', status: 'pending', isActive: true },
  { id: 'sale-005', saleDate: '2026-05-04T08:42:00Z', segment: 'Comptoir',   top: 'Huitres n3',        itemCount: 1, totalAmount: 1200,  seller: 'Lea',  status: 'paid',       isActive: true },
  { id: 'sale-006', saleDate: '2026-05-03T17:18:00Z', segment: 'Restaurant', top: 'Bar de ligne',      itemCount: 5, totalAmount: 14600, seller: 'Marc', status: 'paid',       isActive: true },
  { id: 'sale-007', saleDate: '2026-05-03T16:54:00Z', segment: 'Comptoir',   top: 'Saint-Jacques',     itemCount: 2, totalAmount: 3840,  seller: 'Lea',  status: 'cancelled',     isActive: false },
  { id: 'sale-008', saleDate: '2026-05-03T16:10:00Z', segment: 'Pro',        top: 'Daurade royale',    itemCount: 7, totalAmount: 21200, seller: 'Marc', status: 'paid',       isActive: true },
  { id: 'sale-009', saleDate: '2026-05-03T15:32:00Z', segment: 'Comptoir',   top: 'Cabillaud',         itemCount: 3, totalAmount: 4620,  seller: 'Lea',  status: 'paid',       isActive: true },
  { id: 'sale-010', saleDate: '2026-05-03T14:48:00Z', segment: 'Gros',       top: 'Moules de bouchot', itemCount: 8, totalAmount: 34200, seller: 'Marc', status: 'pending', isActive: true },
  { id: 'sale-011', saleDate: '2026-05-03T13:22:00Z', segment: 'Comptoir',   top: 'Filet de bar',      itemCount: 4, totalAmount: 5880,  seller: 'Lea',  status: 'paid',       isActive: true },
  { id: 'sale-012', saleDate: '2026-05-03T11:48:00Z', segment: 'Restaurant', top: 'Tartare de thon',   itemCount: 6, totalAmount: 16800, seller: 'Marc', status: 'paid',       isActive: true },
]

export const MOCK_MOVEMENTS = [
  {
    id: 'mov-001',
    type: 'entry',
    product: { id: 'prod-001', label: 'Thon rouge entier' },
    supplier: null,
    quantity: 4,
    weightGrams: 32400,
    unitPrice: null,
    origin: 'manual',
    description: 'Réception matin',
    isActive: true,
    createdAt: '2026-05-04T10:12:00Z',
  },
  {
    id: 'mov-002',
    type: 'exit',
    product: { id: 'prod-007', label: 'Filet de saumon' },
    supplier: null,
    quantity: 6,
    weightGrams: 2880,
    unitPrice: null,
    origin: 'manual',
    description: 'Vente comptoir',
    isActive: true,
    createdAt: '2026-05-04T09:48:00Z',
  },
]

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

  http.get('https://api.erp.local/v1/sales', () => {
    return HttpResponse.json({
      data: MOCK_SALES,
      meta: { total: 12, page: 1, limit: 50, totalPages: 1 },
    })
  }),

  http.put('https://api.erp.local/v1/sales/:id', async ({ request, params }) => {
    const body = await request.json() as { saleDate: string; description?: string | null; items: { productId: string; productPriceId: string; quantity: number }[] }
    return HttpResponse.json(
      {
        id: params['id'],
        saleDate: body.saleDate,
        description: body.description ?? null,
        totalAmount: 0,
        itemCount: body.items.length,
        isActive: true,
      },
      { status: 201 },
    )
  }),

  http.get('https://api.erp.local/v1/stock/summary', () => {
    return HttpResponse.json({ data: MOCK_STOCK_SUMMARY })
  }),

  http.get('https://api.erp.local/v1/transformations', () => {
    return HttpResponse.json({
      data: MOCK_TRANSFORMATIONS,
      meta: { total: 7, page: 1, limit: 50, totalPages: 1 },
    })
  }),

  http.get('https://api.erp.local/v1/stock', () => {
    return HttpResponse.json({
      data: MOCK_MOVEMENTS,
      meta: { total: 2, page: 1, limit: 50, totalPages: 1 },
    })
  }),

  http.put('https://api.erp.local/v1/stock/:id', async ({ request, params }) => {
    const body = await request.json() as {
      type: string; productId: string; quantity: number; weightGrams?: number; description?: string
    }
    return HttpResponse.json(
      {
        id: params['id'],
        type: body.type,
        product: { id: body.productId, label: 'Thon rouge entier' },
        supplier: null,
        quantity: body.quantity,
        weightGrams: body.weightGrams ?? 0,
        unitPrice: null,
        origin: 'manual',
        description: body.description ?? null,
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      { status: 201 },
    )
  }),
]
