export type MovementType = 'Entrée' | 'Sortie'
export type ProductStatus = 'Actif' | 'Stock bas' | 'Inactif'

export interface Product {
  name: string
  category: string
  status: ProductStatus
  stock: number
  unit: string
  price: string
  origin: string
}

export const PRODUCT_CATEGORIES = [
  'Poissons frais',
  'Préparations',
  'Crustacés',
  'Coquillages',
  'Fumés',
] as const

export const PRODUCT_STATUSES: ProductStatus[] = ['Actif', 'Stock bas', 'Inactif']

export const PRODUCTS: Product[] = [
  { name: 'Thon rouge entier',  category: 'Poissons frais', status: 'Actif',     stock: 32.4, unit: 'kg', price: '38,00 €/kg', origin: 'Mareyeur Sète' },
  { name: 'Saumon d’Écosse',    category: 'Poissons frais', status: 'Actif',     stock: 42.6, unit: 'kg', price: '24,50 €/kg', origin: 'Loch Duart' },
  { name: 'Daurade royale',     category: 'Poissons frais', status: 'Actif',     stock: 18.3, unit: 'kg', price: '22,00 €/kg', origin: 'Élevage Corse' },
  { name: 'Bar de ligne',       category: 'Poissons frais', status: 'Actif',     stock: 21.6, unit: 'kg', price: '32,00 €/kg', origin: 'Pêche Bretagne' },
  { name: 'Cabillaud',          category: 'Poissons frais', status: 'Actif',     stock: 14.8, unit: 'kg', price: '19,80 €/kg', origin: 'Mer du Nord' },
  { name: 'Lotte (queue)',      category: 'Poissons frais', status: 'Inactif',   stock: 0,    unit: 'kg', price: '28,90 €/kg', origin: 'Pêche Bretagne' },
  { name: 'Filet de saumon',    category: 'Préparations',   status: 'Actif',     stock: 8.6,  unit: 'kg', price: '29,00 €/kg', origin: 'Atelier' },
  { name: 'Filet de bar',       category: 'Préparations',   status: 'Actif',     stock: 4.2,  unit: 'kg', price: '38,00 €/kg', origin: 'Atelier' },
  { name: 'Tartare de thon',    category: 'Préparations',   status: 'Actif',     stock: 1.6,  unit: 'kg', price: '46,00 €/kg', origin: 'Atelier' },
  { name: 'Saumon fumé',        category: 'Fumés',          status: 'Actif',     stock: 6.4,  unit: 'kg', price: '52,00 €/kg', origin: 'Atelier' },
  { name: 'Crevettes roses',    category: 'Crustacés',      status: 'Actif',     stock: 3.0,  unit: 'kg', price: '24,00 €/kg', origin: 'Madagascar' },
  { name: 'Langoustines',       category: 'Crustacés',      status: 'Stock bas', stock: 1.2,  unit: 'kg', price: '48,00 €/kg', origin: 'Pêche Bretagne' },
  { name: 'Saint-Jacques',      category: 'Coquillages',    status: 'Actif',     stock: 2.8,  unit: 'kg', price: '36,00 €/kg', origin: 'Baie de Saint-Brieuc' },
  { name: 'Huîtres n°3',        category: 'Coquillages',    status: 'Actif',     stock: 24.0, unit: 'kg', price: '12,00 €/douz.', origin: 'Marennes Oléron' },
  { name: 'Moules de bouchot',  category: 'Coquillages',    status: 'Actif',     stock: 11.4, unit: 'kg', price: '6,50 €/kg',  origin: 'Mont-Saint-Michel' },
]

export interface PriceRow {
  segment: string
  cost: string
  price: string
  margin: string
}

export interface ProductDetail extends Product {
  ref: string
  description: string
  available: number
  reserved: number
  threshold: number
  prices: PriceRow[]
}

export const PRODUCT_DETAIL: ProductDetail = {
  name: 'Thon rouge entier',
  category: 'Poissons frais',
  status: 'Actif',
  stock: 32.4,
  unit: 'kg',
  price: '38,00 €/kg',
  origin: 'Mareyeur Sète',
  ref: 'POI-THO-001',
  description:
    'Thon rouge entier de Méditerranée, pêché à la palangre. Calibre 30–50 kg, livré sous glace. Idéal pour découpe sushi, tartare et longe rôtie.',
  available: 28.4,
  reserved: 4.0,
  threshold: 10.0,
  prices: [
    { segment: 'Détail',     cost: '24,00 €/kg', price: '38,00 €/kg', margin: '37 %' },
    { segment: 'Pro',        cost: '24,00 €/kg', price: '34,00 €/kg', margin: '29 %' },
    { segment: 'Restaurant', cost: '24,00 €/kg', price: '32,50 €/kg', margin: '26 %' },
    { segment: 'Gros',       cost: '24,00 €/kg', price: '29,80 €/kg', margin: '19 %' },
  ],
}

export interface Movement {
  time: string
  product: string
  type: MovementType
  qty: number
  weight: string
  origin: string
  user: string
}

export interface Metric {
  label: string
  value: string
  unit: string
  hint: string
  delta: string
  up: boolean
}

export const METRICS: Metric[] = [
  { label: 'Stock total',     value: '342,7', unit: 'kg',     hint: '15 références', delta: '+12,4 kg vs hier', up: true },
  { label: 'Ventes du jour',  value: '1 248', unit: '€',      hint: '34 tickets',     delta: '+8 % vs lundi',     up: true },
  { label: 'Produits actifs', value: '14',    unit: '/ 15',   hint: '1 désactivé',    delta: 'Lotte (queue)',     up: false },
  { label: 'Transformations', value: '23',    unit: 'lots',   hint: 'mai 2026',       delta: '+4 vs avril',       up: true },
]

