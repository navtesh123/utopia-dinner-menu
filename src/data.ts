export type Locale = 'EN' | 'FR'

export type LocalizedText = Record<Locale, string>

export type Tag = 'Vegan' | 'Vegetarian' | 'Gluten-free' | 'Nut-free' | 'Spicy' | 'Quick' | 'Popular' | 'High protein' | 'Shareable' | 'Kids' | 'Comforting'

export type Category = 'Appetizers' | 'Starters' | 'Salads' | 'Burritos' | 'Burgers' | 'Sandwiches' | 'Brunch' | 'Sides' | 'Drinks'

export type BaseOption = {
  id: string
  label: LocalizedText
  price?: number
  default?: boolean
}

export type BaseOptionGroup = {
  id: string
  title: LocalizedText
  subtitle?: LocalizedText
  options: BaseOption[]
  required: boolean
}

export type AddOn = {
  id: string
  label: LocalizedText
  price: number
  badge?: LocalizedText
  dietary?: Extract<Tag, 'Vegan' | 'Vegetarian'>[]
}

export type AddOnGroup = {
  id: string
  title: LocalizedText
  subtitle: LocalizedText
  maxSelections?: number
  addOns: AddOn[]
}

export type DishCustomizations = {
  baseOptions?: BaseOptionGroup[]
  addOns?: AddOnGroup[]
}

export type Dish = {
  id: string
  name: LocalizedText
  category: Category
  price: number
  summary: LocalizedText
  description: LocalizedText
  tags: Tag[]
  calories: number
  protein: number
  carbs: number
  fat: number
  available: boolean
  prep: string
  pairing?: { id: string; reason: LocalizedText }
  customisations?: LocalizedText[]
  customizations?: DishCustomizations
  colour: 'rose' | 'lemon' | 'mint' | 'sky' | 'plum'
  image: string
}

const text = (EN: string, FR: string): LocalizedText => ({ EN, FR })

export const categoryLabels: Record<Category, LocalizedText> = {
  Appetizers: text('Appetizers', 'Entrees'),
  Starters: text('Starters', 'A partager'),
  Salads: text('Salads', 'Salades'),
  Burritos: text('Burritos', 'Burritos'),
  Burgers: text('Burgers', 'Burgers'),
  Sandwiches: text('Sandwiches', 'Sandwichs'),
  Brunch: text('Brunch', 'Brunch'),
  Sides: text('Sides', 'Accompagnements'),
  Drinks: text('Drinks', 'Boissons'),
}

export const categoryCues: Record<Category, LocalizedText> = {
  Appetizers: text('Small starts', 'Petites entrees'),
  Starters: text('Shareable plates', 'Assiettes a partager'),
  Salads: text('Greens and bowls', 'Verdure et bols'),
  Burritos: text('Grilled wraps', 'Wraps grilles'),
  Burgers: text('Ace Bakery buns', 'Pains Ace Bakery'),
  Sandwiches: text('Paninis and classics', 'Paninis et classiques'),
  Brunch: text('Late morning plates', 'Assiettes de fin de matinee'),
  Sides: text('Add-ons and extras', 'Extras et ajouts'),
  Drinks: text('Cans, bottles, coffee', 'Canettes, bouteilles, cafe'),
}

export const categories: Category[] = ['Appetizers', 'Starters', 'Salads', 'Burritos', 'Burgers', 'Sandwiches', 'Brunch', 'Sides', 'Drinks']

export const tagLabels: Record<Tag, LocalizedText> = {
  Vegan: text('Vegan', 'Vegan'),
  Vegetarian: text('Vegetarian', 'Vegetarien'),
  'Gluten-free': text('Gluten-free', 'Sans gluten'),
  'Nut-free': text('Nut-free', 'Sans noix'),
  Spicy: text('Spicy', 'Epice'),
  Quick: text('Quick', 'Rapide'),
  Popular: text('Popular', 'Populaire'),
  'High protein': text('High protein', 'Riche en proteines'),
  Shareable: text('Shareable', 'A partager'),
  Kids: text('Kids', 'Enfants'),
  Comforting: text('Comforting', 'Reconfortant'),
}

const nutritionByCategory: Record<Category, { calories: number; protein: number; carbs: number; fat: number; prep: string }> = {
  Appetizers: { calories: 430, protein: 16, carbs: 38, fat: 22, prep: '10 min' },
  Starters: { calories: 620, protein: 18, carbs: 64, fat: 30, prep: '13 min' },
  Salads: { calories: 390, protein: 12, carbs: 24, fat: 24, prep: '8 min' },
  Burritos: { calories: 760, protein: 30, carbs: 78, fat: 34, prep: '14 min' },
  Burgers: { calories: 780, protein: 34, carbs: 58, fat: 42, prep: '14 min' },
  Sandwiches: { calories: 690, protein: 29, carbs: 58, fat: 35, prep: '12 min' },
  Brunch: { calories: 760, protein: 28, carbs: 72, fat: 36, prep: '16 min' },
  Sides: { calories: 210, protein: 4, carbs: 18, fat: 12, prep: '4 min' },
  Drinks: { calories: 90, protein: 0, carbs: 22, fat: 0, prep: '2 min' },
}

const colourByCategory: Record<Category, Dish['colour']> = {
  Appetizers: 'rose',
  Starters: 'lemon',
  Salads: 'mint',
  Burritos: 'sky',
  Burgers: 'plum',
  Sandwiches: 'mint',
  Brunch: 'lemon',
  Sides: 'rose',
  Drinks: 'sky',
}

type DishInput = Omit<Dish, 'calories' | 'protein' | 'carbs' | 'fat' | 'prep' | 'available' | 'colour' | 'image'> & Partial<Pick<Dish, 'calories' | 'protein' | 'carbs' | 'fat' | 'prep' | 'available' | 'colour' | 'image'>>

const dish = (input: DishInput): Dish => {
  const estimate = nutritionByCategory[input.category]
  return {
    ...input,
    calories: input.calories ?? estimate.calories,
    protein: input.protein ?? estimate.protein,
    carbs: input.carbs ?? estimate.carbs,
    fat: input.fat ?? estimate.fat,
    prep: input.prep ?? estimate.prep,
    available: input.available ?? true,
    colour: input.colour ?? colourByCategory[input.category],
    image: input.image ?? `/dishes/${input.id}.jpg`,
  }
}

const customizationSubtitle = (count: number) => text(`Select upto ${count}`, `Choisissez jusqu a ${count}`)
const requiredSubtitle = text('Select any 1', 'Choisissez 1')
const bestseller = text('Bestseller', 'Meilleure vente')
const proteinRich = text('Protein Rich', 'Riche en proteines')

