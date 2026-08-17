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
  type Category,
  type Dish,
  type Locale,
  type LocalizedText,
  type MostLovedDish,
  type Tag,
} from './data'

type View = 'menu' | 'choose' | 'moods' | 'shortlist' | 'detail' | 'search' | 'chef'
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
  pairingTitle: string
  saved: string
  add: string
  reviewTitle: string
  reviewSource: string
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
  sourceNote: string
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
const mealHours: Record<MealPeriod, string> = {
  Brunch: '8am - 12pm',
  Lunch: '12pm - 4pm',
  Dinner: '5pm - 10pm',
}
const heroLogoSrc = '/utopia-logo.png?v=2'
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
  image: 'https://images.unsplash.com/photo-1763685805275-1845419c01a1?fm=jpg&q=80&w=1200&auto=format&fit=crop',
  story: {
    EN: 'Maya cooks like Utopia serves the neighborhood: generous, fast-moving, and full of color. Her menu picks lean into the cafe classics that regulars come back for after work, before a show, or when the table wants a little bit of everything.',
    FR: 'Maya cuisine comme Utopia accueille le quartier : avec generosite, energie et couleur. Ses choix mettent en valeur les classiques du cafe que les habitues reprennent apres le travail, avant un spectacle ou quand la table veut partager un peu de tout.',
  },
  recommendations: ['utopia-burger', 'poutine', 'fish-tacos'],
}
const money = (value: number) => `CA$${value.toFixed(2)}`
const categoryId = (category: Category) => category.toLowerCase().replace(/\s+/g, '-')
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
    sourceNote: 'Menu imported from public delivery listings. Confirm prices, allergens, availability, and nutrition with Utopia before launch.',
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
      pairingTitle: 'Goes well with',
      saved: 'Saved to shortlist',
      add: 'Add to shortlist',
      reviewTitle: 'Review summary',
      reviewSource: 'Based on user reviews from Google Maps, Yelp, etc.',
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
    sourceNote: 'Menu importe a partir de listings publics de livraison. Confirmez les prix, allergenes, disponibilites et valeurs nutritives avec Utopia avant la mise en ligne.',
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
      pairingTitle: 'Se marie bien avec',
      saved: 'Ajoute a la liste courte',
      add: 'Ajouter a la liste courte',
      reviewTitle: 'Resume des avis',
      reviewSource: 'D apres les avis des clients sur Google Maps, Yelp, etc.',
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
  if (heroLogoSrc) {
    return <img alt="utopia" className="wordmark-image" src={heroLogoSrc} />
  }

  return (
    <span className="wordmark" aria-hidden="true">
      utopia
    </span>
  )
}

