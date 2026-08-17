export type Tag = 'Vegan' | 'Vegetarian' | 'Gluten-free' | 'Nut-free' | 'Spicy' | 'Quick' | 'Popular' | 'High protein' | 'Shareable' | 'Kids' | 'Comforting'

export type Category = 'Appetizers' | 'Starters' | 'Salads' | 'Burritos' | 'Burgers' | 'Sandwiches' | 'Brunch' | 'Sides' | 'Drinks'

export type Dish = {
  id: string
  name: string
  category: Category
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
  ['Appetizers', 'Small starts'],
  ['Starters', 'Shareable plates'],
  ['Salads', 'Greens and bowls'],
  ['Burritos', 'Grilled wraps'],
  ['Burgers', 'Ace Bakery buns'],
  ['Sandwiches', 'Paninis and classics'],
  ['Brunch', 'Late morning plates'],
  ['Sides', 'Add-ons and extras'],
  ['Drinks', 'Cans, bottles, coffee'],
] as const

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

type DishInput = Omit<Dish, 'calories' | 'protein' | 'carbs' | 'fat' | 'prep' | 'available' | 'colour'> & Partial<Pick<Dish, 'calories' | 'protein' | 'carbs' | 'fat' | 'prep' | 'available' | 'colour'>>

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
  }
}

