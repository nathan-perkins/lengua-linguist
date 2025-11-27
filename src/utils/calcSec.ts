export function calcSec(startInput: string, endInput: string) {
  let startMin
  let startSec
  let totalStartInputSeconds

  let endMin
  let endSec
  let totalEndInputSeconds

  if (startInput.includes(':')) {
    const startMinSec = startInput.split(':')
    startMin = Number(startMinSec[0])
    startSec = Number(startMinSec[1])

    totalStartInputSeconds = startMin * 60 + startSec
  } else {
    totalStartInputSeconds = Number(startInput)
  }

  if (endInput.includes(':')) {
    const endMinSec = endInput.split(':')
    endMin = Number(endMinSec[0])
    endSec = Number(endMinSec[1])

    totalEndInputSeconds = endMin * 60 + endSec
  } else {
    totalEndInputSeconds = Number(endInput)
  }

  return [totalStartInputSeconds, totalEndInputSeconds]
}