/**
 * After "I have ordered": a short toast of joy, then the guest goes back to the menu.
 * Confetti is CSS-only so we do not add a package. Honors reduced motion.
 */
import { useMemo } from 'react'

type OrderCelebrateProps = {
  title: string
  body: string
}

const PIECE_COUNT = 46

export function OrderCelebrate({ title, body }: OrderCelebrateProps) {
  const pieces = useMemo(
    () => Array.from({ length: PIECE_COUNT }, (_, index) => ({
      id: index,
      left: `${4 + ((index * 17) % 92)}%`,
      delay: `${(index % 12) * 0.05}s`,
      duration: `${1.7 + (index % 7) * 0.12}s`,
      drift: `${(index % 2 === 0 ? -1 : 1) * (10 + (index % 8) * 4)}px`,
      hue: index % 4,
      size: 0.28 + (index % 5) * 0.06,
    })),
    [],
  )

  return (
    <div className="order-celebrate" role="status" aria-live="polite">
      <div className="order-celebrate-confetti" aria-hidden="true">
        {pieces.map((piece) => (
          <span
            className="order-celebrate-piece"
            data-hue={piece.hue}
            key={piece.id}
            style={{
              left: piece.left,
              animationDelay: piece.delay,
              animationDuration: piece.duration,
              ['--drift' as string]: piece.drift,
              width: `${piece.size}rem`,
              height: `${piece.size * 1.7}rem`,
            }}
          />
        ))}
      </div>
      <div className="order-celebrate-card">
        <span className="order-celebrate-mark" aria-hidden="true">✦</span>
        <h2>{title}</h2>
        <p>{body}</p>
      </div>
    </div>
  )
}
