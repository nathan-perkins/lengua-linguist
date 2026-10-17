import type { Player } from '../types'
import '../css/LoopSequenceManager.css'

type LoopSequenceManagerProps = {
  player: Player
}

export default function LoopSequenceManager({ player }: LoopSequenceManagerProps) {
  return (
    <div className="loop-sequence-manager">
      <div className="sequence-header">Loop sequence</div>
      <div className="sequence-list">
        {player.state.isActiveLoop &&
          player.state.activeLoops.map((loop) => {
            if (loop.isPending) return

            return (
              <div className={`loop-entry${loop.isCurrent ? ' current' : ''}`}>
                <span>{`${loop.start.toFixed(2)}s - ${loop.end!.toFixed(2)}s`}</span>
                <p>{loop.title}</p>
              </div>
            )
          })}
      </div>
    </div>
  )
}
