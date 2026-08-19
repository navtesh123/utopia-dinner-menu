/**
 * Best add-on pairings for every menu item.
 * Ranked first-to-last. Used to upsell when a guest adds a plate to the shortlist.
 * Keep pairings in a different category when we can (side, drink, or shareable)
 * so the ticket grows without doubling the same plate.
 */
import { dishes, type LocalizedText } from './data'
import { logWarn } from './logger'

export type PairingSuggestion = {
  id: string
  reason: LocalizedText
}

const text = (EN: string, FR: string): LocalizedText => ({ EN, FR })
const pair = (id: string, EN: string, FR: string): PairingSuggestion => ({ id, reason: text(EN, FR) })

export const pairingsByDishId: Record<string, PairingSuggestion[]> = {
  'chicken-karaage': [
    pair('coke', 'A cold can cuts the salt and crunch.', 'Une canette froide coupe le sel et le croustillant.'),
    pair('fresh-cut-fries', 'Turns the starter into a shareable plate.', 'Transforme l entree en assiette a partager.'),
  ],
  'veggie-chili-bowl': [
    pair('fresh-tortilla-chips', 'Chips are the usual scoop for this chili.', 'Les chips sont le geste habituel avec ce chili.'),
    pair('drip-coffee', 'A warm cup beside a warm bowl.', 'Une tasse chaude a cote d un bol chaud.'),
  ],
  'fresh-tortilla-chips': [
    pair('house-made-guacamole', 'Extra guacamole disappears first at the table.', 'Le guacamole extra part en premier a table.'),
    pair('veggie-chili-bowl', 'Chili makes the chips a real starter.', 'Le chili fait des chips une vraie entree.'),
  ],
  'homemade-daily-soup': [
    pair('field-mix-greens', 'Soup and greens is the light lunch regulars order.', 'Soupe et verdure, le dejeuner leger des habitues.'),
    pair('classic-grilled-cheese', 'The obvious dunk.', 'L accord evidemment trempette.'),
  ],
  'nachos-litos': [
    pair('house-made-guacamole', 'Cool guacamole against the jalapenos.', 'Le guacamole calme les jalapenos.'),
    pair('coke', 'A cold drink for a salty, spicy tray.', 'Une boisson froide pour un plateau sale et epice.'),
  ],
  poutine: [
    pair('utopia-burger', 'The classic College Street comfort pair.', 'L accord reconfortant classique de College Street.'),
    pair('canada-dry-ginger-ale', 'Ginger ale cuts the gravy.', 'Le ginger ale coupe la sauce.'),
  ],
  'fresh-cut-fries': [
    pair('house-burger', 'Fries belong next to a burger.', 'Les frites vont avec un burger.'),
    pair('hot-sauce', 'A splash of Utopia hot sauce on the fries.', 'Un trait de sauce piquante Utopia sur les frites.'),
  ],
  'onion-rings': [
    pair('bacon-cheddar-burger', 'Crisp rings beside a cheddar burger.', 'Rondelles croustillantes a cote d un burger cheddar.'),
    pair('coke', 'Salt and fizz.', 'Sel et bulles.'),
  ],
  'sweet-potato-quesadilla': [
    pair('house-made-guacamole', 'Guacamole cools the jalapeno mayo.', 'Le guacamole calme la mayo jalapeno.'),
    pair('small-eska-sparkling-water', 'Bubbles keep a rich quesadilla light.', 'Les bulles allegrent une quesadilla riche.'),
  ],
  'mushroom-pesto-quesadilla': [
    pair('field-mix-greens', 'Greens keep the melted cheese from feeling heavy.', 'La verdure allege le fromage fondu.'),
    pair('latte', 'A cafe pairing for a pesto plate.', 'Un accord cafe pour une assiette au pesto.'),
  ],
  'veggie-nachos': [
    pair('house-made-guacamole', 'The tray wants more guacamole.', 'Le plateau demande plus de guacamole.'),
    pair('fever-tree-ginger-beer', 'Ginger beer stands up to jalapenos.', 'Le ginger beer tient tete aux jalapenos.'),
  ],
  'fish-tacos': [
    pair('house-made-guacamole', 'Extra guacamole is the usual taco add.', 'Le guacamole extra est l ajout habituel aux tacos.'),
    pair('small-eska-sparkling-water', 'Citrus salsa likes bubbles.', 'La salsa agrumes aime les bulles.'),
  ],
  'chicken-tacos': [
    pair('fresh-cut-fries', 'Crispy chicken, crispy fries.', 'Poulet croustillant, frites croustillantes.'),
    pair('coke', 'A cold can with sriracha mayo.', 'Une canette froide avec la mayo sriracha.'),
  ],
  'veggie-chicken-tacos': [
    pair('fresh-tortilla-chips', 'More crunch on the side.', 'Plus de croustillant a cote.'),
    pair('apple-juice', 'A sweet sip against the heat.', 'Une gorgée sucree contre le piquant.'),
  ],
  'caesar-salad': [
    pair('homemade-daily-soup', 'Soup and Caesar is a complete light order.', 'Soupe et Cesar, une commande legere complete.'),
    pair('chicken-side', 'Add chicken when the table wants more protein.', 'Ajoutez du poulet si la table veut plus de proteines.'),
  ],
  'greek-salad': [
    pair('vegetarian-souvlaki', 'Greek salad next to the pita.', 'Salade grecque a cote du pita.'),
    pair('large-pellegrino', 'A sparkling bottle for a herb plate.', 'Une bouteille petillante pour une assiette aux herbes.'),
  ],
  'field-mix-greens': [
    pair('homemade-daily-soup', 'The kitchen extra that finishes a greens plate.', 'L extra du jour qui complete une assiette de verdure.'),
    pair('drip-coffee', 'A simple cup with a light salad.', 'Une tasse simple avec une salade legere.'),
  ],
  'utopia-good-life': [
    pair('homemade-daily-soup', 'Warm soup beside the citrus kale.', 'Une soupe chaude a cote du kale agrumes.'),
    pair('tea', 'Tea sits well with cranberry dressing.', 'Le the va bien avec la vinaigrette canneberge.'),
  ],
  'mushroom-goat-cheese-salad': [
    pair('latte', 'Goat cheese and a latte feel like brunch at any hour.', 'Chevre et latte, un air de brunch a toute heure.'),
    pair('small-eska-sparkling-water', 'Keep the balsamic bright.', 'Gardez le balsamique vif.'),
  ],
  'chicken-burrito': [
    pair('fresh-cut-fries', 'Fries make it a no-fuss plate.', 'Les frites en font une assiette sans tracas.'),
    pair('coke', 'A cold drink with a grilled burrito.', 'Une boisson froide avec un burrito grille.'),
  ],
  'fried-chicken-avocado-burrito': [
    pair('fresh-cut-fries', 'Karaage likes fries on the side.', 'Le karaage aime les frites a cote.'),
    pair('canada-dry-ginger-ale', 'Ginger ale cools the karashi mayo.', 'Le ginger ale calme la mayo karashi.'),
  ],
  'curried-potato-burrito': [
    pair('house-made-tamarind-chutney', 'Extra chutney for the coconut curry.', 'Chutney extra pour le cari de coco.'),
    pair('fever-tree-ginger-beer', 'Ginger beer with curry is the usual sip.', 'Ginger beer et cari, la gorgée habituelle.'),
  ],
  'steak-mushroom-burrito': [
    pair('fresh-cut-fries', 'Steak and fries, wrapped or not.', 'Steak et frites, wrap ou pas.'),
    pair('hot-sauce', 'More scotch bonnet if the table likes heat.', 'Plus de scotch bonnet si la table aime le piquant.'),
  ],
  'grilled-shrimp-burrito': [
    pair('field-mix-greens', 'Greens keep the garam masala from feeling heavy.', 'La verdure allege le garam masala.'),
    pair('small-eska-sparkling-water', 'Bubbles with grilled shrimp.', 'Des bulles avec les crevettes grillees.'),
  ],
  'smoked-lamb-brie-burrito': [
    pair('onion-rings', 'Crispy onions echo the ones already inside.', 'Les oignons croustillants font echo a ceux deja dans le wrap.'),
    pair('drip-coffee', 'Smoked lamb likes a dark cup.', 'L agneau fume aime une tasse corsée.'),
  ],
  'house-burger': [
    pair('fresh-cut-fries', 'The plate people expect.', 'L assiette que les gens attendent.'),
    pair('coke', 'Burger and a can.', 'Burger et canette.'),
  ],
  'utopia-burger': [
    pair('poutine', 'The house burger with poutine is the big-ticket pair.', 'Le burger maison avec poutine, l accord qui fait monter l addition.'),
    pair('coke', 'A cold can with scotch bonnet mayo.', 'Une canette froide avec la mayo scotch bonnet.'),
  ],
  'bacon-cheddar-burger': [
    pair('onion-rings', 'Rings next to bacon and cheddar.', 'Rondelles a cote du bacon et du cheddar.'),
    pair('diet-coke', 'A cold drink for a rich burger.', 'Une boisson froide pour un burger riche.'),
  ],
  mactopia: [
    pair('fresh-cut-fries', 'Sauce-heavy burger, simple fries.', 'Burger bien nappé, frites simples.'),
    pair('coke', 'The diner pairing.', 'L accord diner.'),
  ],
  'veggie-burger': [
    pair('fresh-cut-fries', 'Still a burger plate.', 'Toujours une assiette burger.'),
    pair('apple-juice', 'A clean sip with Beyond Meat.', 'Une gorgée simple avec le Beyond Meat.'),
  ],
  'chicken-pesto-panini': [
    pair('caesar-salad', 'Pesto chicken and Caesar split the table well.', 'Poulet pesto et Cesar se partagent bien la table.'),
    pair('latte', 'A cafe drink with focaccia.', 'Une boisson cafe avec la focaccia.'),
  ],
  'steak-sandwich': [
    pair('fresh-cut-fries', 'Steak sandwich wants fries.', 'Le sandwich au steak veut des frites.'),
    pair('hot-sauce', 'More heat on the sirloin.', 'Plus de piquant sur la surlonge.'),
  ],
  'seared-tuna-avocado-sandwich': [
    pair('field-mix-greens', 'A light green side for seared tuna.', 'Un cote vert leger pour le thon saisi.'),
    pair('small-eska-sparkling-water', 'Keep the karashi mayo bright.', 'Gardez la mayo karashi vive.'),
  ],
  'classic-grilled-cheese': [
    pair('homemade-daily-soup', 'The dunk this sandwich is waiting for.', 'La trempette que ce sandwich attend.'),
    pair('hot-chocolate', 'A kids-table pairing that still sells.', 'Un accord enfants qui se vend encore.'),
  ],
  'mushroom-pesto-goat-cheese-panini': [
    pair('utopia-good-life', 'Kale salad beside goat cheese.', 'Salade kale a cote du chevre.'),
    pair('cappuccino', 'Pesto and a cappuccino.', 'Pesto et cappuccino.'),
  ],
  'utopia-fried-chicken-sandwich': [
    pair('fresh-cut-fries', 'Fried chicken, fries.', 'Poulet frit, frites.'),
    pair('coke', 'Sriracha mayo likes a cold can.', 'La mayo sriracha aime une canette froide.'),
  ],
  'avocado-provolone-sweet-potato-panini': [
    pair('house-made-guacamole', 'More avocado on a sweet potato panini.', 'Plus d avocat sur un panini a la patate douce.'),
    pair('latte', 'A warm drink with melted provolone.', 'Une boisson chaude avec le provolone fondu.'),
  ],
  fishwich: [
    pair('fresh-cut-fries', 'Fishwich and fries.', 'Fishwich et frites.'),
    pair('canada-dry-ginger-ale', 'Ginger ale with pan-seared cod.', 'Ginger ale avec la morue poelee.'),
  ],
  'vegetarian-souvlaki': [
    pair('greek-salad', 'Pita and Greek salad on the same table.', 'Pita et salade grecque a la meme table.'),
    pair('small-eska-sparkling-water', 'A clean drink with tzatziki.', 'Une boisson simple avec le tzatziki.'),
  ],
  'utopia-chicken-club': [
    pair('fresh-cut-fries', 'Club sandwiches sell with fries.', 'Les clubs se vendent avec des frites.'),
    pair('drip-coffee', 'A diner cup with the club.', 'Une tasse diner avec le club.'),
  ],
  'breakfast-burrito': [
    pair('house-made-guacamole', 'Guacamole on a breakfast burrito.', 'Guacamole sur un burrito dejeuner.'),
    pair('latte', 'The brunch drink that lifts the ticket.', 'La boisson brunch qui fait monter l addition.'),
  ],
  'weekday-special-egg': [
    pair('drip-coffee', 'Eggs and coffee.', 'Oeufs et cafe.'),
    pair('house-cured-smoked-bacon', 'Extra bacon on the weekday plate.', 'Bacon extra sur l assiette de semaine.'),
  ],
  'weekday-special-tofu': [
    pair('tempeh-bacon', 'Tempeh bacon on the tofu scramble.', 'Bacon de tempeh sur le tofu brouille.'),
    pair('americano', 'A clean coffee with the tofu plate.', 'Un cafe simple avec l assiette tofu.'),
  ],
  'classic-eggs-benedict': [
    pair('latte', 'Benedict and a latte.', 'Benedict et latte.'),
    pair('field-mix-greens', 'A green side if the plate already has fries.', 'Un cote vert si l assiette a deja des frites.'),
  ],
  'gotta-frittata': [
    pair('drip-coffee', 'Frittata and a house coffee.', 'Frittata et cafe maison.'),
    pair('fresh-cut-fries', 'More home-fry crunch on the side.', 'Plus de croustillant de pommes de terre a cote.'),
  ],
  'eggs-florentine': [
    pair('cappuccino', 'Florentine and a cappuccino.', 'Florentine et cappuccino.'),
    pair('small-eska-sparkling-water', 'A bright sip with pesto and hollandaise.', 'Une gorgée vive avec pesto et hollandaise.'),
  ],
  'french-toast': [
    pair('latte', 'Challah French toast wants a latte.', 'Le pain dore challah veut un latte.'),
    pair('house-cured-smoked-bacon', 'Salty bacon against the apple and walnuts.', 'Bacon sale contre la pomme et les noix.'),
  ],
  'eggs-natasha': [
    pair('small-eska-sparkling-water', 'Smoked salmon likes bubbles.', 'Le saumon fume aime les bulles.'),
    pair('americano', 'A sharp coffee with hollandaise.', 'Un cafe vif avec l hollandaise.'),
  ],
  shakshouka: [
    pair('drip-coffee', 'Spicy tomato and coffee.', 'Tomate epicee et cafe.'),
    pair('fresh-tortilla-chips', 'Chips for the leftover sauce.', 'Des chips pour la sauce qui reste.'),
  ],
  'steak-and-eggs': [
    pair('drip-coffee', 'Steak and eggs, plus coffee.', 'Steak et oeufs, plus cafe.'),
    pair('hot-sauce', 'Chimichurri is there. Hot sauce still sells.', 'Le chimichurri est la. La sauce piquante se vend encore.'),
  ],
  'vegan-pancakes': [
    pair('latte', 'Pancakes and a latte, oat or not.', 'Crepes et latte, avoine ou pas.'),
    pair('tempeh-bacon', 'More tempeh bacon on the side.', 'Plus de bacon de tempeh a cote.'),
  ],
  'chicken-and-waffles': [
    pair('drip-coffee', 'Waffles, chicken, coffee.', 'Gaufres, poulet, cafe.'),
    pair('hot-sauce', 'Heat on the cornflake crust.', 'Du piquant sur la croute corn flakes.'),
  ],
  'huevos-rancheros': [
    pair('house-made-guacamole', 'The bowls already want more guacamole.', 'Les bols veulent deja plus de guacamole.'),
    pair('latte', 'A brunch drink with the salsa.', 'Une boisson brunch avec la salsa.'),
  ],
  'plain-mayo': [
    pair('fresh-cut-fries', 'Mayo is for the fries.', 'La mayo est pour les frites.'),
    pair('house-burger', 'A burger that can use another swipe.', 'Un burger qui peut prendre un autre trait.'),
  ],
  'sour-cream': [
    pair('veggie-chili-bowl', 'Sour cream on chili.', 'Creme sure sur le chili.'),
    pair('nachos-litos', 'Cool the jalapenos.', 'Calmez les jalapenos.'),
  ],
  'house-made-guacamole': [
    pair('fresh-tortilla-chips', 'Guacamole needs something to scoop.', 'Le guacamole a besoin de quoi tremper.'),
    pair('fish-tacos', 'The taco add guests mention most.', 'L extra tacos le plus mentionne.'),
  ],
  'house-made-tamarind-chutney': [
    pair('curried-potato-burrito', 'Chutney belongs on the curry burrito.', 'Le chutney va sur le burrito au cari.'),
    pair('fresh-cut-fries', 'A sweet-tangy dip for fries.', 'Une trempette sucree-acidulee pour les frites.'),
  ],
  'veggie-gravy': [
    pair('fresh-cut-fries', 'Gravy on fries is a second poutine.', 'La sauce sur les frites, une seconde poutine.'),
    pair('poutine', 'Extra gravy for the curds.', 'Sauce extra pour les grains.'),
  ],
  mayo: [
    pair('fresh-cut-fries', 'Fries and mayo.', 'Frites et mayo.'),
    pair('house-burger', 'Another swipe on the bun.', 'Un autre trait sur le pain.'),
  ],
  'hot-sauce': [
    pair('utopia-burger', 'The house burger is built for this bottle.', 'Le burger maison est fait pour cette bouteille.'),
    pair('fresh-cut-fries', 'Hot sauce on fries.', 'Sauce piquante sur les frites.'),
  ],
  'tempeh-bacon': [
    pair('vegan-pancakes', 'Tempeh bacon with the pancakes.', 'Bacon de tempeh avec les crepes.'),
    pair('weekday-special-tofu', 'On the tofu scramble.', 'Sur le tofu brouille.'),
  ],
  'veggie-chicken-side': [
    pair('field-mix-greens', 'Crispy veggie chicken on greens.', 'Poulet vegetal croustillant sur la verdure.'),
    pair('fresh-cut-fries', 'A fried side with fries.', 'Un extra frit avec des frites.'),
  ],
  'house-cured-smoked-bacon': [
    pair('classic-eggs-benedict', 'More peameal energy on brunch.', 'Plus de bacon de longe au brunch.'),
    pair('house-burger', 'Bacon on a burger that does not already have it.', 'Du bacon sur un burger qui n en a pas deja.'),
  ],
  avocado: [
    pair('seared-tuna-avocado-sandwich', 'More avocado on the tuna sandwich.', 'Plus d avocat sur le sandwich au thon.'),
    pair('breakfast-burrito', 'Avocado in the breakfast burrito.', 'Avocat dans le burrito dejeuner.'),
  ],
  'chicken-side': [
    pair('caesar-salad', 'Chicken turns Caesar into a meal.', 'Le poulet fait du Cesar un repas.'),
    pair('field-mix-greens', 'Protein on the house greens.', 'Des proteines sur la verdure maison.'),
  ],
  coke: [
    pair('utopia-burger', 'The drink people put next to the house burger.', 'La boisson qu on met a cote du burger maison.'),
    pair('chicken-karaage', 'Fizz with fried chicken.', 'Des bulles avec le poulet frit.'),
  ],
  'diet-coke': [
    pair('bacon-cheddar-burger', 'A light can with a heavy burger.', 'Une canette legere avec un burger copieux.'),
    pair('utopia-fried-chicken-sandwich', 'Cold soda with fried chicken.', 'Soda froid avec le poulet frit.'),
  ],
  'canada-dry-ginger-ale': [
    pair('poutine', 'Ginger ale with gravy.', 'Ginger ale avec la sauce.'),
    pair('fishwich', 'Ginger with pan-seared cod.', 'Gingembre avec la morue poelee.'),
  ],
  'apple-juice': [
    pair('classic-grilled-cheese', 'Juice with the grilled cheese.', 'Jus avec le grilled cheese.'),
    pair('veggie-burger', 'A clean drink with the veggie burger.', 'Une boisson simple avec le burger vegetal.'),
  ],
  'small-eska-flat-water': [
    pair('steak-sandwich', 'Water beside a spicy steak sandwich.', 'De l eau a cote d un sandwich au steak piquant.'),
    pair('shakshouka', 'A still glass with a spicy brunch.', 'Un verre plat avec un brunch epice.'),
  ],
  'large-eska-flat-water': [
    pair('veggie-nachos', 'A big water for a share tray.', 'Une grande eau pour un plateau a partager.'),
    pair('steak-and-eggs', 'The table bottle for a steak plate.', 'La bouteille de table pour une assiette steak.'),
  ],
  'small-eska-sparkling-water': [
    pair('fish-tacos', 'Bubbles with citrus salsa.', 'Des bulles avec la salsa agrumes.'),
    pair('greek-salad', 'Sparkling water with olives and feta.', 'Eau petillante avec olives et feta.'),
  ],
  'large-pellegrino': [
    pair('mushroom-goat-cheese-salad', 'A bottle for a goat cheese salad.', 'Une bouteille pour une salade au chevre.'),
    pair('veggie-nachos', 'Share the bottle with the nachos.', 'Partagez la bouteille avec les nachos.'),
  ],
  'fever-tree-ginger-beer': [
    pair('curried-potato-burrito', 'Ginger beer with coconut curry.', 'Ginger beer avec le cari de coco.'),
    pair('veggie-nachos', 'Spice on spice, on purpose.', 'Piquant sur piquant, expres.'),
  ],
  americano: [
    pair('classic-eggs-benedict', 'Americano with Benedict.', 'Americano avec le Benedict.'),
    pair('mushroom-pesto-goat-cheese-panini', 'A short coffee with pesto.', 'Un cafe court avec le pesto.'),
  ],
  latte: [
    pair('french-toast', 'Latte with challah French toast.', 'Latte avec le pain dore challah.'),
    pair('breakfast-burrito', 'The brunch add that raises the ticket.', 'L extra brunch qui fait monter l addition.'),
  ],
  espresso: [
    pair('gotta-frittata', 'A short espresso after the frittata.', 'Un espresso court apres la frittata.'),
    pair('classic-grilled-cheese', 'A small coffee with a simple sandwich.', 'Un petit cafe avec un sandwich simple.'),
  ],
  'double-espresso': [
    pair('steak-and-eggs', 'A double after steak and eggs.', 'Un double apres steak et oeufs.'),
    pair('smoked-lamb-brie-burrito', 'A strong cup with smoked lamb.', 'Une tasse corsée avec l agneau fume.'),
  ],
  cappuccino: [
    pair('eggs-florentine', 'Cappuccino with Florentine.', 'Cappuccino avec la Florentine.'),
    pair('mushroom-pesto-quesadilla', 'Foam with pesto and mushrooms.', 'Mousse avec pesto et champignons.'),
  ],
  'hot-chocolate': [
    pair('french-toast', 'Chocolate with the sweet brunch plate.', 'Chocolat avec l assiette brunch sucree.'),
    pair('classic-grilled-cheese', 'A kids pairing that still adds a drink.', 'Un accord enfants qui ajoute quand meme une boisson.'),
  ],
  tea: [
    pair('utopia-good-life', 'Tea with the cranberry kale salad.', 'The avec la salade kale canneberge.'),
    pair('homemade-daily-soup', 'Tea beside the soup of the day.', 'The a cote de la soupe du jour.'),
  ],
  'drip-coffee': [
    pair('weekday-special-egg', 'Drip coffee with the weekday eggs.', 'Cafe filtre avec les oeufs de semaine.'),
    pair('house-burger', 'A diner coffee with a burger.', 'Un cafe diner avec un burger.'),
  ],
}

/** Top pairings for a dish, skipping anything already on the shortlist. */
export const upsellsFor = (
  dishId: string,
  excludeIds: Set<string>,
  limit = 2,
): PairingSuggestion[] => {
  const list = pairingsByDishId[dishId]
  if (!list) {
    logWarn(`No pairings stored for dish ${dishId}`)
    return []
  }

  const available = list.filter((entry) => {
    if (excludeIds.has(entry.id)) return false
    const dish = dishes.find((item) => item.id === entry.id)
    if (!dish) {
      logWarn(`Pairing points at a missing dish ${entry.id} from ${dishId}`)
      return false
    }
    return dish.available
  })

  return available.slice(0, limit)
}
