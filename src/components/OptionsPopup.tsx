import { useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

interface OptionsPopupProps {
  showButtonTitles: boolean
  setShowButtonTitles: (show: boolean) => void
  setShowOptions: (show: boolean) => void
  optionsRef: React.RefObject<HTMLButtonElement | null>
}

function OptionsPopup({ showButtonTitles, setShowButtonTitles, setShowOptions, optionsRef }: OptionsPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside =(event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        optionsRef.current &&
        !optionsRef.current.contains(event.target as Node)
      ) {
        setShowOptions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [setShowOptions, optionsRef])

  return (
    <div className="options-popup" ref={popupRef}>
      <button
        type="button"
        onClick={() => setShowOptions(false)}
        className="options-popup-close-btn"
        aria-label="Close options"
      >
        <FontAwesomeIcon icon={faTimes} />
      </button>
      <h3 className="options-title">Options</h3>
      <label className="options-popup-label">
        <input
          type="checkbox"
          checked={showButtonTitles}
          onChange={e => setShowButtonTitles(e.target.checked)}
          className="options-popup-checkbox"
        />
        <span>Show Button Titles</span>
      </label>
    </div>
  )
}

export default OptionsPopup