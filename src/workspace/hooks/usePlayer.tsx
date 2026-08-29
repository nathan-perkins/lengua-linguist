import { useState } from 'react'
import type { PlayerState } from '../types'

const initializeState = (url: string) =>
  ({
    src: url,
    pip: false,
    playing: false,
    controls: false,
    light: false,
    volume: 1,
    muted: false,
    played: 0,
    loaded: 0,
    duration: 0,
    playbackRate: 1.0,
    loop: false,
    seeking: false,
    loadedSeconds: 0,
    playedSeconds: 0
  }) satisfies PlayerState

export function usePlayer(url: string) {
  const [state, setState] = useState<PlayerState>(() => initializeState(url))

  const handlePlayPause = () => {
    setState((prevState) => ({
      ...prevState,
      playing: !prevState.playing
    }))
  }

  return {
    state,
    handlePlayPause
  }
}
