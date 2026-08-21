import {
  Alert,
  Button,
  Card,
  Chip,
  CloseButton,
  EmptyState,
  Label,
  Link,
  ListBox,
  ProgressBar,
  Radio,
  RadioGroup,
  SearchField,
  Select,
  Separator,
  ToggleButton,
  ToggleButtonGroup,
} from '@heroui/react'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { logWarn } from './logger'
import { upsellsFor, type PairingSuggestion } from './pairings'
import { isTodayPromo, promoPrice, sellingPrice } from './pricing'
import { mealFromDate, useDayNightTheme } from './theme'
import { TodaysPromos, type PromoCopy } from './TodaysPromos'
import { DishExplain } from './DishExplain'
import { FoodStage } from './FoodStage'
import { OrderCelebrate } from './OrderCelebrate'
import { UpsellSheet, type UpsellCopy } from './UpsellSheet'
import { WebReviews } from './WebReviews'
import {
  categories,
  categoryCues,
  categoryLabels,
  dishes,
  filterTags,
  localize,
  mostLovedDishes,
  reviewSummaryFor,
  tagLabels,
  type AddOn,
  type BaseOption,
  type Category,
  type Dish,
  type Locale,
  type LocalizedText,
  type MostLovedDish,
  type Tag,
} from './data'

type View = 'menu' | 'choose' | 'moods' | 'shortlist' | 'search' | 'chef'
type Mood = 'Fresh' | 'Comforting' | 'Bold' | 'Familiar'
type Hunger = 'Light' | 'Proper' | 'Feast'
type TimePreference = 'Quick' | 'No rush'
type DietaryPreference = Tag | 'No preference'
type MealPeriod = 'Dinner' | 'Lunch' | 'Brunch'
type ServerMessage = {
  title: string
  description: string
  status: 'accent' | 'warning'
}
type DishCustomizationState = {
  baseOptions: Record<string, string>
  addOns: string[]
}

type MenuStrings = {
  mostOrdered: string
  heroTitle: string
  heroBody: string
  sourceLink: string
  searchLabel: string
  searchPlaceholder: string
  filtersLabel: string
  clearAll: string
  browseMenu: string
  helpMeChoose: string
  exploreMenu: string
  itemCount: (count: number) => string
  empty: string
  unavailable: string
  heroAdd: string
  heroKicker: string
}

type DetailStrings = {
  back: string
  menuDescription: string
  dietary: string
  dietaryBody: string
  speakToServer: string
  nutrition: string
  protein: string
  carbs: string
  fat: string
  customisations: string
  baseOptionsTitle: string
  addOnsTitle: string
  selectUpTo: (max: number) => string
  required: string
  free: string
  totalWithCustomizations: string
  pairingTitle: string
  saved: string
  add: string
  reviewTitle: string
  reviewSource: string
  explain: string
  explainClose: string
  explainKicker: string
}

type ChooseStep = {
  key: 'hunger' | 'mood' | 'dietary' | 'time'
  title: string
  help: string
  choices: { value: string; label: string }[]
}

type ChooseStrings = {
  introLabel: string
  progress: (current: number, total: number) => string
  resultsLabel: string
  resultsTitle: string
  resultsBody: string
  changeAnswers: string
  startAgain: string
  saveAll: string
  browseByMood: string
  privacy: string
  whyPrefix: string
  whyQuick: string
  whyVegan: string
  whyFallback: string
  steps: ChooseStep[]
}

type MoodStrings = {
  label: string
  title: string
  body: string
  cards: Record<Mood, { title: string; cta: string }>
}

type ShortlistStrings = {
  label: string
  title: string
  body: string
  orderReady: string
  remove: (name: string) => string
  totalLabel: string
  totalNote: string
  alertTitle: string
  alertBody: string
  showToServer: string
  emptyTitle: string
  emptyBody: string
  orderedCta: string
  enjoyTitle: string
  enjoyBody: string
}

type ChefStrings = {
  sectionLabel: string
  sectionTitle: string
  sectionBody: string
  cardCta: string
  back: string
  profileLabel: string
  storyTitle: string
  recommendationsTitle: string
  recommendationBody: string
}

type AppCopy = {
  languageLabel: string
  languagePlaceholder: string
  languageOptions: string
  languageNames: Record<string, string>
  languageSoon: string
  restaurantName: string
  established: string
  reviewsFromWeb: string
  reviewVotes: (count: number) => string
  reviewCount: (count: number) => string
  address: string
  mealLabel: string
  mealOptions: string
  meals: Record<MealPeriod, string>
  hoursLabel: string
  photosLabel: string
  draftLabel: string
  dismissMessage: string
  allergyReminder: { title: string; description: string }
  readyForServer: { title: string; description: string }
  nav: { primary: string; menu: string; choose: string; shortlist: string }
  cart: { itemsAdded: (count: number) => string; viewCart: string }
  sourceNote: string
  promo: PromoCopy
  upsell: UpsellCopy
  menu: MenuStrings
  detail: DetailStrings
  choose: ChooseStrings
  moods: MoodStrings
  shortlist: ShortlistStrings
  chef: ChefStrings
}

const languageMenu = [
  { id: 'EN', available: true },
  { id: 'FR', available: true },
  { id: 'ZH', available: false },
  { id: 'ES', available: false },
] as const
const meals: MealPeriod[] = ['Dinner', 'Lunch', 'Brunch']
const mealIcons: Record<MealPeriod, string> = {
  Brunch: 'brunch',
  Lunch: 'lunch',
  Dinner: 'dinner',
}
const mealHours: Record<MealPeriod, string> = {
  Brunch: '8am - 12pm',
  Lunch: '12pm - 4pm',
  Dinner: '5pm - 10pm',
}
// Placeholder hero photos - swap these with final restaurant photography when available.
const heroPhotos = [
  '/dishes/utopia-burger.jpg',
  '/dishes/shakshouka.jpg',
  '/dishes/poutine.jpg',
]
const heroSlideInterval = 5000
const chefProfile = {
  name: 'Maya Laurent',
  role: 'Chef, Utopia Cafe & Grill',
  image: '/utopia-storefront.jpg',
  story: {
    EN: 'Maya cooks like Utopia serves the neighborhood: generous, fast-moving, and full of color. Her menu picks lean into the cafe classics that regulars come back for after work, before a show, or when the table wants a little bit of everything.',
    FR: 'Maya cuisine comme Utopia accueille le quartier : avec generosite, energie et couleur. Ses choix mettent en valeur les classiques du cafe que les habitues reprennent apres le travail, avant un spectacle ou quand la table veut partager un peu de tout.',
  },
  recommendations: ['utopia-burger', 'poutine', 'fish-tacos'],
}
const haptic = (style: 'light' | 'medium' | 'heavy' = 'light') => {
  if ('vibrate' in navigator) {
    const duration = style === 'light' ? 25 : style === 'medium' ? 50 : 75
    try {
      const result = navigator.vibrate(duration)
      if (!result) {
        logWarn('Vibration API returned false - may not be supported or permission denied')
      }
    } catch (error) {
      logWarn('Haptic feedback failed', error)
    }
  } else {
    logWarn('Vibration API not supported on this device/browser')
  }
}

const money = (value: number) => `CA$${value.toFixed(2)}`

/** Regular price, or struck-through list price plus today's 20% off. */
function PriceDisplay({ dish }: { dish: Dish }) {
  if (isTodayPromo(dish.id)) {
    return (
      <span className="price-sale">
        <s>{money(dish.price)}</s>
        <strong>{money(promoPrice(dish.price))}</strong>
      </span>
    )
  }
  return <strong>{money(dish.price)}</strong>
}
const categoryId = (category: Category) => category.toLowerCase().replace(/\s+/g, '-')
const defaultCustomizationFor = (dish: Dish): DishCustomizationState => ({
  baseOptions: Object.fromEntries(
    dish.customizations?.baseOptions?.map((group) => [
      group.id,
      (group.options.find((option) => option.default) ?? group.options[0])?.id ?? '',
    ]) ?? [],
  ),
  addOns: [],
})
const findBaseOption = (dish: Dish, groupId: string, optionId: string): BaseOption | undefined => (
  dish.customizations?.baseOptions
    ?.find((group) => group.id === groupId)
    ?.options.find((option) => option.id === optionId)
)
const findAddOn = (dish: Dish, addOnId: string): AddOn | undefined => (
  dish.customizations?.addOns
    ?.flatMap((group) => group.addOns)
    .find((addOn) => addOn.id === addOnId)
)
const calculateDishPrice = (dish: Dish, customization?: DishCustomizationState): number => {
  const selected = customization ?? defaultCustomizationFor(dish)
  const baseOptionTotal = Object.entries(selected.baseOptions).reduce((sum, [groupId, optionId]) => {
    return sum + (findBaseOption(dish, groupId, optionId)?.price ?? 0)
  }, 0)
  const addOnTotal = selected.addOns.reduce((sum, addOnId) => sum + (findAddOn(dish, addOnId)?.price ?? 0), 0)
  return sellingPrice(dish.id, dish.price) + baseOptionTotal + addOnTotal
}
const isCustomizationState = (value: unknown): value is DishCustomizationState => {
  if (!value || typeof value !== 'object') return false
  const candidate = value as DishCustomizationState
  return (
    Boolean(candidate.baseOptions)
    && typeof candidate.baseOptions === 'object'
    && !Array.isArray(candidate.baseOptions)
    && Array.isArray(candidate.addOns)
  )
}
const filterTagIcons: Record<Tag, string> = {
  Vegan: 'leaf',
  Vegetarian: 'sprout',
  'Gluten-free': 'wheat-off',
  'Nut-free': 'spark',
  Spicy: 'flame',
  Quick: 'bolt',
  Popular: 'spark',
  'High protein': 'dumbbell',
  Shareable: 'group',
  Kids: 'smile',
  Comforting: 'spark',
}

const moodItems: Mood[] = ['Fresh', 'Comforting', 'Bold', 'Familiar']
const heartyCategories: Category[] = ['Burritos', 'Burgers', 'Sandwiches', 'Brunch']

