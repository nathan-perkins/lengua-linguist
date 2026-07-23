import { useLayoutEffect, useRef, useState } from 'react'
import { useDraggable } from '@dnd-kit/core'

interface TimelineIndicatorProps {
  currentTime: number
  duration: number
}

function TimelineIndicator({ currentTime, duration }: TimelineIndicatorProps) {
  const {
 attributes, listeners, setNodeRef, transform, isDragging 
} =
    useDraggable({
      id: 'timeline-indicator'
    })

  const indicatorRef = useRef<HTMLDivElement>(null)
  const [barWidth, setBarWidth] = useState(0)

  useLayoutEffect(() => {
    const updateBarWidth = () => {
      const bar = indicatorRef.current?.parentElement
      setBarWidth(bar?.offsetWidth ?? 0)
    }

    updateBarWidth()

    const bar = indicatorRef.current?.parentElement
    if (!bar) return

    if (typeof ResizeObserver !== 'undefined') {
      const resizeObserver = new ResizeObserver(() => {
        updateBarWidth()
      })

      resizeObserver.observe(bar)

      return () => {
        resizeObserver.disconnect()
      }
    }

    window.addEventListener('resize', updateBarWidth)

    return () => {
      window.removeEventListener('resize', updateBarWidth)
    }
  }, [])

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0
  const initialLeftPx = barWidth * (progressPercent / 100)
  const dragX = transform?.x ?? 0

  const minX = -initialLeftPx
  const maxX = barWidth - initialLeftPx
  const clampedX = Math.max(minX, Math.min(maxX, dragX))

  const left = `calc(${progressPercent}% - 8px)`

  return (
    <div
      ref={(el) => {
        setNodeRef(el)
        indicatorRef.current = el
      }}
      {...listeners}
      {...attributes}
      className="video-timeline-indicator"
      style={{
        left,
        transform: transform
          ? `translate3d(${clampedX}px, -50%, 0)`
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
