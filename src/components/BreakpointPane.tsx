interface BreakpointPaneProps {
  handleCloseBreakpointPane: () => void
  startInput: string | undefined
  setStartInput: React.Dispatch<React.SetStateAction<string | undefined>>
  endInput: string | undefined
  setEndInput: React.Dispatch<React.SetStateAction<string | undefined>>
  handleSetBreakpoints: (e: React.SyntheticEvent<HTMLFormElement>) => void
}

function BreakpointPane({ handleCloseBreakpointPane, startInput, setStartInput, endInput, setEndInput, handleSetBreakpoints }: BreakpointPaneProps) {

  return (
    <div className="breakpoint-container">
      <h3 className="breakpoint-header">Add Breakpoints to Video:</h3>
      <form className="breakpoint-form" onSubmit={handleSetBreakpoints}>
        <label>
          Start Point
          <input
            type="text"
            value={startInput}
            onChange={({ target }) => setStartInput(target.value)}
            className="breakpoint-input"
          />
        </label>
        <label>
          End Point
          <input
            type="text"
            value={endInput}
            onChange={({ target }) => setEndInput(target.value)}
            className="breakpoint-input"
          />
        </label>
        <div className="breakpoint-btn-row">
          <button type="submit" className="breakpoint-submit-btn">apply</button>
          <button type="button" onClick={handleCloseBreakpointPane} className="breakpoint-cancel-btn">cancel</button>
        </div>
      </form>
    </div>
  )
}

export default BreakpointPane