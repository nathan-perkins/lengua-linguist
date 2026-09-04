export type PlayerState = {
  src: string
  pip: boolean
  playing: boolean
  controls: boolean
  light: boolean
  volume: number
  muted: boolean
  played: number
  loaded: number
  duration: number
  playbackRate: number
  loop: boolean
  seeking: boolean
  loadedSeconds: number
  playedSeconds: number
}

export type PlayerHandlers = {
  handlePlayPause: () => void
  handlePlay: () => void
  handlePause: () => void
  handleForward: () => void
  handleBackward: () => void
  handleTimeUpdate: () => void
  handleDurationChange: () => void
}

export type Player = {
  setPlayerRef: (node: HTMLVideoElement) => void
  state: PlayerState
  handlers: PlayerHandlers
}
