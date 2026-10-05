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
    playedSeconds: 0,
    isActiveLoop: false,
    activeLoops: []
  }) satisfies PlayerState

export function usePlayer(url: string) {
  const playerRef = useRef<HTMLVideoElement>(null)
  const [state, setState] = useState<PlayerState>(() => initializeState(url))

  const currentLoop = state.activeLoops.find((loop) => loop.isCurrent)

  const setPlayerRef = (node: HTMLVideoElement) => {
    playerRef.current = node
  }

  const handlePlay = () => {
    setState((prevState) => ({
      ...prevState,
      playing: true
    }))
  }

  const handlePause = () => {
    setState((prevState) => ({
      ...prevState,
      playing: false,
      activeLoops:
        prevState.isActiveLoop && currentLoop?.isPending
          ? prevState.activeLoops.map((loop, index) =>
              index === 0 ? { ...loop, end: prevState.playedSeconds, isPending: false } : loop
            )
          : prevState.activeLoops
    }))

    if (state.isActiveLoop && currentLoop && playerRef.current)
      playerRef.current.currentTime = currentLoop.start
  }

  const handlePlayPause = () => {
    if (state.playing === true) {
      handlePause()
      return
    }

    setState((prevState) => ({
      ...prevState,
      playing: true
    }))
  }

  const handleForward = () => {
    const player = playerRef.current
    if (!player) return

    setState((prevState) => ({ ...prevState, seeking: true }))
    player.currentTime += 10
  }

  const handleBackward = () => {
    const player = playerRef.current
    if (!player) return

    setState((prevState) => ({ ...prevState, seeking: true }))
    player.currentTime -= 10
  }

  const handleTimeUpdate = () => {
    const player = playerRef.current
    if (!player) return

    setState((prevState) => ({
      ...prevState,
      playedSeconds: player.currentTime,
      played: player.currentTime / player.duration
    }))

    if (state.activeLoops && currentLoop?.end && player.currentTime >= currentLoop.end)
      handlePause()
  }

  const handleDurationChange = () => {
    const player = playerRef.current
    if (!player) return

    setState((prevState) => ({
      ...prevState,
      duration: playerRef.current?.duration || 0
    }))
  }

  const handleSeeked = () => {
    setState((prevState) => ({ ...prevState, seeking: false }))
  }

  const handleToggleLoops = () => {
    setState((prevState) => ({
      ...prevState,
      isActiveLoop: !prevState.isActiveLoop,
      activeLoops: prevState.isActiveLoop
        ? []
        : [{ id: 1, start: prevState.playedSeconds, end: null, isCurrent: true, isPending: true }]
    }))
  }

  const handlers: PlayerHandlers = {
    handlePlay,
    handlePause,
    handlePlayPause,
    handleForward,
    handleBackward,
    handleTimeUpdate,
    handleDurationChange,
    handleSeeked,
    handleToggleLoops
  }

  return {
    setPlayerRef,
    state,
    handlers
  } satisfies Player
}
