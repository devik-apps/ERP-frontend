export type MovementType = 'Entrée' | 'Sortie'

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
