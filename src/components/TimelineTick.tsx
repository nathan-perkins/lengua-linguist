import { useDraggable } from '@dnd-kit/core'

interface TimelineTickProps {
  leftPercent: number
  isActive: boolean
  ariaLabel: string
  id: string
}

function TimelineTick({ leftPercent, isActive, ariaLabel, id }: TimelineTickProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id })

  const dragX = transform?.x ?? 0

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`video-timeline-tick${isActive ? ' active-timeline-tick' : ''}`}
      style={{
        left: `${leftPercent}%`,
        cursor: isDragging ? 'grabbing' : 'grab',
        zIndex: isActive ? 4 : 3,
        transform: transform
          ? `translate3d(${dragX}px, 0, 0)`
          : undefined,
        transition: isDragging ? 'none' : 'transform 0.1s'
      }}
      aria-label={ariaLabel}
      tabIndex={0}
    />
  )
}

export default TimelineTick