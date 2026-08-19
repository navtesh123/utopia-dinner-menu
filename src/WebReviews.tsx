/**
 * Landing reviews strip.
 * Shows the public web ratings guests asked to see on first arrival:
 * Facebook, Uber Eats, and Tagvenue, in the same three-column rhythm
 * as a "Reviews from the web" summary.
 */
type ReviewSource = {
  platform: string
  rating: number
  count: number
  countKind: 'votes' | 'reviews'
}

export const webReviews: ReviewSource[] = [
  { platform: 'Facebook', rating: 4.4, count: 105, countKind: 'votes' },
  { platform: 'Uber Eats', rating: 4.7, count: 1000, countKind: 'reviews' },
  { platform: 'Tagvenue', rating: 4.9, count: 6, countKind: 'reviews' },
]

type WebReviewsProps = {
  title: string
  votesLabel: (count: number) => string
  reviewsLabel: (count: number) => string
}

export function WebReviews({ title, votesLabel, reviewsLabel }: WebReviewsProps) {
  return (
    <section aria-label={title} className="web-reviews">
      <h2 className="web-reviews-title">{title}</h2>
      <div className="web-reviews-grid">
        {webReviews.map((source, index) => {
          const countText = source.countKind === 'votes'
            ? votesLabel(source.count)
            : reviewsLabel(source.count)
          return (
            <article
              className="web-review"
              key={source.platform}
              style={{ animationDelay: `${120 + index * 70}ms` }}
            >
              <p className="web-review-platform">{source.platform}</p>
              <p className="web-review-rating">
                <span className="web-review-score">{source.rating.toFixed(1)}</span>
                <span className="web-review-of">/5</span>
              </p>
              <p className="web-review-count">{countText}</p>
            </article>
          )
        })}
      </div>
    </section>
  )
}
