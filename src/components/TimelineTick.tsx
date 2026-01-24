import { useDraggable } from '@dnd-kit/core'

interface TimelineTickProps {
  leftPercent: number
  isActive: boolean
  ariaLabel: string
  id: string
  draggable?: boolean
  minLeftPercent?: number
  maxLeftPercent?: number
  barWidth?: number
}

function TimelineTick({ leftPercent, isActive, ariaLabel, id, draggable = false, minLeftPercent, maxLeftPercent, barWidth }: TimelineTickProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id })

  const dragX = transform?.x ?? 0

  let clampedX = dragX
  if (draggable && typeof minLeftPercent === 'number' && typeof maxLeftPercent === 'number' && typeof barWidth === 'number') {
    const percentWidth = leftPercent - minLeftPercent
    const minX = -percentWidth / 100 * barWidth
    const maxX = ((maxLeftPercent - leftPercent) / 100) * barWidth
    clampedX = Math.max(minX, Math.min(dragX, maxX))
  }

  return (
    <div
      ref={draggable ? setNodeRef : undefined}
      {...(draggable ? listeners : {})}
      {...(draggable ? attributes : {})}
      className={`video-timeline-tick${isActive ? ' active-timeline-tick' : ''}`}
      style={{
        left: `${leftPercent}%`,
        cursor: draggable ? (isDragging ? 'grabbing' : 'grab') : 'default',
        zIndex: isActive ? 4 : 3,
        transform: draggable && transform
          ? `translate3d(${clampedX}px, 0, 0)`
          : undefined,
        transition: draggable && isDragging ? 'none' : 'transform 0.1s'
      }}
      aria-label={ariaLabel}
      tabIndex={0}
    />
  )
}

export default TimelineTick