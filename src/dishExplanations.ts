/**
 * Sensory "explain the dish" copy for every menu item.
 * Researched from Utopia's public listings plus classic technique for how
 * each plate is typically made (karaage marinade and double-fry, house-cured
 * peameal, scotch bonnet mayo, shakshuka tomato bath, and so on).
 * Shown only when a guest asks. **double stars** mark words to glow in yellow.
 */
import { type Locale, type LocalizedText } from './data'
import { logWarn } from './logger'

const t = (EN: string, FR: string): LocalizedText => ({ EN, FR })

export type DishExplanation = Record<Locale, string[]>

const expl = (EN: string[], FR: string[]): DishExplanation => ({ EN, FR })

export const dishExplanations: Record<string, DishExplanation> = {
  'chicken-karaage': expl(
    [
      "It's **Japanese fried chicken**, marinated in ginger, soy, and sake.",
      'A potato-starch crust, then a second fry so the skin stays shatter-crisp.',
      'Finished with ginger-soy sake and **sriracha mayo**. A little heat. You will be fine.',
    ],
    [
      "C'est du **poulet frit japonais**, marine au gingembre, soja et sake.",
      'Une croute de fécule, puis une seconde friture pour un croustillant net.',
      'Nappe de sauce gingembre-soja-sake et de **mayo sriracha**. Un peu de piquant. Vous allez bien.',
    ],
  ),
  'veggie-chili-bowl': expl(
    [
      "A **slow vegetarian chili**, beans and tomatoes cooked until they go thick and sweet.",
      'Cheddar, green onion, and sour cream go on while it is still steaming.',
      'Comfort in a bowl. **No meat**, all warmth.',
    ],
    [
      'Un **chili vegetarien mijote**, haricots et tomates jusqu a devenir epais et doux.',
      'Cheddar, oignon vert et creme sure, tant que c est encore fumant.',
      'Du reconfort en bol. **Sans viande**, toute la chaleur.',
    ],
  ),
  'fresh-tortilla-chips': expl(
    [
      'Yellow and blue corn tortillas, **fried in house** until they blister.',
      'Salsa for acid. Guacamole for fat.',
      'Made to be shared, and to disappear.',
    ],
    [
      'Tortillas de mais jaune et bleu, **frites sur place** jusqu a cloquer.',
      'Salsa pour l acidite. Guacamole pour le gras.',
      'Faites pour partager, et pour disparaitre.',
    ],
  ),
  'homemade-daily-soup': expl(
    [
      "The **soup of the day**, built from whatever is ripe and in the kitchen.",
      'Simmered in house, not from a pouch.',
      'Ask your server what landed in the pot this afternoon.',
    ],
    [
      'La **soupe du jour**, avec ce qui est mur et deja en cuisine.',
      'Mijotee sur place, pas en sachet.',
      'Demandez au serveur ce qui est tombe dans la marmite.',
    ],
  ),
  'nachos-litos': expl(
    [
      'Mini nachos: house chips, **veggie chili**, salsa, fried jalapenos, Monterey Jack.',
      'Sour cream cools the edges.',
      '**Shareable heat.** A little fire. You will be fine.',
    ],
    [
      'Mini nachos: chips maison, **chili vegetarien**, salsa, jalapenos frits, Monterey Jack.',
      'La creme sure calme les bords.',
      '**Piquant a partager.** Un peu de feu. Vous allez bien.',
    ],
  ),
  poutine: expl(
    [
      "Quebec's late-night plate: **fresh fries**, cheese curds that still squeak, hot gravy.",
      'Utopia pours a vegetarian gravy, or beef if you ask.',
      'The gravy has to be hot enough to start the melt. That is the whole trick.',
    ],
    [
      "L assiette de minuit du Quebec: **frites fraiches**, fromage en grains qui couine, sauce chaude.",
      'Utopia verse une sauce vegetarienne, ou au boeuf si vous demandez.',
      'La sauce doit etre assez chaude pour commencer a fondre. C est tout le secret.',
    ],
  ),
  'fresh-cut-fries': expl(
    [
      'Potatoes cut here, fried until the edges go **gold and salty**.',
      'Vegan. Gluten-free. No tricks.',
      'Eat them while they still hiss.',
    ],
    [
      'Pommes de terre coupees ici, frites jusqu au **dore sale**.',
      'Vegan. Sans gluten. Sans detour.',
      'Mangez-les tant qu elles sifflent encore.',
    ],
  ),
  'onion-rings': expl(
    [
      'Sweet onion in a **crisp batter**, fried until the ring holds.',
      'Share them, or do not.',
      'Best while the steam is still trapped inside.',
    ],
    [
      'Oignon doux dans une **pate croustillante**, frit jusqu a ce que l anneau tienne.',
      'A partager, ou pas.',
      'Meilleures tant que la vapeur est encore prisonniere.',
    ],
  ),
  'sweet-potato-quesadilla': expl(
    [
      'Roasted **sweet potato** folded into a flour tortilla with salsa and two cheeses.',
      'Baked until the Jack and cheddar run.',
      'Jalapeno mayo on the side. **Gentle heat.** You will be fine.',
    ],
    [
      '**Patate douce** rotie dans une tortilla de farine avec salsa et deux fromages.',
      'Cuite jusqu a ce que le Jack et le cheddar coulent.',
      'Mayo jalapeno a cote. **Piquant doux.** Vous allez bien.',
    ],
  ),
  'mushroom-pesto-quesadilla': expl(
    [
      'White and portobello mushrooms, salsa, **basil pesto**, cheddar and Monterey Jack.',
      'Baked in a tortilla until the pesto soaks the fold.',
      'Earthy, herby, a little rich.',
    ],
    [
      'Champignons blancs et portobello, salsa, **pesto de basilic**, cheddar et Monterey Jack.',
      'Cuit dans une tortilla jusqu a ce que le pesto imbibe le pli.',
      'Terreux, herbe, un peu riche.',
    ],
  ),
  'veggie-nachos': expl(
    [
      'A full tray: house-fried chips, **veggie chili**, salsa, jalapenos, cheddar Monterey Jack.',
      'Salsa and sour cream on top so every chip gets a job.',
      'Built for the table. **Spicy.** You will be fine.',
    ],
    [
      'Un grand plateau: chips maison, **chili vegetarien**, salsa, jalapenos, cheddar Monterey Jack.',
      'Salsa et creme sure pour que chaque chip ait un role.',
      'Fait pour la table. **Epice.** Vous allez bien.',
    ],
  ),
  'fish-tacos': expl(
    [
      'Cod, **blackened** in a hot pan until the spice crust darkens.',
      'Lettuce, tomato-citrus salsa, avocado, jalapeno mayo in a soft tortilla.',
      'Tangy, a little sweet, a little fire. **Coastal heat.** You will be fine.',
    ],
    [
      'Morue **noircie** a la poele jusqu a ce que la croute d epices fonce.',
      'Laitue, salsa tomate-agrumes, avocat, mayo jalapeno dans une tortilla souple.',
      'Acidule, un peu doux, un peu de feu. **Piquant cotier.** Vous allez bien.',
    ],
  ),
  'chicken-tacos': expl(
    [
      'Chicken fried until the crust snaps, then tucked into three tortillas.',
      'Lettuce, tomato-citrus salsa, avocado, **sriracha mayo**.',
      'Crunch first, heat second. You will be fine.',
    ],
    [
      'Poulet frit jusqu a ce que la croute claque, puis glisse dans trois tortillas.',
      'Laitue, salsa tomate-agrumes, avocat, **mayo sriracha**.',
      'Le croustillant d abord, le piquant ensuite. Vous allez bien.',
    ],
  ),
  'veggie-chicken-tacos': expl(
    [
      'Crispy **veggie chicken** in the same taco build: salsa, avocado, sriracha mayo.',
      'The crust is the point. The heat is a nudge.',
      'Plant-based, still loud.',
    ],
    [
      '**Poulet vegetal** croustillant dans le meme taco: salsa, avocat, mayo sriracha.',
      'La croute est le but. Le piquant est une pichenette.',
      'Vegetal, toujours bruyant.',
    ],
  ),
  'caesar-salad': expl(
    [
      'Romaine tossed with **garlic Caesar**, Asiago, croutons, and house bacon bits.',
      'The dressing is emulsified, not poured from a bottle and forgotten.',
      'A vegetarian pass exists. Ask.',
    ],
    [
      'Romaine avec **Cesar a l ail**, asiago, croutons et bacon maison.',
      'La vinaigrette est emulsionnee, pas oubliee au fond d une bouteille.',
      'Une version vegetarienne existe. Demandez.',
    ],
  ),
  'greek-salad': expl(
    [
      'Romaine and mixed greens, **feta**, tomato, cucumber, red onion, Kalamata olives.',
      'Herb vinaigrette, bright and oily in the right way.',
      'A cold plate that still eats like dinner.',
    ],
    [
      'Romaine et verdures, **feta**, tomate, concombre, oignon rouge, olives Kalamata.',
      'Vinaigrette aux herbes, vive et huileuse comme il faut.',
      'Une assiette froide qui se mange comme un diner.',
    ],
  ),
  'field-mix-greens': expl(
    [
      'A **simple green salad**: mixed leaves, tomato, red onion, julienned carrot.',
      'House balsamic vinaigrette, sharp then sweet.',
      'The lightest plate on the board.',
    ],
    [
      'Une **salade verte simple**: feuilles, tomate, oignon rouge, carotte julienne.',
      'Vinaigrette balsamique maison, vive puis douce.',
      'L assiette la plus legere du menu.',
    ],
  ),
  'utopia-good-life': expl(
    [
      'Baby kale and greens with walnuts, dried cranberries, cherry tomato, onion.',
      'The dressing is **cranberry-citrus**: tart, a little jammy.',
      'Named like a mood. Eats like one too.',
    ],
    [
      'Jeune kale et verdures avec noix, canneberges sechees, tomate cerise, oignon.',
      'La vinaigrette est **canneberge-agrumes**: acidulee, un peu confite.',
      'Nommee comme une humeur. Ca se mange comme une aussi.',
    ],
  ),
  'mushroom-goat-cheese-salad': expl(
    [
      'White and portobello mushrooms sauteed until they give up their water.',
      'Roasted peppers, greens, **goat cheese**, walnuts, soy-balsamic.',
      'Warm mushrooms on cold leaves. That contrast is the dish.',
    ],
    [
      'Champignons blancs et portobello sautes jusqu a rendre leur eau.',
      'Poivrons rotis, verdures, **fromage de chevre**, noix, soja-balsamique.',
      'Champignons chauds sur feuilles froides. Ce contraste est le plat.',
    ],
  ),
  'chicken-burrito': expl(
    [
      'Southwestern chicken, **slow-cooked** until it shreds, then grilled onions and salsa.',
      'Green onion mayo and cheddar Monterey Jack inside a flour tortilla, grilled shut.',
      'A College Street burrito: fat, warm, no ceremony.',
    ],
    [
      'Poulet sud-ouest **mijote** jusqu a s effilocher, puis oignons grilles et salsa.',
      'Mayo a l oignon vert et cheddar Monterey Jack dans une tortilla grillee.',
      'Un burrito de College Street: gras, chaud, sans ceremonie.',
    ],
  ),
  'fried-chicken-avocado-burrito': expl(
    [
      'The karaage again, this time wrapped with **avocado**, grilled onions, salsa.',
      'Karashi mayo is Japanese mustard heat. Cheddar Monterey Jack holds it together.',
      'Crisp chicken, cool avocado. **Spicy.** You will be fine.',
    ],
    [
      'Le karaage encore, cette fois avec **avocat**, oignons grilles, salsa.',
      'La mayo karashi, c est le piquant de la moutarde japonaise. Le fromage tient le tout.',
      'Poulet croustillant, avocat froid. **Epice.** Vous allez bien.',
    ],
  ),
  'curried-potato-burrito': expl(
    [
      'Potato, butternut squash, and chickpeas simmered in **coconut curry**.',
      'Baked into a flour tortilla with tamarind chutney for the sour-sweet snap.',
      'Vegan, thick, a little fire. You will be fine.',
    ],
    [
      'Pomme de terre, courge musquee et pois chiches dans un **cari de coco**.',
      'Cuit dans une tortilla avec chutney au tamarin pour le sucre-acide.',
      'Vegan, epais, un peu de feu. Vous allez bien.',
    ],
  ),
  'steak-mushroom-burrito': expl(
    [
      'Sirloin and sauteed mushrooms, crispy onions, salsa, aged cheddar.',
      "Utopia's **scotch bonnet mayo** is the 'ouch' sauce: Caribbean heat, creamy wrap.",
      'Serious spice. You will be fine, or you will ask for water. Both are allowed.',
    ],
    [
      'Surlonge et champignons sautes, oignons croustillants, salsa, cheddar vieilli.',
      "La **mayo au scotch bonnet** Utopia, la sauce ouch: piquant caraibe, enveloppe cremeuse.",
      'Du vrai piquant. Vous allez bien, ou vous demanderez de l eau. Les deux passent.',
    ],
  ),
  'grilled-shrimp-burrito': expl(
    [
      'Black tiger shrimp marinated in **garam masala**, then grilled.',
      'Salsa, grilled onions, garlic dill mayo, cheddar Monterey Jack.',
      'Warm spice, not a dare. The dill mayo keeps it coastal.',
    ],
    [
      'Crevettes tigrees noires marinees au **garam masala**, puis grillees.',
      'Salsa, oignons grilles, mayo ail-aneth, cheddar Monterey Jack.',
      'Epices chaudes, pas un defi. La mayo a l aneth garde un air cotier.',
    ],
  ),
  'smoked-lamb-brie-burrito': expl(
    [
      'Lamb **smoked in house**, then wrapped with double-cream brie.',
      'Salsa, crispy fried onions, red pepper Dijon mayo.',
      'Smoke, fat, a little pickle-sweet. A winter burrito in any month.',
    ],
    [
      'Agneau **fume sur place**, puis enveloppe de brie double creme.',
      'Salsa, oignons frits, mayo Dijon au poivron rouge.',
      'Fumee, gras, un peu de douceur. Un burrito d hiver toute l annee.',
    ],
  ),
  'house-burger': expl(
    [
      'A 6 oz patty of **Angus brisket and chuck**, seasoned and grilled.',
      'Ace Bakery bun, lettuce, ketchup, mustard, pickles, grilled onion, mayo.',
      'The house burger, before the house gets loud.',
    ],
    [
      'Une galette de 6 oz **poitrine et palette Angus**, assaisonnee et grillee.',
      'Pain Ace Bakery, laitue, ketchup, moutarde, cornichons, oignon grille, mayo.',
      'Le burger maison, avant que la maison ne s en mele.',
    ],
  ),
  'utopia-burger': expl(
    [
      "The house patty, then smoked provolone, aged cheddar, **peameal bacon** cured here.",
      "Utopia 'ouch' scotch bonnet mayo, pickled banana peppers, crispy fried onions.",
      'This is the burger people come back for. **Spicy.** You will be fine.',
    ],
    [
      'La galette maison, puis provolone fume, cheddar vieilli, **bacon de longe** sale ici.',
      "Mayo 'ouch' au scotch bonnet, piments banane, oignons frits croustillants.",
      'Le burger pour lequel on revient. **Epice.** Vous allez bien.',
    ],
  ),
  'bacon-cheddar-burger': expl(
    [
      'House burger, **aged cheddar**, bacon cured and smoked in house.',
      'Ace Bakery bun. No extra theatre.',
      'Salt, smoke, melt. The honest add-on burger.',
    ],
    [
      'Burger maison, **cheddar vieilli**, bacon sale et fume sur place.',
      'Pain Ace Bakery. Sans theatre.',
      'Sel, fumee, fondant. Le burger honnete.',
    ],
  ),
  mactopia: expl(
    [
      'House burger with lettuce, pickles, grilled onion, provolone.',
      '**Mactopia sauce** is the house special sauce: creamy, a little sweet, a little tang.',
      'A diner burger with a College Street name.',
    ],
    [
      'Burger maison avec laitue, cornichons, oignon grille, provolone.',
      'La **sauce Mactopia**, la sauce speciale: cremeuse, un peu douce, un peu vive.',
      'Un burger de diner avec un nom de College Street.',
    ],
  ),
  'veggie-burger': expl(
    [
      'A **Beyond Meat** patty on an Ace Bakery bun.',
      'Lettuce, ketchup, mustard, pickles, grilled onion.',
      'Same diner build. No animal in the middle.',
    ],
    [
      'Une galette **Beyond Meat** sur pain Ace Bakery.',
      'Laitue, ketchup, moutarde, cornichons, oignon grille.',
      'Le meme montage diner. Rien d animal au milieu.',
    ],
  ),
  'chicken-pesto-panini': expl(
    [
      'Sliced grilled chicken, **basil pesto**, salsa, Asiago.',
      'Pressed on Ace Bakery herbed focaccia until the cheese finds the crust.',
      'Green, salty, a little char from the press.',
    ],
    [
      'Poulet grille tranche, **pesto de basilic**, salsa, asiago.',
      'Presse sur focaccia aux herbes Ace Bakery jusqu a ce que le fromage joigne la croute.',
      'Vert, sale, un peu de grille du pressage.',
    ],
  ),
  'steak-sandwich': expl(
    [
      'Grilled **sirloin** on focaccia with crispy onions and smoked provolone.',
      'Scotch bonnet mayo and fried jalapenos.',
      'A steak sandwich that does not whisper. **Heat.** You will be fine.',
    ],
    [
      '**Surlonge** grillee sur focaccia avec oignons croustillants et provolone fume.',
      'Mayo au scotch bonnet et jalapenos frits.',
      'Un sandwich au steak qui ne chuchote pas. **Piquant.** Vous allez bien.',
    ],
  ),
  'seared-tuna-avocado-sandwich': expl(
    [
      'Yellowfin tuna, **seared** so the centre stays ruby.',
      'Avocado, lettuce, tomato, onion, karashi mustard mayo on toasted marble rye.',
      'Clean fish, hot mustard. A lunch that feels like a decision.',
    ],
    [
      'Thon albacore **saisi**, le centre encore rubis.',
      'Avocat, laitue, tomate, oignon, mayo moutarde karashi sur seigle marbre grille.',
      'Poisson net, moutarde chaude. Un diner qui ressemble a un choix.',
    ],
  ),
  'classic-grilled-cheese': expl(
    [
      'Cheddar, Monterey Jack, and Swiss, **grilled** until the bread goes lacquered.',
      'Three cheeses because one would be shy.',
      'The dunk for the soup of the day.',
    ],
    [
      'Cheddar, Monterey Jack et suisse, **grilles** jusqu a ce que le pain vernisse.',
      'Trois fromages, parce qu un seul serait timide.',
      'La trempette de la soupe du jour.',
    ],
  ),
  'mushroom-pesto-goat-cheese-panini': expl(
    [
      'Mushrooms, **goat cheese**, pesto, caramelized onions on herbed focaccia.',
      'Pressed until the chevre goes molten and the onions go jammy.',
      'Vegetarian, and not a compromise.',
    ],
    [
      'Champignons, **chevre**, pesto, oignons caramelises sur focaccia aux herbes.',
      'Presse jusqu a ce que le chevre fonde et les oignons se confisent.',
      'Vegetarien, et pas un compromis.',
    ],
  ),
  'utopia-fried-chicken-sandwich': expl(
    [
      'Chicken fried extra-crisp, then **coleslaw** and sriracha mayo on an Ace Bakery bun.',
      'The slaw is there to cool the crust and the heat.',
      'A little fire. You will be fine.',
    ],
    [
      'Poulet frit extra croustillant, puis **salade de chou** et mayo sriracha sur pain Ace Bakery.',
      'Le chou est la pour calmer la croute et le piquant.',
      'Un peu de feu. Vous allez bien.',
    ],
  ),
  'avocado-provolone-sweet-potato-panini': expl(
    [
      'Grilled sweet potato, **smoked provolone**, avocado, tomato, onion.',
      'Red pepper Dijon mayo on herbed focaccia.',
      'Sweet, smoke, and a mustard kick.',
    ],
    [
      'Patate douce grillee, **provolone fume**, avocat, tomate, oignon.',
      'Mayo Dijon au poivron rouge sur focaccia aux herbes.',
      'Doux, fume, et un coup de moutarde.',
    ],
  ),
  fishwich: expl(
    [
      'Cod **pan-seared** until the edges crisp, cheddar, lettuce, pickles, raw onion.',
      'Garlic dill mayo on an Ace Bakery bun.',
      'A fish sandwich that still eats like a burger.',
    ],
    [
      'Morue **poelee** jusqu aux bords croustillants, cheddar, laitue, cornichons, oignon cru.',
      'Mayo ail-aneth sur pain Ace Bakery.',
      'Un sandwich au poisson qui se mange encore comme un burger.',
    ],
  ),
  'vegetarian-souvlaki': expl(
    [
      'House-marinated **soy protein**, grilled, on Greek-style pita.',
      'Tzatziki, barbecue sauce, tomato, onions.',
      'The dual sauce is the point: cool cucumber, sticky smoke.',
    ],
    [
      '**Proteine de soya** marinee maison, grillee, sur pita grec.',
      'Tzatziki, sauce barbecue, tomate, oignons.',
      'Les deux sauces sont le but: concombre froid, fumee colle.',
    ],
  ),
  'utopia-chicken-club': expl(
    [
      'Grilled breast or fried karaage, aged cheddar, Swiss, **house-cured bacon**.',
      'Guacamole, tomato, lettuce on toasted sourdough.',
      'A club with a kitchen that smokes its own bacon. That is the flex.',
    ],
    [
      'Poitrine grillee ou karaage frit, cheddar vieilli, suisse, **bacon maison**.',
      'Guacamole, tomate, laitue sur pain au levain grille.',
      'Un club dont la cuisine fume son bacon. C est le geste.',
    ],
  ),
  'breakfast-burrito': expl(
    [
      'Eggs or **tofu scramble**, cheddar, Monterey Jack, peppers, onion, jalapenos.',
      'Grilled tortilla, home fries, salad on the plate beside it.',
      'Brunch that you can hold. A little heat. You will be fine.',
    ],
    [
      'Oeufs ou **tofu brouille**, cheddar, Monterey Jack, poivrons, oignon, jalapenos.',
      'Tortilla grillee, frites maison et salade a cote.',
      'Un brunch que l on tient. Un peu de piquant. Vous allez bien.',
    ],
  ),
  'weekday-special-egg': expl(
    [
      'Three eggs, any style, with sausage, peameal, bacon, or tempeh.',
      '**Home fries** and toast. Coffee is the usual next move.',
      'The weekday plate: no puzzle, all protein.',
    ],
    [
      'Trois oeufs, au choix, avec saucisse, bacon de longe, bacon ou tempeh.',
      '**Frites maison** et roties. Le cafe est le geste suivant.',
      'L assiette de semaine: pas d enigme, toute la proteine.',
    ],
  ),
  'weekday-special-tofu': expl(
    [
      '**Tofu scramble** in place of eggs, same weekday sides.',
      'Sausage, peameal, bacon, or more tempeh if you stay plant-based.',
      'Soft, savory, yellow with spice, not with yolk.',
    ],
    [
      '**Tofu brouille** a la place des oeufs, memes accompagnements.',
      'Saucisse, bacon de longe, bacon, ou plus de tempeh si vous restez vegetal.',
      'Doux, sale, jaune d epice, pas de jaune d oeuf.',
    ],
  ),
  'classic-eggs-benedict': expl(
    [
      'Poached eggs, **peameal bacon**, fried cornmeal tomato, house hollandaise.',
      'English muffin, home fries, salad.',
      'Hollandaise is butter and yolk, whisked until it coats a spoon. That richness is the dish.',
    ],
    [
      'Oeufs poches, **bacon de longe**, tomate en semoule frite, hollandaise maison.',
      'Muffin anglais, frites maison, salade.',
      'L hollandaise, beurre et jaune, jusqu a nappe. Cette richesse est le plat.',
    ],
  ),
  'gotta-frittata': expl(
    [
      'A **home-baked frittata**, sliced thick, with home fries and greens.',
      'Eggs set in the oven, not scrambled in a panic.',
      'A quiet brunch plate with a loud name.',
    ],
    [
      'Une **frittata cuite maison**, tranchee epaisse, avec frites maison et verdure.',
      'Les oeufs prennent au four, pas brouilles a la hate.',
      'Un brunch calme avec un nom bruyant.',
    ],
  ),
  'eggs-florentine': expl(
    [
      'Two poached eggs, spinach, pesto, roasted red pepper, hollandaise.',
      'The Florentine swap: **greens instead of ham**, still on an English muffin.',
      'Vegetarian, buttery, a little basil.',
    ],
    [
      'Deux oeufs poches, epinards, pesto, poivron rouge roti, hollandaise.',
      'Le geste Florentine: **des verts a la place du jambon**, toujours sur muffin anglais.',
      'Vegetarien, beurre, un peu de basilic.',
    ],
  ),
  'french-toast': expl(
    [
      'Three thick slices of **challah**, soaked and griddled.',
      'Caramelized apple, toasted walnuts, bacon or tempeh.',
      'Custard bread, sticky fruit, a salty side. Brunch doing its job.',
    ],
    [
      'Trois tranches epaisses de **challah**, trempees et grillees.',
      'Pomme caramelisee, noix, bacon ou tempeh.',
      'Pain a la creme, fruit colle, un cote sale. Le brunch fait son travail.',
    ],
  ),
  'eggs-natasha': expl(
    [
      'Poached eggs, **smoked salmon**, fried capers, hollandaise, salsa.',
      'English muffin, home fries. A cousin of eggs royale, with more attitude.',
      'Brine, smoke, butter. A late-morning flex.',
    ],
    [
      'Oeufs poches, **saumon fume**, capres frites, hollandaise, salsa.',
      'Muffin anglais, frites maison. Un cousin des oeufs royale, plus d attitude.',
      'Saumure, fumee, beurre. Un geste de fin de matinee.',
    ],
  ),
  shakshouka: expl(
    [
      "A **North African tomato bath**: peppers, onion, spice, reduced until thick.",
      'Two eggs poached right in the sauce, over seasoned home fries, feta on top.',
      'Tangy, a little sweet. **Mild-to-medium heat.** You will be fine.',
    ],
    [
      'Un **bain de tomates d Afrique du Nord**: poivrons, oignon, epices, reduit.',
      'Deux oeufs poches dans la sauce, sur frites maison, feta par-dessus.',
      'Acidule, un peu doux. **Piquant doux a moyen.** Vous allez bien.',
    ],
  ),
  'steak-and-eggs': expl(
    [
      'Two eggs any style, **skirt steak** or grilled portobello, chimichurri.',
      'Crispy fried onions, fries, salad.',
      'Chimichurri is parsley, garlic, oil, vinegar. The steak is the headline. The sauce is the gossip.',
    ],
    [
      'Deux oeufs au choix, **bavette** ou portobello grille, chimichurri.',
      'Oignons frits, frites, salade.',
      'Le chimichurri: persil, ail, huile, vinaigre. Le steak est le titre. La sauce est le ragot.',
    ],
  ),
  'vegan-pancakes': expl(
    [
      'Four pancakes, **made to order**, no dairy, no egg.',
      'Tempeh bacon, blueberry compote, icing sugar, maple syrup.',
      'Soft stack, smoky strip, fruit that went jammy on the stove.',
    ],
    [
      'Quatre crepes, **a la commande**, sans lait, sans oeuf.',
      'Bacon de tempeh, compote de bleuets, sucre glace, sirop d erable.',
      'Pile douce, laniere fumee, fruit confit sur le feu.',
    ],
  ),
  'chicken-and-waffles': expl(
    [
      'Thigh in a **cornflake crust**, fried. Cornmeal waffle underneath.',
      'Sriracha honey, green onions, salad, maple syrup.',
      'Sweet, hot, crunchy. Breakfast arguing with dinner, and winning.',
    ],
    [
      'Haut de cuisse en **croute corn flakes**, frit. Gaufre de mais en dessous.',
      'Miel sriracha, oignons verts, salade, sirop d erable.',
      'Sucre, chaud, croustillant. Le dejeuner qui se dispute avec le diner, et qui gagne.',
    ],
  ),
  'huevos-rancheros': expl(
    [
      'Eggs or tofu scramble in **corn tortilla bowls**.',
      'Roasted black bean corn salsa, cheese, lettuce, sriracha mayo, guacamole, home fries.',
      'Ranch-style, Toronto-style. **Spicy.** You will be fine.',
    ],
    [
      'Oeufs ou tofu brouille dans des **bols de tortilla de mais**.',
      'Salsa haricots noirs et mais, fromage, laitue, mayo sriracha, guacamole, frites maison.',
      'Style ranch, style Toronto. **Epice.** Vous allez bien.',
    ],
  ),
  'plain-mayo': expl(
    [
      'A side of **plain mayonnaise**. Egg, oil, a little acid.',
      'For fries, for a burger that wants another swipe.',
    ],
    [
      'Une portion de **mayonnaise nature**. Oeuf, huile, un peu d acide.',
      'Pour les frites, pour un burger qui veut un autre trait.',
    ],
  ),
  'sour-cream': expl(
    [
      '**Cultured cream**, thick and tangy.',
      'The cool lid for chili and nachos.',
    ],
    [
      '**Creme fermentee**, epaisse et vive.',
      'Le couvercle froid du chili et des nachos.',
    ],
  ),
  'house-made-guacamole': expl(
    [
      'Avocado smashed **in house**, lime, onion, the usual quiet heat.',
      'It browns if it waits. That is why it is on today\'s extras when the kitchen has extra ripe fruit.',
    ],
    [
      'Avocat ecrase **sur place**, lime, oignon, un piquant discret.',
      'Il brunit s il attend. Voila pourquoi c est un extra du jour quand le fruit est mur.',
    ],
  ),
  'house-made-tamarind-chutney': expl(
    [
      '**Tamarind** cooked down with sugar and spice until it goes sticky and sour-sweet.',
      'The dip the curry burrito was built for.',
    ],
    [
      '**Tamarin** reduit avec sucre et epices jusqu a devenir colle, sucre-acide.',
      'La trempette pour laquelle le burrito au cari est fait.',
    ],
  ),
  'veggie-gravy': expl(
    [
      'A **vegetarian gravy**, browned and seasoned for fries and poutine.',
      'The pour has to be hot. Cold gravy is just a rumor of gravy.',
    ],
    [
      'Une **sauce vegetarienne**, doree et assaisonnee pour frites et poutine.',
      'Le versement doit etre chaud. Une sauce froide n est qu une rumeur de sauce.',
    ],
  ),
  mayo: expl(
    [
      'Creamy **mayo**, the house extra for fries and buns.',
      'One more swipe never hurt a plate.',
    ],
    [
      '**Mayo** onctueuse, l extra maison pour frites et pains.',
      'Un trait de plus n a jamais blesse une assiette.',
    ],
  ),
  'hot-sauce': expl(
    [
      "Utopia's orange **scotch bonnet** sauce. Caribbean pepper, fruit, fire.",
      'This is not a garnish. This is a decision. You will be fine, or you will grin.',
    ],
    [
      'La sauce orange **scotch bonnet** d Utopia. Piment caraibe, fruit, feu.',
      "Ce n est pas une garniture. C est un choix. Vous allez bien, ou vous allez sourire.",
    ],
  ),
  'tempeh-bacon': expl(
    [
      'Tempeh sliced thin, seasoned, fried until **smoky and crisp**.',
      'The vegan bacon that still sounds like bacon in the pan.',
    ],
    [
      'Tempeh tranche fin, assaisonne, frit jusqu a **fume et croustillant**.',
      'Le bacon vegan qui sonne encore comme du bacon dans la poele.',
    ],
  ),
  'veggie-chicken-side': expl(
    [
      'A side of **crispy veggie chicken**, fried the same way as the taco filling.',
      'Crunch you can add to greens, or eat with your fingers.',
    ],
    [
      'Une portion de **poulet vegetal croustillant**, frit comme pour les tacos.',
      'Du croustillant a mettre sur la verdure, ou a manger avec les doigts.',
    ],
  ),
  'house-cured-smoked-bacon': expl(
    [
      'Pork **cured and smoked here**, not fetched already famous.',
      'A few strips. Enough to change a burger or a Benedict.',
    ],
    [
      'Porc **sale et fume ici**, pas deja celebre ailleurs.',
      'Quelques lanieres. Assez pour changer un burger ou un Benedict.',
    ],
  ),
  avocado: expl(
    [
      'Ripe **avocado**, sliced or scooped.',
      'Fat, green, the quiet luxury on a tuna sandwich or a burrito.',
    ],
    [
      '**Avocat** mur, tranche ou ecrase.',
      'Gras, vert, le luxe calme d un sandwich au thon ou d un burrito.',
    ],
  ),
  'chicken-side': expl(
    [
      'A side of **grilled chicken** for salads and bowls that want more protein.',
      'Seasoned, sliced, no ceremony.',
    ],
    [
      'Une portion de **poulet grille** pour salades et bols qui veulent plus de proteines.',
      'Assaisonne, tranche, sans ceremonie.',
    ],
  ),
  coke: expl(
    [
      'A **355 ml can** of Coca-Cola, cold.',
      'The classic fizz beside a salty, fried plate.',
    ],
    [
      'Une **canette de 355 ml** de Coca-Cola, froide.',
      'Les bulles classiques a cote d une assiette salee et frite.',
    ],
  ),
  'diet-coke': expl(
    [
      '**Diet Coke**, 355 ml, ice-cold.',
      'The lighter can for a heavy burger.',
    ],
    [
      '**Coke dietetique**, 355 ml, glace.',
      'La canette plus legere pour un burger copieux.',
    ],
  ),
  'canada-dry-ginger-ale': expl(
    [
      '**Ginger ale**, 355 ml. Sweet spice, cold bubbles.',
      'The usual sip with gravy, or with pan-seared fish.',
    ],
    [
      '**Ginger ale**, 355 ml. Epice doux, bulles froides.',
      'La gorgee habituelle avec la sauce, ou avec le poisson poele.',
    ],
  ),
  'apple-juice': expl(
    [
      'A **355 ml bottle** of apple juice.',
      'Clean and sweet next to grilled cheese or a veggie burger.',
    ],
    [
      'Une **bouteille de 355 ml** de jus de pomme.',
      'Simple et sucre a cote d un grilled cheese ou d un burger vegetal.',
    ],
  ),
  'small-eska-flat-water': expl(
    [
      '**Still water**, 355 ml, Eska.',
      'For the plates that already brought their own fire.',
    ],
    [
      '**Eau plate**, 355 ml, Eska.',
      'Pour les assiettes qui ont deja apporte leur feu.',
    ],
  ),
  'large-eska-flat-water': expl(
    [
      'A **750 ml** bottle of still Eska for the table.',
      'Share it with the nachos, or with steak and eggs.',
    ],
    [
      'Une bouteille **750 ml** d Eska plate pour la table.',
      'A partager avec les nachos, ou avec steak et oeufs.',
    ],
  ),
  'small-eska-sparkling-water': expl(
    [
      '**Sparkling water**, 330 ml.',
      'Bubbles that keep citrus salsa and herb salads bright.',
    ],
    [
      '**Eau petillante**, 330 ml.',
      'Des bulles qui gardent salsa agrumes et salades aux herbes vives.',
    ],
  ),
  'large-pellegrino': expl(
    [
      'A **750 ml S. Pellegrino**, mineral and tight with bubbles.',
      'The bottle you put in the middle of a goat-cheese salad or a share tray.',
    ],
    [
      'Un **S. Pellegrino 750 ml**, mineral, bulles nettes.',
      'La bouteille au milieu d une salade au chevre ou d un plateau a partager.',
    ],
  ),
  'fever-tree-ginger-beer': expl(
    [
      '**Fever-Tree ginger beer**, non-alcoholic, more bite than ale.',
      'Built for curry and jalapenos.',
    ],
    [
      '**Ginger beer Fever-Tree**, sans alcool, plus de mordant que l ale.',
      'Fait pour le cari et les jalapenos.',
    ],
  ),
  americano: expl(
    [
      'Espresso stretched with hot water. A **clean black coffee**.',
      'The sharp cup next to hollandaise.',
    ],
    [
      'Espresso allonge a l eau chaude. Un **cafe noir net**.',
      'La tasse vive a cote de l hollandaise.',
    ],
  ),
  latte: expl(
    [
      'Espresso and steamed milk. A **soft cafe drink**.',
      'The brunch add that makes French toast feel finished.',
    ],
    [
      'Espresso et lait chauffe. Une **boisson cafe douce**.',
      'L extra brunch qui finit le pain dore.',
    ],
  ),
  espresso: expl(
    [
      'A **single shot**, extracted short and dark.',
      'For after the frittata, or instead of a long story.',
    ],
    [
      'Un **espresso simple**, court et sombre.',
      'Apres la frittata, ou a la place d un long recit.',
    ],
  ),
  'double-espresso': expl(
    [
      'Two shots. **More punch**, same small cup.',
      'The closer after steak and eggs.',
    ],
    [
      'Deux extraits. **Plus de punch**, petite tasse.',
      'La fin apres steak et oeufs.',
    ],
  ),
  cappuccino: expl(
    [
      'Espresso, milk, a **thick foam cap**.',
      'Florentine weather. Pesto weather.',
    ],
    [
      'Espresso, lait, une **mousse epaisse**.',
      'Temps Florentine. Temps pesto.',
    ],
  ),
  'hot-chocolate': expl(
    [
      '**Hot chocolate**, cocoa and steamed milk.',
      'The sweet cup beside challah French toast.',
    ],
    [
      '**Chocolat chaud**, cacao et lait chauffe.',
      'La tasse sucree a cote du pain dore challah.',
    ],
  ),
  tea: expl(
    [
      'A **hot tea**, the quiet cup.',
      'It sits well with kale, cranberry, and the soup of the day.',
    ],
    [
      'Un **the chaud**, la tasse calme.',
      'Il va bien avec le kale, la canneberge, et la soupe du jour.',
    ],
  ),
  'drip-coffee': expl(
    [
      '**Fresh drip coffee**, brewed in house.',
      'The weekday cup. Eggs, burgers, no speech required.',
    ],
    [
      '**Cafe filtre frais**, infuse sur place.',
      'La tasse de semaine. Oeufs, burgers, pas de discours.',
    ],
  ),
}

