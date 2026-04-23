import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useInvoices } from '../context/InvoiceContext'
import StatusBadge from '../components/StatusBadge'
import DeleteModal from '../components/DeleteModal'
import { formatDate } from '../utils/formatDate'
import { formatCurrency } from '../utils/formatCurrency'
import './InvoiceDetail.css'

export default function InvoiceDetail({ onEditInvoice }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const { invoices, deleteInvoice, markAsPaid } = useInvoices()
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const invoice = invoices.find(inv => inv.id === id)

  if (!invoice) {
    return (
      <div className="invoice-detail__not-found">
        <p>Invoice not found.</p>
        <button className="btn btn--secondary" onClick={() => navigate('/')}>Go Back</button>
      </div>
    )
  }

  const handleDelete = () => {
    deleteInvoice(id)
    navigate('/')
  }

  return (
    <div className="invoice-detail">
      {/* Back Button */}
      <button className="invoice-detail__back" onClick={() => navigate('/')} aria-label="Go back to invoice list">
        <svg width="7" height="10" viewBox="0 0 7 10" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M6 1L2 5L6 9" stroke="#7C5DFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span>Go back</span>
      </button>

      {/* Status Bar */}
      <div className="invoice-detail__status-bar">
        <div className="invoice-detail__status-left">
          <span className="invoice-detail__status-label">Status</span>
          <StatusBadge status={invoice.status} />
        </div>
        <div className="invoice-detail__actions" role="group" aria-label="Invoice actions">
          {invoice.status !== 'paid' && (
            <button
              className="btn btn--secondary"
              onClick={() => onEditInvoice(invoice)}
              aria-label="Edit invoice"
            >
              Edit
            </button>
          )}
          <button
            className="btn btn--danger"
            onClick={() => setShowDeleteModal(true)}
            aria-label="Delete invoice"
          >
            Delete
          </button>
          {invoice.status === 'pending' && (
            <button
              className="btn btn--primary"
              onClick={() => markAsPaid(id)}
              aria-label="Mark invoice as paid"
            >
              Mark as Paid
            </button>
          )}
          {invoice.status === 'draft' && (
            <button
              className="btn btn--primary"
              onClick={() => markAsPaid(id)}
              aria-label="Mark invoice as paid"
            >
              Mark as Paid
            </button>
          )}
        </div>
      </div>

      {/* Invoice Body */}
      <div className="invoice-detail__body">
        {/* Top Info */}
        <div className="invoice-detail__top">
          <div className="invoice-detail__id-desc">
            <h1 className="invoice-detail__id">
              <span className="invoice-detail__hash" aria-hidden="true">#</span>
              {invoice.id}
            </h1>
            <p className="invoice-detail__desc">{invoice.description}</p>
          </div>
          <address className="invoice-detail__sender-address">
            <span>{invoice.senderAddress.street}</span>
            <span>{invoice.senderAddress.city}</span>
            <span>{invoice.senderAddress.postCode}</span>
            <span>{invoice.senderAddress.country}</span>
          </address>
        </div>

        {/* Meta Grid */}
        <div className="invoice-detail__meta">
          <div className="invoice-detail__meta-group">
            <p className="invoice-detail__label">Invoice Date</p>
            <p className="invoice-detail__value fw-bold">{formatDate(invoice.createdAt)}</p>
          </div>
          <div className="invoice-detail__meta-group">
            <p className="invoice-detail__label">Payment Due</p>
            <p className="invoice-detail__value fw-bold">{formatDate(invoice.paymentDue)}</p>
          </div>
          <div className="invoice-detail__meta-group invoice-detail__meta-group--client">
            <p className="invoice-detail__label">Bill To</p>
            <p className="invoice-detail__value fw-bold">{invoice.clientName}</p>
            <address className="invoice-detail__client-address">
              <span>{invoice.clientAddress.street}</span>
              <span>{invoice.clientAddress.city}</span>
              <span>{invoice.clientAddress.postCode}</span>
              <span>{invoice.clientAddress.country}</span>
            </address>
          </div>
          <div className="invoice-detail__meta-group">
            <p className="invoice-detail__label">Sent To</p>
            <p className="invoice-detail__value fw-bold">{invoice.clientEmail}</p>
          </div>
        </div>

        {/* Items Table */}
        <div className="invoice-detail__items">
          <div className="invoice-detail__items-header" aria-hidden="true">
            <span>Item Name</span>
            <span>QTY.</span>
            <span>Price</span>
            <span>Total</span>
          </div>
          <ul className="invoice-detail__items-list" aria-label="Invoice items">
            {invoice.items.map((item, index) => (
              <li key={index} className="invoice-detail__item">
                <div className="invoice-detail__item-name">
                  <p className="fw-bold">{item.name}</p>
                  <p className="invoice-detail__item-qty-mobile">
                    {item.quantity} x {formatCurrency(item.price)}
                  </p>
                </div>
                <span className="invoice-detail__item-qty">{item.quantity}</span>
                <span className="invoice-detail__item-price">{formatCurrency(item.price)}</span>
                <span className="invoice-detail__item-total fw-bold">{formatCurrency(item.total)}</span>
              </li>
            ))}
          </ul>
          <div className="invoice-detail__total">
            <span>Amount Due</span>
            <span className="invoice-detail__total-amount">{formatCurrency(invoice.total)}</span>
          </div>
        </div>
      </div>

      {/* Mobile Actions */}
      <div className="invoice-detail__mobile-actions" role="group" aria-label="Invoice actions">
        {invoice.status !== 'paid' && (
          <button
            className="btn btn--secondary"
            onClick={() => onEditInvoice(invoice)}
            aria-label="Edit invoice"
          >
            Edit
          </button>
        )}
        <button
          className="btn btn--danger"
          onClick={() => setShowDeleteModal(true)}
          aria-label="Delete invoice"
        >
          Delete
        </button>
        {invoice.status !== 'paid' && (
          <button
            className="btn btn--primary"
            onClick={() => markAsPaid(id)}
            aria-label="Mark invoice as paid"
          >
            Mark as Paid
          </button>
        )}
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <DeleteModal
          invoiceId={id}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  )
}