export const dishes: Dish[] = [
  dish({ id: 'chicken-karaage', name: text('Chicken Karaage', 'Poulet karaage'), category: 'Appetizers', price: 7.95, summary: text('Crispy Japanese-style fried chicken with ginger-soy sake sauce.', 'Poulet frit croustillant a la japonaise avec sauce gingembre-soja-sake.'), description: text('Fried chicken pieces finished with ginger-soy sake sauce and spicy sriracha mayo.', 'Morceaux de poulet frit nappes d une sauce gingembre-soja-sake et d une mayo sriracha epicee.'), tags: ['Popular', 'High protein'], pairing: { id: 'coke', reason: text('A cold can keeps this crisp, salty starter easy.', 'Une canette bien froide accompagne parfaitement cette entree croustillante et salee.') } }),
  dish({ id: 'veggie-chili-bowl', name: text('Veggie Chili Bowl', 'Bol de chili vegetarien'), category: 'Appetizers', price: 10.95, summary: text('Hearty vegetarian chili with cheese, green onion and sour cream.', 'Chili vegetarien copieux avec fromage, oignon vert et creme sure.'), description: text('A warm chili bowl topped with cheddar, green onion and sour cream.', 'Un bol de chili bien chaud garni de cheddar, d oignon vert et de creme sure.'), tags: ['Vegetarian', 'Comforting'] }),
  dish({ id: 'fresh-tortilla-chips', name: text('Fresh Tortilla Chips with Salsa and Guacamole', 'Chips de tortilla frais avec salsa et guacamole'), category: 'Appetizers', price: 9.95, summary: text('House-fried yellow and blue corn chips with salsa and guacamole.', 'Chips de mais jaune et bleu frits sur place, servis avec salsa et guacamole.'), description: text('Corn tortilla chips fried in house and served with salsa and guacamole.', 'Chips de tortilla de mais frits sur place et servis avec salsa et guacamole.'), tags: ['Vegan', 'Gluten-free', 'Shareable', 'Quick'] }),
  dish({ id: 'homemade-daily-soup', name: text('Homemade Daily Soup', 'Soupe du jour maison'), category: 'Appetizers', price: 8.95, summary: text('Daily house soup made with seasonal ingredients.', 'Soupe maison du jour preparee avec des ingredients de saison.'), description: text('A rotating soup made in house from fresh seasonal ingredients.', 'Une soupe changeante preparee sur place avec des ingredients frais de saison.'), tags: ['Vegetarian', 'Gluten-free', 'Quick'] }),
  dish({ id: 'nachos-litos', name: text('Nachos-litos', 'Nachos-litos'), category: 'Appetizers', price: 11.95, summary: text('Mini nachos with veggie chili, salsa, jalapenos and Monterey Jack.', 'Mini nachos avec chili vegetarien, salsa, jalapenos et Monterey Jack.'), description: text('Mini nachos with veggie chili, salsa, fried jalapenos, Monterey Jack, salsa and sour cream.', 'Mini nachos garnis de chili vegetarien, salsa, jalapenos frits, Monterey Jack et creme sure.'), tags: ['Vegetarian', 'Spicy', 'Shareable'] }),

  dish({ id: 'poutine', name: text('Poutine', 'Poutine'), category: 'Starters', price: 10.95, summary: text('Fresh fries, cheese curds and veggie gravy.', 'Frites fraiches, fromage en grains et sauce vegetarienne.'), description: text('Crispy fries covered with cheese curds and vegetarian gravy.', 'Frites croustillantes recouvertes de fromage en grains et de sauce vegetarienne.'), tags: ['Vegetarian', 'Popular', 'Comforting'], pairing: { id: 'utopia-burger', reason: text('This is the classic comfort pairing on the menu.', 'C est l accord reconfortant classique du menu.') }, customizations: { baseOptions: [{ id: 'gravy', title: text('Choice of Gravy', 'Choix de sauce'), subtitle: requiredSubtitle, required: true, options: [{ id: 'veggie-gravy', label: text('Veggie gravy', 'Sauce vegetarienne'), default: true }, { id: 'beef-gravy', label: text('Beef gravy', 'Sauce au boeuf') }] }], addOns: [{ id: 'poutine-add-ons', title: text('Add Ons For Poutine', 'Extras pour poutine'), subtitle: customizationSubtitle(4), maxSelections: 4, addOns: [{ id: 'extra-cheese-curds', label: text('Extra cheese curds', 'Fromage en grains extra'), price: 0.75, badge: bestseller, dietary: ['Vegetarian'] }, { id: 'grilled-chicken', label: text('Grilled chicken', 'Poulet grille'), price: 0.95, badge: proteinRich }, { id: 'crispy-bacon', label: text('Crispy bacon', 'Bacon croustillant'), price: 0.95 }, { id: 'caramelized-onions', label: text('Caramelized onions', 'Oignons caramelises'), price: 0.5, dietary: ['Vegan', 'Vegetarian'] }] }] } }),
  dish({ id: 'fresh-cut-fries', name: text('Fresh Cut Fries', 'Frites fraiches'), category: 'Starters', price: 7.95, summary: text('Fresh-cut fries, vegan and gluten-free.', 'Frites coupees sur place, vegan et sans gluten.'), description: text('Simple fresh-cut fries served hot from the fryer.', 'Frites simples coupees sur place, servies bien chaudes a la sortie de la friteuse.'), tags: ['Vegan', 'Gluten-free', 'Quick', 'Shareable'] }),
  dish({ id: 'onion-rings', name: text('Onion Rings', 'Rondelles d oignon'), category: 'Starters', price: 10.00, summary: text('Crisp fried onion rings.', 'Rondelles d oignon frites et croustillantes.'), description: text('Golden onion rings served as a shareable starter.', 'Rondelles d oignon dorees servies en entree a partager.'), tags: ['Vegetarian', 'Shareable'] }),
  dish({ id: 'sweet-potato-quesadilla', name: text('Sweet Potato Quesadilla', 'Quesadilla a la patate douce'), category: 'Starters', price: 14.95, summary: text('Sweet potato, salsa, cheese and jalapeno mayo.', 'Patate douce, salsa, fromage et mayo au jalapeno.'), description: text('Roasted sweet potato, salsa, cheddar and Monterey Jack baked in a flour tortilla with sour cream.', 'Patate douce rotie, salsa, cheddar et Monterey Jack cuits dans une tortilla de farine avec creme sure.'), tags: ['Vegetarian', 'Spicy'] }),
  dish({ id: 'mushroom-pesto-quesadilla', name: text('Mushroom and Pesto Quesadilla', 'Quesadilla aux champignons et au pesto'), category: 'Starters', price: 14.95, summary: text('Mushrooms, salsa, pesto and melted cheese.', 'Champignons, salsa, pesto et fromage fondant.'), description: text('White and portobello mushrooms with salsa, pesto, cheddar and Monterey Jack baked in a tortilla.', 'Champignons blancs et portobello avec salsa, pesto, cheddar et Monterey Jack cuits dans une tortilla.'), tags: ['Vegetarian'] }),
  dish({ id: 'veggie-nachos', name: text('Veggie Nachos', 'Nachos vegetariens'), category: 'Starters', price: 21.95, summary: text('House chips layered with veggie chili, salsa, jalapenos and cheese.', 'Chips maison garnis de chili vegetarien, salsa, jalapenos et fromage.'), description: text('House-fried corn tortilla chips layered with veggie chili, salsa, jalapenos and cheddar Monterey Jack, with salsa and sour cream.', 'Chips de tortilla de mais frits sur place garnis de chili vegetarien, salsa, jalapenos, cheddar Monterey Jack, salsa et creme sure.'), tags: ['Vegetarian', 'Spicy', 'Shareable'] }),
  dish({ id: 'fish-tacos', name: text('Fish Tacos (3)', 'Tacos au poisson (3)'), category: 'Starters', price: 14.95, summary: text('Blackened cod, lettuce, tomato-citrus salsa, avocado and jalapeno mayo.', 'Morue epicee, laitue, salsa tomate-agrumes, avocat et mayo au jalapeno.'), description: text('Three fish tacos with blackened cod, lettuce, tomato-citrus salsa, avocado and jalapeno mayo.', 'Trois tacos au poisson avec morue epicee, laitue, salsa tomate-agrumes, avocat et mayo au jalapeno.'), tags: ['Spicy', 'High protein'], customizations: { baseOptions: [{ id: 'taco-count', title: text('Choice of Tacos', 'Choix du nombre de tacos'), subtitle: requiredSubtitle, required: true, options: [{ id: 'three-tacos', label: text('3 tacos', '3 tacos'), default: true }, { id: 'five-tacos', label: text('5 tacos', '5 tacos'), price: 1.5 }, { id: 'seven-tacos', label: text('7 tacos', '7 tacos'), price: 3 }] }], addOns: [{ id: 'fish-taco-add-ons', title: text('Add Ons For Fish Tacos', 'Extras pour tacos au poisson'), subtitle: customizationSubtitle(5), maxSelections: 5, addOns: [{ id: 'extra-avocado', label: text('Extra avocado', 'Avocat extra'), price: 0.75, dietary: ['Vegan', 'Vegetarian'] }, { id: 'guacamole', label: text('Guacamole', 'Guacamole'), price: 0.75, badge: bestseller, dietary: ['Vegan', 'Vegetarian'] }, { id: 'extra-fish', label: text('Extra fish', 'Poisson extra'), price: 1.2, badge: proteinRich }, { id: 'pico-de-gallo', label: text('Pico de gallo', 'Pico de gallo'), price: 0.5, dietary: ['Vegan', 'Vegetarian'] }, { id: 'lime-wedges', label: text('Lime wedges', 'Quartiers de lime'), price: 0, dietary: ['Vegan', 'Vegetarian'] }] }] } }),
  dish({ id: 'chicken-tacos', name: text('Chicken Tacos (3)', 'Tacos au poulet (3)'), category: 'Starters', price: 14.95, summary: text('Crispy chicken, lettuce, salsa, avocado and sriracha mayo.', 'Poulet croustillant, laitue, salsa, avocat et mayo sriracha.'), description: text('Three crispy chicken tacos with lettuce, tomato-citrus salsa, avocado and sriracha mayo.', 'Trois tacos au poulet croustillant avec laitue, salsa tomate-agrumes, avocat et mayo sriracha.'), tags: ['Spicy', 'High protein'] }),
  dish({ id: 'veggie-chicken-tacos', name: text('Veggie Chicken Tacos', 'Tacos au poulet vegetal'), category: 'Starters', price: 14.95, summary: text('Veggie chicken, lettuce, salsa, avocado and sriracha mayo.', 'Poulet vegetal, laitue, salsa, avocat et mayo sriracha.'), description: text('Crispy veggie chicken tacos with lettuce, tomato-citrus salsa, avocado and sriracha mayo.', 'Tacos croustillants au poulet vegetal avec laitue, salsa tomate-agrumes, avocat et mayo sriracha.'), tags: ['Vegetarian', 'Spicy'] }),

  dish({ id: 'caesar-salad', name: text('Caesar Salad', 'Salade Cesar'), category: 'Salads', price: 10.95, summary: text('Romaine, Asiago, croutons, bacon bits and garlic Caesar dressing.', 'Romaine, asiago, croutons, morceaux de bacon et vinaigrette Cesar a l ail.'), description: text('Romaine tossed with Asiago, croutons, house bacon bits and garlic Caesar dressing. Vegetarian option available.', 'Romaine melangee avec asiago, croutons, bacon maison et vinaigrette Cesar a l ail. Option vegetarienne disponible.'), tags: ['Gluten-free'] }),
  dish({ id: 'greek-salad', name: text('Greek Salad', 'Salade grecque'), category: 'Salads', price: 11.95, summary: text('Romaine, mixed greens, feta, tomato, cucumber, onion and olives.', 'Romaine, verdures melangees, feta, tomate, concombre, oignon et olives.'), description: text('Romaine and mixed greens tossed with feta, tomato, cucumber, red onion, Kalamata olives and herb vinaigrette.', 'Romaine et verdures melangees avec feta, tomate, concombre, oignon rouge, olives Kalamata et vinaigrette aux herbes.'), tags: ['Vegetarian', 'Gluten-free'] }),
  dish({ id: 'field-mix-greens', name: text('Field Mix Greens', 'Mesclun du jardin'), category: 'Salads', price: 8.95, summary: text('Mixed greens, tomato, red onion, carrots and balsamic vinaigrette.', 'Verdures melangees, tomate, oignon rouge, carottes et vinaigrette balsamique.'), description: text('Mixed greens with tomatoes, red onion, julienned carrots and house balsamic vinaigrette.', 'Verdures melangees avec tomates, oignon rouge, carottes julienne et vinaigrette balsamique maison.'), tags: ['Vegan', 'Gluten-free', 'Quick'] }),
  dish({ id: 'utopia-good-life', name: text('Utopia Good Life', 'Utopia Good Life'), category: 'Salads', price: 10.95, summary: text('Baby kale, greens, walnuts, cranberries and cranberry-citrus dressing.', 'Jeune chou kale, verdures, noix, canneberges et vinaigrette aux canneberges et agrumes.'), description: text('Baby kale and mixed greens with walnuts, dried cranberries, cherry tomatoes, onion and cranberry-citrus dressing.', 'Jeune chou kale et verdures melangees avec noix, canneberges sechees, tomates cerises, oignon et vinaigrette canneberge-agrumes.'), tags: ['Vegan', 'Gluten-free', 'Nut-free'] }),
  dish({ id: 'mushroom-goat-cheese-salad', name: text('Mushroom and Goat Cheese Salad', 'Salade aux champignons et fromage de chevre'), category: 'Salads', price: 15.00, summary: text('Mushrooms, roasted peppers, greens, goat cheese and walnuts.', 'Champignons, poivrons rotis, verdures, fromage de chevre et noix.'), description: text('Sauteed white and portobello mushrooms with roasted peppers, greens, goat cheese, walnuts and soy-balsamic dressing.', 'Champignons blancs et portobello sautes avec poivrons rotis, verdures, fromage de chevre, noix et vinaigrette soja-balsamique.'), tags: ['Vegetarian', 'Nut-free'], customizations: { baseOptions: [{ id: 'dressing', title: text('Choice of Dressing', 'Choix de vinaigrette'), subtitle: requiredSubtitle, required: true, options: [{ id: 'soy-balsamic', label: text('Soy-balsamic', 'Soja-balsamique'), default: true }, { id: 'herb-vinaigrette', label: text('Herb vinaigrette', 'Vinaigrette aux herbes') }, { id: 'cranberry-citrus', label: text('Cranberry-citrus', 'Canneberge-agrumes') }, { id: 'lemon-tahini', label: text('Lemon tahini', 'Citron tahini') }] }], addOns: [{ id: 'salad-add-ons', title: text('Add Ons For Salad', 'Extras pour salade'), subtitle: customizationSubtitle(5), maxSelections: 5, addOns: [{ id: 'grilled-chicken', label: text('Grilled chicken', 'Poulet grille'), price: 0.95, badge: proteinRich }, { id: 'extra-goat-cheese', label: text('Extra goat cheese', 'Fromage de chevre extra'), price: 0.75, badge: bestseller, dietary: ['Vegetarian'] }, { id: 'candied-walnuts', label: text('Candied walnuts', 'Noix confites'), price: 0.6, dietary: ['Vegan', 'Vegetarian'] }, { id: 'avocado', label: text('Avocado', 'Avocat'), price: 0.75, dietary: ['Vegan', 'Vegetarian'] }, { id: 'crispy-chickpeas', label: text('Crispy chickpeas', 'Pois chiches croustillants'), price: 0.5, dietary: ['Vegan', 'Vegetarian'] }] }] } }),

  dish({ id: 'chicken-burrito', name: text('Chicken Burrito', 'Burrito au poulet'), category: 'Burritos', price: 12.95, summary: text('Southwestern chicken, grilled onions, salsa, green onion mayo and cheese.', 'Poulet style sud-ouest, oignons grilles, salsa, mayo a l oignon vert et fromage.'), description: text('Slow-cooked southwestern chicken with grilled onions, salsa, green onion mayo and cheddar Monterey Jack in a grilled flour tortilla.', 'Poulet sud-ouest mijote avec oignons grilles, salsa, mayo a l oignon vert et cheddar Monterey Jack dans une tortilla de farine grillee.'), tags: ['Popular', 'High protein'], pairing: { id: 'fresh-cut-fries', reason: text('Fries make it a complete, no-fuss order.', 'Les frites en font une commande complete et sans tracas.') }, customizations: { baseOptions: [{ id: 'tortilla', title: text('Choice of Tortilla', 'Choix de tortilla'), subtitle: requiredSubtitle, required: true, options: [{ id: 'flour-tortilla', label: text('Flour tortilla', 'Tortilla de farine'), default: true }, { id: 'whole-wheat-tortilla', label: text('Whole wheat tortilla', 'Tortilla ble entier') }, { id: 'spinach-tortilla', label: text('Spinach tortilla', 'Tortilla aux epinards') }] }, { id: 'rice', title: text('Choice of Rice', 'Choix de riz'), subtitle: requiredSubtitle, required: true, options: [{ id: 'cilantro-lime-rice', label: text('Cilantro lime rice', 'Riz coriandre-lime'), default: true }, { id: 'brown-rice', label: text('Brown rice', 'Riz brun') }, { id: 'no-rice', label: text('No rice', 'Sans riz') }] }], addOns: [{ id: 'burrito-add-ons', title: text('Add Ons For Burrito', 'Extras pour burrito'), subtitle: customizationSubtitle(5), maxSelections: 5, addOns: [{ id: 'guacamole', label: text('Guacamole', 'Guacamole'), price: 0.75, badge: bestseller, dietary: ['Vegan', 'Vegetarian'] }, { id: 'extra-chicken', label: text('Extra chicken', 'Poulet extra'), price: 0.95, badge: proteinRich }, { id: 'sour-cream', label: text('Sour cream', 'Creme sure'), price: 0.5, dietary: ['Vegetarian'] }, { id: 'jalapenos', label: text('Jalapenos', 'Jalapenos'), price: 0.4, dietary: ['Vegan', 'Vegetarian'] }, { id: 'black-beans', label: text('Black beans', 'Haricots noirs'), price: 0.5, dietary: ['Vegan', 'Vegetarian'] }] }] } }),
  dish({ id: 'fried-chicken-avocado-burrito', name: text('Fried Chicken and Avocado Burrito', 'Burrito au poulet frit et avocat'), category: 'Burritos', price: 13.95, summary: text('Karaage, avocado, grilled onions, salsa, karashi mayo and cheese.', 'Karaage, avocat, oignons grilles, salsa, mayo karashi et fromage.'), description: text('Japanese-style fried chicken karaage with avocado, grilled onions, salsa, spicy karashi mayo and cheddar Monterey Jack.', 'Poulet frit karaage a la japonaise avec avocat, oignons grilles, salsa, mayo karashi epicee et cheddar Monterey Jack.'), tags: ['Popular', 'High protein', 'Spicy'] }),
  dish({ id: 'curried-potato-burrito', name: text('Curried Potato, Butternut Squash and Chickpea Burrito', 'Burrito au curry de pommes de terre, courge et pois chiches'), category: 'Burritos', price: 12.95, summary: text('Potato, squash and chickpeas in coconut curry with tamarind chutney.', 'Pommes de terre, courge et pois chiches dans un cari de coco avec chutney au tamarin.'), description: text('Potatoes, butternut squash and chickpeas simmered in spicy coconut curry, baked in a flour tortilla with tamarind chutney.', 'Pommes de terre, courge musquee et pois chiches mijotes dans un cari de coco epice, cuits dans une tortilla de farine avec chutney au tamarin.'), tags: ['Vegan', 'Spicy', 'Comforting'] }),
  dish({ id: 'steak-mushroom-burrito', name: text('Steak and Mushroom Burrito', 'Burrito au steak et aux champignons'), category: 'Burritos', price: 15.95, summary: text('Sirloin, mushrooms, crispy onions, salsa, hot mayo and aged cheddar.', 'Surlonge, champignons, oignons croustillants, salsa, mayo piquante et cheddar vieilli.'), description: text('Sirloin with sauteed mushrooms, crispy onions, salsa, Utopia scotch bonnet mayo and aged cheddar.', 'Surlonge avec champignons sautes, oignons croustillants, salsa, mayo au piment fort Utopia et cheddar vieilli.'), tags: ['Spicy', 'High protein'] }),
  dish({ id: 'grilled-shrimp-burrito', name: text('Grilled Shrimp Burrito', 'Burrito aux crevettes grillees'), category: 'Burritos', price: 14.95, summary: text('Garam masala shrimp, salsa, onions, garlic dill mayo and cheese.', 'Crevettes au garam masala, salsa, oignons, mayo ail-aneth et fromage.'), description: text('Garam masala-marinated black tiger shrimp with salsa, grilled onions, garlic dill mayo and cheddar Monterey Jack.', 'Crevettes tigrees noires marinees au garam masala avec salsa, oignons grilles, mayo ail-aneth et cheddar Monterey Jack.'), tags: ['High protein'] }),
  dish({ id: 'smoked-lamb-brie-burrito', name: text('Smoked Lamb and Brie Burrito', 'Burrito a l agneau fume et au brie'), category: 'Burritos', price: 14.95, summary: text('Smoked lamb, brie, salsa, crispy onions and red pepper Dijon mayo.', 'Agneau fume, brie, salsa, oignons croustillants et mayo Dijon au poivron rouge.'), description: text('House-smoked lamb with double cream brie, salsa, crispy fried onions and red pepper Dijon mayo.', 'Agneau fume sur place avec brie double creme, salsa, oignons frits croustillants et mayo Dijon au poivron rouge.'), tags: ['High protein', 'Comforting'] }),

  dish({ id: 'house-burger', name: text('House Burger', 'Burger maison'), category: 'Burgers', price: 10.95, summary: text('Angus brisket and chuck patty with lettuce, condiments, pickles and onion.', 'Galette de poitrine et palette Angus avec laitue, condiments, cornichons et oignon.'), description: text('A 6 oz Angus brisket and chuck burger on an Ace Bakery bun with lettuce, ketchup, mustard, pickles, grilled onion and mayo.', 'Burger Angus de 6 oz en poitrine et palette sur pain Ace Bakery avec laitue, ketchup, moutarde, cornichons, oignon grille et mayo.'), tags: ['Popular', 'High protein'] }),
  dish({ id: 'utopia-burger', name: text('Utopia Burger', 'Burger Utopia'), category: 'Burgers', price: 14.95, summary: text('House burger with provolone, cheddar, peameal bacon, hot mayo and crispy onions.', 'Burger maison avec provolone, cheddar, bacon de longe, mayo piquante et oignons croustillants.'), description: text('House burger with smoked provolone, aged cheddar, house-cured peameal bacon, scotch bonnet mayo, pickled banana peppers and crispy onions.', 'Burger maison avec provolone fume, cheddar vieilli, bacon de longe maison, mayo au scotch bonnet, piments banane marines et oignons croustillants.'), tags: ['Popular', 'Spicy', 'High protein'], customizations: { baseOptions: [{ id: 'doneness', title: text('Choice of Doneness', 'Choix de cuisson'), subtitle: requiredSubtitle, required: true, options: [{ id: 'medium-rare', label: text('Medium rare', 'Saignant a point') }, { id: 'medium', label: text('Medium', 'A point'), default: true }, { id: 'medium-well', label: text('Medium well', 'Bien cuit a point') }, { id: 'well-done', label: text('Well done', 'Bien cuit') }] }, { id: 'bun', title: text('Choice of Bun', 'Choix de pain'), subtitle: requiredSubtitle, required: true, options: [{ id: 'ace-bakery-bun', label: text('Ace Bakery bun', 'Pain Ace Bakery'), default: true }, { id: 'brioche-bun', label: text('Brioche bun', 'Pain brioche') }, { id: 'lettuce-wrap', label: text('Lettuce wrap', 'Wrap de laitue') }] }], addOns: [{ id: 'burger-add-ons', title: text('Add Ons For Burger', 'Extras pour burger'), subtitle: customizationSubtitle(5), maxSelections: 5, addOns: [{ id: 'extra-cheese', label: text('Extra cheese', 'Fromage extra'), price: 0.75, badge: bestseller, dietary: ['Vegetarian'] }, { id: 'extra-bacon', label: text('Extra bacon', 'Bacon extra'), price: 0.95 }, { id: 'fried-egg', label: text('Fried egg', 'Oeuf frit'), price: 0.5, badge: proteinRich, dietary: ['Vegetarian'] }, { id: 'avocado', label: text('Avocado', 'Avocat'), price: 0.75, dietary: ['Vegan', 'Vegetarian'] }, { id: 'crispy-onions', label: text('Crispy onions', 'Oignons croustillants'), price: 0.5, dietary: ['Vegan', 'Vegetarian'] }] }] } }),
  dish({ id: 'bacon-cheddar-burger', name: text('Bacon Cheddar Burger', 'Burger cheddar bacon'), category: 'Burgers', price: 12.95, summary: text('House burger with aged cheddar and smoked bacon.', 'Burger maison avec cheddar vieilli et bacon fume.'), description: text('A house burger topped with aged cheddar and house-cured smoked bacon, served on an Ace Bakery bun.', 'Un burger maison garni de cheddar vieilli et de bacon fume maison, servi sur un pain Ace Bakery.'), tags: ['High protein', 'Comforting'] }),
  dish({ id: 'mactopia', name: text('Mactopia', 'Mactopia'), category: 'Burgers', price: 12.95, summary: text('House burger with lettuce, pickles, onion, provolone and Mactopia sauce.', 'Burger maison avec laitue, cornichons, oignon, provolone et sauce Mactopia.'), description: text('House burger topped with lettuce, pickles, grilled onion, provolone and Mactopia sauce.', 'Burger maison garni de laitue, cornichons, oignon grille, provolone et sauce Mactopia.'), tags: ['Comforting'] }),
  dish({ id: 'veggie-burger', name: text('Veggie Burger', 'Burger vegetarien'), category: 'Burgers', price: 10.95, summary: text('Beyond Meat burger with lettuce, condiments, pickles and onion.', 'Burger Beyond Meat avec laitue, condiments, cornichons et oignon.'), description: text('A Beyond Meat burger on an Ace Bakery bun with lettuce, ketchup, mustard, pickles and grilled onion.', 'Un burger Beyond Meat sur pain Ace Bakery avec laitue, ketchup, moutarde, cornichons et oignon grille.'), tags: ['Vegan', 'Vegetarian', 'Comforting'] }),

  dish({ id: 'chicken-pesto-panini', name: text('Chicken and Pesto Panini', 'Panini au poulet et au pesto'), category: 'Sandwiches', price: 12.95, summary: text('Grilled chicken, pesto, salsa and Asiago on herbed focaccia.', 'Poulet grille, pesto, salsa et asiago sur focaccia aux herbes.'), description: text('Sliced grilled chicken with pesto, salsa and Asiago cheese on an Ace Bakery herbed focaccia panini.', 'Poulet grille tranche avec pesto, salsa et fromage asiago sur focaccia aux herbes Ace Bakery.'), tags: ['High protein'] }),
  dish({ id: 'steak-sandwich', name: text('Steak Sandwich', 'Sandwich au steak'), category: 'Sandwiches', price: 15.95, summary: text('Sirloin, crispy onions, provolone, hot mayo and jalapenos.', 'Surlonge, oignons croustillants, provolone, mayo piquante et jalapenos.'), description: text('Grilled sirloin with crispy onions, smoked provolone, Utopia scotch bonnet mayo and fried jalapenos on focaccia.', 'Surlonge grillee avec oignons croustillants, provolone fume, mayo au scotch bonnet Utopia et jalapenos frits sur focaccia.'), tags: ['Spicy', 'High protein'] }),
  dish({ id: 'seared-tuna-avocado-sandwich', name: text('Seared Tuna and Avocado Sandwich', 'Sandwich au thon saisi et avocat'), category: 'Sandwiches', price: 13.95, summary: text('Yellowfin tuna, avocado, lettuce, tomato, onion and karashi mayo.', 'Thon albacore, avocat, laitue, tomate, oignon et mayo karashi.'), description: text('Seared yellowfin tuna with avocado, lettuce, tomato, onion and spicy karashi mustard mayo on toasted marble rye.', 'Thon albacore saisi avec avocat, laitue, tomate, oignon et mayo moutarde karashi epicee sur pain de seigle marbre grille.'), tags: ['High protein'] }),
  dish({ id: 'classic-grilled-cheese', name: text('Classic Grilled Cheese', 'Grilled cheese classique'), category: 'Sandwiches', price: 11.95, summary: text('Cheddar, Monterey Jack and Swiss on toast.', 'Cheddar, Monterey Jack et suisse sur pain grille.'), description: text('A classic grilled cheese with cheddar, Monterey Jack and Swiss on your choice of bread.', 'Un grilled cheese classique avec cheddar, Monterey Jack et suisse sur le pain de votre choix.'), tags: ['Vegetarian', 'Kids', 'Comforting'] }),
  dish({ id: 'mushroom-pesto-goat-cheese-panini', name: text('Mushroom, Pesto and Goat Cheese Panini', 'Panini aux champignons, pesto et fromage de chevre'), category: 'Sandwiches', price: 11.95, summary: text('Mushrooms, goat cheese, pesto and caramelized onions.', 'Champignons, fromage de chevre, pesto et oignons caramelises.'), description: text('White and portobello mushrooms with goat cheese, pesto and caramelized onions on herbed focaccia.', 'Champignons blancs et portobello avec fromage de chevre, pesto et oignons caramelises sur focaccia aux herbes.'), tags: ['Vegetarian'] }),
  dish({ id: 'utopia-fried-chicken-sandwich', name: text('Utopia-style Fried Chicken', 'Poulet frit style Utopia'), category: 'Sandwiches', price: 12.95, summary: text('Crispy fried chicken, coleslaw and sriracha mayo.', 'Poulet frit croustillant, salade de chou et mayo sriracha.'), description: text('Extra-crispy fried chicken with fresh coleslaw and sriracha mayo on an Ace Bakery burger bun.', 'Poulet frit extra croustillant avec salade de chou fraiche et mayo sriracha sur pain burger Ace Bakery.'), tags: ['Spicy', 'High protein'] }),
  dish({ id: 'avocado-provolone-sweet-potato-panini', name: text('Avocado, Smoked Provolone and Sweet Potato Panini', 'Panini a l avocat, provolone fume et patate douce'), category: 'Sandwiches', price: 12.95, summary: text('Sweet potato, provolone, avocado, tomato, onion and Dijon mayo.', 'Patate douce, provolone, avocat, tomate, oignon et mayo Dijon.'), description: text('Grilled sweet potato with smoked provolone, avocado, tomato, onion and red pepper Dijon mayo on herbed focaccia.', 'Patate douce grillee avec provolone fume, avocat, tomate, oignon et mayo Dijon au poivron rouge sur focaccia aux herbes.'), tags: ['Vegetarian'] }),
  dish({ id: 'fishwich', name: text('Fishwich', 'Fishwich'), category: 'Sandwiches', price: 14.95, summary: text('Cod, cheddar, lettuce, pickles, onion and garlic dill mayo.', 'Morue, cheddar, laitue, cornichons, oignon et mayo ail-aneth.'), description: text('Pan-seared cod with cheddar, lettuce, pickles, raw onion and garlic dill mayo on an Ace Bakery bun.', 'Morue poelee avec cheddar, laitue, cornichons, oignon cru et mayo ail-aneth sur pain Ace Bakery.'), tags: ['High protein'] }),
  dish({ id: 'vegetarian-souvlaki', name: text('Vegetarian Souvlaki', 'Souvlaki vegetarien'), category: 'Sandwiches', price: 12.95, summary: text('Soy protein, tzatziki, barbecue sauce, tomato and onions on pita.', 'Proteine de soya, tzatziki, sauce barbecue, tomate et oignons sur pita.'), description: text('House-marinated soy protein grilled and served on Greek-style pita with tzatziki, barbecue sauce, tomato and onions.', 'Proteine de soya marinee maison, grillee et servie sur pita de style grec avec tzatziki, sauce barbecue, tomate et oignons.'), tags: ['Vegetarian', 'Popular'] }),
  dish({ id: 'utopia-chicken-club', name: text('Utopia Chicken Club', 'Club poulet Utopia'), category: 'Sandwiches', price: 12.95, summary: text('Grilled or fried chicken, cheese, bacon, guacamole, tomato and lettuce.', 'Poulet grille ou frit, fromage, bacon, guacamole, tomate et laitue.'), description: text('Chicken breast or fried karaage with aged cheddar, Swiss, house-cured bacon, guacamole, tomato and lettuce on toasted sourdough.', 'Poitrine de poulet ou karaage frit avec cheddar vieilli, suisse, bacon maison, guacamole, tomate et laitue sur pain au levain grille.'), tags: ['Popular', 'High protein'] }),

  dish({ id: 'breakfast-burrito', name: text('Breakfast Burrito', 'Burrito dejeuner'), category: 'Brunch', price: 18.95, summary: text('Eggs or tofu scramble, cheese, peppers, onion and jalapenos.', 'Oeufs ou tofu brouille, fromage, poivrons, oignon et jalapenos.'), description: text('Scrambled eggs or tofu scramble with cheddar, Monterey Jack, peppers, onion and jalapenos in a grilled tortilla with home fries and salad.', 'Oeufs brouilles ou tofu brouille avec cheddar, Monterey Jack, poivrons, oignon et jalapenos dans une tortilla grillee, servis avec frites maison et salade.'), tags: ['Vegetarian', 'Spicy', 'Comforting'], customizations: { baseOptions: [{ id: 'protein-base', title: text('Choice of Eggs or Tofu', 'Choix oeufs ou tofu'), subtitle: requiredSubtitle, required: true, options: [{ id: 'scrambled-eggs', label: text('Scrambled eggs', 'Oeufs brouilles'), default: true }, { id: 'tofu-scramble', label: text('Tofu scramble', 'Tofu brouille') }] }, { id: 'tortilla', title: text('Choice of Tortilla', 'Choix de tortilla'), subtitle: requiredSubtitle, required: true, options: [{ id: 'flour-tortilla', label: text('Flour tortilla', 'Tortilla de farine'), default: true }, { id: 'whole-wheat-tortilla', label: text('Whole wheat tortilla', 'Tortilla ble entier') }, { id: 'spinach-tortilla', label: text('Spinach tortilla', 'Tortilla aux epinards') }] }], addOns: [{ id: 'breakfast-burrito-add-ons', title: text('Add Ons For Breakfast Burrito', 'Extras pour burrito dejeuner'), subtitle: customizationSubtitle(5), maxSelections: 5, addOns: [{ id: 'extra-cheese', label: text('Extra cheese', 'Fromage extra'), price: 0.75, badge: bestseller, dietary: ['Vegetarian'] }, { id: 'avocado', label: text('Avocado', 'Avocat'), price: 0.75, dietary: ['Vegan', 'Vegetarian'] }, { id: 'tempeh-bacon', label: text('Tempeh bacon', 'Bacon de tempeh'), price: 0.75, dietary: ['Vegan', 'Vegetarian'] }, { id: 'hash-browns', label: text('Hash browns', 'Pommes de terre rapees'), price: 0.6, dietary: ['Vegetarian'] }, { id: 'extra-jalapenos', label: text('Extra jalapenos', 'Jalapenos extra'), price: 0.4, dietary: ['Vegan', 'Vegetarian'] }] }] } }),
  dish({ id: 'weekday-special-egg', name: text('Weekday Special - Egg', 'Special de semaine - oeufs'), category: 'Brunch', price: 16.95, summary: text('Three eggs with breakfast meat or tempeh, home fries and toast.', 'Trois oeufs avec viande dejeuner ou tempeh, frites maison et roties.'), description: text('Three eggs any style with sausage, peameal, bacon or tempeh, served with home fries and toast.', 'Trois oeufs au choix avec saucisse, bacon de longe, bacon ou tempeh, servis avec frites maison et roties.'), tags: ['Vegetarian', 'High protein'] }),
  dish({ id: 'weekday-special-tofu', name: text('Weekday Special - Tofu', 'Special de semaine - tofu'), category: 'Brunch', price: 16.95, summary: text('Tofu scramble with breakfast meat or tempeh, home fries and toast.', 'Tofu brouille avec viande dejeuner ou tempeh, frites maison et roties.'), description: text('Scrambled tofu with sausage, peameal, bacon or tempeh, served with home fries and toast.', 'Tofu brouille avec saucisse, bacon de longe, bacon ou tempeh, servi avec frites maison et roties.'), tags: ['Vegan', 'Vegetarian'] }),
  dish({ id: 'classic-eggs-benedict', name: text('Classic Eggs Benedict', 'Oeufs benedict classique'), category: 'Brunch', price: 18.95, summary: text('Peameal bacon, cornmeal tomato, hollandaise, home fries and salad.', 'Bacon de longe, tomate au mais, hollandaise, frites maison et salade.'), description: text('Classic Benedict with peameal bacon, fried cornmeal tomato and house hollandaise on an English muffin.', 'Benedict classique avec bacon de longe, tomate enrobee de semoule de mais frite et hollandaise maison sur muffin anglais.'), tags: ['High protein', 'Comforting'] }),
  dish({ id: 'gotta-frittata', name: text('Gotta Frittata', 'Gotta Frittata'), category: 'Brunch', price: 16.95, summary: text('Home-baked frittata with home fries and green salad.', 'Frittata cuite maison avec frites maison et salade verte.'), description: text('A slice of home-baked frittata served with home fries and green salad.', 'Une part de frittata cuite maison servie avec frites maison et salade verte.'), tags: ['Vegetarian', 'Comforting'] }),
  dish({ id: 'eggs-florentine', name: text('Eggs Florentine', 'Oeufs florentine'), category: 'Brunch', price: 18.95, summary: text('Poached eggs, spinach, pesto, roasted pepper and hollandaise.', 'Oeufs poches, epinards, pesto, poivron roti et hollandaise.'), description: text('Two poached eggs with spinach, pesto, roasted red pepper and hollandaise on an English muffin.', 'Deux oeufs poches avec epinards, pesto, poivron rouge roti et hollandaise sur muffin anglais.'), tags: ['Vegetarian', 'Gluten-free'] }),
  dish({ id: 'french-toast', name: text('French Toast', 'Pain dore'), category: 'Brunch', price: 16.95, summary: text('Challah French toast with apple, walnuts and bacon or tempeh.', 'Pain dore brioche avec pomme, noix et bacon ou tempeh.'), description: text('Three thick slices of challah French toast with caramelized apple, toasted walnuts and a side of bacon or tempeh.', 'Trois tranches epaisses de pain dore challah avec pomme caramelisee, noix grillees et un accompagnement de bacon ou tempeh.'), tags: ['Vegetarian', 'Nut-free', 'Comforting'] }),
  dish({ id: 'eggs-natasha', name: text('Eggs Natasha', 'Oeufs Natasha'), category: 'Brunch', price: 19.95, summary: text('Poached eggs, smoked salmon, capers, hollandaise and salsa.', 'Oeufs poches, saumon fume, capres, hollandaise et salsa.'), description: text('Poached eggs with smoked salmon, fried capers and hollandaise on an English muffin with salsa and home fries.', 'Oeufs poches avec saumon fume, capres frites et hollandaise sur muffin anglais, servis avec salsa et frites maison.'), tags: ['High protein'] }),
  dish({ id: 'shakshouka', name: text('Shakshouka', 'Shakshouka'), category: 'Brunch', price: 17.95, summary: text('Eggs poached in spicy tomato sauce over home fries with feta.', 'Oeufs poches dans une sauce tomate epicee sur frites maison avec feta.'), description: text('Two eggs poached in thick spicy tomato sauce over seasoned home fries, topped with feta and served with toast.', 'Deux oeufs poches dans une sauce tomate epicee et onctueuse sur frites maison assaisonnees, garnis de feta et servis avec roties.'), tags: ['Vegetarian', 'Spicy', 'Comforting'] }),
  dish({ id: 'steak-and-eggs', name: text('Steak and Eggs', 'Steak et oeufs'), category: 'Brunch', price: 21.95, summary: text('Eggs, skirt steak or portobello, chimichurri, fries and salad.', 'Oeufs, bavette ou portobello, chimichurri, frites et salade.'), description: text('Two eggs any style with skirt steak or grilled portobello, chimichurri, crispy fried onions, fries and salad.', 'Deux oeufs au choix avec bavette ou portobello grille, chimichurri, oignons frits croustillants, frites et salade.'), tags: ['High protein', 'Gluten-free'] }),
  dish({ id: 'vegan-pancakes', name: text('Vegan Pancakes', 'Crepes vegan'), category: 'Brunch', price: 16.95, summary: text('Pancakes with tempeh bacon, blueberry compote and maple syrup.', 'Crepes avec bacon de tempeh, compote de bleuets et sirop d erable.'), description: text('Four made-to-order pancakes with tempeh bacon, blueberry compote, icing sugar and maple syrup.', 'Quatre crepes preparees a la commande avec bacon de tempeh, compote de bleuets, sucre glace et sirop d erable.'), tags: ['Vegan', 'Vegetarian', 'Comforting'] }),
  dish({ id: 'chicken-and-waffles', name: text('Chicken and Waffles', 'Poulet et gaufres'), category: 'Brunch', price: 16.95, summary: text('Cornflake chicken, cornmeal waffle, sriracha honey and maple syrup.', 'Poulet pane aux corn flakes, gaufre de mais, miel sriracha et sirop d erable.'), description: text('Cornflake-crusted chicken thigh with a cornmeal waffle, sriracha honey, green onions, salad and maple syrup.', 'Haut de cuisse de poulet pane aux corn flakes avec gaufre de mais, miel sriracha, oignons verts, salade et sirop d erable.'), tags: ['Spicy', 'High protein', 'Comforting'] }),
  dish({ id: 'huevos-rancheros', name: text('Huevos Rancheros', 'Huevos rancheros'), category: 'Brunch', price: 17.95, summary: text('Eggs or tofu, corn tortilla bowls, black bean corn salsa and guacamole.', 'Oeufs ou tofu, bols de tortilla de mais, salsa de haricots noirs et mais, et guacamole.'), description: text('Scrambled eggs or tofu scramble in corn tortilla bowls with roasted black bean corn salsa, cheese, lettuce, sriracha mayo, guacamole, home fries and salad.', 'Oeufs brouilles ou tofu brouille dans des bols de tortilla de mais avec salsa rotie de haricots noirs et mais, fromage, laitue, mayo sriracha, guacamole, frites maison et salade.'), tags: ['Vegetarian', 'Spicy', 'Gluten-free'] }),

  dish({ id: 'plain-mayo', name: text('Plain Mayo', 'Mayo nature'), category: 'Sides', price: 1.00, summary: text('Simple mayonnaise.', 'Mayonnaise simple.'), description: text('A side of plain mayo.', 'Portion de mayo nature.'), tags: ['Quick'] }),
  dish({ id: 'sour-cream', name: text('Sour Cream', 'Creme sure'), category: 'Sides', price: 2.00, summary: text('Tangy sour cream.', 'Creme sure acidulee.'), description: text('A side of sour cream.', 'Portion de creme sure.'), tags: ['Vegetarian', 'Quick'] }),
  dish({ id: 'house-made-guacamole', name: text('House-Made Guacamole', 'Guacamole maison'), category: 'Sides', price: 3.00, summary: text('Fresh avocado dip.', 'Trempette fraiche a l avocat.'), description: text('House-made guacamole for adding to wraps, tacos and starters.', 'Guacamole maison a ajouter aux wraps, tacos et entrees.'), tags: ['Vegan', 'Gluten-free', 'Quick'] }),
  dish({ id: 'house-made-tamarind-chutney', name: text('House-Made Tamarind Chutney', 'Chutney maison au tamarin'), category: 'Sides', price: 2.00, summary: text('Sweet-tangy tamarind chutney.', 'Chutney au tamarin sucre et acidule.'), description: text('A side of house tamarind chutney.', 'Portion de chutney au tamarin maison.'), tags: ['Vegan', 'Quick'] }),
  dish({ id: 'veggie-gravy', name: text('Veggie Gravy', 'Sauce vegetarienne'), category: 'Sides', price: 5.00, summary: text('Savory vegetarian gravy.', 'Sauce vegetarienne savoureuse.'), description: text('Vegetarian gravy for fries and poutine-style sides.', 'Sauce vegetarienne pour frites et accompagnements style poutine.'), tags: ['Vegetarian', 'Comforting'] }),
  dish({ id: 'mayo', name: text('Mayo', 'Mayo'), category: 'Sides', price: 2.00, summary: text('Creamy mayo.', 'Mayo onctueuse.'), description: text('A side of mayo.', 'Portion de mayo.'), tags: ['Quick'] }),
  dish({ id: 'hot-sauce', name: text('Hot Sauce', 'Sauce piquante'), category: 'Sides', price: 3.00, summary: text('Utopia scotch bonnet hot sauce.', 'Sauce piquante Utopia au scotch bonnet.'), description: text('A side of Utopia orange scotch bonnet hot sauce.', 'Portion de sauce piquante orange Utopia au scotch bonnet.'), tags: ['Vegan', 'Gluten-free', 'Spicy', 'Quick'] }),
  dish({ id: 'tempeh-bacon', name: text('Tempeh Bacon', 'Bacon de tempeh'), category: 'Sides', price: 3.00, summary: text('Crispy smoky tempeh strips.', 'Lanieres de tempeh fumees et croustillantes.'), description: text('Crispy tempeh strips with a smoky bacon-like flavour.', 'Lanieres de tempeh croustillantes au gout fume de bacon.'), tags: ['Vegan', 'Vegetarian'] }),
  dish({ id: 'veggie-chicken-side', name: text('Veggie Chicken', 'Poulet vegetal'), category: 'Sides', price: 7.00, summary: text('Crispy fried veggie chicken.', 'Poulet vegetal frit et croustillant.'), description: text('A side portion of crispy fried veggie chicken.', 'Portion d accompagnement de poulet vegetal frit et croustillant.'), tags: ['Vegetarian'] }),
  dish({ id: 'house-cured-smoked-bacon', name: text('House Cured and Smoked Bacon', 'Bacon maison sale et fume'), category: 'Sides', price: 3.00, summary: text('Smoked bacon add-on.', 'Extra bacon fume.'), description: text('A side of house-cured smoked bacon.', 'Portion de bacon sale et fume maison.'), tags: ['High protein', 'Quick'] }),
  dish({ id: 'avocado', name: text('Avocado', 'Avocat'), category: 'Sides', price: 2.00, summary: text('Fresh avocado.', 'Avocat frais.'), description: text('Fresh avocado add-on.', 'Extra avocat frais.'), tags: ['Vegan', 'Gluten-free', 'Quick'] }),
  dish({ id: 'chicken-side', name: text('Chicken', 'Poulet'), category: 'Sides', price: 7.00, summary: text('Chicken add-on.', 'Extra poulet.'), description: text('A side portion of chicken.', 'Portion d accompagnement de poulet.'), tags: ['High protein'] }),

  dish({ id: 'coke', name: text('Coke', 'Coke'), category: 'Drinks', price: 3.00, summary: text('355 ml can of Coca-Cola.', 'Canette de Coca-Cola de 355 ml.'), description: text('A 355 ml can of Coke.', 'Une canette de Coke de 355 ml.'), tags: ['Quick'] }),
  dish({ id: 'diet-coke', name: text('Diet Coke', 'Coke dietetique'), category: 'Drinks', price: 3.00, summary: text('355 ml can of Diet Coke.', 'Canette de Coke dietetique de 355 ml.'), description: text('A 355 ml can of Diet Coke.', 'Une canette de Coke dietetique de 355 ml.'), tags: ['Quick'] }),
  dish({ id: 'canada-dry-ginger-ale', name: text('Canada Dry Ginger Ale', 'Canada Dry gingembre'), category: 'Drinks', price: 3.00, summary: text('355 ml can of ginger ale.', 'Canette de 355 ml de boisson gazeuse au gingembre.'), description: text('A 355 ml can of Canada Dry Ginger Ale.', 'Une canette de Canada Dry gingembre de 355 ml.'), tags: ['Quick'] }),
  dish({ id: 'apple-juice', name: text('Apple Juice', 'Jus de pomme'), category: 'Drinks', price: 4.00, summary: text('355 ml bottle of apple juice.', 'Bouteille de 355 ml de jus de pomme.'), description: text('A 355 ml bottle of apple juice.', 'Une bouteille de 355 ml de jus de pomme.'), tags: ['Quick'] }),
  dish({ id: 'small-eska-flat-water', name: text('Small Eska Flat Water', 'Petite eau plate Eska'), category: 'Drinks', price: 3.00, summary: text('355 ml bottle of flat water.', 'Bouteille de 355 ml d eau plate.'), description: text('A small bottle of Eska flat water.', 'Une petite bouteille d eau plate Eska.'), tags: ['Vegan', 'Gluten-free', 'Quick'] }),
  dish({ id: 'large-eska-flat-water', name: text('Large Eska Flat Water', 'Grande eau plate Eska'), category: 'Drinks', price: 8.00, summary: text('750 ml bottle of flat water.', 'Bouteille de 750 ml d eau plate.'), description: text('A large bottle of Eska flat water.', 'Une grande bouteille d eau plate Eska.'), tags: ['Vegan', 'Gluten-free', 'Quick'] }),
  dish({ id: 'small-eska-sparkling-water', name: text('Small Eska Sparkling Water', 'Petite eau petillante Eska'), category: 'Drinks', price: 4.00, summary: text('330 ml bottle of sparkling water.', 'Bouteille de 330 ml d eau petillante.'), description: text('A small bottle of sparkling water.', 'Une petite bouteille d eau petillante.'), tags: ['Vegan', 'Gluten-free', 'Quick'] }),
  dish({ id: 'large-pellegrino', name: text('Large S. Pellegrino Sparkling Water', 'Grande eau petillante S. Pellegrino'), category: 'Drinks', price: 8.00, summary: text('750 ml bottle of sparkling water.', 'Bouteille de 750 ml d eau petillante.'), description: text('A 750 ml bottle of S. Pellegrino sparkling water.', 'Une bouteille de 750 ml d eau petillante S. Pellegrino.'), tags: ['Vegan', 'Gluten-free', 'Quick'] }),
  dish({ id: 'fever-tree-ginger-beer', name: text('Fever Tree Ginger Beer', 'Ginger beer Fever Tree'), category: 'Drinks', price: 4.25, summary: text('Non-alcoholic ginger beer.', 'Boisson gingembre sans alcool.'), description: text('A bottled Fever Tree ginger beer.', 'Une bouteille de ginger beer Fever Tree.'), tags: ['Quick'] }),
  dish({ id: 'americano', name: text('Americano', 'Americano'), category: 'Drinks', price: 3.00, summary: text('Hot Americano coffee.', 'Cafe Americano chaud.'), description: text('A hot Americano.', 'Un Americano chaud.'), tags: ['Vegan', 'Quick'] }),
  dish({ id: 'latte', name: text('Latte', 'Latte'), category: 'Drinks', price: 3.75, summary: text('Hot latte.', 'Latte chaud.'), description: text('A hot latte.', 'Un latte chaud.'), tags: ['Vegetarian', 'Quick'] }),
  dish({ id: 'espresso', name: text('Espresso', 'Espresso'), category: 'Drinks', price: 2.50, summary: text('Single espresso.', 'Espresso simple.'), description: text('A single espresso.', 'Un espresso simple.'), tags: ['Vegan', 'Quick'] }),
  dish({ id: 'double-espresso', name: text('Double Espresso', 'Double espresso'), category: 'Drinks', price: 3.00, summary: text('Double espresso.', 'Double espresso.'), description: text('A double espresso.', 'Un double espresso.'), tags: ['Vegan', 'Quick'] }),
  dish({ id: 'cappuccino', name: text('Cappuccino', 'Cappuccino'), category: 'Drinks', price: 3.25, summary: text('Hot cappuccino.', 'Cappuccino chaud.'), description: text('A hot cappuccino.', 'Un cappuccino chaud.'), tags: ['Vegetarian', 'Quick'] }),
  dish({ id: 'hot-chocolate', name: text('Hot Chocolate', 'Chocolat chaud'), category: 'Drinks', price: 3.75, summary: text('Hot chocolate.', 'Chocolat chaud.'), description: text('A hot chocolate.', 'Un chocolat chaud.'), tags: ['Vegetarian', 'Kids', 'Quick'] }),
  dish({ id: 'tea', name: text('Tea', 'The'), category: 'Drinks', price: 2.25, summary: text('Hot tea.', 'The chaud.'), description: text('A cup of hot tea.', 'Une tasse de the chaud.'), tags: ['Vegan', 'Quick'] }),
  dish({ id: 'drip-coffee', name: text('Drip Coffee', 'Cafe filtre'), category: 'Drinks', price: 2.25, summary: text('Fresh drip coffee.', 'Cafe filtre frais.'), description: text('A cup of drip coffee.', 'Une tasse de cafe filtre.'), tags: ['Vegan', 'Quick'] }),
]

