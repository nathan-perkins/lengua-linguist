import VideoTimeline from './VideoTimeline'

interface Segment {
  index: number
  start: number
  end: number
}

interface LoopControlFrameProps {
  currentTime: number
  duration: number
  controlSegments: Segment[]
  activeSegmentIndex: number | null
  pendingSegmentStart: number | null
  onSeek?: (time: number) => void
  loopController: boolean
}

function LoopControlFrame({ currentTime, duration, controlSegments, activeSegmentIndex, pendingSegmentStart, onSeek, loopController }: LoopControlFrameProps) {
  return (
    <div className="loop-control-frame">
      <div className="control-timeline">
        <VideoTimeline
          currentTime={currentTime}
          duration={duration}
          segments={controlSegments}
          activeSegmentIndex={activeSegmentIndex}
          pendingSegmentStart={pendingSegmentStart}
          onSeek={onSeek}
          loopController={loopController}
        />
      </div>
    </div>
  )
}

export default LoopControlFrame