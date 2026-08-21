/**
 * Today's extras: perishable plates at 20% off so they leave the kitchen today.
 */
import { Button } from '@heroui/react'
import type { ReactNode } from 'react'
import { dishes, localize, type Locale } from './data'
import { FoodStage } from './FoodStage'
import { TODAY_PROMO_IDS, TODAY_PROMO_PERCENT, promoPrice } from './pricing'
import { logWarn } from './logger'

export type PromoCopy = {
  title: string
  body: string
  offLabel: string
  add: string
}

type TodaysPromosProps = {
  locale: Locale
  quantities: Record<string, number>
  onDish: (dishId: string) => void
  onAdd: (id: string) => void
  strings: PromoCopy
  money: (value: number) => string
  renderStepper: (id: string, value: number) => ReactNode
  onHaptic: (style?: 'light' | 'medium' | 'heavy') => void
}

export function TodaysPromos({
  locale,
  quantities,
  onDish,
  onAdd,
  strings,
  money,
  renderStepper,
  onHaptic,
}: TodaysPromosProps) {
  const promoDishes = TODAY_PROMO_IDS
    .map((id) => dishes.find((dish) => dish.id === id))
    .filter((dish): dish is NonNullable<typeof dish> => {
      if (!dish) {
        logWarn('Today promo points at a missing dish')
        return false
      }
      return dish.available
    })

  if (promoDishes.length === 0) return null

  return (
    <section className="todays-promos" aria-labelledby="todays-promos-title">
      <div className="todays-promos-header">
        <span className="section-label">{strings.offLabel}</span>
        <h2 id="todays-promos-title">{strings.title}</h2>
        <p>{strings.body}</p>
      </div>
      <div className="todays-promos-track" role="list">
        {promoDishes.map((dish) => {
          const sale = promoPrice(dish.price)
          return (
            <article className="todays-promo-card" key={dish.id} role="listitem">
              <button
                className="todays-promo-hit"
                type="button"
                onClick={() => {
                  onHaptic('medium')
                  onDish(dish.id)
                }}
              >
                <span className="todays-promo-badge">{TODAY_PROMO_PERCENT}% off</span>
                <FoodStage className="todays-promo-stage" src={dish.image} />
                <span className="todays-promo-copy">
                  <strong>{localize(dish.name, locale)}</strong>
                  <span className="todays-promo-prices">
                    <s>{money(dish.price)}</s>
                    <em>{money(sale)}</em>
                  </span>
                </span>
              </button>
              {quantities[dish.id] ? (
                renderStepper(dish.id, quantities[dish.id])
              ) : (
                <Button
                  className="todays-promo-add"
                  size="sm"
                  onPress={() => {
                    onHaptic('medium')
                    onAdd(dish.id)
                  }}
                >
                  {strings.add}
                </Button>
              )}
            </article>
          )
        })}
      </div>
    </section>
  )
}