export type SalesSegment = 'Comptoir' | 'Pro' | 'Restaurant' | 'Gros'
export type SaleStatus = 'Payé' | 'En attente' | 'Annulé'

export const SALES_SEGMENTS: SalesSegment[] = ['Comptoir', 'Pro', 'Restaurant', 'Gros']

export interface Sale {
  id: string
  time: string
  segment: SalesSegment
  top: string
  items: number
  total: string
  seller: string
  status: SaleStatus
}

export const SALES_METRICS: Metric[] = [
  { label: 'Chiffre d\'affaires', value: '1 248', unit: '€',  hint: '34 tickets',     delta: '+8 % vs lundi',    up: true  },
  { label: 'Tickets émis',        value: '34',    unit: '',   hint: '4 en attente',   delta: '+6 vs lundi',      up: true  },
  { label: 'Panier moyen',        value: '36,70', unit: '€',  hint: 'Méd. 28,40 €',   delta: '+1,80 € vs lundi', up: true  },
  { label: 'Segment principal',   value: '62',    unit: '%',  hint: 'Comptoir',       delta: '20 tickets',       up: false },
]

export const SALES: Sale[] = [
  { id: 'T-2034', time: '04/05 10:08', segment: 'Comptoir',   top: 'Filet de saumon',    items: 3, total: '42,80 €',  seller: 'Léa',  status: 'Payé'       },
  { id: 'T-2033', time: '04/05 09:55', segment: 'Restaurant', top: 'Thon rouge',         items: 6, total: '184,50 €', seller: 'Marc', status: 'Payé'       },
  { id: 'T-2032', time: '04/05 09:38', segment: 'Comptoir',   top: 'Crevettes roses',    items: 2, total: '24,00 €',  seller: 'Léa',  status: 'Payé'       },
  { id: 'T-2031', time: '04/05 09:20', segment: 'Pro',        top: 'Saumon d’Écosse',    items: 4, total: '76,40 €',  seller: 'Marc', status: 'En attente' },
  { id: 'T-2030', time: '04/05 08:42', segment: 'Comptoir',   top: 'Huîtres n°3',        items: 1, total: '12,00 €',  seller: 'Léa',  status: 'Payé'       },
  { id: 'T-2029', time: '03/05 17:18', segment: 'Restaurant', top: 'Bar de ligne',       items: 5, total: '146,00 €', seller: 'Marc', status: 'Payé'       },
  { id: 'T-2028', time: '03/05 16:54', segment: 'Comptoir',   top: 'Saint-Jacques',      items: 2, total: '38,40 €',  seller: 'Léa',  status: 'Annulé'     },
  { id: 'T-2027', time: '03/05 16:10', segment: 'Pro',        top: 'Daurade royale',     items: 7, total: '212,00 €', seller: 'Marc', status: 'Payé'       },
  { id: 'T-2026', time: '03/05 15:32', segment: 'Comptoir',   top: 'Cabillaud',          items: 3, total: '46,20 €',  seller: 'Léa',  status: 'Payé'       },
  { id: 'T-2025', time: '03/05 14:48', segment: 'Gros',       top: 'Moules de bouchot',  items: 8, total: '342,00 €', seller: 'Marc', status: 'En attente' },
  { id: 'T-2024', time: '03/05 13:22', segment: 'Comptoir',   top: 'Filet de bar',       items: 4, total: '58,80 €',  seller: 'Léa',  status: 'Payé'       },
  { id: 'T-2023', time: '03/05 11:48', segment: 'Restaurant', top: 'Tartare de thon',    items: 6, total: '168,00 €', seller: 'Marc', status: 'Payé'       },
]

export const MOVEMENTS: Movement[] = [
  { time: '04/05 10:12', product: 'Thon rouge entier',   type: 'Entrée', qty: 4,  weight: '32 400 g', origin: 'Mareyeur Sète',     user: 'Marc' },
  { time: '04/05 09:48', product: 'Filet de saumon',     type: 'Sortie', qty: 6,  weight: '2 880 g',  origin: 'Vente comptoir',    user: 'Léa' },
  { time: '04/05 09:30', product: 'Crevettes roses',     type: 'Sortie', qty: 2,  weight: '600 g',    origin: 'Vente comptoir',    user: 'Léa' },
  { time: '04/05 08:55', product: 'Saumon d’Écosse',type: 'Entrée', qty: 3,  weight: '14 200 g', origin: 'Loch Duart',        user: 'Marc' },
  { time: '04/05 08:20', product: 'Tartare de thon',     type: 'Entrée', qty: 8,  weight: '1 600 g',  origin: 'Transformation',    user: 'Atelier' },
  { time: '03/05 17:24', product: 'Filet de saumon',     type: 'Entrée', qty: 12, weight: '5 760 g',  origin: 'Transformation',    user: 'Atelier' },
  { time: '03/05 16:45', product: 'Saint-Jacques',       type: 'Sortie', qty: 1,  weight: '450 g',    origin: 'Vente comptoir',    user: 'Léa' },
  { time: '03/05 15:10', product: 'Daurade royale',      type: 'Entrée', qty: 5,  weight: '6 100 g',  origin: 'Élevage Corse',     user: 'Marc' },
  { time: '03/05 14:00', product: 'Huîtres n°3',         type: 'Entrée', qty: 2,  weight: '24 000 g', origin: 'Marennes Oléron',   user: 'Marc' },
  { time: '03/05 11:02', product: 'Bar de ligne',        type: 'Entrée', qty: 4,  weight: '7 200 g',  origin: 'Pêche Bretagne',    user: 'Marc' },
  { time: '03/05 10:48', product: 'Filet de bar',        type: 'Entrée', qty: 6,  weight: '2 100 g',  origin: 'Transformation',    user: 'Atelier' },
]
