import { useDraggable } from '@dnd-kit/core'

interface TimelineIndicatorProps {
  currentTime: number
  duration: number
}

function TimelineIndicator({ currentTime, duration }: TimelineIndicatorProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: 'timeline-indicator'
  })

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0
  const left = `calc(${progressPercent}% - 8px)`

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="video-timeline-indicator"
      style={{
        left,
        transform: transform
          ? `translate3d(${transform.x}px, -50%, 0)`
          : 'translateY(-50%)',
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      role="slider"
      aria-valuenow={currentTime}
      aria-valuemin={0}
      aria-valuemax={duration}
      tabIndex={0}
    />
  )
}

export default TimelineIndicator