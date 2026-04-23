import { useState, useRef, useEffect } from 'react'
import './Filter.css'

const STATUSES = ['draft', 'pending', 'paid']

export default function Filter({ selected, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const toggle = (status) => {
    if (selected.includes(status)) {
      onChange(selected.filter(s => s !== status))
    } else {
      onChange([...selected, status])
    }
  }

  return (
    <div className="filter" ref={ref}>
      <button
        className="filter__toggle"
        onClick={() => setOpen(prev => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="filter__label">
          Filter <span className="filter__label--desktop">by status</span>
        </span>
        <svg
          className={`filter__chevron ${open ? 'filter__chevron--open' : ''}`}
          width="11" height="7" viewBox="0 0 11 7"
          fill="none" xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M1 1L5.5 5.5L10 1" stroke="#7C5DFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {open && (
        <div className="filter__dropdown" role="listbox" aria-multiselectable="true" aria-label="Filter by status">
          {STATUSES.map(status => (
            <label key={status} className="filter__option" role="option" aria-selected={selected.includes(status)}>
              <input
                type="checkbox"
                checked={selected.includes(status)}
                onChange={() => toggle(status)}
                className="filter__checkbox-input"
              />
              <span className="filter__checkbox" aria-hidden="true">
                {selected.includes(status) && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </span>
              <span className="filter__option-label">{status}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}