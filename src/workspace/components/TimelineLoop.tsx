import type { TimelineLoop } from '../types'
import '../css/TimelineLoop.css'

type TimelineLoopProps = {
  loop: TimelineLoop
}

export default function TimelineTick({ loop }: TimelineLoopProps) {
  return (
    <div className="timeline-loop">
      <div
        className="timeline-tick loop-start"
        style={{ '--start': `${loop.start}%` } as React.CSSProperties}
      />
      {loop.end && (
        <div
          className="timeline-tick loop-end"
          style={{ '--end': `${loop.end}%` } as React.CSSProperties}
        />
      )}
    </div>
  )
}
