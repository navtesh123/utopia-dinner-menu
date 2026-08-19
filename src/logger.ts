/**
 * App-wide error logging switch.
 * Set ERROR_LOGGING to false (or VITE_ERROR_LOGGING=0) before going live
 * so debug output can be silenced without hunting call sites.
 */
const ERROR_LOGGING =
  import.meta.env.VITE_ERROR_LOGGING === '0'
    ? false
    : true

export const isErrorLoggingEnabled = () => ERROR_LOGGING

export const logError = (message: string, detail?: unknown) => {
  if (!ERROR_LOGGING) return
  if (detail !== undefined) {
    console.error(`[utopia] ${message}`, detail)
    return
  }
  console.error(`[utopia] ${message}`)
}

export const logWarn = (message: string, detail?: unknown) => {
  if (!ERROR_LOGGING) return
  if (detail !== undefined) {
    console.warn(`[utopia] ${message}`, detail)
    return
  }
  console.warn(`[utopia] ${message}`)
}
