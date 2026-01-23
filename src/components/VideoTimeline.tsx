import React, { useRef } from 'react'
import TimelineIndicator from './TimelineIndicator'
import { DndContext, type DragEndEvent } from '@dnd-kit/core'
import TimelineTick from './TimelineTick'

interface Segment {
  index: number
  start: number
  end: number
}

interface VideoTimelineProps {
  currentTime: number
  duration: number
  segments?: Segment[]
  activeSegmentIndex: number | null
  pendingSegmentStart: number | null
  onSeek?: (time: number) => void
  onSegmentUpdate?: (index: number, newEnd: number) => void
  loopController?: boolean
}

function getSegmentKey(segment: Segment) {
  return `${segment.start}-${segment.end}`
}

function VideoTimeline({ currentTime, duration, segments, activeSegmentIndex, pendingSegmentStart, onSeek, onSegmentUpdate, loopController }: VideoTimelineProps) {
  const barRef = useRef<HTMLDivElement>(null)

  if (duration <= 0) return

  let progressPercent = 0
  let controllerStart = 0
  let controllerEnd = 0
  let controllerDuration = 0

  if (loopController && segments && segments.length > 0) {
    if (activeSegmentIndex === segments[0].index) {
      const activeSegmentLength = segments[0].end - segments[0].start
      controllerStart = Math.max(0, segments[0].start - activeSegmentLength / 2)
      controllerEnd = Math.min(segments[0].end + activeSegmentLength / 2, duration)

      controllerDuration = controllerEnd - controllerStart
      progressPercent = controllerDuration > 0
        ? ((currentTime - controllerStart) / controllerDuration) * 100
        : 0
    } else if (activeSegmentIndex !== null && activeSegmentIndex > segments[0].index) {
      const activeSegmentLength = segments[activeSegmentIndex].end - segments[activeSegmentIndex].start
      controllerStart = Math.max(0, segments[activeSegmentIndex].start - activeSegmentLength / 2)
      controllerEnd = Math.min(segments[activeSegmentIndex].end + activeSegmentLength / 2, duration)

      controllerDuration = controllerEnd - controllerStart
      progressPercent = controllerDuration > 0
        ? ((currentTime - controllerStart) / controllerDuration) * 100
        : 0
    }
  } else {
    progressPercent = (currentTime / duration) * 100
  }

  const timelineDuration = controllerDuration > 0
    ? controllerDuration
    : duration

  const handleIndicatorDragEnd = (event: DragEndEvent) => {
    if (!timelineDuration || !barRef.current) return

    if (
      event.activatorEvent &&
      'clientX' in event.activatorEvent &&
      typeof (event.activatorEvent as MouseEvent).clientX === 'number'
    ) {
      const rect = barRef.current.getBoundingClientRect()
      const transform = event?.delta.x ?? 0
      const initialLeft = (currentTime / timelineDuration) * rect.width
      const finalLeft = initialLeft + transform
      const percent = Math.max(0, Math.min(1, finalLeft / rect.width))
      const seekTime = percent * timelineDuration
      if (onSeek) onSeek(seekTime)
    }
  }

  const handleMarkerDragEnd = (event: DragEndEvent, segmentIndex: number) => {
    if (!timelineDuration || !barRef.current || !segments) return

    if (
      event.activatorEvent &&
      'clientX' in event.activatorEvent &&
      typeof (event.activatorEvent as MouseEvent).clientX === 'number'
    ) {
      const rect = barRef.current.getBoundingClientRect()
      const transform = event?.delta.x ?? 0

      const segment = segments.find(segment => segment.index === segmentIndex)
      if (!segment) return

      const initialLeft = (segment.end) / timelineDuration * rect.width
      const finalLeft = initialLeft + transform
      const percent = Math.max(0, Math.min(1, finalLeft / rect.width))
      let newEnd = percent * timelineDuration
      
      if (onSegmentUpdate) {
        newEnd = Math.max(newEnd, segment.start)
        onSegmentUpdate(segmentIndex, newEnd)
      }
    }
  }

  const parseTickId = (id: string) => {
    // id format: "segment-<index>-start" or "segment-<index>-end"
    const match = id.match(/^segment-(\d+)-(end)$/)
    if (!match) return null
    return { segmentIndex: Number(match[1]) }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    // Indicator drag
    if (event.active.id === 'timeline-indicator') {
      handleIndicatorDragEnd(event)
      return
    }
    // Tick drag
    const tickInfo = parseTickId(String(event.active.id))
    if (tickInfo) {
      handleMarkerDragEnd(event, tickInfo.segmentIndex)
    }
  }

  let pendingMarker

  if (pendingSegmentStart !== null) {
    pendingMarker = (pendingSegmentStart / timelineDuration) * 100
  }

  const indicatorTime = loopController && segments && segments.length > 0
    ? currentTime - controllerStart
    : currentTime

  const showIndicator = indicatorTime >= 0 && indicatorTime <= timelineDuration

  const barWidth = barRef.current?.offsetWidth ?? 0

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="video-timeline-bar" ref={barRef}>
        {pendingSegmentStart !== null && (
          <div
            className="video-timeline-tick active-timeline-tick"
            style={{ left: `${pendingMarker}%` }}
            aria-label={`Pending segment start at ${pendingMarker}s`}
          />
        )}
        {segments && segments.map((segment, idx) => {
          const startMarker = ((segment.start - controllerStart) / timelineDuration) * 100
          const endMarker = ((segment.end - controllerStart) / timelineDuration) * 100
          const keyBase = getSegmentKey(segment)
          const isActive = loopController
            ? activeSegmentIndex === segment.index
            : idx === activeSegmentIndex && pendingSegmentStart === null

          return (
            <React.Fragment key={keyBase}>
              <TimelineTick
                id={`segment-${segment.index}-start`}
                leftPercent={startMarker}
                isActive={isActive}
                ariaLabel={`Segment start at ${segment.start}s`}
              />
              <TimelineTick
                id={`segment-${segment.index}-end`}
                leftPercent={endMarker}
                isActive={isActive}
                ariaLabel={`Segment end at ${segment.end}s`}
                draggable={segment.index === segments.length - 1}
                minLeftPercent={startMarker}
                barWidth={barWidth}
              />
            </React.Fragment>
          )
        })}
        <div className="video-timeline-progress" style={{ width: `${progressPercent}%` }} />
        {showIndicator && (
          <TimelineIndicator currentTime={loopController && segments && segments.length > 0 ? currentTime - controllerStart : currentTime} duration={timelineDuration} />
        )}
      </div>
    </DndContext>
  )
}

export default VideoTimeline