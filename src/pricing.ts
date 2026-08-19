/**
 * Today's perishable promos and sale-price helpers.
 * These are plates the kitchen needs to sell before close (soup, greens, fish, guacamole).
 * Turn off all sale math by emptying TODAY_PROMO_IDS.
 */
import { logWarn } from './logger'

/** Percent taken off the listed price for today's extras. */
export const TODAY_PROMO_PERCENT = 20

/**
 * Items that lose quality if they sit. Edit this list to change the daily specials.
 * Prices stay on the dish record; this file only marks which ones are on promo.
 */
export const TODAY_PROMO_IDS = [
  'homemade-daily-soup',
  'field-mix-greens',
  'fish-tacos',
  'seared-tuna-avocado-sandwich',
  'grilled-shrimp-burrito',
  'house-made-guacamole',
] as const

export const isTodayPromo = (dishId: string): boolean => (
  (TODAY_PROMO_IDS as readonly string[]).includes(dishId)
)

/** 20% off, rounded to the nearest cent. */
export const promoPrice = (listedPrice: number): number => {
  if (!Number.isFinite(listedPrice) || listedPrice < 0) {
    logWarn('promoPrice received an invalid listed price', listedPrice)
    return 0
  }
  return Math.round(listedPrice * (1 - TODAY_PROMO_PERCENT / 100) * 100) / 100
}

/** Listed price if the dish is on today's promo, otherwise the regular price. */
export const sellingPrice = (dishId: string, listedPrice: number): number => (
  isTodayPromo(dishId) ? promoPrice(listedPrice) : listedPrice
)
