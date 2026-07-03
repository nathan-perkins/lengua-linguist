import {
  useLayoutEffect,
  type Dispatch,
  type RefObject,
  type SetStateAction
} from 'react'
import '../css/AppHead.css'

interface IAppHeadProps {
  ref: RefObject<HTMLDivElement | null>
  setHeadHeight: Dispatch<SetStateAction<number>>
}

export default function AppHead({ ref, setHeadHeight }: IAppHeadProps) {
  useLayoutEffect(() => {
    setHeadHeight(ref.current?.offsetHeight ?? 0)
  }, [])

  return (
    <div ref={ref} className="app-head-container">
      <h1 className="app-head-heading">LenguaLinguist</h1>
    </div>
  )
}
