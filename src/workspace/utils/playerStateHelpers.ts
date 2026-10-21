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

  return {
    ...state,
    activeLoops: [
      ...state.activeLoops.map((loop) => ({ ...loop, isCurrent: false })),
      {
        id: index + 1,
        title: `Loop ${index + 2}`,
        start: loop.end!,
        end: null,
        isCurrent: true,
        isPending: true
      }
    ]
  }
}
