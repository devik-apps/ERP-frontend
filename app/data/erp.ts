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
