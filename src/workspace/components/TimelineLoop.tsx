import type { TimelineLoop } from '../types'
import '../css/TimelineLoop.css'

type TimelineLoopProps = {
  loop: TimelineLoop
  videoDuration: number
}

export default function TimelineTick({ loop, videoDuration }: TimelineLoopProps) {
  return (
    <div className="timeline-loop">
      <div
        className={`timeline-tick loop-start${loop.isCurrent ? ' current' : ''}`}
        style={{ '--start': `${(loop.start / videoDuration) * 100}%` } as React.CSSProperties}
      />
      {loop.end && (
        <div
          className={`timeline-tick loop-end${loop.isCurrent ? ' current' : ''}`}
          style={{ '--end': `${(loop.end / videoDuration) * 100}%` } as React.CSSProperties}
        />
      )}
    </div>
  )
}
