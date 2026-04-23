import { useEffect, useRef } from 'react'
import './DeleteModal.css'

export default function DeleteModal({ invoiceId, onConfirm, onCancel }) {
  const cancelBtnRef = useRef(null)
  const modalRef = useRef(null)

  // Focus trap + initial focus
  useEffect(() => {
    cancelBtnRef.current?.focus()

    const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    const focusableElements = modalRef.current?.querySelectorAll(focusableSelectors)
    const firstEl = focusableElements?.[0]
    const lastEl = focusableElements?.[focusableElements.length - 1]

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        onCancel()
        return
      }
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstEl) {
            e.preventDefault()
            lastEl?.focus()
          }
        } else {
          if (document.activeElement === lastEl) {
            e.preventDefault()
            firstEl?.focus()
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onCancel])

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel() }}
    >
      <div className="modal" ref={modalRef}>
        <h2 className="modal__title" id="modal-title">Confirm Deletion</h2>
        <p className="modal__description" id="modal-description">
          Are you sure you want to delete invoice <strong>#{invoiceId}</strong>?
          This action cannot be undone.
        </p>
        <div className="modal__actions">
          <button
            className="btn btn--secondary"
            onClick={onCancel}
            ref={cancelBtnRef}
          >
            Cancel
          </button>
          <button
            className="btn btn--danger"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}