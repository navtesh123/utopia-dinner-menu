/**
 * "Explain this dish" control and reveal.
 * Copy stays hidden until the guest asks. Highlights use the storefront yellow.
 * Fact pills sit under the story: spice first in gold, then diet and kitchen notes.
 */
import { Button } from '@heroui/react'
import { useEffect, useState } from 'react'
import { explanationFor, factsFor, parseExplainLine, spiceLabelFor } from './dishExplanations'
import { localize, type Locale } from './data'

type DishExplainProps = {
  dishId: string
  locale: Locale
  askLabel: string
  hideLabel: string
  onHaptic: (style?: 'light' | 'medium' | 'heavy') => void
}

export function DishExplain({ dishId, locale, askLabel, hideLabel, onHaptic }: DishExplainProps) {
  const [open, setOpen] = useState(false)
  const lines = explanationFor(dishId, locale)
  const facts = factsFor(dishId)

  useEffect(() => {
    setOpen(false)
  }, [dishId])

  if (lines.length === 0) return null

  return (
    <section className="dish-explain">
      <Button
        className="dish-explain-ask"
        fullWidth
        onPress={() => {
          onHaptic('medium')
          setOpen((current) => !current)
        }}
      >
        {open ? hideLabel : askLabel}
      </Button>
      {open && (
        <div className="dish-explain-body">
          {lines.map((line) => (
            <p key={line}>
              {parseExplainLine(line).map((part, index) => (
                part.highlight
                  ? <em className="dish-explain-mark" key={`${part.text}-${index}`}>{part.text}</em>
                  : <span key={`${part.text}-${index}`}>{part.text}</span>
              ))}
            </p>
          ))}
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
        </div>
      )}
    </section>
  )
}
