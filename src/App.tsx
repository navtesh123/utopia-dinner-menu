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
import { useEffect, useMemo, useState } from 'react'
import { categories, dishes, filterTags, type Category, type Dish, type Tag } from './data'

type View = 'menu' | 'choose' | 'moods' | 'shortlist' | 'detail'
type Mood = 'Fresh' | 'Comforting' | 'Bold' | 'Familiar'
type Language = 'EN' | 'FR' | 'ES'
type ServerMessage = {
  title: string
  description: string
  status: 'accent' | 'warning'
}

const languages: Language[] = ['EN', 'FR', 'ES']
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

function Icon({ name, className }: { name: string; className?: string }) {
  switch (name) {
    case 'menu':
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
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
    case 'bell':
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8 17h8m-6 2a2 2 0 0 0 4 0m4-2H6c1.1-1.1 2-2.8 2-6a4 4 0 1 1 8 0c0 3.2.9 4.9 2 6Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
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

function DishArt({ dish, large = false }: { dish: Dish; large?: boolean }) {
  return (
    <div
      className={`dish-art ${dish.colour} ${large ? 'large' : ''}`}
      aria-label={`Illustration placeholder for ${dish.name}`}
      role="img"
    >
      <span>✦</span>
    </div>
  )
}

function Tags({ tags, max }: { tags: Tag[]; max?: number }) {
  return (
    <div className="tags">
      {tags.slice(0, max).map((tag) => (
        <Chip color="accent" key={tag} size="sm" variant="soft">
          {tag}
        </Chip>
      ))}
    </div>
  )
}

export function App() {
  const [view, setView] = useState<View>('menu')
  const [selected, setSelected] = useState<Dish | null>(null)
  const [activeFilters, setActiveFilters] = useState<Tag[]>([])
  const [search, setSearch] = useState('')
  const [language, setLanguage] = useState<Language>('EN')
  const [shortlist, setShortlist] = useState<string[]>(() => JSON.parse(localStorage.getItem('utopia-shortlist') || '[]'))
  const [answers, setAnswers] = useState<{ hunger?: string; mood?: Mood; dietary?: Tag; time?: string }>({})
  const [question, setQuestion] = useState(0)
  const [serverMessage, setServerMessage] = useState<ServerMessage | null>(null)

  useEffect(() => localStorage.setItem('utopia-shortlist', JSON.stringify(shortlist)), [shortlist])

  const shownDishes = useMemo(() => dishes.filter((dish) => {
    const matchesFilter = activeFilters.every((tag) => dish.tags.includes(tag))
    const text = `${dish.name} ${dish.summary} ${dish.category}`.toLowerCase()
    return matchesFilter && text.includes(search.toLowerCase())
  }), [activeFilters, search])

  const shortlistItems = dishes.filter((dish) => shortlist.includes(dish.id))
  const navigate = (next: View) => {
    setView(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const chooseDish = (dish: Dish) => {
    setSelected(dish)
    navigate('detail')
  }
  const toggleShortlist = (id: string) => setShortlist((current) => (
    current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
  ))

  const recommendations = useMemo(() => {
    return dishes
      .filter((dish) => dish.available && !['Drinks', 'Sides'].includes(dish.category))
      .map((dish) => {
        let score = dish.tags.includes('Popular') ? 1 : 0
        if (answers.dietary && dish.tags.includes(answers.dietary)) score += 8
        if (answers.mood === 'Fresh' && (dish.tags.includes('Vegan') || ['field-mix-greens', 'utopia-good-life', 'seared-tuna-avocado-sandwich'].includes(dish.id))) score += 4
        if (answers.mood === 'Comforting' && ['poutine', 'utopia-burger', 'classic-grilled-cheese', 'breakfast-burrito', 'mactopia'].includes(dish.id)) score += 4
        if (answers.mood === 'Bold' && dish.tags.includes('Spicy')) score += 4
        if (answers.mood === 'Familiar' && dish.tags.includes('Popular')) score += 4
        if (answers.time === 'Quick' && dish.tags.includes('Quick')) score += 3
        if (answers.hunger === 'Feast' && ['Burritos', 'Burgers', 'Sandwiches', 'Brunch'].includes(dish.category)) score += 2
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
        <header className="topbar">
          <span className="eyebrow">UTOPIA CAFE & GRILL · TORONTO</span>
          <div className="language-select">
            <Select
              aria-label="Language selector"
              fullWidth
              placeholder="Language"
              value={language}
              onChange={(value) => value && setLanguage(value as Language)}
            >
              <Select.Trigger>
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover placement="bottom end">
                <ListBox aria-label="Language options">
                  {languages.map((option) => (
                    <ListBox.Item id={option} key={option} textValue={option}>
                      <Label>{option}</Label>
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
            </Select>
          </div>
        </header>

        <div className="brand-row">
          <LogoMark />
          <div>
            <h1>Utopia</h1>
            <p>586 College St · public menu draft</p>
          </div>
        </div>

        {serverMessage && (
          <div className="alert-wrap" id="server-alert">
            <Alert status={serverMessage.status}>
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>{serverMessage.title}</Alert.Title>
                <Alert.Description>{serverMessage.description}</Alert.Description>
              </Alert.Content>
              <CloseButton aria-label="Dismiss message" onPress={() => setServerMessage(null)} />
            </Alert>
          </div>
        )}

        {view === 'menu' && (
          <MenuView
            shownDishes={shownDishes}
            activeFilters={activeFilters}
            search={search}
            onSearch={setSearch}
            onFilters={setActiveFilters}
            onClear={() => setActiveFilters([])}
            onDish={chooseDish}
            onNavigate={navigate}
          />
        )}
        {view === 'detail' && selected && (
          <DetailView
            dish={selected}
            saved={shortlist.includes(selected.id)}
            onBack={() => navigate('menu')}
            onSave={() => toggleShortlist(selected.id)}
            onPairing={chooseDish}
            onAllergy={() => showServerMessage({
              title: 'Allergy reminder',
              description: 'Please speak to your server about ingredients and cross-contamination before ordering.',
              status: 'warning',
            })}
          />
        )}
        {view === 'choose' && (
          <ChooseView
            answers={answers}
            question={question}
            recommendations={recommendations.map((entry) => entry.dish)}
            onAnswer={(key, value) => {
              setAnswers((current) => ({ ...current, [key]: value }))
              setQuestion((current) => Math.min(current + 1, 4))
            }}
            onRestart={() => {
              setAnswers({})
              setQuestion(0)
            }}
            onBrowseMoods={() => navigate('moods')}
            onDish={chooseDish}
            onSaveAll={() => setShortlist(recommendations.map(({ dish }) => dish.id))}
          />
        )}
        {view === 'moods' && (
          <MoodView onMood={(mood) => {
            setAnswers((current) => ({ ...current, mood }))
            setQuestion(4)
            navigate('choose')
          }} />
        )}
        {view === 'shortlist' && (
          <ShortlistView
            items={shortlistItems}
            onRemove={toggleShortlist}
            onServer={() => showServerMessage({
              title: 'Ready for your server',
              description: 'Show this shortlist to your server when you are ready to order.',
              status: 'accent',
            })}
          />
        )}

        <nav className="bottom-nav" aria-label="Primary navigation">
          <Button
            className="nav-button"
            aria-current={view === 'menu' || view === 'detail' ? 'page' : undefined}
            size="sm"
            variant={view === 'menu' || view === 'detail' ? 'secondary' : 'ghost'}
            onPress={() => navigate('menu')}
          >
            <Icon className="nav-icon" name="menu" />
            <span>Menu</span>
          </Button>
          <Button
            className="nav-button"
            aria-current={view === 'choose' || view === 'moods' ? 'page' : undefined}
            size="sm"
            variant={view === 'choose' || view === 'moods' ? 'secondary' : 'ghost'}
            onPress={() => navigate('choose')}
          >
            <Icon className="nav-icon" name="magic" />
            <span>Choose</span>
          </Button>
          <Button
            className="nav-button"
            aria-current={view === 'shortlist' ? 'page' : undefined}
            size="sm"
            variant={view === 'shortlist' ? 'secondary' : 'ghost'}
            onPress={() => navigate('shortlist')}
          >
            <Icon className="nav-icon" name="bookmark" />
            <span>Shortlist</span>
            {shortlist.length > 0 && <Chip color="accent" size="sm">{shortlist.length}</Chip>}
          </Button>
          <Button
            className="nav-button"
            size="sm"
            variant="ghost"
            onPress={() => showServerMessage({
              title: 'Your server can help',
              description: 'Please ask your server—they will be happy to help.',
              status: 'accent',
            })}
          >
            <Icon className="nav-icon" name="bell" />
            <span>Server</span>
          </Button>
        </nav>
      </div>

      <p className="demo-note" id="source-note">
        Menu imported from public delivery listings. Confirm prices, allergens, availability, and nutrition with Utopia before launch.
      </p>
    </main>
  )
}

type MenuViewProps = {
  shownDishes: Dish[]
  activeFilters: Tag[]
  search: string
  onSearch: (value: string) => void
  onFilters: (tags: Tag[]) => void
  onClear: () => void
  onDish: (dish: Dish) => void
  onNavigate: (view: View) => void
}

function MenuView({ shownDishes, activeFilters, search, onSearch, onFilters, onClear, onDish, onNavigate }: MenuViewProps) {
  return (
    <section className="view menu-view">
      <section className="hero-feature">
        <div>
          <span className="section-label">MOST ORDERED</span>
          <h2>Burritos, burgers, brunch and comfort plates.</h2>
          <p>Built from the public Utopia Cafe & Grill menu for the first working QR prototype.</p>
          <Link href="#source-note">
            View source note
            <Link.Icon>→</Link.Icon>
          </Link>
        </div>
        <DishArt dish={dishes.find((dish) => dish.id === 'utopia-burger') ?? dishes[0]} />
      </section>

      <SearchField
        aria-label="Search the menu"
        fullWidth
        value={search}
        onChange={onSearch}
      >
        <SearchField.Group>
          <SearchField.SearchIcon />
          <SearchField.Input placeholder="Search the menu" />
          <SearchField.ClearButton />
        </SearchField.Group>
      </SearchField>

      <div className="filter-row">
        <ToggleButtonGroup
          aria-label="Menu filters"
          isDetached
          selectedKeys={activeFilters}
          selectionMode="multiple"
          size="sm"
          onSelectionChange={(keys) => onFilters(Array.from(keys) as Tag[])}
        >
          {filterTags.map((tag) => (
            <ToggleButton className="filter-chip" id={tag} key={tag}>
              <Icon className="filter-chip-icon" name={filterTagIcons[tag]} />
              <span>{tag}</span>
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        {activeFilters.length > 0 && (
          <Button size="sm" variant="ghost" onPress={onClear}>Clear all</Button>
        )}
      </div>

      <div className="action-grid">
        <Button fullWidth onPress={() => document.getElementById('appetizers')?.scrollIntoView({ behavior: 'smooth' })}>
          Browse menu
        </Button>
        <Button fullWidth variant="outline" onPress={() => onNavigate('choose')}>
          Help me choose
        </Button>
      </div>

      <section className="category-index">
        <span className="section-label">EXPLORE MENU</span>
        <Separator />
        {categories.map(([name, cue]) => (
          <div className="category-link" key={name}>
            <Button fullWidth variant="ghost" onPress={() => document.getElementById(categoryId(name))?.scrollIntoView({ behavior: 'smooth' })}>
              <span className="category-link-copy">
                <strong>{name}</strong>
                <span>{cue} · {dishes.filter((dish) => dish.category === name).length}</span>
              </span>
            </Button>
            <Separator />
          </div>
        ))}
      </section>

      {categories.map(([category, cue]) => {
        const inCategory = shownDishes.filter((dish) => dish.category === category)
        return (
          <section className="menu-category" id={categoryId(category)} key={category}>
            <div className="category-heading">
              <div>
                <h2>{category}</h2>
                <p>{cue}</p>
              </div>
              <span>{inCategory.length} items</span>
            </div>
            <Separator />
            {inCategory.length
              ? inCategory.map((dish) => <DishRow dish={dish} onPress={() => onDish(dish)} key={dish.id} />)
              : <p className="empty">No items match these filters. Try clearing one.</p>}
          </section>
        )
      })}
    </section>
  )
}

function DishRow({ dish, onPress, why }: { dish: Dish; onPress: () => void; why?: string }) {
  return (
    <div className="dish-card-wrap">
      <Button className="dish-row-button" fullWidth isDisabled={!dish.available} variant="ghost" onPress={onPress}>
        <span className="dish-row-content">
          <span className="dish-copy">
            <strong className="dish-name">{dish.name}</strong>
            <span className="dish-summary">{dish.summary}</span>
            {why && <span className="dish-reason">{why}</span>}
            <strong>{money(dish.price)}</strong>
            <Tags tags={dish.tags} max={2} />
            {!dish.available && <Chip color="danger" size="sm" variant="soft">Unavailable today</Chip>}
          </span>
          <DishArt dish={dish} />
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
}

function DetailView({ dish, saved, onBack, onSave, onPairing, onAllergy }: DetailViewProps) {
  const pair = dish.pairing ? dishes.find((item) => item.id === dish.pairing?.id) : undefined
  return (
    <section className="view detail-view">
      <Button size="sm" variant="ghost" onPress={onBack}>← Menu</Button>
      <DishArt dish={dish} large />

      <div className="detail-title">
        <div>
          <span className="section-label">{dish.category.toUpperCase()}</span>
          <h2>{dish.name}</h2>
        </div>
        <strong>{money(dish.price)}</strong>
      </div>
      <p className="detail-summary">{dish.summary}</p>
      <Tags tags={dish.tags} />

      <Separator />
      <section className="detail-block">
        <span className="section-label">MENU DESCRIPTION</span>
        <p>{dish.description}</p>
      </section>

      <Separator />
      <section className="detail-block allergy">
        <span className="section-label">DIETARY & ALLERGY</span>
        <p>Dietary tags are interpreted from public menu text and must be checked with the restaurant before launch.</p>
        <Link href="#server-alert" onPress={onAllergy}>
          Please speak to your server about allergies
          <Link.Icon>→</Link.Icon>
        </Link>
      </section>

      <Separator />
      <section className="nutrition">
        <span className="section-label">ESTIMATED NUTRITION</span>
        <div>
          <strong>{dish.calories}<small>kcal</small></strong>
          <strong>{dish.protein}g<small>protein</small></strong>
          <strong>{dish.carbs}g<small>carbs</small></strong>
          <strong>{dish.fat}g<small>fat</small></strong>
        </div>
      </section>

      {dish.customisations && (
        <>
          <Separator />
          <section className="detail-block customisations">
            <span className="section-label">MAKE IT YOURS</span>
            {dish.customisations.map((item) => (
              <Button fullWidth key={item} variant="outline">
                {item} <span aria-hidden="true">→</span>
              </Button>
            ))}
          </section>
        </>
      )}

      {pair && (
        <Card>
          <Card.Header>
            <Card.Title>Goes well with</Card.Title>
          </Card.Header>
          <Card.Content>
            <Button fullWidth variant="ghost" onPress={() => onPairing(pair)}>
              <span className="pairing-content">
                <DishArt dish={pair} />
                <span>
                  <strong>{pair.name}</strong>
                  <span>{dish.pairing?.reason}</span>
                </span>
                <strong>{money(pair.price)}</strong>
              </span>
            </Button>
          </Card.Content>
        </Card>
      )}

      <div className="sticky-action">
        <Button fullWidth isDisabled={!dish.available} onPress={onSave}>
          {saved ? 'Saved to shortlist' : 'Add to shortlist'}
        </Button>
      </div>
    </section>
  )
}

type ChooseViewProps = {
  answers: { hunger?: string; mood?: Mood; dietary?: Tag; time?: string }
  question: number
  recommendations: Dish[]
  onAnswer: (key: 'hunger' | 'mood' | 'dietary' | 'time', value: string) => void
  onRestart: () => void
  onBrowseMoods: () => void
  onDish: (dish: Dish) => void
  onSaveAll: () => void
}

function ChooseView({ answers, question, recommendations, onAnswer, onRestart, onBrowseMoods, onDish, onSaveAll }: ChooseViewProps) {
  if (question >= 4) {
    return (
      <section className="view choose-view">
        <span className="section-label">FIND MY PLATE · YOUR MATCHES</span>
        <h2>Three plates that match what you asked for</h2>
        <p className="muted">Curated from menu facts—no personal data is saved.</p>
        <Link onPress={onRestart}>Change answers</Link>
        <div className="recommendations">
          {recommendations.map((dish) => (
            <DishRow
              dish={dish}
              key={dish.id}
              onPress={() => onDish(dish)}
              why={`Why it fits — ${dish.tags.includes('Quick') ? 'ready quickly, ' : ''}${dish.tags.includes('Vegan') ? 'plant-powered, ' : ''}made for tonight.`}
            />
          ))}
        </div>
        <div className="action-grid">
          <Button fullWidth variant="outline" onPress={onRestart}>Start again</Button>
          <Button fullWidth onPress={onSaveAll}>Save all three</Button>
        </div>
      </section>
    )
  }

  const step = [
    { key: 'hunger' as const, title: 'How hungry are you?', help: 'There is no wrong answer. You can change it later.', choices: ['Light', 'Proper', 'Feast'] },
    { key: 'mood' as const, title: 'What sounds good right now?', help: 'Pick the one that fits—you can change it later.', choices: ['Fresh', 'Comforting', 'Bold', 'Familiar'] },
    { key: 'dietary' as const, title: 'Anything we should work around?', help: 'We only show tags interpreted from the public menu.', choices: ['Vegan', 'Vegetarian', 'Gluten-free', 'No preference'] },
    { key: 'time' as const, title: 'How much time do you have?', help: 'We will prioritise dishes ready sooner.', choices: ['Quick', 'No rush'] },
  ][question]

  return (
    <section className="view choose-view">
      <span className="section-label">FIND MY PLATE · {question + 1} OF 4</span>
      <div className="progress-wrap">
        <ProgressBar aria-label={`Question ${question + 1} of 4`} maxValue={4} minValue={0} size="sm" value={question + 1}>
          <ProgressBar.Track>
            <ProgressBar.Fill />
          </ProgressBar.Track>
        </ProgressBar>
      </div>
      <h2>{step.title}</h2>
      <p className="muted">{step.help}</p>
      {question === 0 && (
        <Button size="sm" variant="ghost" onPress={onBrowseMoods}>Browse by mood instead</Button>
      )}
      <div className="answers-wrap">
        <RadioGroup
          aria-label={step.title}
          value={answers[step.key]}
          onChange={(value) => onAnswer(step.key, value)}
        >
          {step.choices.map((choice) => (
            <Radio key={choice} value={choice}>
              <Radio.Content>
                <Radio.Control>
                  <Radio.Indicator />
                </Radio.Control>
                {choice}
              </Radio.Content>
            </Radio>
          ))}
        </RadioGroup>
      </div>
      <p className="privacy-note">No sign-in. Nothing is saved after you leave, except your shortlist on this device.</p>
    </section>
  )
}

function MoodView({ onMood }: { onMood: (mood: Mood) => void }) {
  return (
    <section className="view mood-view">
      <span className="section-label">BROWSE BY MOOD</span>
      <h2>What sounds right, right now?</h2>
      <p className="muted">No questions, no data. Just a more intuitive way to browse.</p>
      <div className="mood-grid">
        {(['Fresh', 'Comforting', 'Bold', 'Familiar'] as Mood[]).map((mood, index) => (
          <Card key={mood}>
            <Card.Content>
              <span className={`mood-art tone-${index}`} aria-hidden="true">✦</span>
              <Card.Title>
                {mood === 'Fresh' ? 'Bright & fresh' : mood === 'Comforting' ? 'Big comfort' : mood === 'Bold' ? 'Spicy adventure' : 'Something familiar'}
              </Card.Title>
              <Card.Description>{[8, 18, 15, 12][index]} items</Card.Description>
            </Card.Content>
            <Card.Footer>
              <Button fullWidth variant="outline" onPress={() => onMood(mood)}>Choose {mood}</Button>
            </Card.Footer>
          </Card>
        ))}
      </div>
    </section>
  )
}

function ShortlistView({ items, onRemove, onServer }: { items: Dish[]; onRemove: (id: string) => void; onServer: () => void }) {
  const total = items.reduce((sum, dish) => sum + dish.price, 0)
  return (
    <section className="view shortlist-view">
      <span className="section-label">YOUR SHORTLIST</span>
      <h2>Ready to order</h2>
      <p className="muted">Show this to your server. Nothing is sent to the kitchen.</p>
      {items.length ? (
        <>
          <div className="shortlist-items">
            {items.map((dish) => (
              <div key={dish.id}>
                <Separator />
                <article>
                  <div>
                    <strong>{dish.name}</strong>
                    <p>{dish.summary}</p>
                    <Chip color="success" size="sm" variant="soft">Order-ready</Chip>
                  </div>
                  <strong>{money(dish.price)}</strong>
                  <CloseButton aria-label={`Remove ${dish.name}`} onPress={() => onRemove(dish.id)} />
                </article>
              </div>
            ))}
          </div>
          <Separator />
          <div className="order-total">
            <strong>Order-ready items</strong>
            <strong>{money(total)}</strong>
            <p>Prices are draft values from public listings.</p>
          </div>
          <Alert status="warning">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>Note for the server</Alert.Title>
              <Alert.Description>Ask about allergy options before ordering.</Alert.Description>
            </Alert.Content>
          </Alert>
          <div className="shortlist-action">
            <Button fullWidth onPress={onServer}>Show to server</Button>
          </div>
        </>
      ) : (
        <EmptyState>
          <LogoMark />
          <h3>Your shortlist is empty</h3>
          <p>Save dishes to keep a calm, order-ready list.</p>
        </EmptyState>
      )}
    </section>
  )
}