/**
 * Bottom pills for the explain reveal: spice first (gold), then diet,
 * a cooking note, a notable ingredient, and a pairing hint.
 */
export type SpiceLevel = 0 | 1 | 2 | 3 | 4 | 5

export type ExplainFacts = {
  spice: SpiceLevel
  notes: LocalizedText[]
}

const facts = (spice: SpiceLevel, notes: LocalizedText[]): ExplainFacts => ({ spice, notes })

export const dishExplainFacts: Record<string, ExplainFacts> = {
  'chicken-karaage': facts(2, [
    t('Japanese fried', 'Friture japonaise'),
    t('Contains soy', 'Contient du soja'),
    t('Ginger-soy glaze', 'Nappage gingembre-soja'),
    t('Goes with a cold can', 'Va avec une canette froide'),
  ]),
  'veggie-chili-bowl': facts(2, [
    t('Vegetarian', 'Vegetarien'),
    t('Bean stew', 'Ragout de haricots'),
    t('Contains dairy', 'Contient des produits laitiers'),
    t('Bowl meal', 'Plat en bol'),
  ]),
  'fresh-tortilla-chips': facts(1, [
    t('Vegan', 'Vegan'),
    t('House fried', 'Frits sur place'),
    t('Corn chips', 'Chips de mais'),
    t('Goes with guacamole', 'Va avec le guacamole'),
  ]),
  'homemade-daily-soup': facts(1, [
    t('Vegetarian', 'Vegetarien'),
    t('Changes daily', 'Change chaque jour'),
    t('Seasonal pot', 'Marmite de saison'),
    t('Ask the kitchen', 'Demandez en cuisine'),
  ]),
  'nachos-litos': facts(3, [
    t('Vegetarian', 'Vegetarien'),
    t('Contains jalapenos', 'Contient des jalapenos'),
    t('Contains dairy', 'Contient des produits laitiers'),
    t('Mini share', 'Mini a partager'),
  ]),
  poutine: facts(0, [
    t('Vegetarian', 'Vegetarien'),
    t('Cheese curds', 'Fromage en grains'),
    t('Hot gravy', 'Sauce chaude'),
    t('Quebec classic', 'Classique quebecois'),
  ]),
  'fresh-cut-fries': facts(0, [
    t('Vegan', 'Vegan'),
    t('Gluten-free', 'Sans gluten'),
    t('Fresh cut', 'Coupees sur place'),
    t('Shareable', 'A partager'),
  ]),
  'onion-rings': facts(0, [
    t('Vegetarian', 'Vegetarien'),
    t('Fried', 'Frit'),
    t('Sweet onion', 'Oignon doux'),
    t('Shareable', 'A partager'),
  ]),
  'sweet-potato-quesadilla': facts(2, [
    t('Vegetarian', 'Vegetarien'),
    t('Contains dairy', 'Contient des produits laitiers'),
    t('Jalapeno mayo', 'Mayo jalapeno'),
    t('Flour tortilla', 'Tortilla de farine'),
  ]),
  'mushroom-pesto-quesadilla': facts(0, [
    t('Vegetarian', 'Vegetarien'),
    t('Basil pesto', 'Pesto de basilic'),
    t('Contains dairy', 'Contient des produits laitiers'),
    t('Mushroom fold', 'Pli aux champignons'),
  ]),
  'veggie-nachos': facts(3, [
    t('Vegetarian', 'Vegetarien'),
    t('Contains jalapenos', 'Contient des jalapenos'),
    t('Contains dairy', 'Contient des produits laitiers'),
    t('Shareable tray', 'Plateau a partager'),
  ]),
  'fish-tacos': facts(3, [
    t('Blackened cod', 'Morue noircie'),
    t('Contains fish', 'Contient du poisson'),
    t('Citrus salsa', 'Salsa agrumes'),
    t('Jalapeno mayo', 'Mayo jalapeno'),
  ]),
  'chicken-tacos': facts(3, [
    t('Fried chicken', 'Poulet frit'),
    t('Sriracha mayo', 'Mayo sriracha'),
    t('High protein', 'Riche en proteines'),
    t('Three tacos', 'Trois tacos'),
  ]),
  'veggie-chicken-tacos': facts(3, [
    t('Vegetarian', 'Vegetarien'),
    t('Plant protein', 'Proteine vegetale'),
    t('Sriracha mayo', 'Mayo sriracha'),
    t('Crispy crust', 'Croute croustillante'),
  ]),
  'caesar-salad': facts(0, [
    t('Contains bacon', 'Contient du bacon'),
    t('Contains dairy', 'Contient des produits laitiers'),
    t('Garlic dressing', 'Vinaigrette a l ail'),
    t('Vegetarian option', 'Option vegetarienne'),
  ]),
  'greek-salad': facts(0, [
    t('Vegetarian', 'Vegetarien'),
    t('Contains feta', 'Contient de la feta'),
    t('Gluten-free', 'Sans gluten'),
    t('Kalamata olives', 'Olives Kalamata'),
  ]),
  'field-mix-greens': facts(0, [
    t('Vegan', 'Vegan'),
    t('Gluten-free', 'Sans gluten'),
    t('Balsamic', 'Balsamique'),
    t('Light plate', 'Assiette legere'),
  ]),
  'utopia-good-life': facts(0, [
    t('Vegan', 'Vegan'),
    t('Contains walnuts', 'Contient des noix'),
    t('Cranberry-citrus', 'Canneberge-agrumes'),
    t('Baby kale', 'Jeune kale'),
  ]),
  'mushroom-goat-cheese-salad': facts(0, [
    t('Vegetarian', 'Vegetarien'),
    t('Goat cheese', 'Fromage de chevre'),
    t('Contains walnuts', 'Contient des noix'),
    t('Warm mushrooms', 'Champignons chauds'),
  ]),
  'chicken-burrito': facts(1, [
    t('Slow-cooked chicken', 'Poulet mijote'),
    t('Contains dairy', 'Contient des produits laitiers'),
    t('Flour tortilla', 'Tortilla de farine'),
    t('Goes with fries', 'Va avec les frites'),
  ]),
  'fried-chicken-avocado-burrito': facts(3, [
    t('Karaage inside', 'Karaage a l interieur'),
    t('Karashi mayo', 'Mayo karashi'),
    t('Contains avocado', 'Contient de l avocat'),
    t('Contains dairy', 'Contient des produits laitiers'),
  ]),
  'curried-potato-burrito': facts(3, [
    t('Vegan', 'Vegan'),
    t('Coconut base', 'Base coco'),
    t('Contains tamarind', 'Contient du tamarin'),
    t('Chickpea curry', 'Cari de pois chiches'),
  ]),
  'steak-mushroom-burrito': facts(4, [
    t('Scotch bonnet mayo', 'Mayo au scotch bonnet'),
    t('Sirloin', 'Surlonge'),
    t('Contains dairy', 'Contient des produits laitiers'),
    t('High protein', 'Riche en proteines'),
  ]),
  'grilled-shrimp-burrito': facts(2, [
    t('Garam masala', 'Garam masala'),
    t('Contains shellfish', 'Contient des crustaces'),
    t('Garlic dill mayo', 'Mayo ail-aneth'),
    t('High protein', 'Riche en proteines'),
  ]),
  'smoked-lamb-brie-burrito': facts(1, [
    t('House smoked', 'Fume sur place'),
    t('Contains brie', 'Contient du brie'),
    t('Lamb', 'Agneau'),
    t('Crispy onions', 'Oignons croustillants'),
  ]),
  'house-burger': facts(0, [
    t('Angus beef', 'Boeuf Angus'),
    t('Ace Bakery bun', 'Pain Ace Bakery'),
    t('High protein', 'Riche en proteines'),
    t('House patty', 'Galette maison'),
  ]),
  'utopia-burger': facts(4, [
    t('Scotch bonnet mayo', 'Mayo au scotch bonnet'),
    t('Peameal bacon', 'Bacon de longe'),
    t('Contains dairy', 'Contient des produits laitiers'),
    t('High protein', 'Riche en proteines'),
  ]),
  'bacon-cheddar-burger': facts(0, [
    t('House bacon', 'Bacon maison'),
    t('Aged cheddar', 'Cheddar vieilli'),
    t('High protein', 'Riche en proteines'),
    t('Ace Bakery bun', 'Pain Ace Bakery'),
  ]),
  mactopia: facts(0, [
    t('Special sauce', 'Sauce speciale'),
    t('Contains dairy', 'Contient des produits laitiers'),
    t('Diner burger', 'Burger diner'),
    t('Provolone', 'Provolone'),
  ]),
  'veggie-burger': facts(0, [
    t('Vegan', 'Vegan'),
    t('Beyond Meat', 'Beyond Meat'),
    t('Ace Bakery bun', 'Pain Ace Bakery'),
    t('No animal', 'Sans animal'),
  ]),
  'chicken-pesto-panini': facts(0, [
    t('Basil pesto', 'Pesto de basilic'),
    t('Contains dairy', 'Contient des produits laitiers'),
    t('Herbed focaccia', 'Focaccia aux herbes'),
    t('High protein', 'Riche en proteines'),
  ]),
  'steak-sandwich': facts(4, [
    t('Scotch bonnet mayo', 'Mayo au scotch bonnet'),
    t('Sirloin', 'Surlonge'),
    t('Fried jalapenos', 'Jalapenos frits'),
    t('High protein', 'Riche en proteines'),
  ]),
  'seared-tuna-avocado-sandwich': facts(2, [
    t('Seared tuna', 'Thon saisi'),
    t('Contains fish', 'Contient du poisson'),
    t('Karashi mayo', 'Mayo karashi'),
    t('Marble rye', 'Seigle marbre'),
  ]),
  'classic-grilled-cheese': facts(0, [
    t('Vegetarian', 'Vegetarien'),
    t('Three cheeses', 'Trois fromages'),
    t('Kids friendly', 'Pour enfants'),
    t('Goes with soup', 'Va avec la soupe'),
  ]),
  'mushroom-pesto-goat-cheese-panini': facts(0, [
    t('Vegetarian', 'Vegetarien'),
    t('Goat cheese', 'Fromage de chevre'),
    t('Basil pesto', 'Pesto de basilic'),
    t('Herbed focaccia', 'Focaccia aux herbes'),
  ]),
  'utopia-fried-chicken-sandwich': facts(3, [
    t('Fried chicken', 'Poulet frit'),
    t('Sriracha mayo', 'Mayo sriracha'),
    t('Coleslaw', 'Salade de chou'),
    t('High protein', 'Riche en proteines'),
  ]),
  'avocado-provolone-sweet-potato-panini': facts(1, [
    t('Vegetarian', 'Vegetarien'),
    t('Smoked provolone', 'Provolone fume'),
    t('Sweet potato', 'Patate douce'),
    t('Herbed focaccia', 'Focaccia aux herbes'),
  ]),
  fishwich: facts(1, [
    t('Pan-seared cod', 'Morue poelee'),
    t('Contains fish', 'Contient du poisson'),
    t('Garlic dill mayo', 'Mayo ail-aneth'),
    t('Ace Bakery bun', 'Pain Ace Bakery'),
  ]),
  'vegetarian-souvlaki': facts(1, [
    t('Vegetarian', 'Vegetarien'),
    t('Soy protein', 'Proteine de soya'),
    t('Tzatziki', 'Tzatziki'),
    t('Greek pita', 'Pita grec'),
  ]),
  'utopia-chicken-club': facts(1, [
    t('House bacon', 'Bacon maison'),
    t('Guacamole', 'Guacamole'),
    t('Toasted sourdough', 'Pain au levain grille'),
    t('High protein', 'Riche en proteines'),
  ]),
  'breakfast-burrito': facts(2, [
    t('Vegetarian', 'Vegetarien'),
    t('Eggs or tofu', 'Oeufs ou tofu'),
    t('Contains jalapenos', 'Contient des jalapenos'),
    t('Home fries', 'Frites maison'),
  ]),
  'weekday-special-egg': facts(0, [
    t('Three eggs', 'Trois oeufs'),
    t('Home fries', 'Frites maison'),
    t('High protein', 'Riche en proteines'),
    t('Weekday plate', 'Assiette de semaine'),
  ]),
  'weekday-special-tofu': facts(1, [
    t('Vegan option', 'Option vegan'),
    t('Tofu scramble', 'Tofu brouille'),
    t('Home fries', 'Frites maison'),
    t('Weekday plate', 'Assiette de semaine'),
  ]),
  'classic-eggs-benedict': facts(0, [
    t('Peameal bacon', 'Bacon de longe'),
    t('Hollandaise', 'Hollandaise'),
    t('English muffin', 'Muffin anglais'),
    t('High protein', 'Riche en proteines'),
  ]),
  'gotta-frittata': facts(0, [
    t('Vegetarian', 'Vegetarien'),
    t('Oven baked', 'Cuit au four'),
    t('Home fries', 'Frites maison'),
    t('Contains egg', 'Contient de l oeuf'),
  ]),
  'eggs-florentine': facts(0, [
    t('Vegetarian', 'Vegetarien'),
    t('Hollandaise', 'Hollandaise'),
    t('Basil pesto', 'Pesto de basilic'),
    t('English muffin', 'Muffin anglais'),
  ]),
  'french-toast': facts(0, [
    t('Vegetarian', 'Vegetarien'),
    t('Challah', 'Challah'),
    t('Contains walnuts', 'Contient des noix'),
    t('Maple', 'Erable'),
  ]),
  'eggs-natasha': facts(0, [
    t('Smoked salmon', 'Saumon fume'),
    t('Contains fish', 'Contient du poisson'),
    t('Hollandaise', 'Hollandaise'),
    t('Fried capers', 'Capres frites'),
  ]),
  shakshouka: facts(3, [
    t('Vegetarian', 'Vegetarien'),
    t('Tomato base', 'Base tomate'),
    t('Contains feta', 'Contient de la feta'),
    t('Goes with toast', 'Va avec les roties'),
  ]),
  'steak-and-eggs': facts(1, [
    t('Skirt steak', 'Bavette'),
    t('Chimichurri', 'Chimichurri'),
    t('Gluten-free', 'Sans gluten'),
    t('High protein', 'Riche en proteines'),
  ]),
  'vegan-pancakes': facts(0, [
    t('Vegan', 'Vegan'),
    t('Maple syrup', 'Sirop d erable'),
    t('Blueberry', 'Bleuets'),
    t('Tempeh bacon', 'Bacon de tempeh'),
  ]),
  'chicken-and-waffles': facts(3, [
    t('Cornflake crust', 'Croute corn flakes'),
    t('Sriracha honey', 'Miel sriracha'),
    t('Maple', 'Erable'),
    t('High protein', 'Riche en proteines'),
  ]),
  'huevos-rancheros': facts(3, [
    t('Vegetarian', 'Vegetarien'),
    t('Corn tortillas', 'Tortillas de mais'),
    t('Contains guacamole', 'Contient du guacamole'),
    t('Gluten-free', 'Sans gluten'),
  ]),
  'plain-mayo': facts(0, [
    t('Contains egg', 'Contient de l oeuf'),
    t('For fries', 'Pour les frites'),
    t('Side dip', 'Trempette'),
  ]),
  'sour-cream': facts(0, [
    t('Vegetarian', 'Vegetarien'),
    t('Contains dairy', 'Contient des produits laitiers'),
    t('For nachos', 'Pour les nachos'),
    t('Cooling lid', 'Couvercle froid'),
  ]),
  'house-made-guacamole': facts(1, [
    t('Vegan', 'Vegan'),
    t('Gluten-free', 'Sans gluten'),
    t('Avocado', 'Avocat'),
    t('Lime', 'Lime'),
  ]),
  'house-made-tamarind-chutney': facts(1, [
    t('Vegan', 'Vegan'),
    t('Contains tamarind', 'Contient du tamarin'),
    t('Sour-sweet', 'Sucre-acide'),
    t('For curry', 'Pour le cari'),
  ]),
  'veggie-gravy': facts(0, [
    t('Vegetarian', 'Vegetarien'),
    t('For fries', 'Pour les frites'),
    t('For poutine', 'Pour la poutine'),
    t('Serve hot', 'Servir chaud'),
  ]),
  mayo: facts(0, [
    t('Contains egg', 'Contient de l oeuf'),
    t('For fries', 'Pour les frites'),
    t('Creamy extra', 'Extra onctueux'),
  ]),
  'hot-sauce': facts(5, [
    t('Vegan', 'Vegan'),
    t('Scotch bonnet', 'Scotch bonnet'),
    t('Gluten-free', 'Sans gluten'),
    t('Serious heat', 'Vrai feu'),
  ]),
  'tempeh-bacon': facts(0, [
    t('Vegan', 'Vegan'),
    t('Smoky', 'Fume'),
    t('Plant protein', 'Proteine vegetale'),
    t('Crispy strips', 'Lanieres croustillantes'),
  ]),
  'veggie-chicken-side': facts(1, [
    t('Vegetarian', 'Vegetarien'),
    t('Fried', 'Frit'),
    t('Plant protein', 'Proteine vegetale'),
    t('Crispy crust', 'Croute croustillante'),
  ]),
  'house-cured-smoked-bacon': facts(0, [
    t('House cured', 'Sale sur place'),
    t('Smoked here', 'Fume ici'),
    t('High protein', 'Riche en proteines'),
    t('Burger extra', 'Extra burger'),
  ]),
  avocado: facts(0, [
    t('Vegan', 'Vegan'),
    t('Gluten-free', 'Sans gluten'),
    t('Ripe fruit', 'Fruit mur'),
    t('Add-on', 'Extra'),
  ]),
  'chicken-side': facts(0, [
    t('High protein', 'Riche en proteines'),
    t('Grilled', 'Grille'),
    t('Salad extra', 'Extra salade'),
  ]),
  coke: facts(0, [
    t('Cold can', 'Canette froide'),
    t('355 ml', '355 ml'),
    t('Goes with fries', 'Va avec les frites'),
  ]),
  'diet-coke': facts(0, [
    t('Cold can', 'Canette froide'),
    t('355 ml', '355 ml'),
    t('Goes with a burger', 'Va avec un burger'),
  ]),
  'canada-dry-ginger-ale': facts(0, [
    t('Ginger fizz', 'Bulles gingembre'),
    t('355 ml', '355 ml'),
    t('Goes with gravy', 'Va avec la sauce'),
  ]),
  'apple-juice': facts(0, [
    t('Bottled juice', 'Jus en bouteille'),
    t('355 ml', '355 ml'),
    t('Kids friendly', 'Pour enfants'),
  ]),
  'small-eska-flat-water': facts(0, [
    t('Still water', 'Eau plate'),
    t('355 ml', '355 ml'),
    t('For spicy plates', 'Pour les plats epices'),
  ]),
  'large-eska-flat-water': facts(0, [
    t('Still water', 'Eau plate'),
    t('750 ml', '750 ml'),
    t('For the table', 'Pour la table'),
  ]),
  'small-eska-sparkling-water': facts(0, [
    t('Sparkling', 'Petillant'),
    t('330 ml', '330 ml'),
    t('Goes with salad', 'Va avec la salade'),
  ]),
  'large-pellegrino': facts(0, [
    t('Sparkling', 'Petillant'),
    t('750 ml', '750 ml'),
    t('For the table', 'Pour la table'),
  ]),
  'fever-tree-ginger-beer': facts(1, [
    t('No alcohol', 'Sans alcool'),
    t('Ginger bite', 'Mordant gingembre'),
    t('Goes with curry', 'Va avec le cari'),
  ]),
  americano: facts(0, [
    t('Black coffee', 'Cafe noir'),
    t('Espresso and water', 'Espresso et eau'),
    t('Goes with brunch', 'Va avec le brunch'),
  ]),
  latte: facts(0, [
    t('Contains dairy', 'Contient des produits laitiers'),
    t('Steamed milk', 'Lait chauffe'),
    t('Goes with French toast', 'Va avec le pain dore'),
  ]),
  espresso: facts(0, [
    t('Single shot', 'Espresso simple'),
    t('Short and dark', 'Court et sombre'),
    t('After the plate', 'Apres l assiette'),
  ]),
  'double-espresso': facts(0, [
    t('Two shots', 'Deux extraits'),
    t('More punch', 'Plus de punch'),
    t('After steak and eggs', 'Apres steak et oeufs'),
  ]),
  cappuccino: facts(0, [
    t('Contains dairy', 'Contient des produits laitiers'),
    t('Thick foam', 'Mousse epaisse'),
    t('Goes with Florentine', 'Va avec la Florentine'),
  ]),
  'hot-chocolate': facts(0, [
    t('Vegetarian', 'Vegetarien'),
    t('Kids friendly', 'Pour enfants'),
    t('Goes with challah', 'Va avec le challah'),
  ]),
  tea: facts(0, [
    t('Vegan', 'Vegan'),
    t('Quiet cup', 'Tasse calme'),
    t('Goes with soup', 'Va avec la soupe'),
  ]),
  'drip-coffee': facts(0, [
    t('Vegan', 'Vegan'),
    t('Brewed in house', 'Infuse sur place'),
    t('Weekday cup', 'Tasse de semaine'),
  ]),
}

/** Split **highlight** markers into text nodes the UI can color in sign yellow. */
export type ExplainPart = { text: string; highlight: boolean }

export const parseExplainLine = (line: string): ExplainPart[] => {
  const parts: ExplainPart[] = []
  const tokens = line.split(/(\*\*[^*]+\*\*)/g)
  for (const token of tokens) {
    if (!token) continue
    const highlight = token.startsWith('**') && token.endsWith('**')
    parts.push({
      text: highlight ? token.slice(2, -2) : token,
      highlight,
    })
  }
  return parts
}

export const explanationFor = (dishId: string, locale: Locale): string[] => {
  const entry = dishExplanations[dishId]
  if (!entry) {
    logWarn('No dish explanation stored', dishId)
    return []
  }
  return entry[locale]
}

export const spiceLabelFor = (spice: SpiceLevel, locale: Locale): string =>
  locale === 'FR' ? `Piquant ${spice} / 5` : `Spice ${spice} / 5`

export const factsFor = (dishId: string): ExplainFacts | null => {
  const entry = dishExplainFacts[dishId]
  if (!entry) {
    logWarn('No dish explain facts stored', dishId)
    return null
  }
  return entry
}