const ui: Record<Locale, AppCopy> = {
  EN: {
    languageLabel: 'Language selector',
    languagePlaceholder: 'Language',
    languageOptions: 'Language options',
    languageNames: {
      EN: 'English',
      FR: 'French',
      ZH: 'Mandarin',
      ES: 'Spanish',
    },
    languageSoon: 'Soon',
    restaurantName: 'Utopia cafe & grill',
    established: 'Established 1995',
    reviewsFromWeb: 'Reviews from the web',
    reviewVotes: (count: number) => `${count.toLocaleString('en-CA')} votes`,
    reviewCount: (count: number) => `${count.toLocaleString('en-CA')} reviews`,
    address: '586 college st.',
    mealLabel: 'Meal period',
    mealOptions: 'Meal options',
    meals: {
      Dinner: 'Dinner',
      Lunch: 'Lunch',
      Brunch: 'Brunch',
    },
    hoursLabel: 'Open',
    photosLabel: 'Restaurant photo',
    draftLabel: 'public menu draft',
    dismissMessage: 'Dismiss message',
    allergyReminder: {
      title: 'Allergy reminder',
      description: 'Please speak to your server about ingredients and cross-contamination before ordering.',
    },
    readyForServer: {
      title: 'Ready for your server',
      description: 'Show this shortlist to your server when you are ready to order.',
    },
    nav: {
      primary: 'Primary navigation',
      menu: 'Menu',
      choose: 'Choose',
      shortlist: 'Shortlist',
    },
    cart: {
      itemsAdded: (count: number) => `${count} ${count === 1 ? 'Item' : 'Items'} added`,
      viewCart: 'View Shortlist',
    },
    sourceNote: 'Menu imported from public delivery listings. Confirm prices, allergens, availability, and nutrition with Utopia before launch.',
    promo: {
      title: "Today's kitchen extras",
      body: 'These plates need a home tonight. 20% off today only.',
      offLabel: '20% OFF TODAY',
      add: 'Add',
    },
    upsell: {
      title: 'Make it a plate',
      body: (name: string) => `Guests often add these with ${name}.`,
      add: 'Add',
      skip: 'No thanks',
    },
    menu: {
      mostOrdered: 'MOST ORDERED',
      heroTitle: 'Burritos, burgers, brunch and comfort plates.',
      heroBody: 'Built from the public Utopia Cafe & Grill menu for the first working QR prototype.',
      sourceLink: 'View source note',
      searchLabel: 'Search the menu',
      searchPlaceholder: 'Search the menu',
      filtersLabel: 'Menu filters',
      clearAll: 'Clear all',
      browseMenu: 'Browse menu',
      helpMeChoose: 'Help me choose',
      exploreMenu: 'EXPLORE MENU',
      itemCount: (count: number) => `${count} items`,
      empty: 'No items match these filters. Try clearing one.',
      unavailable: 'Unavailable today',
      heroAdd: 'Add',
      heroKicker: 'Seasonal special',
    },
    detail: {
      back: 'Menu',
      menuDescription: 'MENU DESCRIPTION',
      dietary: 'DIETARY & ALLERGY',
      dietaryBody: 'Dietary tags are interpreted from public menu text and must be checked with the restaurant before launch.',
      speakToServer: 'Please speak to your server about allergies',
      nutrition: 'ESTIMATED NUTRITION',
      protein: 'protein',
      carbs: 'carbs',
      fat: 'fat',
      customisations: 'MAKE IT YOURS',
      baseOptionsTitle: 'Choices',
      addOnsTitle: 'Add-ons',
      selectUpTo: (max: number) => `Select upto ${max}`,
      required: 'Select any 1',
      free: 'Free',
      totalWithCustomizations: 'Total',
      pairingTitle: 'Goes well with',
      saved: 'Saved to shortlist',
      add: 'Add to shortlist',
      reviewTitle: 'Review summary',
      reviewSource: 'Based on user reviews from Google Maps, Yelp, etc.',
      explain: 'Explain this dish',
      explainClose: 'Close the story',
      explainKicker: 'THE STORY',
    },
    choose: {
      introLabel: 'FIND MY PLATE',
      progress: (current: number, total: number) => `Question ${current} of ${total}`,
      resultsLabel: 'FIND MY PLATE · YOUR MATCHES',
      resultsTitle: 'Three plates that match what you asked for',
      resultsBody: 'Curated from menu facts. No personal data is saved.',
      changeAnswers: 'Change answers',
      startAgain: 'Start again',
      saveAll: 'Save all three',
      browseByMood: 'Browse by mood instead',
      privacy: 'No sign-in. Nothing is saved after you leave, except your shortlist on this device.',
      whyPrefix: 'Why it fits',
      whyQuick: 'ready quickly',
      whyVegan: 'plant-powered',
      whyFallback: 'made for tonight',
      steps: [
        {
          key: 'hunger' as const,
          title: 'How hungry are you?',
          help: 'There is no wrong answer. You can change it later.',
          choices: [
            { value: 'Light' as Hunger, label: 'Light' },
            { value: 'Proper' as Hunger, label: 'Proper' },
            { value: 'Feast' as Hunger, label: 'Feast' },
          ],
        },
        {
          key: 'mood' as const,
          title: 'What sounds good right now?',
          help: 'Pick the one that fits. You can change it later.',
          choices: moodItems.map((value) => ({ value, label: value })),
        },
        {
          key: 'dietary' as const,
          title: 'Anything we should work around?',
          help: 'We only show tags interpreted from the public menu.',
          choices: [
            { value: 'Vegan' as DietaryPreference, label: 'Vegan' },
            { value: 'Vegetarian' as DietaryPreference, label: 'Vegetarian' },
            { value: 'Gluten-free' as DietaryPreference, label: 'Gluten-free' },
            { value: 'No preference' as DietaryPreference, label: 'No preference' },
          ],
        },
        {
          key: 'time' as const,
          title: 'How much time do you have?',
          help: 'We will prioritise dishes ready sooner.',
          choices: [
            { value: 'Quick' as TimePreference, label: 'Quick' },
            { value: 'No rush' as TimePreference, label: 'No rush' },
          ],
        },
      ],
    },
    moods: {
      label: 'BROWSE BY MOOD',
      title: 'What sounds right, right now?',
      body: 'No questions, no data. Just a more intuitive way to browse.',
      cards: {
        Fresh: { title: 'Bright & fresh', cta: 'Choose Fresh' },
        Comforting: { title: 'Big comfort', cta: 'Choose Comforting' },
        Bold: { title: 'Spicy adventure', cta: 'Choose Bold' },
        Familiar: { title: 'Something familiar', cta: 'Choose Familiar' },
      },
    },
    shortlist: {
      label: 'YOUR SHORTLIST',
      title: 'Ready to order',
      body: 'Show this to your server. Nothing is sent to the kitchen.',
      orderReady: 'Order-ready',
      remove: (name: string) => `Remove ${name}`,
      totalLabel: 'Order-ready items',
      totalNote: 'Prices are draft values from public listings.',
      alertTitle: 'Note for the server',
      alertBody: 'Ask about allergy options before ordering.',
      showToServer: 'Show to server',
      emptyTitle: 'Your shortlist is empty',
      emptyBody: 'Save dishes to keep a calm, order-ready list.',
      orderedCta: 'I have ordered',
      enjoyTitle: 'Enjoy your meal',
      enjoyBody: 'Utopia will take it from here. See you at the table.',
    },
    chef: {
      sectionLabel: 'MEET THE CHEF RECOMMENDATION',
      sectionTitle: "Maya's picks for tonight",
      sectionBody: 'A quick guide from the kitchen to the dishes that feel most like Utopia.',
      cardCta: 'Read the story',
      back: 'Menu',
      profileLabel: 'CHEF STORY',
      storyTitle: 'A neighborhood menu with a little spark',
      recommendationsTitle: "Maya's top recommendations",
      recommendationBody: 'Three dishes she would send first when someone wants the full Utopia mood.',
    },
  },
  FR: {
    languageLabel: 'Selecteur de langue',
    languagePlaceholder: 'Langue',
    languageOptions: 'Options de langue',
    languageNames: {
      EN: 'Anglais',
      FR: 'Francais',
      ZH: 'Mandarin',
      ES: 'Espagnol',
    },
    languageSoon: 'Bientot',
    restaurantName: 'Utopia cafe & grill',
    established: 'Depuis 1995',
    reviewsFromWeb: 'Avis du web',
    reviewVotes: (count: number) => `${count.toLocaleString('fr-CA')} votes`,
    reviewCount: (count: number) => `${count.toLocaleString('fr-CA')} avis`,
    address: '586 college st.',
    mealLabel: 'Service',
    mealOptions: 'Options de service',
    meals: {
      Dinner: 'Diner',
      Lunch: 'Dejeuner',
      Brunch: 'Brunch',
    },
    hoursLabel: 'Ouvert',
    photosLabel: 'Photo du restaurant',
    draftLabel: 'ebauche de menu public',
    dismissMessage: 'Fermer le message',
    allergyReminder: {
      title: 'Rappel allergies',
      description: 'Veuillez parler a votre serveur des ingredients et des risques de contamination croisee avant de commander.',
    },
    readyForServer: {
      title: 'Pret pour votre serveur',
      description: 'Montrez cette liste courte a votre serveur lorsque vous etes pret a commander.',
    },
    nav: {
      primary: 'Navigation principale',
      menu: 'Menu',
      choose: 'Choisir',
      shortlist: 'Liste courte',
    },
    cart: {
      itemsAdded: (count: number) => `${count} ${count === 1 ? 'Article ajoute' : 'Articles ajoutes'}`,
      viewCart: 'Voir la liste',
    },
    sourceNote: 'Menu importe a partir de listings publics de livraison. Confirmez les prix, allergenes, disponibilites et valeurs nutritives avec Utopia avant la mise en ligne.',
    promo: {
      title: 'Les extras du jour',
      body: 'Ces plats doivent partir ce soir. 20 % de rabais aujourd hui seulement.',
      offLabel: '20 % AUJOURD HUI',
      add: 'Ajouter',
    },
    upsell: {
      title: 'Completez l assiette',
      body: (name: string) => `Les clients ajoutent souvent ceci avec ${name}.`,
      add: 'Ajouter',
      skip: 'Non merci',
    },
    menu: {
      mostOrdered: 'LES PLUS COMMANDES',
      heroTitle: 'Burritos, burgers, brunch et assiettes reconfortantes.',
      heroBody: 'Construit a partir du menu public de Utopia Cafe & Grill pour le premier prototype QR fonctionnel.',
      sourceLink: 'Voir la note source',
      searchLabel: 'Rechercher dans le menu',
      searchPlaceholder: 'Rechercher dans le menu',
      filtersLabel: 'Filtres du menu',
      clearAll: 'Tout effacer',
      browseMenu: 'Parcourir le menu',
      helpMeChoose: 'Aidez-moi a choisir',
      exploreMenu: 'EXPLORER LE MENU',
      itemCount: (count: number) => `${count} articles`,
      empty: 'Aucun article ne correspond a ces filtres. Essayez d en retirer un.',
      unavailable: 'Indisponible aujourd hui',
      heroAdd: 'Ajouter',
      heroKicker: 'Special saisonnier',
    },
    detail: {
      back: 'Menu',
      menuDescription: 'DESCRIPTION DU MENU',
      dietary: 'REGIMES ET ALLERGIES',
      dietaryBody: 'Les etiquettes alimentaires sont interpretees a partir du texte public du menu et doivent etre verifiees avec le restaurant avant le lancement.',
      speakToServer: 'Veuillez parler a votre serveur des allergies',
      nutrition: 'VALEURS NUTRITIVES ESTIMEES',
      protein: 'proteines',
      carbs: 'glucides',
      fat: 'lipides',
      customisations: 'PERSONNALISEZ-LE',
      baseOptionsTitle: 'Choix',
      addOnsTitle: 'Extras',
      selectUpTo: (max: number) => `Choisissez jusqu a ${max}`,
      required: 'Choisissez 1',
      free: 'Gratuit',
      totalWithCustomizations: 'Total',
      pairingTitle: 'Se marie bien avec',
      saved: 'Ajoute a la liste courte',
      add: 'Ajouter a la liste courte',
      reviewTitle: 'Resume des avis',
      reviewSource: 'D apres les avis des clients sur Google Maps, Yelp, etc.',
      explain: 'Expliquer ce plat',
      explainClose: 'Fermer l histoire',
      explainKicker: 'L HISTOIRE',
    },
    choose: {
      introLabel: 'TROUVEZ MON ASSIETTE',
      progress: (current: number, total: number) => `Question ${current} sur ${total}`,
      resultsLabel: 'TROUVEZ MON ASSIETTE · VOS CHOIX',
      resultsTitle: 'Trois assiettes qui correspondent a ce que vous avez demande',
      resultsBody: 'Selectionne a partir des donnees du menu. Aucune donnee personnelle n est enregistree.',
      changeAnswers: 'Modifier les reponses',
      startAgain: 'Recommencer',
      saveAll: 'Enregistrer les trois',
      browseByMood: 'Parcourir par ambiance',
      privacy: 'Aucune connexion. Rien n est enregistre apres votre depart, sauf votre liste courte sur cet appareil.',
      whyPrefix: 'Pourquoi ca convient',
      whyQuick: 'pret rapidement',
      whyVegan: '100 % vegetal',
      whyFallback: 'parfait pour ce soir',
      steps: [
        {
          key: 'hunger' as const,
          title: 'Quelle est votre faim?',
          help: 'Il n y a pas de mauvaise reponse. Vous pourrez changer plus tard.',
          choices: [
            { value: 'Light' as Hunger, label: 'Legere' },
            { value: 'Proper' as Hunger, label: 'Normale' },
            { value: 'Feast' as Hunger, label: 'Festin' },
          ],
        },
        {
          key: 'mood' as const,
          title: 'Qu est-ce qui vous tente en ce moment?',
          help: 'Choisissez ce qui vous ressemble. Vous pourrez changer plus tard.',
          choices: [
            { value: 'Fresh' as Mood, label: 'Frais' },
            { value: 'Comforting' as Mood, label: 'Reconfortant' },
            { value: 'Bold' as Mood, label: 'Audacieux' },
            { value: 'Familiar' as Mood, label: 'Classique' },
          ],
        },
        {
          key: 'dietary' as const,
          title: 'Y a-t-il quelque chose a eviter?',
          help: 'Nous affichons seulement les etiquettes interpretees a partir du menu public.',
          choices: [
            { value: 'Vegan' as DietaryPreference, label: 'Vegan' },
            { value: 'Vegetarian' as DietaryPreference, label: 'Vegetarien' },
            { value: 'Gluten-free' as DietaryPreference, label: 'Sans gluten' },
            { value: 'No preference' as DietaryPreference, label: 'Aucune preference' },
          ],
        },
        {
          key: 'time' as const,
          title: 'Combien de temps avez-vous?',
          help: 'Nous donnerons priorite aux plats prepares plus rapidement.',
          choices: [
            { value: 'Quick' as TimePreference, label: 'Rapide' },
            { value: 'No rush' as TimePreference, label: 'Pas de presse' },
          ],
        },
      ],
    },
    moods: {
      label: 'PARCOURIR PAR AMBIANCE',
      title: 'Qu est-ce qui semble juste, maintenant?',
      body: 'Aucune question, aucune donnee. Juste une facon plus intuitive de parcourir.',
      cards: {
        Fresh: { title: 'Clair et frais', cta: 'Choisir Frais' },
        Comforting: { title: 'Grand reconfort', cta: 'Choisir Reconfortant' },
        Bold: { title: 'Aventure epicee', cta: 'Choisir Audacieux' },
        Familiar: { title: 'Quelque chose de connu', cta: 'Choisir Classique' },
      },
    },
    shortlist: {
      label: 'VOTRE LISTE COURTE',
      title: 'Pret a commander',
      body: 'Montrez-la a votre serveur. Rien n est envoye en cuisine.',
      orderReady: 'Pret a commander',
      remove: (name: string) => `Retirer ${name}`,
      totalLabel: 'Articles prets a commander',
      totalNote: 'Les prix sont des valeurs provisoires provenant de listings publics.',
      alertTitle: 'Note pour le serveur',
      alertBody: 'Demandez les options pour allergies avant de commander.',
      showToServer: 'Montrer au serveur',
      emptyTitle: 'Votre liste courte est vide',
      emptyBody: 'Enregistrez des plats pour garder une liste calme et prete a commander.',
      orderedCta: 'J ai commande',
      enjoyTitle: 'Bon appetit',
      enjoyBody: 'Utopia s occupe du reste. A table.',
    },
    chef: {
      sectionLabel: 'RECOMMANDATION DU CHEF',
      sectionTitle: 'Les choix de Maya pour ce soir',
      sectionBody: 'Un guide rapide de la cuisine vers les plats qui ressemblent le plus a Utopia.',
      cardCta: 'Lire son histoire',
      back: 'Menu',
      profileLabel: 'HISTOIRE DU CHEF',
      storyTitle: 'Un menu de quartier avec une touche vive',
      recommendationsTitle: 'Les meilleures recommandations de Maya',
      recommendationBody: 'Trois plats qu elle proposerait d abord pour retrouver toute l ambiance Utopia.',
    },
  },
}

