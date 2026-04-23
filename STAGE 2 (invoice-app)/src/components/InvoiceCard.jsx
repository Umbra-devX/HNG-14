import { Link } from 'react-router-dom'
import StatusBadge from './StatusBadge'
import { formatDate } from '../utils/formatDate'
import { formatCurrency } from '../utils/formatCurrency'
import './InvoiceCard.css'

export default function InvoiceCard({ invoice }) {
  const { id, paymentDue, clientName, total, status } = invoice

  return (
    <Link to={`/invoice/${id}`} className="invoice-card" aria-label={`Invoice ${id}, due ${formatDate(paymentDue)}, ${clientName}, ${formatCurrency(total)}, ${status}`}>
      <div className="invoice-card__id">
        <span className="invoice-card__hash" aria-hidden="true">#</span>
        <span className="fw-bold">{id}</span>
      </div>

      <div className="invoice-card__due text-body">
        Due {formatDate(paymentDue)}
      </div>

      <div className="invoice-card__client text-body">
        {clientName}
      </div>

      <div className="invoice-card__total fw-bold">
        {formatCurrency(total)}
      </div>

      <StatusBadge status={status} />

      <svg className="invoice-card__chevron" width="7" height="10" viewBox="0 0 7 10" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M1 1L5 5L1 9" stroke="#7C5DFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </Link>
  )
}