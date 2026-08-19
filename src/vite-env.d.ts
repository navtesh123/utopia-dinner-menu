/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Set to "0" to turn off app error logs in one place. */
  readonly VITE_ERROR_LOGGING?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