function Icon({ name, className }: { name: string; className?: string }) {
  switch (name) {
    case 'menu':
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
        </svg>
      )
    case 'back':
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M15 5 8 12l7 7" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
        </svg>
      )
    case 'magic':
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
          <path d="m5 19 6.2-6.2m3-3L20 4m-8 2 1.2 2.8L16 10l-2.8 1.2L12 14l-1.2-2.8L8 10l2.8-1.2L12 6Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
        </svg>
      )
    case 'bookmark':
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7 5.5A1.5 1.5 0 0 1 8.5 4h7A1.5 1.5 0 0 1 17 5.5V20l-5-3-5 3V5.5Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
        </svg>
      )
    case 'heart':
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 21c-1.2-1-5-4.6-5-8.5A3.5 3.5 0 0 1 10.5 9a3.5 3.5 0 0 1 1.5.35 3.5 3.5 0 0 1 1.5-.35 3.5 3.5 0 0 1 3.5 3.5c0 3.9-3.8 7.5-5 8.5Z" fill="currentColor" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
        </svg>
      )
    case 'leaf':
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 14c0-5 4.5-8 12-8 0 7.5-3 12-8 12-2.2 0-4-1.8-4-4Zm2.5 2.5L17 8" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
        </svg>
      )
    case 'sprout':
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 20v-7m0 0C9.5 13 7 11.5 7 8c3 0 5.5 1.2 7 4.2C15.5 9.2 18 8 21 8c0 3.5-2.5 5-5 5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
        </svg>
      )
    case 'wheat-off':
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 4 18 20M12 4v16m-4-9c1 0 2-.8 2-2M8 15c1 0 2-.8 2-2m4 0c1 0 2-.8 2-2m-4 7c1 0 2-.8 2-2" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
        </svg>
      )
    case 'flame':
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 20a5 5 0 0 0 5-5c0-4-3-5.3-3-8 0-1.4.3-2.2 1-3-4 1-7 4.7-7 8.5A5.5 5.5 0 0 0 12 20Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
        </svg>
      )
    case 'bolt':
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M13 3 6 13h5l-1 8 7-10h-5l1-8Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
        </svg>
      )
    case 'dumbbell':
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 10v4m2-6v8m12-8v8m2-6v4M6 12h12" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
        </svg>
      )
    case 'smile':
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8.5 10h.01M15.5 10h.01M8 14c1 1.3 2.3 2 4 2s3-.7 4-2m4-2a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
        </svg>
      )
    case 'group':
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M9 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm8 1a2.5 2.5 0 1 0 0-5m-8 12v-1a4 4 0 0 1 4-4h-8a4 4 0 0 0-4 4v1m16 0v-1c0-1.7-1-3.2-2.5-3.8" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
        </svg>
      )
    case 'thumbs-up':
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8 11v9H5.5A1.5 1.5 0 0 1 4 18.5v-6A1.5 1.5 0 0 1 5.5 11H8Zm0 0 2.2-5.2A2 2 0 0 1 12 4.7c.9 0 1.6.7 1.6 1.6V9h4.2a2 2 0 0 1 2 2.3l-1 7A2 2 0 0 1 16.8 20H8" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
        </svg>
      )
    case 'brunch':
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7 10h8v4a4 4 0 0 1-8 0v-4Zm8 1h1.5a2 2 0 0 1 0 4H15M6 19h11M6.5 6.5c.7.6.7 1.3 0 1.9m4-1.9c.7.6.7 1.3 0 1.9m4-1.9c.7.6.7 1.3 0 1.9" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
        </svg>
      )
    case 'lunch':
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 6.5v-2m0 15v-2m5.3-10.8 1.4-1.4M5.3 18.7l1.4-1.4m10.6 0 1.4 1.4M5.3 5.3l1.4 1.4M4.5 12h2m11 0h2M15.5 12a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
        </svg>
      )
    case 'dinner':
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M16.5 18.5A7 7 0 0 1 9.4 7.1 6 6 0 1 0 16.5 18.5ZM17 5l.5 1.5L19 7l-1.5.5L17 9l-.5-1.5L15 7l1.5-.5L17 5Zm3 6 .4 1 .9.4-.9.3-.4 1-.3-1-.9-.3.9-.4.3-1Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
        </svg>
      )
    case 'spark':
    default:
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
          <path d="m12 4 1.6 4.4L18 10l-4.4 1.6L12 16l-1.6-4.4L6 10l4.4-1.6L12 4Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
        </svg>
      )
  }
}

