import './StatusBadge.css'

export default function StatusBadge({ status }) {
  return (
    <div className={`status-badge status-badge--${status}`} aria-label={`Status: ${status}`}>
      <span className="status-badge__dot" aria-hidden="true" />
      <span className="status-badge__text">{status}</span>
    </div>
  )
}