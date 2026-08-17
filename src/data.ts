export type Tag = 'Vegan' | 'Vegetarian' | 'Gluten-free' | 'Nut-free' | 'Halal' | 'Spicy' | 'Quick' | 'Popular' | 'High protein' | 'Shareable' | 'Kids' | 'Comforting'

export type Dish = {
  id: string
  name: string
  category: 'Starters' | 'Mains' | 'Sides' | 'Desserts' | 'Drinks'
  price: number
  summary: string
  description: string
  tags: Tag[]
  calories: number
  protein: number
  carbs: number
  fat: number
  available: boolean
  prep: string
  pairing?: { id: string; reason: string }
  customisations?: string[]
  colour: 'rose' | 'lemon' | 'mint' | 'sky' | 'plum'
}

export const categories = [
  ['Starters', 'Warm plates to share'],
  ['Mains', 'The kitchen’s centrepiece'],
  ['Sides', 'Small additions'],
  ['Desserts', 'A fitting finish'],
  ['Drinks', 'Pairings and pours'],
] as const

export const dishes: Dish[] = [
  { id: 'harissa-cauliflower', name: 'Harissa cauliflower', category: 'Starters', price: 9, summary: 'Charred florets, tahini, pomegranate and herbs.', description: 'Smoky cauliflower with bright pomegranate, cooling tahini and a lively, gently spiced finish.', tags: ['Vegan', 'Gluten-free', 'Spicy', 'Shareable'], calories: 284, protein: 8, carbs: 31, fat: 14, available: true, prep: '12 min', pairing: { id: 'citrus-soda', reason: 'The citrus and bubbles keep the heat feeling bright.' }, colour: 'rose' },
  { id: 'citrus-soda', name: 'Citrus soda', category: 'Drinks', price: 5, summary: 'Grapefruit, lime and a pinch of sea salt.', description: 'A sharp house soda with fresh grapefruit, lime and a softly salty finish.', tags: ['Vegan', 'Gluten-free', 'Quick'], calories: 74, protein: 0, carbs: 18, fat: 0, available: true, prep: '2 min', colour: 'lemon' },
  { id: 'smoked-aubergine', name: 'Smoked aubergine', category: 'Starters', price: 10, summary: 'Miso glaze, sesame, crisp shallots and herbs.', description: 'Silky grilled aubergine with a sweet-savoury miso glaze and crunchy shallots.', tags: ['Vegan', 'Gluten-free', 'Shareable'], calories: 261, protein: 7, carbs: 26, fat: 15, available: true, prep: '10 min', colour: 'plum' },
  { id: 'lemon-chicken', name: 'Lemon herb chicken', category: 'Mains', price: 19, summary: 'Charred chicken, couscous, peppers and herb yogurt.', description: 'A comforting plate of charred chicken, lemony couscous, roasted peppers and smoky herb yogurt.', tags: ['Halal', 'High protein', 'Popular'], calories: 642, protein: 46, carbs: 54, fat: 24, available: true, prep: '16 min', pairing: { id: 'garden-salad', reason: 'A crisp, lemony side keeps this generous dish balanced.' }, customisations: ['Make it mild', 'Swap couscous for greens', 'Add avocado +£2'], colour: 'mint' },
  { id: 'mushroom-orzo', name: 'Roast mushroom orzo', category: 'Mains', price: 17, summary: 'Wild mushrooms, pea shoots and parmesan cream.', description: 'Creamy orzo with deeply roasted mushrooms, sweet peas and peppery pea shoots.', tags: ['Vegetarian', 'Comforting'], calories: 598, protein: 19, carbs: 72, fat: 26, available: true, prep: '14 min', colour: 'lemon' },
  { id: 'green-bowl', name: 'Green grain bowl', category: 'Mains', price: 16, summary: 'Herby grains, roasted squash, greens and seeds.', description: 'A bright bowl of warm grains, roasted squash, green herbs and toasted seeds.', tags: ['Vegan', 'Quick'], calories: 512, protein: 14, carbs: 68, fat: 21, available: true, prep: '9 min', colour: 'sky' },
  { id: 'garden-salad', name: 'Lemon garden salad', category: 'Sides', price: 6, summary: 'Cucumber, herbs, radish and lemon dressing.', description: 'A crisp, cooling salad dressed with bright lemon and plenty of fresh herbs.', tags: ['Vegan', 'Gluten-free', 'Quick'], calories: 144, protein: 3, carbs: 12, fat: 9, available: true, prep: '4 min', colour: 'mint' },
  { id: 'sticky-date', name: 'Sticky date pudding', category: 'Desserts', price: 8, summary: 'Warm date sponge, toffee sauce and crème fraîche.', description: 'A soft warm date pudding with dark toffee sauce and cool crème fraîche.', tags: ['Popular'], calories: 487, protein: 5, carbs: 66, fat: 22, available: true, prep: '8 min', colour: 'rose' },
  { id: 'sharing-fries', name: 'Rosemary fries', category: 'Sides', price: 5, summary: 'Crisp potatoes, rosemary salt and garlic aioli.', description: 'Hot, crisp rosemary fries served with house garlic aioli.', tags: ['Shareable', 'Popular'], calories: 398, protein: 5, carbs: 48, fat: 20, available: true, prep: '7 min', colour: 'lemon' },
  { id: 'seared-fish', name: 'Seared market fish', category: 'Mains', price: 22, summary: 'Today’s catch, wilted greens and caper butter.', description: 'A light, clean plate of seared fish with greens and caper butter.', tags: ['Gluten-free', 'High protein'], calories: 521, protein: 41, carbs: 21, fat: 30, available: false, prep: '18 min', colour: 'sky' },
]

export const filterTags: Tag[] = ['Vegan', 'Gluten-free', 'Nut-free', 'Halal', 'Spicy', 'Quick', 'High protein', 'Kids']
