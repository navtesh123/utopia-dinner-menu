/**
 * "Explain this dish" button plus a story card that opens over the plate.
 * The story is a dialog, not an inline expand, so the guest can read and close it.
 */
import { Button } from '@heroui/react'
import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { explanationFor, factsFor, parseExplainLine, spiceLabelFor } from './dishExplanations'
import { localize, type Locale } from './data'

type DishExplainProps = {
  dishId: string
  dishName: string
  locale: Locale
  askLabel: string
  closeLabel: string
  kicker: string
  onHaptic: (style?: 'light' | 'medium' | 'heavy') => void
}

export function DishExplain({
  dishId,
  dishName,
  locale,
  askLabel,
  closeLabel,
  kicker,
  onHaptic,
}: DishExplainProps) {
  const [open, setOpen] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)
  const titleId = useId()
  const lines = explanationFor(dishId, locale)
  const facts = factsFor(dishId)

  const close = () => {
    onHaptic('light')
    setOpen(false)
  }

  useEffect(() => {
    setOpen(false)
  }, [dishId])

  useEffect(() => {
    if (!open) return
    closeRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      onHaptic('light')
      setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onHaptic])

  if (lines.length === 0) return null

  const card = open ? (
    <div
      className="dish-explain-overlay"
      onClick={close}
    >
      <article
        aria-labelledby={titleId}
        aria-modal="true"
        className="dish-explain-card"
        role="dialog"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="dish-explain-card-handle" aria-hidden="true" />
        <button
          ref={closeRef}
          aria-label={closeLabel}
          className="dish-explain-card-close"
          type="button"
          onClick={close}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6l-12 12m0-12l12 12" />
          </svg>
        </button>
        <span className="section-label dish-explain-card-kicker">{kicker}</span>
        <h2 className="dish-explain-card-title" id={titleId}>{dishName}</h2>
        <div className="dish-explain-card-story">
          {lines.map((line) => (
            <p key={line}>
              {parseExplainLine(line).map((part, index) => (
                part.highlight
                  ? <em className="dish-explain-mark" key={`${part.text}-${index}`}>{part.text}</em>
                  : <span key={`${part.text}-${index}`}>{part.text}</span>
              ))}
            </p>
          ))}
        </div>
        {facts && (
          <ul className="dish-explain-pills">
            <li className="dish-explain-pill" data-accent="true">
              {spiceLabelFor(facts.spice, locale)}
            </li>
            {facts.notes.map((note) => (
              <li className="dish-explain-pill" key={note.EN}>
                {localize(note, locale)}
              </li>
            ))}
          </ul>
        )}
      </article>
    </div>
  ) : null

  return (
    <section className="dish-explain">
      <Button
        className="dish-explain-ask"
        fullWidth
        onPress={() => {
          onHaptic('medium')
          setOpen(true)
        }}
      >
        {askLabel}
      </Button>
      {card ? createPortal(card, document.body) : null}
    </section>
  )
}
