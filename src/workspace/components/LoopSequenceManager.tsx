import { IconPlus } from '@tabler/icons-react'
import type { Player } from '../types'
import '../css/LoopSequenceManager.css'

type LoopSequenceManagerProps = {
  player: Player
}

export default function LoopSequenceManager({ player }: LoopSequenceManagerProps) {
  return (
    <div className="loop-sequence-manager">
      <div className="sequence-header">
        <span>Loop sequence</span>
        <button type="button" className="add-loop-btn" onClick={player.handlers.handleNewLoop}>
          <IconPlus />
        </button>
      </div>
      <div className="sequence-list">
        {player.state.isActiveLoop &&
          player.state.activeLoops.map((loop) => {
            if (loop.isPending) return

            return (
              <button
                className={`loop-entry${loop.isCurrent ? ' current' : ''}`}
                onClick={() => player.handlers.handleSelectLoop(loop)}
              >
                <span>{`${loop.start.toFixed(2)}s - ${loop.end!.toFixed(2)}s`}</span>
                <p>{loop.title}</p>
              </button>
            )
          })}
      </div>
    </div>
  )
}
