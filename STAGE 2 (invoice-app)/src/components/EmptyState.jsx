import './EmptyState.css'

export default function EmptyState() {
  return (
    <div className="empty-state" role="status" aria-live="polite">
      <img
        src="/illustration-empty.svg"
        alt=""
        className="empty-state__illustration"
        aria-hidden="true"
      />
      <h2 className="empty-state__title">There is nothing here</h2>
      <p className="empty-state__text">
        Create an invoice by clicking the <strong>New Invoice</strong> button and get started
      </p>
    </div>
  )
}
