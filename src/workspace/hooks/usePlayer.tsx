import { useRef, useState } from 'react'
import type { Player, PlayerHandlers, PlayerState } from '../types'

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
  const playerRef = useRef<HTMLVideoElement>(null)
  const [state, setState] = useState<PlayerState>(() => initializeState(url))

  const setPlayerRef = (node: HTMLVideoElement) => {
    playerRef.current = node
  }

  const handlePlayPause = () => {
    setState((prevState) => ({
      ...prevState,
      playing: !prevState.playing
    }))
  }

  const handleTimeUpdate = () => {
    const player = playerRef.current
    if (!player) return

    setState((prevState) => ({
      ...prevState,
      playedSeconds: player.currentTime,
      played: player.currentTime / player.duration
    }))
  }

  const handleDurationChange = () => {
    const player = playerRef.current
    if (!player) return

    setState((prevState) => ({
      ...prevState,
      duration: playerRef.current?.duration || 0
    }))
  }

  const handlers: PlayerHandlers = {
    handlePlayPause,
    handleTimeUpdate,
    handleDurationChange
  }

  return {
    setPlayerRef,
    state,
    handlers
  } satisfies Player
}
