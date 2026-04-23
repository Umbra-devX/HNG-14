import { useState } from 'react'
import { useInvoices } from '../context/InvoiceContext'
import InvoiceCard from '../components/InvoiceCard'
import Filter from '../components/Filter'
import EmptyState from '../components/EmptyState'
import './InvoiceList.css'

export default function InvoiceList({ onNewInvoice }) {
  const { invoices } = useInvoices()
  const [selectedStatuses, setSelectedStatuses] = useState([])

  const filtered = selectedStatuses.length === 0
    ? invoices
    : invoices.filter(inv => selectedStatuses.includes(inv.status))

  return (
    <div className="invoice-list">
      <header className="invoice-list__header">
        <div className="invoice-list__title-group">
          <h1 className="invoice-list__title">Invoices</h1>
          <p className="invoice-list__count text-body" aria-live="polite">
            <span className="invoice-list__count--desktop">
              {filtered.length === 0
                ? 'No invoices'
                : `There are ${filtered.length} total invoices`}
            </span>
            <span className="invoice-list__count--mobile">
              {filtered.length} invoices
            </span>
          </p>
        </div>

        <div className="invoice-list__actions">
          <Filter selected={selectedStatuses} onChange={setSelectedStatuses} />

          <button
            className="btn btn--primary invoice-list__new-btn"
            onClick={onNewInvoice}
            aria-label="Create new invoice"
          >
            <span className="btn__icon" aria-hidden="true">
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.313 10.023V6.313h3.71V4.688h-3.71V.977H4.687v3.71H.977v1.626h3.71v3.71z" fill="#7C5DFA"/>
              </svg>
            </span>
            <span>New <span className="btn__text--desktop">Invoice</span></span>
          </button>
        </div>
      </header>

      <div className="invoice-list__list" role="list" aria-label="Invoice list">
        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          filtered.map(invoice => (
            <div role="listitem" key={invoice.id}>
              <InvoiceCard invoice={invoice} />
            </div>
          ))
        )}
      </div>
    </div>
  )
}