/**
 * Framed food photo.
 * Source shots are tight macros. This sits the whole plate on a soft table
 * instead of cropping into gravy and grease.
 */
type FoodStageProps = {
  src: string
  className?: string
}

export function FoodStage({ src, className }: FoodStageProps) {
  return (
    <div className={className ? `food-stage ${className}` : 'food-stage'}>
      <img alt="" aria-hidden="true" className="food-stage-bleed" src={src} />
      <img alt="" className="food-stage-plate" src={src} />
    </div>
  )
}