function DishArt({ dish, locale, large = false }: { dish: Dish; locale: Locale; large?: boolean }) {
  const label = `${locale === 'FR' ? 'Photo' : 'Photo'} ${localize(dish.name, locale)}`

  return (
    <div className={`dish-art ${dish.colour} ${large ? 'large' : ''}`} aria-label={label} role="img">
      <img alt="" className="dish-art-image" src={dish.image} />
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

export function App() {
  const [view, setView] = useState<View>('menu')
  const previousView = useRef<View>('menu')
  const [selected, setSelected] = useState<Dish | null>(null)
  const [activeFilters, setActiveFilters] = useState<Tag[]>([])
  const [search, setSearch] = useState('')
  const [language, setLanguage] = useState<Locale>(() => {
    const saved = localStorage.getItem('utopia-language')
    return saved === 'FR' ? 'FR' : 'EN'
  })
  const [meal, setMeal] = useState<MealPeriod>('Dinner')
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
  const [answers, setAnswers] = useState<{ hunger?: Hunger; mood?: Mood; dietary?: DietaryPreference; time?: TimePreference }>({})
  const [question, setQuestion] = useState(0)
  const [serverMessage, setServerMessage] = useState<ServerMessage | null>(null)

  const [heroSlide, setHeroSlide] = useState(0)

  const copy = ui[language]

  useEffect(() => localStorage.setItem('utopia-shortlist', JSON.stringify(quantities)), [quantities])
  useEffect(() => localStorage.setItem('utopia-language', language), [language])

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
    setSelected(dish)
    navigate('detail')
  }

  const setQuantity = (id: string, next: number) => {
    setQuantities((current) => {
      const updated = { ...current }
      if (next <= 0) delete updated[id]
      else updated[id] = next
      return updated
    })
  }

  const toggleShortlist = (id: string) => setQuantities((current) => {
    if (current[id]) {
      const updated = { ...current }
      delete updated[id]
      return updated
    }
    return { ...current, [id]: 1 }
  })

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
              <img
                alt=""
                aria-hidden="true"
                className={`hero-photo${index === heroSlide ? ' is-active' : ''}`}
                key={src}
                src={src}
              />
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
                  onClick={() => setHeroSlide(index)}
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
              onChange={(value) => value && setLanguage(value as Locale)}
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
            <div className="hero-meta">
              <span>{copy.address}</span>
              <span aria-hidden="true">|</span>
              <Select
                aria-label={copy.mealLabel}
                className="header-select meal-select"
                value={meal}
                onChange={(value) => value && setMeal(value as MealPeriod)}
              >
                <Select.Trigger>
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox aria-label={copy.mealOptions}>
                    {meals.map((option) => (
                      <ListBox.Item className="meal-option" id={option} key={option} textValue={copy.meals[option]}>
                        <Label>{copy.meals[option]}</Label>
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
                onPointerDown={(event) => {
                  event.preventDefault()
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
              <CloseButton aria-label={copy.dismissMessage} onPress={() => setServerMessage(null)} />
            </Alert>
          </div>
        )}

        {view === 'menu' && (
          <MenuView
            activeFilters={activeFilters}
            chefStrings={copy.chef}
            locale={language}
            onAdd={(id) => setQuantity(id, 1)}
            onChef={() => navigate('chef')}
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
        {view === 'detail' && selected && (
          <DetailView
            dish={selected}
            locale={language}
            onAllergy={() => showServerMessage({
              title: copy.allergyReminder.title,
              description: copy.allergyReminder.description,
              status: 'warning',
            })}
            onBack={() => navigate('menu')}
            onPairing={chooseDish}
            onSave={() => toggleShortlist(selected.id)}
            saved={Boolean(quantities[selected.id])}
            strings={copy.detail}
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
            onSaveAll={() => setQuantities(Object.fromEntries(recommendations.map(({ dish }) => [dish.id, 1])))}
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
            locale={language}
            quantities={quantities}
            onRemove={toggleShortlist}
            onServer={() => showServerMessage({
              title: copy.readyForServer.title,
              description: copy.readyForServer.description,
              status: 'accent',
            })}
            strings={copy.shortlist}
          />
        )}

        {view !== 'search' && view !== 'chef' && (
        <nav className="bottom-nav" aria-label={copy.nav.primary}>
          <Button
            className="nav-button"
            aria-current={view === 'menu' || view === 'detail' ? 'page' : undefined}
            size="sm"
            variant={view === 'menu' || view === 'detail' ? 'secondary' : 'ghost'}
            onPress={() => navigate('menu')}
          >
            <Icon className="nav-icon" name="menu" />
            <span>{copy.nav.menu}</span>
          </Button>
          <Button
            className="nav-button"
            aria-current={view === 'choose' || view === 'moods' ? 'page' : undefined}
            size="sm"
            variant={view === 'choose' || view === 'moods' ? 'secondary' : 'ghost'}
            onPress={() => navigate('choose')}
          >
            <Icon className="nav-icon" name="magic" />
            <span>{copy.nav.choose}</span>
          </Button>
          <Button
            className="nav-button"
            aria-current={view === 'shortlist' ? 'page' : undefined}
            size="sm"
            variant={view === 'shortlist' ? 'secondary' : 'ghost'}
            onPress={() => navigate('shortlist')}
          >
            <Icon className="nav-icon" name="bookmark" />
            <span>{copy.nav.shortlist}</span>
            {shortlistCount > 0 && <Chip color="accent" size="sm">{shortlistCount}</Chip>}
          </Button>
        </nav>
        )}
      </div>

      <p className="demo-note" id="source-note">
        {copy.sourceNote}
      </p>
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
          onPress={onClose}
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
          <button className="search-page-dismiss" type="button" onClick={onClose} tabIndex={-1} aria-label={closeLabel} />
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
        onClick={() => onChange(value - 1)}
      >
        −
      </button>
      <span>{value}</span>
      <button aria-label="+" type="button" onClick={() => onChange(value + 1)}>
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
        <Button className="chef-view-back" size="sm" variant="ghost" onPress={onBack}>
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
              <button className="chef-recommendation-card" key={dish.id} type="button" role="listitem" onClick={() => onDish(dish)}>
                <img alt="" src={dish.image} />
                <span>
                  <strong>{localize(dish.name, locale)}</strong>
                  <small>{money(dish.price)}</small>
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
            <button className="most-loved-card-button" type="button" onClick={() => onDish(dish)}>
              <div className="most-loved-card-image-wrap">
                <img alt="" className="most-loved-card-image" src={dish.image} />
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
                    <span className="most-loved-card-price">{money(dish.price)}</span>
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
  onAdd: (id: string) => void
  onQuantity: (id: string, next: number) => void
  quantities: Record<string, number>
  locale: Locale
  strings: MenuStrings
  chefStrings: ChefStrings
}

const featuredPromos: Record<string, LocalizedText> = {
  'utopia-burger': { EN: 'Buy 1 get 1', FR: '1 achete 1 offert' },
  poutine: { EN: '20% off', FR: '-20 %' },
  'chicken-karaage': { EN: '$9 off', FR: '9 $ de rabais' },
}

function MenuView({ shownDishes, activeFilters, onFilters, onClear, onDish, onChef, onAdd, onQuantity, quantities, locale, strings, chefStrings }: MenuViewProps) {
  const featuredDishes = [
    dishes.find((dish) => dish.id === 'utopia-burger') ?? dishes[0],
    dishes.find((dish) => dish.id === 'poutine') ?? dishes[1],
    dishes.find((dish) => dish.id === 'chicken-karaage') ?? dishes[2],
  ]

  return (
    <section className="view menu-view">
      <section className="hero-carousel" aria-label={strings.mostOrdered}>
        <div className="hero-carousel-track" role="list">
          {featuredDishes.map((dish, index) => (
            <article
              className={`hero-card hero-card-${index + 1}`}
              key={dish.id}
              role="listitem"
              onClick={() => onDish(dish)}
            >
              <img alt="" className="hero-card-image" src={dish.image} />
              <div className="hero-card-scrim" />
              {featuredPromos[dish.id] && (
                <span className="hero-card-promo">{localize(featuredPromos[dish.id], locale)}</span>
              )}
              <div className="hero-card-footer">
                <div className="hero-card-copy">
                  <span className="hero-card-kicker">{strings.heroKicker}</span>
                  <h2>{localize(dish.name, locale)}</h2>
                  <p>{money(dish.price)}</p>
                </div>
                {quantities[dish.id] ? (
                  <QuantityStepper
                    className="hero-card-stepper"
                    value={quantities[dish.id]}
                    onChange={(next) => onQuantity(dish.id, next)}
                  />
                ) : (
                  <Button
                    className="hero-card-add"
                    size="sm"
                    onClick={(event) => event.stopPropagation()}
                    onPress={() => onAdd(dish.id)}
                  >
                    {strings.heroAdd}
                  </Button>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <MostLovedSection
        locale={locale}
        onAdd={onAdd}
        onDish={onDish}
        onQuantity={onQuantity}
        quantities={quantities}
      />

      <section className="chef-feature" aria-labelledby="chef-feature-title">
        <button className="chef-feature-card" type="button" onClick={onChef}>
          <img alt="" className="chef-feature-image" src={chefProfile.image} />
          <span className="chef-feature-scrim" aria-hidden="true" />
          <span className="chef-feature-copy">
            <span className="chef-feature-kicker">{chefStrings.sectionLabel}</span>
            <strong id="chef-feature-title">{chefStrings.sectionTitle}</strong>
            <span>{chefStrings.sectionBody}</span>
          </span>
        </button>
      </section>

      <div className="filter-row">
        <ToggleButtonGroup
          aria-label={strings.filtersLabel}
          isDetached
          selectedKeys={activeFilters}
          selectionMode="multiple"
          size="sm"
          onSelectionChange={(keys) => onFilters(Array.from(keys) as Tag[])}
        >
          {filterTags.map((tag) => (
            <ToggleButton className="filter-chip" id={tag} key={tag}>
              <Icon className="filter-chip-icon" name={filterTagIcons[tag]} />
              <span>{localize(tagLabels[tag], locale)}</span>
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        {activeFilters.length > 0 && (
          <Button size="sm" variant="ghost" onPress={onClear}>{strings.clearAll}</Button>
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
              <Button fullWidth variant="ghost" onPress={() => document.getElementById(categoryId(name))?.scrollIntoView({ behavior: 'smooth' })}>
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
      <Button className="dish-row-button" fullWidth isDisabled={!dish.available} variant="ghost" onPress={onPress}>
        <span className="dish-row-content">
          <span className="dish-copy">
            <Tags tags={dish.tags} locale={locale} max={2} />
            <strong className="dish-name">{localize(dish.name, locale)}</strong>
            <span className="dish-summary">{localize(dish.summary, locale)}</span>
            {why && <span className="dish-reason">{why}</span>}
            <strong>{money(dish.price)}</strong>
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
  saved: boolean
  onBack: () => void
  onSave: () => void
  onPairing: (dish: Dish) => void
  onAllergy: () => void
  locale: Locale
  strings: DetailStrings
}

function DetailView({ dish, saved, onBack, onSave, onPairing, onAllergy, locale, strings }: DetailViewProps) {
  const pair = dish.pairing ? dishes.find((item) => item.id === dish.pairing?.id) : undefined
  const review = reviewSummaryFor(dish)
  return (
    <section className="view detail-view">
      <Button size="sm" variant="ghost" onPress={onBack}>← {strings.back}</Button>
      <DishArt dish={dish} large locale={locale} />

      <div className="detail-title">
        <div>
          <span className="section-label">{localize(categoryLabels[dish.category], locale).toUpperCase()}</span>
          <h2>{localize(dish.name, locale)}</h2>
        </div>
        <strong>{money(dish.price)}</strong>
      </div>
      <p className="detail-summary">{localize(dish.summary, locale)}</p>
      <Tags tags={dish.tags} locale={locale} />

      <Separator />
      <section className="nutrition">
        <span className="section-label">{strings.nutrition}</span>
        <div>
          <strong>{dish.calories}<small>kcal</small></strong>
          <strong>{dish.protein}g<small>{strings.protein}</small></strong>
          <strong>{dish.carbs}g<small>{strings.carbs}</small></strong>
          <strong>{dish.fat}g<small>{strings.fat}</small></strong>
        </div>
      </section>

      <Separator />
      <article className="review-summary-card">
        <div className="review-summary-tags">
          {review.tags.map((tag) => (
            <span className="review-tag" key={tag.EN}>{localize(tag, locale)}</span>
          ))}
        </div>
        <h3 className="review-summary-title">{strings.reviewTitle}</h3>
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

      {dish.customisations && (
        <>
          <Separator />
          <section className="detail-block customisations">
            <span className="section-label">{strings.customisations}</span>
            {dish.customisations.map((item) => (
              <Button fullWidth key={localize(item, locale)} variant="outline">
                {localize(item, locale)} <span aria-hidden="true">→</span>
              </Button>
            ))}
          </section>
        </>
      )}

      {pair && (
        <Card>
          <Card.Header>
            <Card.Title>{strings.pairingTitle}</Card.Title>
          </Card.Header>
          <Card.Content>
            <Button fullWidth variant="ghost" onPress={() => onPairing(pair)}>
              <span className="pairing-content">
                <DishArt dish={pair} locale={locale} />
                <span>
                  <strong>{localize(pair.name, locale)}</strong>
                  <span>{dish.pairing ? localize(dish.pairing.reason, locale) : ''}</span>
                </span>
                <strong>{money(pair.price)}</strong>
              </span>
            </Button>
          </Card.Content>
        </Card>
      )}

      <div className="sticky-action">
        <Button fullWidth isDisabled={!dish.available} onPress={onSave}>
          {saved ? strings.saved : strings.add}
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
  locale: Locale
  strings: ChooseStrings
}

function ChooseView({ answers, question, recommendations, onAnswer, onRestart, onBrowseMoods, onDish, onSaveAll, locale, strings }: ChooseViewProps) {
  if (question >= 4) {
    return (
      <section className="view choose-view">
        <span className="section-label">{strings.resultsLabel}</span>
        <h2>{strings.resultsTitle}</h2>
        <p className="muted">{strings.resultsBody}</p>
        <Link onPress={onRestart}>{strings.changeAnswers}</Link>
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
          <Button fullWidth variant="outline" onPress={onRestart}>{strings.startAgain}</Button>
          <Button fullWidth onPress={onSaveAll}>{strings.saveAll}</Button>
        </div>
      </section>
    )
  }

  const step = strings.steps[question]

  return (
    <section className="view choose-view">
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
        <Button size="sm" variant="ghost" onPress={onBrowseMoods}>{strings.browseByMood}</Button>
      )}
      <div className="answers-wrap">
        <RadioGroup
          aria-label={step.title}
          value={answers[step.key]}
          onChange={(value) => onAnswer(step.key, value as Hunger | Mood | DietaryPreference | TimePreference)}
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
              <Button fullWidth variant="outline" onPress={() => onMood(mood)}>{strings.cards[mood].cta}</Button>
            </Card.Footer>
          </Card>
        ))}
      </div>
    </section>
  )
}

function ShortlistView({ items, quantities, onRemove, onServer, locale, strings }: { items: Dish[]; quantities: Record<string, number>; onRemove: (id: string) => void; onServer: () => void; locale: Locale; strings: ShortlistStrings }) {
  const total = items.reduce((sum, dish) => sum + dish.price * (quantities[dish.id] ?? 1), 0)
  return (
    <section className="view shortlist-view">
      <span className="section-label">{strings.label}</span>
      <h2>{strings.title}</h2>
      <p className="muted">{strings.body}</p>
      {items.length ? (
        <>
          <div className="shortlist-items">
            {items.map((dish) => (
              <div key={dish.id}>
                <Separator />
                <article>
                  <DishArt dish={dish} locale={locale} />
                  <div>
                    <strong>{localize(dish.name, locale)}</strong>
                    <p>{localize(dish.summary, locale)}</p>
                    <Chip color="success" size="sm" variant="soft">{strings.orderReady}</Chip>
                  </div>
                  <strong>{money(dish.price)}</strong>
                  <CloseButton aria-label={strings.remove(localize(dish.name, locale))} onPress={() => onRemove(dish.id)} />
                </article>
              </div>
            ))}
          </div>
          <Separator />
          <div className="order-total">
            <strong>{strings.totalLabel}</strong>
            <strong>{money(total)}</strong>
            <p>{strings.totalNote}</p>
          </div>
          <Alert status="warning">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>{strings.alertTitle}</Alert.Title>
              <Alert.Description>{strings.alertBody}</Alert.Description>
            </Alert.Content>
          </Alert>
          <div className="shortlist-action">
            <Button fullWidth onPress={onServer}>{strings.showToServer}</Button>
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