export const dishes: Dish[] = [
  dish({ id: 'chicken-karaage', name: 'Chicken Karaage', category: 'Appetizers', price: 7.95, summary: 'Crispy Japanese-style fried chicken with ginger-soy sake sauce.', description: 'Fried chicken pieces finished with ginger-soy sake sauce and spicy sriracha mayo.', tags: ['Popular', 'High protein'], pairing: { id: 'coke', reason: 'A cold can keeps this crisp, salty starter easy.' } }),
  dish({ id: 'veggie-chili-bowl', name: 'Veggie Chili Bowl', category: 'Appetizers', price: 10.95, summary: 'Hearty vegetarian chili with cheese, green onion and sour cream.', description: 'A warm chili bowl topped with cheddar, green onion and sour cream.', tags: ['Vegetarian', 'Comforting'] }),
  dish({ id: 'fresh-tortilla-chips', name: 'Fresh Tortilla Chips with Salsa and Guacamole', category: 'Appetizers', price: 9.95, summary: 'House-fried yellow and blue corn chips with salsa and guacamole.', description: 'Corn tortilla chips fried in house and served with salsa and guacamole.', tags: ['Vegan', 'Gluten-free', 'Shareable', 'Quick'] }),
  dish({ id: 'homemade-daily-soup', name: 'Homemade Daily Soup', category: 'Appetizers', price: 8.95, summary: 'Daily house soup made with seasonal ingredients.', description: 'A rotating soup made in house from fresh seasonal ingredients.', tags: ['Vegetarian', 'Gluten-free', 'Quick'] }),
  dish({ id: 'nachos-litos', name: 'Nachos-litos', category: 'Appetizers', price: 11.95, summary: 'Mini nachos with veggie chili, salsa, jalapenos and Monterey Jack.', description: 'Mini nachos with veggie chili, salsa, fried jalapenos, Monterey Jack, salsa and sour cream.', tags: ['Vegetarian', 'Spicy', 'Shareable'] }),

  dish({ id: 'poutine', name: 'Poutine', category: 'Starters', price: 10.95, summary: 'Fresh fries, cheese curds and veggie gravy.', description: 'Crispy fries covered with cheese curds and vegetarian gravy.', tags: ['Vegetarian', 'Popular', 'Comforting'], pairing: { id: 'utopia-burger', reason: 'This is the classic comfort pairing on the menu.' } }),
  dish({ id: 'fresh-cut-fries', name: 'Fresh Cut Fries', category: 'Starters', price: 7.95, summary: 'Fresh-cut fries, vegan and gluten-free.', description: 'Simple fresh-cut fries served hot from the fryer.', tags: ['Vegan', 'Gluten-free', 'Quick', 'Shareable'] }),
  dish({ id: 'onion-rings', name: 'Onion Rings', category: 'Starters', price: 10.00, summary: 'Crisp fried onion rings.', description: 'Golden onion rings served as a shareable starter.', tags: ['Vegetarian', 'Shareable'] }),
  dish({ id: 'sweet-potato-quesadilla', name: 'Sweet Potato Quesadilla', category: 'Starters', price: 14.95, summary: 'Sweet potato, salsa, cheese and jalapeno mayo.', description: 'Roasted sweet potato, salsa, cheddar and Monterey Jack baked in a flour tortilla with sour cream.', tags: ['Vegetarian', 'Spicy'] }),
  dish({ id: 'mushroom-pesto-quesadilla', name: 'Mushroom and Pesto Quesadilla', category: 'Starters', price: 14.95, summary: 'Mushrooms, salsa, pesto and melted cheese.', description: 'White and portobello mushrooms with salsa, pesto, cheddar and Monterey Jack baked in a tortilla.', tags: ['Vegetarian'] }),
  dish({ id: 'veggie-nachos', name: 'Veggie Nachos', category: 'Starters', price: 21.95, summary: 'House chips layered with veggie chili, salsa, jalapenos and cheese.', description: 'House-fried corn tortilla chips layered with veggie chili, salsa, jalapenos and cheddar Monterey Jack, with salsa and sour cream.', tags: ['Vegetarian', 'Spicy', 'Shareable'] }),
  dish({ id: 'fish-tacos', name: 'Fish Tacos (3)', category: 'Starters', price: 14.95, summary: 'Blackened cod, lettuce, tomato-citrus salsa, avocado and jalapeno mayo.', description: 'Three fish tacos with blackened cod, lettuce, tomato-citrus salsa, avocado and jalapeno mayo.', tags: ['Spicy', 'High protein'] }),
  dish({ id: 'chicken-tacos', name: 'Chicken Tacos (3)', category: 'Starters', price: 14.95, summary: 'Crispy chicken, lettuce, salsa, avocado and sriracha mayo.', description: 'Three crispy chicken tacos with lettuce, tomato-citrus salsa, avocado and sriracha mayo.', tags: ['Spicy', 'High protein'] }),
  dish({ id: 'veggie-chicken-tacos', name: 'Veggie Chicken Tacos', category: 'Starters', price: 14.95, summary: 'Veggie chicken, lettuce, salsa, avocado and sriracha mayo.', description: 'Crispy veggie chicken tacos with lettuce, tomato-citrus salsa, avocado and sriracha mayo.', tags: ['Vegetarian', 'Spicy'] }),

  dish({ id: 'caesar-salad', name: 'Caesar Salad', category: 'Salads', price: 10.95, summary: 'Romaine, Asiago, croutons, bacon bits and garlic Caesar dressing.', description: 'Romaine tossed with Asiago, croutons, house bacon bits and garlic Caesar dressing. Vegetarian option available.', tags: ['Gluten-free'] }),
  dish({ id: 'greek-salad', name: 'Greek Salad', category: 'Salads', price: 11.95, summary: 'Romaine, mixed greens, feta, tomato, cucumber, onion and olives.', description: 'Romaine and mixed greens tossed with feta, tomato, cucumber, red onion, Kalamata olives and herb vinaigrette.', tags: ['Vegetarian', 'Gluten-free'] }),
  dish({ id: 'field-mix-greens', name: 'Field Mix Greens', category: 'Salads', price: 8.95, summary: 'Mixed greens, tomato, red onion, carrots and balsamic vinaigrette.', description: 'Mixed greens with tomatoes, red onion, julienned carrots and house balsamic vinaigrette.', tags: ['Vegan', 'Gluten-free', 'Quick'] }),
  dish({ id: 'utopia-good-life', name: 'Utopia Good Life', category: 'Salads', price: 10.95, summary: 'Baby kale, greens, walnuts, cranberries and cranberry-citrus dressing.', description: 'Baby kale and mixed greens with walnuts, dried cranberries, cherry tomatoes, onion and cranberry-citrus dressing.', tags: ['Vegan', 'Gluten-free', 'Nut-free'] }),
  dish({ id: 'mushroom-goat-cheese-salad', name: 'Mushroom and Goat Cheese Salad', category: 'Salads', price: 15.00, summary: 'Mushrooms, roasted peppers, greens, goat cheese and walnuts.', description: 'Sauteed white and portobello mushrooms with roasted peppers, greens, goat cheese, walnuts and soy-balsamic dressing.', tags: ['Vegetarian', 'Nut-free'] }),

  dish({ id: 'chicken-burrito', name: 'Chicken Burrito', category: 'Burritos', price: 12.95, summary: 'Southwestern chicken, grilled onions, salsa, green onion mayo and cheese.', description: 'Slow-cooked southwestern chicken with grilled onions, salsa, green onion mayo and cheddar Monterey Jack in a grilled flour tortilla.', tags: ['Popular', 'High protein'], pairing: { id: 'fresh-cut-fries', reason: 'Fries make it a complete, no-fuss order.' } }),
  dish({ id: 'fried-chicken-avocado-burrito', name: 'Fried Chicken and Avocado Burrito', category: 'Burritos', price: 13.95, summary: 'Karaage, avocado, grilled onions, salsa, karashi mayo and cheese.', description: 'Japanese-style fried chicken karaage with avocado, grilled onions, salsa, spicy karashi mayo and cheddar Monterey Jack.', tags: ['Popular', 'High protein', 'Spicy'] }),
  dish({ id: 'curried-potato-burrito', name: 'Curried Potato, Butternut Squash and Chickpea Burrito', category: 'Burritos', price: 12.95, summary: 'Potato, squash and chickpeas in coconut curry with tamarind chutney.', description: 'Potatoes, butternut squash and chickpeas simmered in spicy coconut curry, baked in a flour tortilla with tamarind chutney.', tags: ['Vegan', 'Spicy', 'Comforting'] }),
  dish({ id: 'steak-mushroom-burrito', name: 'Steak and Mushroom Burrito', category: 'Burritos', price: 15.95, summary: 'Sirloin, mushrooms, crispy onions, salsa, hot mayo and aged cheddar.', description: 'Sirloin with sauteed mushrooms, crispy onions, salsa, Utopia scotch bonnet mayo and aged cheddar.', tags: ['Spicy', 'High protein'] }),
  dish({ id: 'grilled-shrimp-burrito', name: 'Grilled Shrimp Burrito', category: 'Burritos', price: 14.95, summary: 'Garam masala shrimp, salsa, onions, garlic dill mayo and cheese.', description: 'Garam masala-marinated black tiger shrimp with salsa, grilled onions, garlic dill mayo and cheddar Monterey Jack.', tags: ['High protein'] }),
  dish({ id: 'smoked-lamb-brie-burrito', name: 'Smoked Lamb and Brie Burrito', category: 'Burritos', price: 14.95, summary: 'Smoked lamb, brie, salsa, crispy onions and red pepper Dijon mayo.', description: 'House-smoked lamb with double cream brie, salsa, crispy fried onions and red pepper Dijon mayo.', tags: ['High protein', 'Comforting'] }),

  dish({ id: 'house-burger', name: 'House Burger', category: 'Burgers', price: 10.95, summary: 'Angus brisket and chuck patty with lettuce, condiments, pickles and onion.', description: 'A 6 oz Angus brisket and chuck burger on an Ace Bakery bun with lettuce, ketchup, mustard, pickles, grilled onion and mayo.', tags: ['Popular', 'High protein'] }),
  dish({ id: 'utopia-burger', name: 'Utopia Burger', category: 'Burgers', price: 14.95, summary: 'House burger with provolone, cheddar, peameal bacon, hot mayo and crispy onions.', description: 'House burger with smoked provolone, aged cheddar, house-cured peameal bacon, scotch bonnet mayo, pickled banana peppers and crispy onions.', tags: ['Popular', 'Spicy', 'High protein'] }),
  dish({ id: 'bacon-cheddar-burger', name: 'Bacon Cheddar Burger', category: 'Burgers', price: 12.95, summary: 'House burger with aged cheddar and smoked bacon.', description: 'A house burger topped with aged cheddar and house-cured smoked bacon, served on an Ace Bakery bun.', tags: ['High protein', 'Comforting'] }),
  dish({ id: 'mactopia', name: 'Mactopia', category: 'Burgers', price: 12.95, summary: 'House burger with lettuce, pickles, onion, provolone and Mactopia sauce.', description: 'House burger topped with lettuce, pickles, grilled onion, provolone and Mactopia sauce.', tags: ['Comforting'] }),
  dish({ id: 'veggie-burger', name: 'Veggie Burger', category: 'Burgers', price: 10.95, summary: 'Beyond Meat burger with lettuce, condiments, pickles and onion.', description: 'A Beyond Meat burger on an Ace Bakery bun with lettuce, ketchup, mustard, pickles and grilled onion.', tags: ['Vegan', 'Vegetarian', 'Comforting'] }),

  dish({ id: 'chicken-pesto-panini', name: 'Chicken and Pesto Panini', category: 'Sandwiches', price: 12.95, summary: 'Grilled chicken, pesto, salsa and Asiago on herbed focaccia.', description: 'Sliced grilled chicken with pesto, salsa and Asiago cheese on an Ace Bakery herbed focaccia panini.', tags: ['High protein'] }),
  dish({ id: 'steak-sandwich', name: 'Steak Sandwich', category: 'Sandwiches', price: 15.95, summary: 'Sirloin, crispy onions, provolone, hot mayo and jalapenos.', description: 'Grilled sirloin with crispy onions, smoked provolone, Utopia scotch bonnet mayo and fried jalapenos on focaccia.', tags: ['Spicy', 'High protein'] }),
  dish({ id: 'seared-tuna-avocado-sandwich', name: 'Seared Tuna and Avocado Sandwich', category: 'Sandwiches', price: 13.95, summary: 'Yellowfin tuna, avocado, lettuce, tomato, onion and karashi mayo.', description: 'Seared yellowfin tuna with avocado, lettuce, tomato, onion and spicy karashi mustard mayo on toasted marble rye.', tags: ['High protein'] }),
  dish({ id: 'classic-grilled-cheese', name: 'Classic Grilled Cheese', category: 'Sandwiches', price: 11.95, summary: 'Cheddar, Monterey Jack and Swiss on toast.', description: 'A classic grilled cheese with cheddar, Monterey Jack and Swiss on your choice of bread.', tags: ['Vegetarian', 'Kids', 'Comforting'] }),
  dish({ id: 'mushroom-pesto-goat-cheese-panini', name: 'Mushroom, Pesto and Goat Cheese Panini', category: 'Sandwiches', price: 11.95, summary: 'Mushrooms, goat cheese, pesto and caramelized onions.', description: 'White and portobello mushrooms with goat cheese, pesto and caramelized onions on herbed focaccia.', tags: ['Vegetarian'] }),
  dish({ id: 'utopia-fried-chicken-sandwich', name: 'Utopia-style Fried Chicken', category: 'Sandwiches', price: 12.95, summary: 'Crispy fried chicken, coleslaw and sriracha mayo.', description: 'Extra-crispy fried chicken with fresh coleslaw and sriracha mayo on an Ace Bakery burger bun.', tags: ['Spicy', 'High protein'] }),
  dish({ id: 'avocado-provolone-sweet-potato-panini', name: 'Avocado, Smoked Provolone and Sweet Potato Panini', category: 'Sandwiches', price: 12.95, summary: 'Sweet potato, provolone, avocado, tomato, onion and Dijon mayo.', description: 'Grilled sweet potato with smoked provolone, avocado, tomato, onion and red pepper Dijon mayo on herbed focaccia.', tags: ['Vegetarian'] }),
  dish({ id: 'fishwich', name: 'Fishwich', category: 'Sandwiches', price: 14.95, summary: 'Cod, cheddar, lettuce, pickles, onion and garlic dill mayo.', description: 'Pan-seared cod with cheddar, lettuce, pickles, raw onion and garlic dill mayo on an Ace Bakery bun.', tags: ['High protein'] }),
  dish({ id: 'vegetarian-souvlaki', name: 'Vegetarian Souvlaki', category: 'Sandwiches', price: 12.95, summary: 'Soy protein, tzatziki, barbecue sauce, tomato and onions on pita.', description: 'House-marinated soy protein grilled and served on Greek-style pita with tzatziki, barbecue sauce, tomato and onions.', tags: ['Vegetarian', 'Popular'] }),
  dish({ id: 'utopia-chicken-club', name: 'Utopia Chicken Club', category: 'Sandwiches', price: 12.95, summary: 'Grilled or fried chicken, cheese, bacon, guacamole, tomato and lettuce.', description: 'Chicken breast or fried karaage with aged cheddar, Swiss, house-cured bacon, guacamole, tomato and lettuce on toasted sourdough.', tags: ['Popular', 'High protein'] }),

  dish({ id: 'breakfast-burrito', name: 'Breakfast Burrito', category: 'Brunch', price: 18.95, summary: 'Eggs or tofu scramble, cheese, peppers, onion and jalapenos.', description: 'Scrambled eggs or tofu scramble with cheddar, Monterey Jack, peppers, onion and jalapenos in a grilled tortilla with home fries and salad.', tags: ['Vegetarian', 'Spicy', 'Comforting'] }),
  dish({ id: 'weekday-special-egg', name: 'Weekday Special - Egg', category: 'Brunch', price: 16.95, summary: 'Three eggs with breakfast meat or tempeh, home fries and toast.', description: 'Three eggs any style with sausage, peameal, bacon or tempeh, served with home fries and toast.', tags: ['Vegetarian', 'High protein'] }),
  dish({ id: 'weekday-special-tofu', name: 'Weekday Special - Tofu', category: 'Brunch', price: 16.95, summary: 'Tofu scramble with breakfast meat or tempeh, home fries and toast.', description: 'Scrambled tofu with sausage, peameal, bacon or tempeh, served with home fries and toast.', tags: ['Vegan', 'Vegetarian'] }),
  dish({ id: 'classic-eggs-benedict', name: 'Classic Eggs Benedict', category: 'Brunch', price: 18.95, summary: 'Peameal bacon, cornmeal tomato, hollandaise, home fries and salad.', description: 'Classic Benedict with peameal bacon, fried cornmeal tomato and house hollandaise on an English muffin.', tags: ['High protein', 'Comforting'] }),
  dish({ id: 'gotta-frittata', name: 'Gotta Frittata', category: 'Brunch', price: 16.95, summary: 'Home-baked frittata with home fries and green salad.', description: 'A slice of home-baked frittata served with home fries and green salad.', tags: ['Vegetarian', 'Comforting'] }),
  dish({ id: 'eggs-florentine', name: 'Eggs Florentine', category: 'Brunch', price: 18.95, summary: 'Poached eggs, spinach, pesto, roasted pepper and hollandaise.', description: 'Two poached eggs with spinach, pesto, roasted red pepper and hollandaise on an English muffin.', tags: ['Vegetarian', 'Gluten-free'] }),
  dish({ id: 'french-toast', name: 'French Toast', category: 'Brunch', price: 16.95, summary: 'Challah French toast with apple, walnuts and bacon or tempeh.', description: 'Three thick slices of challah French toast with caramelized apple, toasted walnuts and a side of bacon or tempeh.', tags: ['Vegetarian', 'Nut-free', 'Comforting'] }),
  dish({ id: 'eggs-natasha', name: 'Eggs Natasha', category: 'Brunch', price: 19.95, summary: 'Poached eggs, smoked salmon, capers, hollandaise and salsa.', description: 'Poached eggs with smoked salmon, fried capers and hollandaise on an English muffin with salsa and home fries.', tags: ['High protein'] }),
  dish({ id: 'shakshouka', name: 'Shakshouka', category: 'Brunch', price: 17.95, summary: 'Eggs poached in spicy tomato sauce over home fries with feta.', description: 'Two eggs poached in thick spicy tomato sauce over seasoned home fries, topped with feta and served with toast.', tags: ['Vegetarian', 'Spicy', 'Comforting'] }),
  dish({ id: 'steak-and-eggs', name: 'Steak and Eggs', category: 'Brunch', price: 21.95, summary: 'Eggs, skirt steak or portobello, chimichurri, fries and salad.', description: 'Two eggs any style with skirt steak or grilled portobello, chimichurri, crispy fried onions, fries and salad.', tags: ['High protein', 'Gluten-free'] }),
  dish({ id: 'vegan-pancakes', name: 'Vegan Pancakes', category: 'Brunch', price: 16.95, summary: 'Pancakes with tempeh bacon, blueberry compote and maple syrup.', description: 'Four made-to-order pancakes with tempeh bacon, blueberry compote, icing sugar and maple syrup.', tags: ['Vegan', 'Vegetarian', 'Comforting'] }),
  dish({ id: 'chicken-and-waffles', name: 'Chicken and Waffles', category: 'Brunch', price: 16.95, summary: 'Cornflake chicken, cornmeal waffle, sriracha honey and maple syrup.', description: 'Cornflake-crusted chicken thigh with a cornmeal waffle, sriracha honey, green onions, salad and maple syrup.', tags: ['Spicy', 'High protein', 'Comforting'] }),
  dish({ id: 'huevos-rancheros', name: 'Huevos Rancheros', category: 'Brunch', price: 17.95, summary: 'Eggs or tofu, corn tortilla bowls, black bean corn salsa and guacamole.', description: 'Scrambled eggs or tofu scramble in corn tortilla bowls with roasted black bean corn salsa, cheese, lettuce, sriracha mayo, guacamole, home fries and salad.', tags: ['Vegetarian', 'Spicy', 'Gluten-free'] }),

  dish({ id: 'plain-mayo', name: 'Plain Mayo', category: 'Sides', price: 1.00, summary: 'Simple mayonnaise.', description: 'A side of plain mayo.', tags: ['Quick'] }),
  dish({ id: 'sour-cream', name: 'Sour Cream', category: 'Sides', price: 2.00, summary: 'Tangy sour cream.', description: 'A side of sour cream.', tags: ['Vegetarian', 'Quick'] }),
  dish({ id: 'house-made-guacamole', name: 'House-Made Guacamole', category: 'Sides', price: 3.00, summary: 'Fresh avocado dip.', description: 'House-made guacamole for adding to wraps, tacos and starters.', tags: ['Vegan', 'Gluten-free', 'Quick'] }),
  dish({ id: 'house-made-tamarind-chutney', name: 'House-Made Tamarind Chutney', category: 'Sides', price: 2.00, summary: 'Sweet-tangy tamarind chutney.', description: 'A side of house tamarind chutney.', tags: ['Vegan', 'Quick'] }),
  dish({ id: 'veggie-gravy', name: 'Veggie Gravy', category: 'Sides', price: 5.00, summary: 'Savory vegetarian gravy.', description: 'Vegetarian gravy for fries and poutine-style sides.', tags: ['Vegetarian', 'Comforting'] }),
  dish({ id: 'mayo', name: 'Mayo', category: 'Sides', price: 2.00, summary: 'Creamy mayo.', description: 'A side of mayo.', tags: ['Quick'] }),
  dish({ id: 'hot-sauce', name: 'Hot Sauce', category: 'Sides', price: 3.00, summary: 'Utopia scotch bonnet hot sauce.', description: 'A side of Utopia orange scotch bonnet hot sauce.', tags: ['Vegan', 'Gluten-free', 'Spicy', 'Quick'] }),
  dish({ id: 'tempeh-bacon', name: 'Tempeh Bacon', category: 'Sides', price: 3.00, summary: 'Crispy smoky tempeh strips.', description: 'Crispy tempeh strips with a smoky bacon-like flavour.', tags: ['Vegan', 'Vegetarian'] }),
  dish({ id: 'veggie-chicken-side', name: 'Veggie Chicken', category: 'Sides', price: 7.00, summary: 'Crispy fried veggie chicken.', description: 'A side portion of crispy fried veggie chicken.', tags: ['Vegetarian'] }),
  dish({ id: 'house-cured-smoked-bacon', name: 'House Cured and Smoked Bacon', category: 'Sides', price: 3.00, summary: 'Smoked bacon add-on.', description: 'A side of house-cured smoked bacon.', tags: ['High protein', 'Quick'] }),
  dish({ id: 'avocado', name: 'Avocado', category: 'Sides', price: 2.00, summary: 'Fresh avocado.', description: 'Fresh avocado add-on.', tags: ['Vegan', 'Gluten-free', 'Quick'] }),
  dish({ id: 'chicken-side', name: 'Chicken', category: 'Sides', price: 7.00, summary: 'Chicken add-on.', description: 'A side portion of chicken.', tags: ['High protein'] }),

  dish({ id: 'coke', name: 'Coke', category: 'Drinks', price: 3.00, summary: '355 ml can of Coca-Cola.', description: 'A 355 ml can of Coke.', tags: ['Quick'] }),
  dish({ id: 'diet-coke', name: 'Diet Coke', category: 'Drinks', price: 3.00, summary: '355 ml can of Diet Coke.', description: 'A 355 ml can of Diet Coke.', tags: ['Quick'] }),
  dish({ id: 'canada-dry-ginger-ale', name: 'Canada Dry Ginger Ale', category: 'Drinks', price: 3.00, summary: '355 ml can of ginger ale.', description: 'A 355 ml can of Canada Dry Ginger Ale.', tags: ['Quick'] }),
  dish({ id: 'apple-juice', name: 'Apple Juice', category: 'Drinks', price: 4.00, summary: '355 ml bottle of apple juice.', description: 'A 355 ml bottle of apple juice.', tags: ['Quick'] }),
  dish({ id: 'small-eska-flat-water', name: 'Small Eska Flat Water', category: 'Drinks', price: 3.00, summary: '355 ml bottle of flat water.', description: 'A small bottle of Eska flat water.', tags: ['Vegan', 'Gluten-free', 'Quick'] }),
  dish({ id: 'large-eska-flat-water', name: 'Large Eska Flat Water', category: 'Drinks', price: 8.00, summary: '750 ml bottle of flat water.', description: 'A large bottle of Eska flat water.', tags: ['Vegan', 'Gluten-free', 'Quick'] }),
  dish({ id: 'small-eska-sparkling-water', name: 'Small Eska Sparkling Water', category: 'Drinks', price: 4.00, summary: '330 ml bottle of sparkling water.', description: 'A small bottle of sparkling water.', tags: ['Vegan', 'Gluten-free', 'Quick'] }),
  dish({ id: 'large-pellegrino', name: 'Large S. Pellegrino Sparkling Water', category: 'Drinks', price: 8.00, summary: '750 ml bottle of sparkling water.', description: 'A 750 ml bottle of S. Pellegrino sparkling water.', tags: ['Vegan', 'Gluten-free', 'Quick'] }),
  dish({ id: 'fever-tree-ginger-beer', name: 'Fever Tree Ginger Beer', category: 'Drinks', price: 4.25, summary: 'Non-alcoholic ginger beer.', description: 'A bottled Fever Tree ginger beer.', tags: ['Quick'] }),
  dish({ id: 'americano', name: 'Americano', category: 'Drinks', price: 3.00, summary: 'Hot Americano coffee.', description: 'A hot Americano.', tags: ['Vegan', 'Quick'] }),
  dish({ id: 'latte', name: 'Latte', category: 'Drinks', price: 3.75, summary: 'Hot latte.', description: 'A hot latte.', tags: ['Vegetarian', 'Quick'] }),
  dish({ id: 'espresso', name: 'Espresso', category: 'Drinks', price: 2.50, summary: 'Single espresso.', description: 'A single espresso.', tags: ['Vegan', 'Quick'] }),
  dish({ id: 'double-espresso', name: 'Double Espresso', category: 'Drinks', price: 3.00, summary: 'Double espresso.', description: 'A double espresso.', tags: ['Vegan', 'Quick'] }),
  dish({ id: 'cappuccino', name: 'Cappuccino', category: 'Drinks', price: 3.25, summary: 'Hot cappuccino.', description: 'A hot cappuccino.', tags: ['Vegetarian', 'Quick'] }),
  dish({ id: 'hot-chocolate', name: 'Hot Chocolate', category: 'Drinks', price: 3.75, summary: 'Hot chocolate.', description: 'A hot chocolate.', tags: ['Vegetarian', 'Kids', 'Quick'] }),
  dish({ id: 'tea', name: 'Tea', category: 'Drinks', price: 2.25, summary: 'Hot tea.', description: 'A cup of hot tea.', tags: ['Vegan', 'Quick'] }),
  dish({ id: 'drip-coffee', name: 'Drip Coffee', category: 'Drinks', price: 2.25, summary: 'Fresh drip coffee.', description: 'A cup of drip coffee.', tags: ['Vegan', 'Quick'] }),
]

export const filterTags: Tag[] = ['Vegan', 'Vegetarian', 'Gluten-free', 'Spicy', 'Quick', 'Popular', 'High protein', 'Kids']