function LogoMark() {
  return <span className="logo-mark" aria-hidden="true">u</span>
}

function Wordmark() {
  return (
    <span className="utopia-sign" aria-hidden="true">
      <span className="utopia-sign-type">utopia</span>
    </span>
  )
}

function DishArt({ dish, locale, large = false }: { dish: Dish; locale: Locale; large?: boolean }) {
  const label = `${locale === 'FR' ? 'Photo' : 'Photo'} ${localize(dish.name, locale)}`

  return (
    <div className={`dish-art ${dish.colour} ${large ? 'large' : ''}`} aria-label={label} role="img">
      {large ? (
        <FoodStage src={dish.image} />
      ) : (
        <img alt="" className="dish-art-image" src={dish.image} />
      )}
    </div>
  )
}

function Tags({ tags, locale, max }: { tags: Tag[]; locale: Locale; max?: number }) {
  return (
    <div className="tags">
      {tags.slice(0, max).map((tag) => (
        <Chip color="accent" key={tag} size="sm" variant="soft">
          {localize(tagLabels[tag], locale)}
        </Chip>
      ))}
    </div>
  )
}

/** QR menu shell: landing hero (name, 1995, web reviews) then browse / choose / shortlist. */
export function App() {
  const [view, setView] = useState<View>('menu')
  const previousView = useRef<View>('menu')
  const scrollPositionRef = useRef<number>(0)
  const [selected, setSelected] = useState<Dish | null>(null)
  const [activeFilters, setActiveFilters] = useState<Tag[]>([])
  const [search, setSearch] = useState('')
  const [language, setLanguage] = useState<Locale>(() => {
    const saved = localStorage.getItem('utopia-language')
    return saved === 'FR' ? 'FR' : 'EN'
  })
  const [meal, setMeal] = useState<MealPeriod>(() => mealFromDate())
  const [quantities, setQuantities] = useState<Record<string, number>>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('utopia-shortlist') || '{}')
      if (Array.isArray(saved)) {
        return Object.fromEntries(saved.filter(Boolean).map((id: string) => [id, 1]))
      }
      if (saved && typeof saved === 'object') {
        return Object.fromEntries(
          Object.entries(saved).filter((entry): entry is [string, number] => typeof entry[1] === 'number' && entry[1] > 0),
        )
      }
    } catch {
      return {}
    }
    return {}
  })
  const [dishCustomizations, setDishCustomizations] = useState<Record<string, DishCustomizationState>>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('utopia-dish-customizations') || '{}')
      if (saved && typeof saved === 'object' && !Array.isArray(saved)) {
        return Object.fromEntries(
          Object.entries(saved).filter((entry): entry is [string, DishCustomizationState] => isCustomizationState(entry[1])),
        )
      }
    } catch {
      return {}
    }
    return {}
  })
  const [answers, setAnswers] = useState<{ hunger?: Hunger; mood?: Mood; dietary?: DietaryPreference; time?: TimePreference }>({})
  const [question, setQuestion] = useState(0)
  const [serverMessage, setServerMessage] = useState<ServerMessage | null>(null)
  const [showShortlistModal, setShowShortlistModal] = useState(false)
  const [showDetailSheet, setShowDetailSheet] = useState(false)
  const [upsell, setUpsell] = useState<{ source: Dish; suggestions: PairingSuggestion[] } | null>(null)
  const [celebrate, setCelebrate] = useState(false)
  const celebrateTimer = useRef<number>(0)

  const [heroSlide, setHeroSlide] = useState(0)

  const copy = ui[language]

  // Room light follows the meal: Brunch/Lunch stay sunlit, Dinner goes navy night.
  useDayNightTheme(meal)

  useEffect(() => localStorage.setItem('utopia-shortlist', JSON.stringify(quantities)), [quantities])
  useEffect(() => localStorage.setItem('utopia-dish-customizations', JSON.stringify(dishCustomizations)), [dishCustomizations])
  useEffect(() => localStorage.setItem('utopia-language', language), [language])

  useEffect(() => {
    document.body.style.overflow = showShortlistModal || showDetailSheet || Boolean(upsell) || celebrate ? 'hidden' : ''
  }, [showShortlistModal, showDetailSheet, upsell, celebrate])

  useEffect(() => () => window.clearTimeout(celebrateTimer.current), [])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = window.setInterval(
      () => setHeroSlide((current) => (current + 1) % heroPhotos.length),
      heroSlideInterval,
    )
    return () => window.clearInterval(timer)
  }, [])

  const shownDishes = useMemo(() => dishes.filter((dish) => {
    const matchesFilter = activeFilters.every((tag) => dish.tags.includes(tag))
    const text = [
      localize(dish.name, language),
      localize(dish.summary, language),
      localize(categoryLabels[dish.category], language),
      localize(categoryCues[dish.category], language),
      ...dish.tags.map((tag) => localize(tagLabels[tag], language)),
    ].join(' ').toLowerCase()
    return matchesFilter && text.includes(search.toLowerCase())
  }), [activeFilters, language, search])

  const shortlistCount = Object.values(quantities).reduce((sum, count) => sum + count, 0)
  const shortlistItems = dishes.filter((dish) => quantities[dish.id])

  const navigate = (next: View) => {
    setView((current) => {
      if (next === 'search' && current !== 'search') previousView.current = current
      return next
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const closeSearch = () => {
    navigate(previousView.current === 'search' ? 'menu' : previousView.current)
  }

  const chooseDish = (dish: Dish) => {
    scrollPositionRef.current = window.scrollY
    setSelected(dish)
    setShowDetailSheet(true)
  }

  const ensureDishCustomization = (id: string) => {
    const dish = dishes.find((item) => item.id === id)
    if (!dish?.customizations) return
    setDishCustomizations((current) => current[id] ? current : { ...current, [id]: defaultCustomizationFor(dish) })
  }

  const setQuantity = (id: string, next: number) => {
    setQuantities((current) => {
      const updated = { ...current }
      if (next <= 0) {
        delete updated[id]
        setDishCustomizations(({ [id]: _removed, ...rest }) => rest)
      } else {
        updated[id] = next
        ensureDishCustomization(id)
      }
      return updated
    })
  }

  /** First add of a plate also opens pairing upsells. Later quantity changes stay quiet. */
  const addWithUpsell = (id: string) => {
    const dish = dishes.find((item) => item.id === id)
    if (!dish) {
      logWarn('addWithUpsell could not find dish', id)
      return
    }
    const already = Boolean(quantities[id])
    setQuantity(id, already ? (quantities[id] ?? 1) + 1 : 1)
    if (already) return
    const suggestions = upsellsFor(id, new Set([...Object.keys(quantities), id]))
    if (suggestions.length === 0) return
    setUpsell({ source: dish, suggestions })
  }

  /** Add from the upsell sheet without opening another upsell. */
  const addQuiet = (id: string) => {
    setQuantity(id, (quantities[id] ?? 0) + 1)
  }

  /** Guest already placed the order at the table: celebrate, empty the cart, return to the menu. */
  const finishOrder = () => {
    haptic('heavy')
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setCelebrate(true)
    setShowShortlistModal(false)
    setShowDetailSheet(false)
    setUpsell(null)
    setQuantities({})
    setDishCustomizations({})
    setView('menu')
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
    window.clearTimeout(celebrateTimer.current)
    celebrateTimer.current = window.setTimeout(() => {
      setCelebrate(false)
    }, reduceMotion ? 1400 : 2400)
  }

  const toggleShortlist = (id: string) => setQuantities((current) => {
    if (current[id]) {
      const updated = { ...current }
      delete updated[id]
      setDishCustomizations(({ [id]: _removed, ...rest }) => rest)
      return updated
    }
    ensureDishCustomization(id)
    return { ...current, [id]: 1 }
  })

  const updateDishCustomization = (id: string, customization: DishCustomizationState) => {
    setDishCustomizations((current) => ({ ...current, [id]: customization }))
  }

  const recommendations = useMemo(() => {
    return dishes
      .filter((dish) => dish.available && !['Drinks', 'Sides'].includes(dish.category))
      .map((dish) => {
        let score = dish.tags.includes('Popular') ? 1 : 0
        if (answers.dietary && answers.dietary !== 'No preference' && dish.tags.includes(answers.dietary)) score += 8
        if (answers.mood === 'Fresh' && (dish.tags.includes('Vegan') || ['field-mix-greens', 'utopia-good-life', 'seared-tuna-avocado-sandwich'].includes(dish.id))) score += 4
        if (answers.mood === 'Comforting' && ['poutine', 'utopia-burger', 'classic-grilled-cheese', 'breakfast-burrito', 'mactopia'].includes(dish.id)) score += 4
        if (answers.mood === 'Bold' && dish.tags.includes('Spicy')) score += 4
        if (answers.mood === 'Familiar' && dish.tags.includes('Popular')) score += 4
        if (answers.time === 'Quick' && dish.tags.includes('Quick')) score += 3
        if (answers.hunger === 'Feast' && heartyCategories.includes(dish.category)) score += 2
        return { dish, score }
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
  }, [answers])

  const showServerMessage = (message: ServerMessage) => {
    setServerMessage(message)
    window.requestAnimationFrame(() => document.getElementById('server-alert')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }))
  }

  return (
    <main className="site-shell">
      <div className="phone-frame">
        {view === 'menu' && (
        <header className="hero-header">
          <div className="hero-photos">
            {heroPhotos.map((src, index) => (
              <div
                className={`hero-photo-slide${index === heroSlide ? ' is-active' : ''}`}
                key={src}
              >
                <FoodStage src={src} />
              </div>
            ))}
            <div className="hero-photos-scrim" aria-hidden="true" />
            <div className="hero-photo-dots">
              {heroPhotos.map((src, index) => (
                <button
                  aria-label={`${copy.photosLabel} ${index + 1}`}
                  aria-pressed={index === heroSlide}
                  className={`hero-photo-dot${index === heroSlide ? ' is-active' : ''}`}
                  key={src}
                  type="button"
                  onClick={() => {
                    haptic('light')
                    setHeroSlide(index)
                  }}
                />
              ))}
            </div>
          </div>
          <div className="language-select">
            <Select
              aria-label={copy.languageLabel}
              className="header-select"
              placeholder={copy.languagePlaceholder}
              value={language}
              onChange={(value) => {
                haptic('light')
                value && setLanguage(value as Locale)
              }}
            >
              <Select.Trigger>
                <Select.Value>{language}</Select.Value>
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover placement="bottom end">
                <ListBox aria-label={copy.languageOptions}>
                  {languageMenu.map((option) => (
                    <ListBox.Item
                      className="language-option"
                      id={option.id}
                      isDisabled={!option.available}
                      key={option.id}
                      textValue={copy.languageNames[option.id]}
                    >
                      <Label>{copy.languageNames[option.id]}</Label>
                      {!option.available && (
                        <Chip className="language-soon" color="default" size="sm" variant="soft">
                          {copy.languageSoon}
                        </Chip>
                      )}
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
            </Select>
          </div>
          <div className="hero-info-card">
            <span className="hero-info-logo">
              <Wordmark />
            </span>
            <h1>{copy.restaurantName}</h1>
            <p className="established-year">{copy.established}</p>
            <WebReviews
              reviewsLabel={copy.reviewCount}
              title={copy.reviewsFromWeb}
              votesLabel={copy.reviewVotes}
            />
            <div className="hero-meta">
              <span>{copy.address}</span>
              <span aria-hidden="true">|</span>
              <Select
                aria-label={copy.mealLabel}
                className="header-select meal-select"
                value={meal}
                onChange={(value) => {
                  haptic('light')
                  value && setMeal(value as MealPeriod)
                }}
              >
                <Select.Trigger>
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox aria-label={copy.mealOptions}>
                    {meals.map((option) => (
                      <ListBox.Item className="meal-option" id={option} key={option} textValue={copy.meals[option]}>
                        <span className="meal-option-label">
                          <Icon className="meal-option-icon" name={mealIcons[option]} />
                          <Label>{copy.meals[option]}</Label>
                        </span>
                        <span className="meal-hours">{mealHours[option]}</span>
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
              </Select>
            </div>
            <div className="hero-hours">
              <span className="hero-hours-open">{copy.hoursLabel}</span>
              <span>{mealHours[meal]}</span>
            </div>
          </div>
          <SearchField
            aria-label={copy.menu.searchLabel}
            className="hero-search"
            fullWidth
            value={search}
            onChange={(value) => {
              setSearch(value)
              if (view !== 'menu' && view !== 'search') navigate('menu')
            }}
          >
            <SearchField.Group>
              <SearchField.SearchIcon />
              <SearchField.Input
                placeholder={copy.menu.searchPlaceholder}
                readOnly
                onClick={() => {
                  haptic('light')
                  navigate('search')
                }}
              />
              <SearchField.ClearButton />
            </SearchField.Group>
          </SearchField>
        </header>
        )}

        {serverMessage && (
          <div className="alert-wrap" id="server-alert">
            <Alert status={serverMessage.status}>
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>{serverMessage.title}</Alert.Title>
                <Alert.Description>{serverMessage.description}</Alert.Description>
              </Alert.Content>
              <CloseButton aria-label={copy.dismissMessage} onPress={() => {
                haptic('light')
                setServerMessage(null)
              }} />
            </Alert>
          </div>
        )}

        {view === 'menu' && (
          <MenuView
            activeFilters={activeFilters}
            chefStrings={copy.chef}
            locale={language}
            onAdd={addWithUpsell}
            promoStrings={copy.promo}
            onChef={() => navigate('chef')}
            onChoose={() => navigate('choose')}
            onClear={() => setActiveFilters([])}
            onDish={chooseDish}
            onFilters={setActiveFilters}
            onQuantity={setQuantity}
            quantities={quantities}
            shownDishes={shownDishes}
            strings={copy.menu}
          />
        )}
        {view === 'chef' && (
          <ChefView
            locale={language}
            onBack={() => navigate('menu')}
            onDish={chooseDish}
            strings={copy.chef}
          />
        )}
        {view === 'choose' && (
          <ChooseView
            answers={answers}
            locale={language}
            onAnswer={(key, value) => {
              setAnswers((current) => ({ ...current, [key]: value }))
              setQuestion((current) => Math.min(current + 1, 4))
            }}
            onBrowseMoods={() => navigate('moods')}
            onDish={chooseDish}
            onRestart={() => {
              setAnswers({})
              setQuestion(0)
            }}
            onClose={() => navigate('menu')}
            onSaveAll={() => {
              setQuantities(Object.fromEntries(recommendations.map(({ dish }) => [dish.id, 1])))
              setDishCustomizations((current) => ({
                ...current,
                ...Object.fromEntries(
                  recommendations
                    .map(({ dish }) => dish.customizations ? [dish.id, current[dish.id] ?? defaultCustomizationFor(dish)] : null)
                    .filter((entry): entry is [string, DishCustomizationState] => entry !== null),
                ),
              }))
            }}
            question={question}
            recommendations={recommendations.map((entry) => entry.dish)}
            strings={copy.choose}
          />
        )}
        {view === 'moods' && (
          <MoodView locale={language} onMood={(mood) => {
            setAnswers((current) => ({ ...current, mood }))
            setQuestion(4)
            navigate('choose')
          }} strings={copy.moods} />
        )}
        {view === 'search' && (
          <SearchView
            closeLabel={copy.detail.back}
            locale={language}
            results={shownDishes}
            search={search}
            strings={copy.menu}
            onClose={closeSearch}
            onDish={chooseDish}
            onSearch={setSearch}
          />
        )}
        {view === 'shortlist' && (
          <ShortlistView
            items={shortlistItems}
            customizations={dishCustomizations}
            locale={language}
            quantities={quantities}
            onRemove={toggleShortlist}
            onOrdered={finishOrder}
            strings={copy.shortlist}
          />
        )}

        {shortlistCount > 0 && view !== 'search' && view !== 'chef' && (
          <button className="cart-banner" type="button" onClick={() => {
            haptic('medium')
            setShowShortlistModal(true)
          }}>
            <span className="cart-banner-text">{copy.cart.itemsAdded(shortlistCount)}</span>
            <span className="cart-banner-button">
              {copy.cart.viewCart}
              <span aria-hidden="true">→</span>
            </span>
          </button>
        )}

        {showShortlistModal && (
          <>
            <div className="modal-overlay" onClick={() => {
              haptic('light')
              setShowShortlistModal(false)
            }} />
            <div className="bottom-sheet">
              <div className="bottom-sheet-handle" />
              <button className="bottom-sheet-close" type="button" onClick={() => {
                haptic('light')
                setShowShortlistModal(false)
              }} aria-label={copy.dismissMessage}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6l-12 12m0-12l12 12" />
                </svg>
              </button>
              <ShortlistView
                items={shortlistItems}
                customizations={dishCustomizations}
                locale={language}
                quantities={quantities}
                onRemove={toggleShortlist}
                onOrdered={finishOrder}
                strings={copy.shortlist}
              />
            </div>
          </>
        )}

        {showDetailSheet && selected && (
          <>
            <div className="modal-overlay" onClick={() => {
              haptic('light')
              setShowDetailSheet(false)
              window.scrollTo({ top: scrollPositionRef.current, behavior: 'auto' })
            }} />
            <div className="bottom-sheet bottom-sheet-detail">
              <button className="bottom-sheet-close" type="button" onClick={() => {
                haptic('light')
                setShowDetailSheet(false)
                window.scrollTo({ top: scrollPositionRef.current, behavior: 'auto' })
              }} aria-label={copy.dismissMessage}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6l-12 12m0-12l12 12" />
                </svg>
              </button>
              <DetailView
                dish={selected}
                customization={dishCustomizations[selected.id] ?? defaultCustomizationFor(selected)}
                locale={language}
                onAllergy={() => {
                  haptic('light')
                  showServerMessage({
                    title: copy.allergyReminder.title,
                    description: copy.allergyReminder.description,
                    status: 'warning',
                  })
                }}
                onBack={() => {
                  haptic('light')
                  setShowDetailSheet(false)
                  window.scrollTo({ top: scrollPositionRef.current, behavior: 'auto' })
                }}
                onPairing={chooseDish}
                onSave={() => {
                  haptic('medium')
                  if (quantities[selected.id]) {
                    toggleShortlist(selected.id)
                  } else {
                    addWithUpsell(selected.id)
                  }
                  setShowDetailSheet(false)
                  window.scrollTo({ top: scrollPositionRef.current, behavior: 'auto' })
                }}
                onCustomizationChange={(customization) => updateDishCustomization(selected.id, customization)}
                saved={Boolean(quantities[selected.id])}
                strings={copy.detail}
              />
            </div>
          </>
        )}

        {upsell && (
          <>
            <div className="modal-overlay" onClick={() => {
              haptic('light')
              setUpsell(null)
            }} />
            <div className="bottom-sheet upsell-sheet-frame">
              <div className="bottom-sheet-handle" />
              <button className="bottom-sheet-close" type="button" onClick={() => {
                haptic('light')
                setUpsell(null)
              }} aria-label={copy.dismissMessage}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6l-12 12m0-12l12 12" />
                </svg>
              </button>
              <UpsellSheet
                locale={language}
                money={money}
                onAdd={(id) => {
                  addQuiet(id)
                  setUpsell((current) => {
                    if (!current) return null
                    const remaining = current.suggestions.filter((entry) => entry.id !== id)
                    return remaining.length ? { ...current, suggestions: remaining } : null
                  })
                }}
                onClose={() => setUpsell(null)}
                onHaptic={haptic}
                source={upsell.source}
                strings={copy.upsell}
                suggestions={upsell.suggestions}
              />
            </div>
          </>
        )}

        {celebrate && (
          <OrderCelebrate
            title={copy.shortlist.enjoyTitle}
            body={copy.shortlist.enjoyBody}
          />
        )}
      </div>
    </main>
  )
}

type SearchViewProps = {
  search: string
  results: Dish[]
  onSearch: (value: string) => void
  onClose: () => void
  onDish: (dish: Dish) => void
  locale: Locale
  closeLabel: string
  strings: MenuStrings
}

function SearchView({ search, results, onSearch, onClose, onDish, locale, closeLabel, strings }: SearchViewProps) {
  const query = search.trim()
  const inputRef = useRef<HTMLInputElement>(null)

  useLayoutEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    const focusInput = () => inputRef.current?.focus()
    const frame = window.requestAnimationFrame(focusInput)
    const timeout = window.setTimeout(focusInput, 50)
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.cancelAnimationFrame(frame)
      window.clearTimeout(timeout)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [onClose])

  return (
    <section className="search-page" aria-label={strings.searchLabel}>
      <div className="search-page-bar">
        <Button
          aria-label={closeLabel}
          className="search-page-back"
          size="sm"
          variant="ghost"
          onPress={() => {
            haptic('light')
            onClose()
          }}
        >
          <Icon className="search-page-back-icon" name="back" />
        </Button>
        <SearchField
          aria-label={strings.searchLabel}
          className="search-page-field"
          fullWidth
          value={search}
          onChange={onSearch}
        >
          <SearchField.Group>
            <SearchField.SearchIcon />
            <SearchField.Input autoFocus placeholder={strings.searchPlaceholder} ref={inputRef} />
            <SearchField.ClearButton />
          </SearchField.Group>
        </SearchField>
      </div>
      {query ? (
        <div className="search-page-results">
          {results.length
            ? results.map((dish) => (
              <DishRow
                dish={dish}
                key={dish.id}
                locale={locale}
                unavailableLabel={strings.unavailable}
                onPress={() => onDish(dish)}
              />
            ))
            : <p className="empty">{strings.empty}</p>}
        </div>
      ) : (
          <button className="search-page-dismiss" type="button" onClick={() => {
            haptic('light')
            onClose()
          }} tabIndex={-1} aria-label={closeLabel} />
      )}
    </section>
  )
}

function QuantityStepper({
  value,
  onChange,
  className,
}: {
  value: number
  onChange: (next: number) => void
  className?: string
}) {
  return (
    <div
      className={`quantity-stepper ${className ?? ''}`.trim()}
      onClick={(event) => event.stopPropagation()}
      onPointerDown={(event) => event.stopPropagation()}
    >
      <button
        aria-label="-"
        className={value <= 1 ? 'quantity-stepper-minus-muted' : undefined}
        type="button"
        onClick={() => {
          haptic('light')
          onChange(value - 1)
        }}
      >
        −
      </button>
      <span>{value}</span>
      <button aria-label="+" type="button" onClick={() => {
        haptic('light')
        onChange(value + 1)
      }}>
        +
      </button>
    </div>
  )
}

function ChefView({ locale, onBack, onDish, strings }: { locale: Locale; onBack: () => void; onDish: (dish: Dish) => void; strings: ChefStrings }) {
  const recommendedDishes = chefProfile.recommendations
    .map((id) => dishes.find((dish) => dish.id === id))
    .filter((dish): dish is Dish => Boolean(dish))

  return (
    <section className="chef-view">
      <div className="chef-view-hero">
        <img alt="" className="chef-view-image" src={chefProfile.image} />
        <div className="chef-view-scrim" aria-hidden="true" />
        <Button className="chef-view-back" size="sm" variant="ghost" onPress={() => {
          haptic('light')
          onBack()
        }}>
          <Icon className="chef-view-back-icon" name="back" />
          <span>{strings.back}</span>
        </Button>
        <div className="chef-view-title">
          <span className="section-label">{strings.profileLabel}</span>
          <h2>{chefProfile.name}</h2>
          <p>{chefProfile.role}</p>
        </div>
      </div>

      <div className="chef-view-content">
        <section className="chef-story-card">
          <span className="section-label">{strings.storyTitle}</span>
          <p>{localize(chefProfile.story, locale)}</p>
        </section>

        <section className="chef-recommendations" aria-labelledby="chef-recommendations-title">
          <div className="chef-recommendations-heading">
            <span className="section-label">{strings.recommendationsTitle}</span>
            <p>{strings.recommendationBody}</p>
          </div>
          <div className="chef-recommendation-track" role="list">
            {recommendedDishes.map((dish) => (
              <button className="chef-recommendation-card" key={dish.id} type="button" role="listitem" onClick={() => {
                haptic('medium')
                onDish(dish)
              }}>
                <FoodStage src={dish.image} />
                <span>
                  <strong>{localize(dish.name, locale)}</strong>
                  <small><PriceDisplay dish={dish} /></small>
                </span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </section>
  )
}

function MostLovedSection({ locale, onDish, onAdd, onQuantity, quantities }: { locale: Locale; onDish: (dish: Dish) => void; onAdd: (id: string) => void; onQuantity: (id: string, next: number) => void; quantities: Record<string, number> }) {
  const lovedDishes = mostLovedDishes
    .map((loved) => {
      const dish = dishes.find((d) => d.id === loved.id)
      return dish ? { dish, quote: loved.quote } : null
    })
    .filter((item): item is { dish: Dish; quote: LocalizedText } => item !== null)

  return (
    <section className="most-loved-section" aria-label={locale === 'FR' ? 'les plus aimes' : 'most loved'}>
      <div className="most-loved-header">
        <Icon className="most-loved-heart" name="heart" />
        <span className="most-loved-title">{locale === 'FR' ? 'les plus aimés' : 'most loved'}</span>
      </div>
      <div className="most-loved-track" role="list">
        {lovedDishes.map(({ dish, quote }) => (
          <article className="most-loved-card" key={dish.id} role="listitem">
            <button className="most-loved-card-button" type="button" onClick={() => {
              haptic('medium')
              onDish(dish)
            }}>
              <div className="most-loved-card-image-wrap">
                <FoodStage src={dish.image} />
              </div>
              <div className="most-loved-card-content">
                <div className="most-loved-card-header">
                  <div style={{ display: 'grid', gap: '0.15rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      {dish.tags.includes('Vegetarian') && (
                        <Icon className="most-loved-card-tag-icon" name="sprout" />
                      )}
                      {dish.tags.includes('Vegan') && (
                        <Icon className="most-loved-card-tag-icon" name="leaf" />
                      )}
                      <span className="most-loved-card-name">{localize(dish.name, locale)}</span>
                    </div>
                    <span className="most-loved-card-price"><PriceDisplay dish={dish} /></span>
                  </div>
                  {quantities[dish.id] ? (
                    <QuantityStepper
                      className="most-loved-stepper"
                      value={quantities[dish.id]}
                      onChange={(next) => onQuantity(dish.id, next)}
                    />
                  ) : (
                    <Button
                      className="most-loved-card-add"
                      size="sm"
                      onClick={(event) => {
                        haptic('medium')
                        event.stopPropagation()
                        onAdd(dish.id)
                      }}
                    >
                      {locale === 'FR' ? 'Ajouter' : 'Add'}
                    </Button>
                  )}
                </div>
                <p className="most-loved-card-quote">
                  <span>❤️</span>
                  <span>{localize(quote, locale)}</span>
                </p>
              </div>
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}

type MenuViewProps = {
  shownDishes: Dish[]
  activeFilters: Tag[]
  onFilters: (tags: Tag[]) => void
  onClear: () => void
  onDish: (dish: Dish) => void
  onChef: () => void
  onChoose: () => void
  onAdd: (id: string) => void
  onQuantity: (id: string, next: number) => void
  quantities: Record<string, number>
  locale: Locale
  strings: MenuStrings
  chefStrings: ChefStrings
  promoStrings: PromoCopy
}

function MenuView({ shownDishes, activeFilters, onFilters, onClear, onDish, onChef, onChoose, onAdd, onQuantity, quantities, locale, strings, chefStrings, promoStrings }: MenuViewProps) {
  return (
    <section className="view menu-view">
      <TodaysPromos
        locale={locale}
        money={money}
        onAdd={onAdd}
        onDish={(id) => {
          const dish = dishes.find((item) => item.id === id)
          if (dish) onDish(dish)
        }}
        onHaptic={haptic}
        quantities={quantities}
        renderStepper={(id, value) => (
          <QuantityStepper className="todays-promo-stepper" value={value} onChange={(next) => onQuantity(id, next)} />
        )}
        strings={promoStrings}
      />

      <MostLovedSection
        locale={locale}
        onAdd={onAdd}
        onDish={onDish}
        onQuantity={onQuantity}
        quantities={quantities}
      />

      <section className="chef-feature" aria-labelledby="chef-feature-title">
        <button className="chef-feature-card" type="button" onClick={() => {
          haptic('medium')
          onChef()
        }}>
          <img alt="" className="chef-feature-image" src={chefProfile.image} />
          <span className="chef-feature-scrim" aria-hidden="true" />
          <span className="chef-feature-copy">
            <span className="chef-feature-kicker">{chefStrings.sectionLabel}</span>
            <strong id="chef-feature-title">{chefStrings.sectionTitle}</strong>
            <span>{chefStrings.sectionBody}</span>
          </span>
        </button>
      </section>

      <section className="discovery-banner" onClick={() => {
        haptic('medium')
        onChoose()
      }}>
        <div className="discovery-banner-content">
          <div className="discovery-banner-copy">
            <h3>{locale === 'FR' ? 'Besoin d\'inspiration?' : "Find your next favorite"}</h3>
            <p>
              {locale === 'FR'
                ? 'Dites-nous ce qui vous inspire et nous trouverons le plat parfait pour vos envies'
                : "Tell us your vibe and we'll find the dish that matches your hunger"}
            </p>
            <span className="discovery-banner-cta">
              {locale === 'FR' ? 'Commencer →' : 'Explore →'}
            </span>
          </div>
          <div className="discovery-banner-art" aria-hidden="true">
            <span className="discovery-sparkle discovery-sparkle-1">✦</span>
            <span className="discovery-sparkle discovery-sparkle-2">✦</span>
            <span className="discovery-sparkle discovery-sparkle-3">✨</span>
          </div>
        </div>
      </section>

      <div className="filter-row">
        <ToggleButtonGroup
          aria-label={strings.filtersLabel}
          isDetached
          selectedKeys={activeFilters}
          selectionMode="multiple"
          size="sm"
          onSelectionChange={(keys) => {
            haptic('light')
            onFilters(Array.from(keys) as Tag[])
          }}
        >
          {filterTags.map((tag) => (
            <ToggleButton className="filter-chip" id={tag} key={tag}>
              <Icon className="filter-chip-icon" name={filterTagIcons[tag]} />
              <span>{localize(tagLabels[tag], locale)}</span>
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        {activeFilters.length > 0 && (
          <Button size="sm" variant="ghost" onPress={() => {
            haptic('light')
            onClear()
          }}>{strings.clearAll}</Button>
        )}
      </div>

      <details className="category-accordion">
        <summary>
          <span className="section-label">{strings.exploreMenu}</span>
        </summary>
        <div className="category-index">
          <Separator />
          {categories.map((name) => (
            <div className="category-link" key={name}>
              <Button fullWidth variant="ghost" onPress={() => {
                haptic('light')
                document.getElementById(categoryId(name))?.scrollIntoView({ behavior: 'smooth' })
              }}>
                <span className="category-link-copy">
                  <strong>{localize(categoryLabels[name], locale)}</strong>
                  <span>{localize(categoryCues[name], locale)} · {dishes.filter((dish) => dish.category === name).length}</span>
                </span>
              </Button>
              <Separator />
            </div>
          ))}
        </div>
      </details>

      {categories.map((category) => {
        const inCategory = shownDishes.filter((dish) => dish.category === category)
        return (
          <section className="menu-category" id={categoryId(category)} key={category}>
            <div className="category-heading">
              <div>
                <h2>{localize(categoryLabels[category], locale)}</h2>
                <p>{localize(categoryCues[category], locale)}</p>
              </div>
              <span>{strings.itemCount(inCategory.length)}</span>
            </div>
            <Separator />
            {inCategory.length
              ? inCategory.map((dish) => <DishRow dish={dish} locale={locale} onPress={() => onDish(dish)} key={dish.id} unavailableLabel={strings.unavailable} />)
              : <p className="empty">{strings.empty}</p>}
          </section>
        )
      })}
    </section>
  )
}

function DishRow({ dish, locale, onPress, why, unavailableLabel }: { dish: Dish; locale: Locale; onPress: () => void; why?: string; unavailableLabel?: string }) {
  return (
    <div className="dish-card-wrap">
      <Button className="dish-row-button" fullWidth isDisabled={!dish.available} variant="ghost" onPress={() => {
        haptic('medium')
        onPress()
      }}>
        <span className="dish-row-content">
          <span className="dish-copy">
            <Tags tags={dish.tags} locale={locale} max={2} />
            <strong className="dish-name">{localize(dish.name, locale)}</strong>
            <span className="dish-summary">{localize(dish.summary, locale)}</span>
            {why && <span className="dish-reason">{why}</span>}
            <PriceDisplay dish={dish} />
            {!dish.available && unavailableLabel && <Chip color="danger" size="sm" variant="soft">{unavailableLabel}</Chip>}
          </span>
          <DishArt dish={dish} locale={locale} />
        </span>
      </Button>
    </div>
  )
}

type DetailViewProps = {
  dish: Dish
  customization: DishCustomizationState
  saved: boolean
  onBack: () => void
  onSave: () => void
  onCustomizationChange: (customization: DishCustomizationState) => void
  onPairing: (dish: Dish) => void
  onAllergy: () => void
  locale: Locale
  strings: DetailStrings
}

function DetailView({ dish, customization, saved, onBack, onSave, onCustomizationChange, onPairing, onAllergy, locale, strings }: DetailViewProps) {
  const suggestedPairs = upsellsFor(dish.id, new Set(), 3)
    .map((entry) => {
      const paired = dishes.find((item) => item.id === entry.id)
      return paired ? { dish: paired, reason: entry.reason } : null
    })
    .filter((entry): entry is { dish: Dish; reason: PairingSuggestion['reason'] } => Boolean(entry))
  const review = reviewSummaryFor(dish)
  const selectedAddOns = new Set(customization.addOns)
  const totalPrice = calculateDishPrice(dish, customization)

  const selectBaseOption = (groupId: string, optionId: string) => {
    onCustomizationChange({
      ...customization,
      baseOptions: { ...customization.baseOptions, [groupId]: optionId },
    })
  }

  const toggleAddOn = (groupId: string, addOnId: string) => {
    const group = dish.customizations?.addOns?.find((item) => item.id === groupId)
    const alreadySelected = selectedAddOns.has(addOnId)
    const groupSelectedCount = group?.addOns.filter((addOn) => selectedAddOns.has(addOn.id)).length ?? 0
    if (!alreadySelected && group?.maxSelections && groupSelectedCount >= group.maxSelections) return
    onCustomizationChange({
      ...customization,
      addOns: alreadySelected
        ? customization.addOns.filter((id) => id !== addOnId)
        : [...customization.addOns, addOnId],
    })
  }

  return (
    <section className="view detail-view detail-sheet-view">
      <div className="detail-sheet-scroll">
      <DishArt dish={dish} large locale={locale} />

      <div className="detail-title">
        <div>
          <span className="section-label">{localize(categoryLabels[dish.category], locale).toUpperCase()}</span>
          <h2>{localize(dish.name, locale)}</h2>
        </div>
        <strong>{money(totalPrice)}</strong>
      </div>
      <p className="detail-summary">{localize(dish.summary, locale)}</p>
      <Tags tags={dish.tags} locale={locale} />
      <DishExplain
        dishId={dish.id}
        dishName={localize(dish.name, locale)}
        kicker={strings.explainKicker}
        locale={locale}
        askLabel={strings.explain}
        closeLabel={strings.explainClose}
        onHaptic={haptic}
      />

      <section className="nutrition">
        <span className="section-label">{strings.nutrition}</span>
        <div>
          <strong>{dish.calories}<small>kcal</small></strong>
          <strong>{dish.protein}g<small>{strings.protein}</small></strong>
          <strong>{dish.carbs}g<small>{strings.carbs}</small></strong>
          <strong>{dish.fat}g<small>{strings.fat}</small></strong>
        </div>
      </section>

      <article className="review-summary-card">
        <h3 className="review-summary-title">{strings.reviewTitle}</h3>
        <div className="review-summary-tags">
          {review.tags.map((tag) => (
            <span className="review-tag" key={tag.EN}>{localize(tag, locale)}</span>
          ))}
        </div>
        <ul className="review-summary-points">
          {review.points.map((point) => (
            <li key={point.EN}>
              <Icon className="review-summary-icon" name="thumbs-up" />
              <span>{localize(point, locale)}</span>
            </li>
          ))}
        </ul>
        <p className="review-summary-source">{strings.reviewSource}</p>
      </article>

      {dish.customizations && (
        <>
          <section className="detail-block customisations">
            <span className="section-label">{strings.customisations}</span>
            {dish.customizations.baseOptions?.map((group) => (
              <section className="customization-card" key={group.id}>
                <div className="customization-heading">
                  <div>
                    <h3>{localize(group.title, locale)}</h3>
                    <p>{group.subtitle ? localize(group.subtitle, locale) : strings.required}</p>
                  </div>
                  {group.required && <span>{strings.required}</span>}
                </div>
                <RadioGroup
                  aria-label={localize(group.title, locale)}
                  className="customization-radio-group"
                  value={customization.baseOptions[group.id]}
                  onChange={(optionId) => {
                    haptic('light')
                    selectBaseOption(group.id, optionId)
                  }}
                >
                  {group.options.map((option) => (
                    <Radio className="customization-radio" key={option.id} value={option.id}>
                      <Radio.Content>
                        <Radio.Control>
                          <Radio.Indicator />
                        </Radio.Control>
                        <span className="customization-option-copy">
                          <span>{localize(option.label, locale)}</span>
                          {option.price ? <small>+ {money(option.price)}</small> : null}
                        </span>
                      </Radio.Content>
                    </Radio>
                  ))}
                </RadioGroup>
              </section>
            ))}
            {dish.customizations.addOns?.map((group) => (
              <section className="customization-card" key={group.id}>
                <div className="customization-heading">
                  <div>
                    <h3>{localize(group.title, locale)}</h3>
                    <p>{localize(group.subtitle, locale)}</p>
                  </div>
                  {group.maxSelections && <span>{strings.selectUpTo(group.maxSelections)}</span>}
                </div>
                <div className="add-on-list">
                  {group.addOns.map((addOn) => {
                    const checked = selectedAddOns.has(addOn.id)
                    return (
                      <label className="add-on-row" key={addOn.id}>
                        <span className="add-on-dietary" data-kind={addOn.dietary?.includes('Vegan') || addOn.dietary?.includes('Vegetarian') ? 'veg' : 'protein'} aria-hidden="true">
                          <span />
                        </span>
                        <span className="add-on-copy">
                          {addOn.badge && <strong>{localize(addOn.badge, locale)}</strong>}
                          <span>{localize(addOn.label, locale)}</span>
                        </span>
                        <span className="add-on-price">{addOn.price ? `+ ${money(addOn.price)}` : strings.free}</span>
                        <input
                          aria-label={localize(addOn.label, locale)}
                          checked={checked}
                          className="add-on-checkbox"
                          type="checkbox"
                          onChange={() => {
                            haptic('light')
                            toggleAddOn(group.id, addOn.id)
                          }}
                        />
                      </label>
                    )
                  })}
                </div>
              </section>
            ))}
          </section>
        </>
      )}

      {suggestedPairs.length > 0 && (
        <Card>
          <Card.Header>
            <Card.Title>{strings.pairingTitle}</Card.Title>
          </Card.Header>
          <Card.Content>
            {suggestedPairs.map(({ dish: pair, reason }) => (
              <Button className="pairing-row" fullWidth key={pair.id} variant="ghost" onPress={() => {
                haptic('medium')
                onPairing(pair)
              }}>
                <span className="pairing-content">
                  <DishArt dish={pair} locale={locale} />
                  <span className="pairing-copy">
                    <strong>{localize(pair.name, locale)}</strong>
                    <span>{localize(reason, locale)}</span>
                  </span>
                  <span className="pairing-price">
                    <PriceDisplay dish={pair} />
                  </span>
                </span>
              </Button>
            ))}
          </Card.Content>
        </Card>
      )}
      </div>

      <div className="sticky-action">
        <Button fullWidth isDisabled={!dish.available} onPress={() => {
          haptic('heavy')
          onSave()
        }}>
          {saved ? strings.saved : `${strings.add.split(' ')[0]} · ${money(totalPrice)}`}
        </Button>
      </div>
    </section>
  )
}

type ChooseViewProps = {
  answers: { hunger?: Hunger; mood?: Mood; dietary?: DietaryPreference; time?: TimePreference }
  question: number
  recommendations: Dish[]
  onAnswer: (key: 'hunger' | 'mood' | 'dietary' | 'time', value: Hunger | Mood | DietaryPreference | TimePreference) => void
  onRestart: () => void
  onBrowseMoods: () => void
  onDish: (dish: Dish) => void
  onSaveAll: () => void
  onClose: () => void
  locale: Locale
  strings: ChooseStrings
}

function ChooseView({ answers, question, recommendations, onAnswer, onRestart, onBrowseMoods, onDish, onSaveAll, onClose, locale, strings }: ChooseViewProps) {
  if (question >= 4) {
    return (
      <section className="view choose-view">
        <button className="choose-close-button" type="button" onClick={() => {
          haptic('light')
          onClose()
        }} aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6l-12 12m0-12l12 12" />
          </svg>
        </button>
        <span className="section-label">{strings.resultsLabel}</span>
        <h2>{strings.resultsTitle}</h2>
        <p className="muted">{strings.resultsBody}</p>
        <Link onPress={() => {
          haptic('light')
          onRestart()
        }}>{strings.changeAnswers}</Link>
        <div className="recommendations">
          {recommendations.map((dish) => (
            <DishRow
              dish={dish}
              key={dish.id}
              locale={locale}
              onPress={() => onDish(dish)}
              why={buildWhyCopy(dish, locale, strings)}
            />
          ))}
        </div>
        <div className="action-grid">
          <Button fullWidth variant="outline" onPress={() => {
            haptic('light')
            onRestart()
          }}>{strings.startAgain}</Button>
          <Button fullWidth onPress={() => {
            haptic('heavy')
            onSaveAll()
          }}>{strings.saveAll}</Button>
        </div>
      </section>
    )
  }

  const step = strings.steps[question]

  return (
    <section className="view choose-view">
      <button className="choose-close-button" type="button" onClick={() => {
        haptic('light')
        onClose()
      }} aria-label="Close">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6l-12 12m0-12l12 12" />
        </svg>
      </button>
      <span className="section-label">{strings.introLabel} · {question + 1} / 4</span>
      <div className="progress-wrap">
        <ProgressBar aria-label={strings.progress(question + 1, 4)} maxValue={4} minValue={0} size="sm" value={question + 1}>
          <ProgressBar.Track>
            <ProgressBar.Fill />
          </ProgressBar.Track>
        </ProgressBar>
      </div>
      <h2>{step.title}</h2>
      <p className="muted">{step.help}</p>
      {question === 0 && (
        <Button size="sm" variant="ghost" onPress={() => {
          haptic('light')
          onBrowseMoods()
        }}>{strings.browseByMood}</Button>
      )}
      <div className="answers-wrap">
        <RadioGroup
          aria-label={step.title}
          value={answers[step.key]}
          onChange={(value) => {
            haptic('light')
            onAnswer(step.key, value as Hunger | Mood | DietaryPreference | TimePreference)
          }}
        >
          {step.choices.map((choice) => (
            <Radio key={choice.value} value={choice.value}>
              <Radio.Content>
                <Radio.Control>
                  <Radio.Indicator />
                </Radio.Control>
                {choice.label}
              </Radio.Content>
            </Radio>
          ))}
        </RadioGroup>
      </div>
      <p className="privacy-note">{strings.privacy}</p>
    </section>
  )
}

function MoodView({ onMood, locale, strings }: { onMood: (mood: Mood) => void; locale: Locale; strings: MoodStrings }) {
  return (
    <section className="view mood-view">
      <span className="section-label">{strings.label}</span>
      <h2>{strings.title}</h2>
      <p className="muted">{strings.body}</p>
      <div className="mood-grid">
        {moodItems.map((mood, index) => (
          <Card key={mood}>
            <Card.Content>
              <span className={`mood-art tone-${index}`} aria-hidden="true">✦</span>
              <Card.Title>{strings.cards[mood].title}</Card.Title>
              <Card.Description>{countMoodItems(mood)} {locale === 'FR' ? 'articles' : 'items'}</Card.Description>
            </Card.Content>
            <Card.Footer>
              <Button fullWidth variant="outline" onPress={() => {
                haptic('medium')
                onMood(mood)
              }}>{strings.cards[mood].cta}</Button>
            </Card.Footer>
          </Card>
        ))}
      </div>
    </section>
  )
}

function ShortlistView({
  items,
  quantities,
  customizations,
  onRemove,
  onOrdered,
  locale,
  strings,
}: {
  items: Dish[]
  quantities: Record<string, number>
  customizations: Record<string, DishCustomizationState>
  onRemove: (id: string) => void
  onOrdered: () => void
  locale: Locale
  strings: ShortlistStrings
}) {
  const total = items.reduce((sum, dish) => {
    const quantity = quantities[dish.id] ?? 1
    return sum + calculateDishPrice(dish, customizations[dish.id]) * quantity
  }, 0)
  return (
    <section className="view shortlist-view">
      <span className="section-label">{strings.label}</span>
      <h2>{strings.title}</h2>
      <p className="muted">{strings.body}</p>
      {items.length ? (
        <>
          <div className="shortlist-items">
            {items.map((dish) => {
              const customization = customizations[dish.id] ?? defaultCustomizationFor(dish)
              const quantity = quantities[dish.id] ?? 1
              const baseSelections = dish.customizations?.baseOptions
                ?.map((group) => findBaseOption(dish, group.id, customization.baseOptions[group.id]))
                .filter((option): option is BaseOption => Boolean(option)) ?? []
              const addOns = customization.addOns
                .map((addOnId) => findAddOn(dish, addOnId))
                .filter((addOn): addOn is AddOn => Boolean(addOn))
              const unitPrice = calculateDishPrice(dish, customization)
              return (
                <div key={dish.id}>
                  <Separator />
                  <article>
                    <DishArt dish={dish} locale={locale} />
                    <div>
                      <strong>{localize(dish.name, locale)}</strong>
                      <p>{localize(dish.summary, locale)}</p>
                      {(baseSelections.length > 0 || addOns.length > 0) && (
                        <div className="shortlist-customizations">
                          {baseSelections.length > 0 && (
                            <span>{baseSelections.map((option) => localize(option.label, locale)).join(', ')}</span>
                          )}
                          {addOns.map((addOn) => (
                            <span key={addOn.id}>+ {localize(addOn.label, locale)} ({addOn.price ? money(addOn.price) : locale === 'FR' ? 'Gratuit' : 'Free'})</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="shortlist-price">
                      <strong>{money(unitPrice * quantity)}</strong>
                      {quantity > 1 && <span>{quantity} x {money(unitPrice)}</span>}
                    </div>
                    <CloseButton aria-label={strings.remove(localize(dish.name, locale))} onPress={() => {
                      haptic('light')
                      onRemove(dish.id)
                    }} />
                  </article>
                </div>
              )
            })}
          </div>
          <Separator />
          <div className="order-total">
            <strong>{strings.totalLabel}</strong>
            <strong>{money(total)}</strong>
          </div>
          <div className="shortlist-action">
            <Button className="ordered-cta" fullWidth onPress={onOrdered}>
              {strings.orderedCta}
            </Button>
          </div>
        </>
      ) : (
        <EmptyState>
          <LogoMark />
          <h3>{strings.emptyTitle}</h3>
          <p>{strings.emptyBody}</p>
        </EmptyState>
      )}
    </section>
  )
}

function buildWhyCopy(dish: Dish, locale: Locale, strings: ChooseStrings) {
  const parts = []
  if (dish.tags.includes('Quick')) parts.push(strings.whyQuick)
  if (dish.tags.includes('Vegan')) parts.push(strings.whyVegan)
  parts.push(strings.whyFallback)
  return `${strings.whyPrefix} - ${parts.join(', ')}.`
}

function countMoodItems(mood: Mood) {
  switch (mood) {
    case 'Fresh':
      return 8
    case 'Comforting':
      return 18
    case 'Bold':
      return 15
    case 'Familiar':
    default:
      return 12
  }
}