export const filterTags: Tag[] = ['Vegan', 'Vegetarian', 'Gluten-free', 'Spicy', 'Quick', 'Popular', 'High protein', 'Kids']

export const localize = (value: LocalizedText, locale: Locale) => value[locale]

export type ReviewSummary = {
  tags: LocalizedText[]
  points: LocalizedText[]
}

const hashId = (id: string) => [...id].reduce((sum, char) => sum + char.charCodeAt(0), 0)

const pickUnique = <T>(items: T[], count: number, seed: number) => {
  const chosen: T[] = []
  for (let offset = 0; offset < items.length && chosen.length < count; offset += 1) {
    const item = items[(seed + offset * 3) % items.length]
    if (!chosen.includes(item)) chosen.push(item)
  }
  return chosen
}

const categoryReviewTags: Record<Category, LocalizedText[]> = {
  Appetizers: [text('Great starter', 'Bonne entree'), text('Shareable', 'A partager'), text('Flavourful', 'Savoureux')],
  Starters: [text('Shareable', 'A partager'), text('Crispy', 'Croustillant'), text('Comfort food', 'Reconfortant')],
  Salads: [text('Fresh', 'Frais'), text('Light', 'Leger'), text('Well dressed', 'Bien assaisonnee')],
  Burritos: [text('Filling', 'Rassasiant'), text('Well packed', 'Bien garni'), text('Flavourful', 'Savoureux')],
  Burgers: [text('Juicy', 'Juteux'), text('Generous', 'Genereux'), text('Satisfying', 'Satisfaisant')],
  Sandwiches: [text('Hearty', 'Copieux'), text('Well toasted', 'Bien grille'), text('Flavourful', 'Savoureux')],
  Brunch: [text('Brunch favourite', 'Favori du brunch'), text('Generous plate', 'Assiette genereuse'), text('Worth the wait', 'Vaut l attente')],
  Sides: [text('Good add-on', 'Bon extra'), text('Fresh', 'Frais'), text('Easy to share', 'Facile a partager')],
  Drinks: [text('Refreshing', 'Rafraichissant'), text('Good pairing', 'Bon accord'), text('Served cold', 'Servi froid')],
}

