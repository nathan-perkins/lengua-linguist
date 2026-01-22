import VideoTimeline from './VideoTimeline'

interface Segment {
  index: number
  start: number
  end: number
}

interface LoopControlFrameProps {
  currentTime: number
  duration: number
  segments: Segment[]
  activeSegmentIndex: number | null
  pendingSegmentStart: number | null
  onSeek?: (time: number) => void
  onSegmentUpdate?: (index: number, newStart: number, newEnd: number) => void
  loopController: boolean
}

function LoopControlFrame({ currentTime, duration, segments, activeSegmentIndex, pendingSegmentStart, onSeek, onSegmentUpdate, loopController }: LoopControlFrameProps) {
  return (
    <div className="loop-control-frame">
      <div className="control-timeline">
        <VideoTimeline
          currentTime={currentTime}
          duration={duration}
          segments={segments}
          activeSegmentIndex={activeSegmentIndex}
          pendingSegmentStart={pendingSegmentStart}
          onSeek={onSeek}
          onSegmentUpdate={onSegmentUpdate}
          loopController={loopController}
        />
      </div>
    </div>
  )
}

export default LoopControlFrame