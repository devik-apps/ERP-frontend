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

export interface Metric {
  label: string
  value: string
  unit: string
  hint: string
  delta: string
  up: boolean
}

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

export type SupplierStatus = 'Actif' | 'Inactif' | 'Suspendu'
export type SupplierCategory = 'Poissons frais' | 'Coquillages' | 'Crustacés' | 'Équipement'

export const SUPPLIER_STATUSES: SupplierStatus[] = ['Actif', 'Inactif', 'Suspendu']
export const SUPPLIER_CATEGORIES: SupplierCategory[] = ['Poissons frais', 'Coquillages', 'Crustacés', 'Équipement']

export interface Supplier {
  id: string
  name: string
  category: SupplierCategory
  contact: string
  phone: string
  lastOrder: string
  amount: string
  delay: string
  status: SupplierStatus
}

export const SUPPLIER_METRICS: Metric[] = [
  { label: 'Fournisseurs actifs', value: '8',      unit: '/ 10', hint: '1 inactif, 1 suspendu', delta: '= vs avril',       up: false },
  { label: 'Commandes en cours',  value: '3',      unit: '',     hint: 'mai 2026',               delta: '+1 vs lundi',      up: true  },
  { label: 'Montant mensuel',     value: '12 840', unit: '€',    hint: 'mai 2026',               delta: '+4 % vs avril',    up: true  },
  { label: 'Délai moyen',         value: '2,2',    unit: 'j',    hint: 'livraison',              delta: '−0,3 j vs avril',  up: true  },
]

export const SUPPLIERS: Supplier[] = [
  { id: 'F-001', name: 'Mareyeur Sète',       category: 'Poissons frais', contact: 'Jean Petit',      phone: '04 67 48 21 30', lastOrder: '04/05/26', amount: '1 240 €', delay: '1 j',  status: 'Actif'   },
  { id: 'F-002', name: 'Loch Duart Ltd',       category: 'Poissons frais', contact: 'Andrew MacLeod',  phone: '+44 1571 844 44', lastOrder: '04/05/26', amount: '2 180 €', delay: '3 j',  status: 'Actif'   },
  { id: 'F-003', name: 'Élevage Corse SARL',  category: 'Poissons frais', contact: 'Pierre Colonna',  phone: '04 95 37 12 08', lastOrder: '02/05/26', amount: '680 €',   delay: '2 j',  status: 'Actif'   },
  { id: 'F-004', name: 'Pêche Bretagne Coop', category: 'Poissons frais', contact: 'Yves Kerlan',     phone: '02 98 56 44 17', lastOrder: '03/05/26', amount: '1 560 €', delay: '2 j',  status: 'Actif'   },
  { id: 'F-005', name: 'Mer du Nord Import',  category: 'Poissons frais', contact: 'Thomas Duval',    phone: '03 21 80 62 54', lastOrder: '03/05/26', amount: '480 €',   delay: '3 j',  status: 'Actif'   },
  { id: 'F-006', name: 'Marennes Oléron AOC', category: 'Coquillages',    contact: 'Claire Morin',    phone: '05 46 75 38 20', lastOrder: '01/05/26', amount: '1 080 €', delay: '1 j',  status: 'Actif'   },
  { id: 'F-007', name: 'Baie Saint-Brieuc',   category: 'Coquillages',    contact: 'Gilles Tanguy',   phone: '02 96 83 17 45', lastOrder: '03/05/26', amount: '840 €',   delay: '2 j',  status: 'Actif'   },
  { id: 'F-008', name: 'MSM Moules',           category: 'Coquillages',    contact: 'René Leblanc',    phone: '02 33 60 44 89', lastOrder: '02/05/26', amount: '420 €',   delay: '1 j',  status: 'Inactif' },
  { id: 'F-009', name: 'Madagascar Seafood',  category: 'Crustacés',      contact: 'Paul Ratsimba',   phone: '+261 20 22 48 16', lastOrder: '01/05/26', amount: '3 600 €', delay: '5 j',  status: 'Actif'   },
  { id: 'F-010', name: "Équip' Marée",         category: 'Équipement',     contact: 'Sophie Martin',   phone: '01 42 60 33 71', lastOrder: '15/03/26', amount: '760 €',   delay: '—',    status: 'Suspendu'},
]