const tagReviewTags: Partial<Record<Tag, LocalizedText>> = {
  Popular: text('Crowd favourite', 'Favori des clients'),
  Spicy: text('Nice heat', 'Bien epice'),
  Vegan: text('Great vegan option', 'Bonne option vegan'),
  Vegetarian: text('Veggie friendly', 'Bon choix vegetarien'),
  Quick: text('Comes out fast', 'Arrive vite'),
  'High protein': text('Filling', 'Rassasiant'),
  Shareable: text('Easy to share', 'Facile a partager'),
  Comforting: text('Comfort food', 'Reconfortant'),
  Kids: text('Kid friendly', 'Pour enfants'),
  'Gluten-free': text('GF option', 'Option sans gluten'),
}

export const reviewSummaryFor = (dish: Dish): ReviewSummary => {
  const seed = hashId(dish.id)
  const tags = [
    ...categoryReviewTags[dish.category],
    ...dish.tags.map((tag) => tagReviewTags[tag]).filter((tag): tag is LocalizedText => Boolean(tag)),
  ]
  if (dish.price <= 8) tags.push(text('Great value', 'Excellent rapport qualite-prix'))
  if (dish.price >= 16) tags.push(text('Generous portion', 'Portion genereuse'))

  const uniqueTags = tags.filter((tag, index) => tags.findIndex((item) => item.EN === tag.EN) === index)
  const name = dish.name
  const points = [
    text(`Guests keep coming back for the ${name.EN.toLowerCase()}.`, `Les clients reviennent pour le ${name.FR.toLowerCase()}.`),
    text('Portions are generous and feel like good value for College Street.', 'Les portions sont genereuses et le rapport qualite-prix est bon sur College Street.'),
    text('Flavours are well balanced, with sauces that stand out.', 'Les saveurs sont bien equilibrees, avec des sauces qui se distinguent.'),
    text('Often mentioned as a reliable order when sharing the table.', 'Souvent mentionne comme un choix fiable pour partager a table.'),
    text('Described as fresh, carefully assembled, and consistently good.', 'Decrit comme frais, bien assemble et toujours bon.'),
  ]

  if (dish.tags.includes('Spicy')) {
    points.splice(2, 0, text('The heat is noticeable without overpowering the rest of the dish.', 'Le piquant se sent sans masquer le reste du plat.'))
  }
  if (dish.tags.includes('Popular')) {
    points.splice(1, 0, text('One of the most mentioned dishes in recent reviews.', 'Un des plats les plus mentionnes dans les avis recents.'))
  }
  if (dish.category === 'Drinks') {
    const hot = /coffee|latte|espresso|cappuccino|tea|chocolate|americano|drip/.test(dish.id)
    const drinkTags = uniqueTags.map((tag) => (
      tag.EN === 'Served cold' && hot ? text('Served hot', 'Servi chaud') : tag
    ))
    return {
      tags: pickUnique(drinkTags, 3, seed),
      points: pickUnique([
        text('A simple, reliable pairing with most plates.', 'Un accord simple et fiable avec la plupart des plats.'),
        text('Served promptly and at a good temperature.', 'Servi rapidement et a bonne temperature.'),
        text('Easy add-on that guests often mention alongside food.', 'Un extra facile que les clients mentionnent souvent avec le repas.'),
      ], 3, seed),
    }
  }
  if (dish.category === 'Sides') {
    return {
      tags: pickUnique(uniqueTags, 3, seed),
      points: pickUnique([
        text(`A popular extra with ${name.EN.toLowerCase()} appearing often in orders.`, `Un extra populaire, souvent commande avec ${name.FR.toLowerCase()}.`),
        text('Small add-on that guests say rounds out the meal.', 'Un petit extra que les clients disent completer le repas.'),
        text('Fresh, simple, and worth adding if you already like the plate.', 'Frais, simple, et vaut le coup si le plat vous plait deja.'),
      ], 3, seed),
    }
  }

  return {
    tags: pickUnique(uniqueTags, Math.min(5, uniqueTags.length), seed),
    points: pickUnique(points, 3 + (seed % 3), seed),
  }
}

export type MostLovedDish = {
  id: string
  quote: LocalizedText
}

export const mostLovedDishes: MostLovedDish[] = [
  { id: 'poutine', quote: text('... loved the red sauce and the parmesan cheese', '... adore la sauce rouge et le fromage parmesan') },
  { id: 'utopia-burger', quote: text('... the bacon was perfectly crispy and the spice level was just right', '... le bacon etait parfaitement croustillant et le piquant juste comme il faut') },
  { id: 'chicken-burrito', quote: text('... comes packed with flavor and the portions are generous', '... tellement savoureux et les portions sont genereuses') },
  { id: 'breakfast-burrito', quote: text('... best brunch item I have tried here, everything melts together', '... meilleur plat brunch que j ai essaye ici, tout se marie parfaitement') },
  { id: 'fish-tacos', quote: text('... the fish is always fresh and the jalapeño mayo adds a nice kick', '... le poisson est toujours frais et la mayo jalapeño ajoute un super kick') },
  { id: 'mushroom-goat-cheese-salad', quote: text('... the goat cheese and walnuts make this salad feel special', '... le fromage de chevre et les noix rendent cette salade vraiment speciale') },
]
