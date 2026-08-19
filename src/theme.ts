/**
 * Day / night theming follows the selected meal period so the room
 * matches the menu: Brunch and Lunch are sunlit; Dinner is navy night.
 * The clock only picks the starting meal on first load.
 */
import { useEffect } from 'react'
import { logWarn } from './logger'

export type TimeOfDay = 'day' | 'night'
export type ClockMeal = 'Brunch' | 'Lunch' | 'Dinner'

const DAY_START_HOUR = 7
const NIGHT_START_HOUR = 18

export const isNightHour = (hour: number): boolean => (
  hour < DAY_START_HOUR || hour >= NIGHT_START_HOUR
)

export const timeOfDayFromDate = (date = new Date()): TimeOfDay => (
  isNightHour(date.getHours()) ? 'night' : 'day'
)

/** Maps local hour to the service period shown in the header. */
export const mealFromDate = (date = new Date()): ClockMeal => {
  const hour = date.getHours()
  if (hour >= 8 && hour < 12) return 'Brunch'
  if (hour >= 12 && hour < 17) return 'Lunch'
  return 'Dinner'
}

/** Dinner is the night room. Brunch and Lunch stay in daylight. */
export const isNightMeal = (meal: ClockMeal): boolean => meal === 'Dinner'

/** Applies HeroUI `.dark` plus our `data-theme` from the selected meal. */
export const applyDayNightTheme = (meal: ClockMeal) => {
  try {
    const night = isNightMeal(meal)
    const root = document.documentElement
    root.classList.toggle('dark', night)
    root.dataset.theme = night ? 'night' : 'day'
    root.style.colorScheme = night ? 'dark' : 'light'
  } catch (error) {
    logWarn('Could not apply day/night theme', error)
  }
}

/** Re-applies the room whenever the guest switches Brunch, Lunch, or Dinner. */
export const useDayNightTheme = (meal: ClockMeal) => {
  useEffect(() => {
    applyDayNightTheme(meal)
  }, [meal])
}
