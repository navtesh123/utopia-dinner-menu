import { Button } from '@heroui/react'
import { useEffect, useMemo, useState } from 'react'
import { categories, dishes, filterTags, type Dish, type Tag } from './data'

type View = 'menu' | 'choose' | 'moods' | 'shortlist' | 'detail'
type Mood = 'Fresh' | 'Comforting' | 'Bold' | 'Familiar'

const money = (value: number) => `£${value.toFixed(2)}`

function LogoMark() {
  return <span className="logo-mark" aria-hidden="true">u</span>
}

function DishArt({ dish, large = false }: { dish: Dish; large?: boolean }) {
  return <div className={`dish-art ${dish.colour} ${large ? 'large' : ''}`} aria-label={`Illustration placeholder for ${dish.name}`} role="img"><span>✦</span></div>
}

function Tags({ tags, max }: { tags: Tag[]; max?: number }) {
  return <div className="tags">{tags.slice(0, max).map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div>
}

export function App() {
  const [view, setView] = useState<View>('menu')
  const [selected, setSelected] = useState<Dish | null>(null)
  const [activeFilters, setActiveFilters] = useState<Tag[]>([])
  const [search, setSearch] = useState('')
  const [shortlist, setShortlist] = useState<string[]>(() => JSON.parse(localStorage.getItem('utopia-shortlist') || '[]'))
  const [answers, setAnswers] = useState<{ hunger?: string; mood?: Mood; dietary?: Tag; time?: string }>({})
  const [question, setQuestion] = useState(0)

  useEffect(() => localStorage.setItem('utopia-shortlist', JSON.stringify(shortlist)), [shortlist])

  const shownDishes = useMemo(() => dishes.filter((dish) => {
    const matchesFilter = activeFilters.every((tag) => dish.tags.includes(tag))
    const text = `${dish.name} ${dish.summary} ${dish.category}`.toLowerCase()
    return matchesFilter && text.includes(search.toLowerCase())
  }), [activeFilters, search])

  const shortlistItems = dishes.filter((dish) => shortlist.includes(dish.id))
  const navigate = (next: View) => { setView(next); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const chooseDish = (dish: Dish) => { setSelected(dish); navigate('detail') }
  const toggleShortlist = (id: string) => setShortlist((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
  const toggleFilter = (tag: Tag) => setActiveFilters((current) => current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag])

  const recommendations = useMemo(() => {
    return dishes.filter((dish) => dish.available && dish.category !== 'Drinks').map((dish) => {
      let score = dish.tags.includes('Popular') ? 1 : 0
      if (answers.dietary && dish.tags.includes(answers.dietary)) score += 8
      if (answers.mood === 'Fresh' && (dish.tags.includes('Vegan') || dish.id === 'seared-fish')) score += 4
      if (answers.mood === 'Comforting' && ['lemon-chicken', 'mushroom-orzo', 'sticky-date'].includes(dish.id)) score += 4
      if (answers.mood === 'Bold' && dish.tags.includes('Spicy')) score += 4
      if (answers.mood === 'Familiar' && dish.tags.includes('Popular')) score += 4
      if (answers.time === 'Quick' && dish.tags.includes('Quick')) score += 3
      if (answers.hunger === 'Feast' && dish.category === 'Mains') score += 2
      return { dish, score }
    }).sort((a, b) => b.score - a.score).slice(0, 3)
  }, [answers])

  return <main className="site-shell">
    <div className="phone-frame">
      <header className="topbar">
        <span className="eyebrow">DINNER TONIGHT · TABLE 12</span>
        <button className="language" aria-label="Language selector">EN⌄</button>
      </header>
      <div className="brand-row"><LogoMark /><div><h1>Utopia</h1><p>Kitchen open until 22:30 · High Street</p></div><button className="more" aria-label="More menu options">•••</button></div>

      {view === 'menu' && <MenuView shownDishes={shownDishes} activeFilters={activeFilters} search={search} onSearch={setSearch} onFilter={toggleFilter} onClear={() => setActiveFilters([])} onDish={chooseDish} onNavigate={navigate} />}
      {view === 'detail' && selected && <DetailView dish={selected} saved={shortlist.includes(selected.id)} onBack={() => navigate('menu')} onSave={() => toggleShortlist(selected.id)} onPairing={chooseDish} />}
      {view === 'choose' && <ChooseView answers={answers} question={question} recommendations={recommendations.map((entry) => entry.dish)} onAnswer={(key, value) => { setAnswers((current) => ({ ...current, [key]: value })); setQuestion((current) => Math.min(current + 1, 4)) }} onRestart={() => { setAnswers({}); setQuestion(0) }} onDish={chooseDish} onSaveAll={() => setShortlist(recommendations.map(({ dish }) => dish.id))} />}
      {view === 'moods' && <MoodView onMood={(mood) => { setAnswers((current) => ({ ...current, mood })); setQuestion(4); navigate('choose') }} />}
      {view === 'shortlist' && <ShortlistView items={shortlistItems} onRemove={toggleShortlist} />}

      <nav className="bottom-nav" aria-label="Primary navigation">
        <button className={view === 'menu' || view === 'detail' ? 'active' : ''} onClick={() => navigate('menu')}>Menu</button>
        <button className={view === 'choose' || view === 'moods' ? 'active' : ''} onClick={() => navigate('choose')}>Choose</button>
        <button className={view === 'shortlist' ? 'active' : ''} onClick={() => navigate('shortlist')}>Shortlist <em>{shortlist.length || ''}</em></button>
        <button onClick={() => alert('Please ask your server - they will be happy to help.')}>Server</button>
      </nav>
    </div>
    <p className="demo-note">Prototype content only - replace with approved restaurant data before launch.</p>
  </main>
}

function MenuView({ shownDishes, activeFilters, search, onSearch, onFilter, onClear, onDish, onNavigate }: { shownDishes: Dish[]; activeFilters: Tag[]; search: string; onSearch: (value: string) => void; onFilter: (tag: Tag) => void; onClear: () => void; onDish: (dish: Dish) => void; onNavigate: (view: View) => void }) {
  return <section className="view menu-view">
    <div className="offer-strip"><span>TONIGHT</span><b>Seasonal feature — 20% off until 20:00</b></div>
    <section className="hero-feature">
      <div><span className="section-label">SEASONAL FEATURE</span><h2>Summer plates, made for slow evenings.</h2><p>One bright dish, one clean offer, no hard sell.</p><button className="text-link">Read the feature →</button></div>
      <DishArt dish={dishes[0]} />
    </section>
    <div className="search-row"><label className="search"><span>⌕</span><input value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Search the menu" aria-label="Search the menu" /></label></div>
    <div className="filter-scroll" aria-label="Menu filters">{filterTags.map((tag) => <button key={tag} className={activeFilters.includes(tag) ? 'filter active' : 'filter'} onClick={() => onFilter(tag)}>{tag}{activeFilters.includes(tag) && ' ×'}</button>)}{activeFilters.length > 0 && <button className="clear" onClick={onClear}>Clear all</button>}</div>
    <div className="action-grid"><Button className="primary-action" onPress={() => document.getElementById('starters')?.scrollIntoView({ behavior: 'smooth' })}>Browse menu</Button><Button className="outline-action" onPress={() => onNavigate('choose')}>Help me choose</Button></div>
    <section className="category-index"><span className="section-label">EXPLORE DINNER</span>{categories.map(([name, cue]) => <button key={name} onClick={() => document.getElementById(name.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })}><strong>{name}</strong><span>{cue} · {dishes.filter((dish) => dish.category === name).length}</span></button>)}</section>
    {categories.map(([category, cue]) => { const inCategory = shownDishes.filter((dish) => dish.category === category); return <section className="menu-category" id={category.toLowerCase()} key={category}><div className="category-heading"><div><h2>{category}</h2><p>{cue}</p></div><span>{inCategory.length} dishes</span></div>{inCategory.length ? inCategory.map((dish) => <DishRow dish={dish} onClick={() => onDish(dish)} key={dish.id} />) : <p className="empty">No dishes match these filters. Try clearing one.</p>}</section> })}
  </section>
}

function DishRow({ dish, onClick, why }: { dish: Dish; onClick: () => void; why?: string }) { return <button className={`dish-row ${!dish.available ? 'unavailable' : ''}`} onClick={onClick}><DishArt dish={dish} /><span className="dish-copy"><span className="dish-title"><b>{dish.name}</b><strong>{money(dish.price)}</strong></span><span>{dish.summary}</span>{why && <i>{why}</i>}<Tags tags={dish.tags} max={2} /></span>{!dish.available && <span className="availability">Unavailable today</span>}</button> }

function DetailView({ dish, saved, onBack, onSave, onPairing }: { dish: Dish; saved: boolean; onBack: () => void; onSave: () => void; onPairing: (dish: Dish) => void }) {
  const pair = dish.pairing ? dishes.find((item) => item.id === dish.pairing?.id) : undefined
  return <section className="view detail-view"><button className="back" onClick={onBack}>← Menu</button><DishArt dish={dish} large /><div className="detail-title"><div><span className="section-label">{dish.category.toUpperCase()}</span><h2>{dish.name}</h2></div><b>{money(dish.price)}</b></div><p className="detail-summary">{dish.summary}</p><Tags tags={dish.tags} /><section className="detail-block"><span className="section-label">WHAT IT TASTES LIKE</span><p>{dish.description}</p></section><section className="detail-block allergy"><span className="section-label">DIETARY & ALLERGY</span><p>Contains ingredients of concern listed plainly. This is not a safety guarantee; please speak to your server about allergies.</p><button className="text-link">Please speak to your server about allergies →</button></section><section className="nutrition"><span className="section-label">NUTRITION AT A GLANCE</span><div><b>{dish.calories}<small>kcal</small></b><b>{dish.protein}g<small>protein</small></b><b>{dish.carbs}g<small>carbs</small></b><b>{dish.fat}g<small>fat</small></b></div></section>{dish.customisations && <section className="detail-block"><span className="section-label">MAKE IT YOURS</span>{dish.customisations.map((item) => <button className="custom-option" key={item}>{item}<span>Choose →</span></button>)}</section>}{pair && <section className="pairing"><span className="section-label">GOES WELL WITH</span><button onClick={() => onPairing(pair)}><DishArt dish={pair} /><span><b>{pair.name}</b><p>{dish.pairing?.reason}</p></span><strong>{money(pair.price)}</strong></button></section>}<Button className="primary-action save-button" onPress={onSave} isDisabled={!dish.available}>{saved ? 'Saved to shortlist' : 'Add to shortlist'}</Button></section>
}

function ChooseView({ answers, question, recommendations, onAnswer, onRestart, onDish, onSaveAll }: { answers: { hunger?: string; mood?: Mood; dietary?: Tag; time?: string }; question: number; recommendations: Dish[]; onAnswer: (key: 'hunger' | 'mood' | 'dietary' | 'time', value: string) => void; onRestart: () => void; onDish: (dish: Dish) => void; onSaveAll: () => void }) {
  if (question >= 4) return <section className="view choose-view"><span className="section-label">FIND MY PLATE · YOUR MATCHES</span><h2>Three plates that match what you asked for</h2><p className="muted">Curated from menu facts - no personal data is saved.</p><button className="text-link" onClick={onRestart}>Change answers</button><div className="recommendations">{recommendations.map((dish) => <DishRow dish={dish} onClick={() => onDish(dish)} key={dish.id} why={`Why it fits — ${dish.tags.includes('Quick') ? 'ready quickly, ' : ''}${dish.tags.includes('Vegan') ? 'plant-powered, ' : ''}made for tonight.`} />)}</div><div className="action-grid two"><Button className="outline-action" onPress={onRestart}>Start again</Button><Button className="primary-action" onPress={onSaveAll}>Save all three</Button></div></section>
  const steps = [
    { key: 'hunger' as const, title: 'How hungry are you?', help: 'There is no wrong answer. You can change it later.', choices: ['Light', 'Proper', 'Feast'] },
    { key: 'mood' as const, title: 'What sounds good right now?', help: 'Pick the one that fits - you can change it later.', choices: ['Fresh', 'Comforting', 'Bold', 'Familiar'] },
    { key: 'dietary' as const, title: 'Anything we should work around?', help: 'We only show confirmed menu tags.', choices: ['Vegan', 'Gluten-free', 'Halal', 'No preference'] },
    { key: 'time' as const, title: 'How much time do you have?', help: 'We will prioritise dishes ready sooner.', choices: ['Quick', 'No rush'] },
  ][question]
  return <section className="view choose-view"><span className="section-label">FIND MY PLATE · {question + 1} OF 4</span><div className="progress"><i style={{ width: `${(question + 1) * 25}%` }} /></div><h2>{steps.title}</h2><p className="muted">{steps.help}</p><div className="choice-list">{steps.choices.map((choice) => <button key={choice} onClick={() => onAnswer(steps.key, choice)}>{choice}<span>→</span></button>)}</div><p className="privacy-note">No sign-in. Nothing is saved after you leave, except your shortlist on this device.</p></section>
}

function MoodView({ onMood }: { onMood: (mood: Mood) => void }) { return <section className="view mood-view"><span className="section-label">BROWSE BY MOOD</span><h2>What sounds right, right now?</h2><p className="muted">No questions, no data. Just a more intuitive way to browse.</p><div className="mood-grid">{(['Fresh', 'Comforting', 'Bold', 'Familiar'] as Mood[]).map((mood, index) => <button key={mood} onClick={() => onMood(mood)}><span className={`mood-art tone-${index}`} aria-hidden="true">✦</span><b>{mood === 'Fresh' ? 'Bright & fresh' : mood === 'Comforting' ? 'Big comfort' : mood === 'Bold' ? 'Spicy adventure' : 'Something familiar'}</b><small>{[6, 8, 5, 7][index]} dishes</small></button>)}</div></section> }

function ShortlistView({ items, onRemove }: { items: Dish[]; onRemove: (id: string) => void }) { const total = items.reduce((sum, dish) => sum + dish.price, 0); return <section className="view shortlist-view"><span className="section-label">YOUR SHORTLIST · TABLE 12</span><h2>Ready to order</h2><p className="muted">Show this to your server. Nothing is sent to the kitchen.</p>{items.length ? <><div className="shortlist-items">{items.map((dish) => <article key={dish.id}><div><b>{dish.name}</b><p>{dish.summary}</p><span>Order-ready</span></div><strong>{money(dish.price)}</strong><button onClick={() => onRemove(dish.id)} aria-label={`Remove ${dish.name}`}>×</button></article>)}</div><div className="order-total"><b>Order-ready items</b><strong>{money(total)}</strong><p>Offer price applied where eligible.</p></div><div className="server-note"><span>NOTE FOR THE SERVER</span><p>Ask about allergy options before ordering.</p></div><Button className="primary-action show-server" onPress={() => alert('Your server will be with you shortly.')}>Show to server</Button></> : <div className="empty-shortlist"><LogoMark /><h3>Your shortlist is empty</h3><p>Save dishes to keep a calm, order-ready list.</p></div>}</section> }
