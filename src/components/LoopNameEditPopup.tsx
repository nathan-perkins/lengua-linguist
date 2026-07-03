import { useState, useEffect, useRef } from 'react'

interface LoopNameEditPopupProps {
  initialValue: string
  onSave: (newName: string) => void
  onCancel: () => void
}

function LoopNameEditPopup({
  initialValue,
  onSave,
  onCancel
}: LoopNameEditPopupProps) {
  const [value, setValue] = useState(initialValue)
  const inputRef = useRef<HTMLInputElement>(null)
  const popupRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        onCancel()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [onCancel])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') onSave(value)
    if (e.key === 'Escape') onCancel()
  }

  return (
    <div className="name-edit-popup" ref={popupRef}>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="name-edit-input"
      />
      <div className="btn-row">
        <button
          type="button"
          onClick={() => onSave(value)}
          className="control-btn"
        >
          Save
        </button>
        <button type="button" onClick={onCancel} className="control-btn">
          Cancel
        </button>
      </div>
    </div>
  )
}

export default LoopNameEditPopup
