import type { PlayerState } from '../types'

export const getCurrent = (state: PlayerState) => {
  const index = state.activeLoops.findIndex((loop) => loop.isCurrent)
  return { index, loop: state.activeLoops[index] }
}

export const selectLoop = (state: PlayerState, target: number): PlayerState => ({
  ...state,
  activeLoops: state.activeLoops.map((loop, index) => ({ ...loop, isCurrent: index === target }))
})

export const stepBackward = (state: PlayerState): PlayerState => {
  const { index, loop } = getCurrent(state)
  if (!loop || !index || index <= 0) return state

  return selectLoop(state, index - 1)
}

export const stepForward = (state: PlayerState): PlayerState => {
  const { index, loop } = getCurrent(state)
  if (!loop || loop.isPending) return state

  if (index !== state.activeLoops.length - 1) return selectLoop(state, index + 1)

  const nextId = Math.max(...state.activeLoops.map((loop) => loop.id)) + 1

  return {
    ...state,
    activeLoops: [
      ...state.activeLoops.map((loop) => ({ ...loop, isCurrent: false })),
      {
        id: nextId,
        title: `Loop ${nextId + 1}`,
        start: loop.end!,
        end: null,
        isCurrent: true,
        isPending: true
      }
    ]
  }
}

export const undoLoop = (state: PlayerState): PlayerState => {
  const { index, loop } = getCurrent(jumpToLatest(state))
  if (!loop) return state

  const next = {
    ...state,
    activeLoops: state.activeLoops.filter((_, indexFilter) => index !== indexFilter)
  }

  return jumpToLatest(next)
}

export const mergeLoop = (state: PlayerState): PlayerState => {
  const { index, loop } = getCurrent(state)
  if (index <= 0) return state

  const previous = state.activeLoops[index - 1]
  const merged = {
    ...previous,
    end: loop.end,
    isCurrent: true
  }

  return {
    ...state,
    activeLoops: [
      ...state.activeLoops.slice(0, index - 1),
      merged,
      ...state.activeLoops.slice(index + 1)
    ]
  }
}

export const jumpToFirst = (state: PlayerState) => selectLoop(state, 0)
export const jumpToLatest = (state: PlayerState) => selectLoop(state, state.activeLoops.length - 1)
