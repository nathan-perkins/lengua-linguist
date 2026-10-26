import { useRef, useState } from 'react'
import type { Player, PlayerHandlers, PlayerState, TimelineLoop } from '../types'
import {
  getCurrent,
  jumpToFirst,
  jumpToLatest,
  selectLoop,
  stepBackward,
  stepForward,
  undoLoop
} from '../utils/playerStateHelpers'

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

  const currentLoop = getCurrent(state).loop
  const currentLoopIndex = getCurrent(state).index

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
              index === currentLoopIndex
                ? { ...loop, end: prevState.playedSeconds, isPending: false }
                : loop
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

  const handleIncreasePlaybackSpeed = () => {
    if (state.playbackRate >= 2) return
    setState((prevState) => ({ ...prevState, playbackRate: prevState.playbackRate + 0.1 }))
  }

  const handleDecreasePlaybackSpeed = () => {
    if (state.playbackRate <= 0.1) return
    setState((prevState) => ({ ...prevState, playbackRate: prevState.playbackRate - 0.1 }))
  }

  const handleToggleLoops = () => {
    setState((prevState) => ({
      ...prevState,
      isActiveLoop: !prevState.isActiveLoop,
      activeLoops: prevState.isActiveLoop
        ? []
        : [
            {
              id: 0,
              title: 'Loop 1',
              start: prevState.playedSeconds,
              end: null,
              isCurrent: true,
              isPending: true
            }
          ]
    }))
  }

  const handleSelectLoop = (selectedLoop: TimelineLoop) => {
    if (selectedLoop.isCurrent) return

    handlePause()

    const selectedLoopIndex = state.activeLoops.findIndex((loop) => loop === selectedLoop)

    const next = selectLoop(state, selectedLoopIndex)
    setState(next)

    const target = getCurrent(next).loop
    if (playerRef.current && target) playerRef.current.currentTime = target.start
  }

  const handleLoopBackwardStep = () => {
    const next = stepBackward(state)
    setState(next)

    const target = getCurrent(next).loop
    if (playerRef.current && target) playerRef.current.currentTime = target.start
  }

  const handleLoopForwardStep = () => {
    const next = stepForward(state)
    setState(next)

    const target = getCurrent(next).loop
    if (playerRef.current && target) playerRef.current.currentTime = target.start
  }

  const handleJumpToFirst = () => {
    const next = jumpToFirst(state)
    setState(next)

    const target = getCurrent(next).loop
    if (playerRef.current && target) playerRef.current.currentTime = target.start
  }

  const handleJumpToLatest = () => {
    const next = jumpToLatest(state)
    setState(next)

    const target = getCurrent(next).loop
    if (playerRef.current && target) playerRef.current.currentTime = target.start
  }

  const handleNewLoop = () => {
    const { loop } = getCurrent(state)
    if (!loop || loop.isPending) return

    const next = stepForward(jumpToLatest(state))
    setState(next)

    const target = getCurrent(next).loop
    if (playerRef.current && target) playerRef.current.currentTime = target.start
  }

  const handleUndoLoop = () => {
    const { index } = getCurrent(state)
    if (!index || index === getCurrent(jumpToFirst(state)).index) return

    setState(undoLoop(state))
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
    handleIncreasePlaybackSpeed,
    handleDecreasePlaybackSpeed,
    handleToggleLoops,
    handleSelectLoop,
    handleLoopBackwardStep,
    handleLoopForwardStep,
    handleJumpToFirst,
    handleJumpToLatest,
    handleNewLoop,
    handleUndoLoop
  }

  return {
    setPlayerRef,
    state,
    handlers
  } satisfies Player
}
