/**
 * Cart upsell: after a guest adds a plate, offer the best stored pairings.
 * Adding from this sheet does not open another upsell, to avoid a loop.
 */
import { Button } from '@heroui/react'
import { dishes, localize, type Dish, type Locale } from './data'
import type { PairingSuggestion } from './pairings'
import { sellingPrice } from './pricing'
import { logWarn } from './logger'

export type UpsellCopy = {
  title: string
  body: (name: string) => string
  add: string
  skip: string
}

type UpsellSheetProps = {
  source: Dish
  suggestions: PairingSuggestion[]
  locale: Locale
  strings: UpsellCopy
  money: (value: number) => string
  onAdd: (id: string) => void
  onClose: () => void
  onHaptic: (style?: 'light' | 'medium' | 'heavy') => void
}

export function UpsellSheet({
  source,
  suggestions,
  locale,
  strings,
  money,
  onAdd,
  onClose,
  onHaptic,
}: UpsellSheetProps) {
  const rows = suggestions
    .map((entry) => {
      const dish = dishes.find((item) => item.id === entry.id)
      if (!dish) {
        logWarn('Upsell row missing dish', entry.id)
        return null
      }
      return { dish, reason: entry.reason }
    })
    .filter((row): row is { dish: Dish; reason: typeof suggestions[number]['reason'] } => Boolean(row))

  if (rows.length === 0) return null

  return (
    <section className="upsell-sheet" aria-labelledby="upsell-title">
      <span className="section-label">{strings.title}</span>
      <h2 id="upsell-title">{strings.body(localize(source.name, locale))}</h2>
      <div className="upsell-list">
        {rows.map(({ dish, reason }) => (
          <article className="upsell-row" key={dish.id}>
            <img alt="" className="upsell-image" src={dish.image} />
            <div className="upsell-copy">
              <strong>{localize(dish.name, locale)}</strong>
              <p>{localize(reason, locale)}</p>
              <span className="upsell-price">{money(sellingPrice(dish.id, dish.price))}</span>
            </div>
            <Button
              className="upsell-add"
              size="sm"
              onPress={() => {
                onHaptic('medium')
                onAdd(dish.id)
              }}
            >
              {strings.add}
            </Button>
          </article>
        ))}
      </div>
      <Button
        className="upsell-skip"
        fullWidth
        variant="ghost"
        onPress={() => {
          onHaptic('light')
          onClose()
        }}
      >
        {strings.skip}
      </Button>
    </section>
  )
}
