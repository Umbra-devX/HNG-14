import { useState, useEffect, useRef } from 'react'
import { useInvoices } from '../context/InvoiceContext'
import { generateId } from '../utils/generateId'
import { formatDate } from '../utils/formatDate'
import './InvoiceForm.css'

const emptyItem = { name: '', quantity: 1, price: 0, total: 0 }

const emptyForm = {
  senderAddress: { street: '', city: '', postCode: '', country: '' },
  clientName: '',
  clientEmail: '',
  clientAddress: { street: '', city: '', postCode: '', country: '' },
  createdAt: new Date().toISOString().split('T')[0],
  paymentTerms: 30,
  description: '',
  items: [{ ...emptyItem }],
}

export default function InvoiceForm({ onClose, editInvoice }) {
  const { addInvoice, updateInvoice } = useInvoices()
  const [form, setForm] = useState(() =>
    editInvoice ? { ...editInvoice } : { ...emptyForm, items: [{ ...emptyItem }] }
  )
  const [errors, setErrors] = useState({})
  const firstInputRef = useRef(null)
  const overlayRef = useRef(null)

  const isEdit = !!editInvoice

  // Focus first input on open
  useEffect(() => {
    firstInputRef.current?.focus()
  }, [])

  // ESC to close
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const set = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const setAddress = (type, field, value) => {
    setForm(prev => ({
      ...prev,
      [type]: { ...prev[type], [field]: value }
    }))
    setErrors(prev => ({ ...prev, [`${type}.${field}`]: '' }))
  }

  const setItem = (index, field, value) => {
    const items = [...form.items]
    items[index] = { ...items[index], [field]: value }
    if (field === 'quantity' || field === 'price') {
      items[index].total = parseFloat(items[index].quantity || 0) * parseFloat(items[index].price || 0)
    }
    setForm(prev => ({ ...prev, items }))
    setErrors(prev => ({ ...prev, items: '' }))
  }

  const addItem = () => {
    setForm(prev => ({ ...prev, items: [...prev.items, { ...emptyItem }] }))
  }

  const removeItem = (index) => {
    setForm(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }))
  }

  const computeTotal = (items) =>
    items.reduce((sum, item) => sum + parseFloat(item.total || 0), 0)

  const computePaymentDue = (createdAt, terms) => {
    const date = new Date(createdAt)
    date.setDate(date.getDate() + parseInt(terms))
    return date.toISOString().split('T')[0]
  }

  const validate = () => {
    const e = {}
    if (!form.senderAddress.street.trim()) e['senderAddress.street'] = 'Required'
    if (!form.senderAddress.city.trim()) e['senderAddress.city'] = 'Required'
    if (!form.senderAddress.postCode.trim()) e['senderAddress.postCode'] = 'Required'
    if (!form.senderAddress.country.trim()) e['senderAddress.country'] = 'Required'
    if (!form.clientName.trim()) e.clientName = 'Required'
    if (!form.clientEmail.trim()) {
      e.clientEmail = 'Required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.clientEmail)) {
      e.clientEmail = 'Must be a valid email'
    }
    if (!form.clientAddress.street.trim()) e['clientAddress.street'] = 'Required'
    if (!form.clientAddress.city.trim()) e['clientAddress.city'] = 'Required'
    if (!form.clientAddress.postCode.trim()) e['clientAddress.postCode'] = 'Required'
    if (!form.clientAddress.country.trim()) e['clientAddress.country'] = 'Required'
    if (!form.description.trim()) e.description = 'Required'
    if (form.items.length === 0) {
      e.items = 'Add at least one item'
    } else {
      form.items.forEach((item, i) => {
        if (!item.name.trim()) e[`item.${i}.name`] = 'Required'
        if (!item.quantity || item.quantity <= 0) e[`item.${i}.quantity`] = 'Must be > 0'
        if (!item.price || item.price < 0) e[`item.${i}.price`] = 'Must be ≥ 0'
      })
    }
    return e
  }

  const buildInvoice = (status) => ({
    ...form,
    id: isEdit ? editInvoice.id : generateId(),
    status,
    total: computeTotal(form.items),
    paymentDue: computePaymentDue(form.createdAt, form.paymentTerms),
  })

  const handleSaveDraft = () => {
    const invoice = buildInvoice('draft')
    if (isEdit) {
      updateInvoice(invoice.id, invoice)
    } else {
      addInvoice(invoice)
    }
    onClose()
  }

  const handleSubmit = () => {
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    const invoice = buildInvoice(isEdit ? editInvoice.status === 'draft' ? 'pending' : editInvoice.status : 'pending')
    if (isEdit) {
      updateInvoice(invoice.id, invoice)
    } else {
      addInvoice(invoice)
    }
    onClose()
  }

  const err = (key) => errors[key] ? (
    <span className="form__error" role="alert">{errors[key]}</span>
  ) : null

  return (
    <div
      className="form-overlay"
      ref={overlayRef}
      aria-modal="true"
      role="dialog"
      aria-label={isEdit ? `Edit invoice ${editInvoice.id}` : 'Create new invoice'}
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
    >
      <div className="form-drawer">
        <div className="form-drawer__inner">
          <button className="form-drawer__close-mobile btn btn--secondary" onClick={onClose} aria-label="Close form">
            <svg width="7" height="10" viewBox="0 0 7 10" fill="none"><path d="M6 1L2 5L6 9" stroke="#7C5DFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Go back
          </button>

          <h2 className="form-drawer__title">
            {isEdit ? <><span className="form__hash">#</span>{editInvoice.id}</> : 'New Invoice'}
          </h2>

          <div className="form-drawer__body">
            {/* Bill From */}
            <fieldset className="form__fieldset">
              <legend className="form__legend">Bill From</legend>
              <div className="form__group">
                <div className="form__field">
                  <div className="form__label-row">
                    <label htmlFor="senderStreet" className={`form__label ${errors['senderAddress.street'] ? 'form__label--error' : ''}`}>Street Address</label>
                    {err('senderAddress.street')}
                  </div>
                  <input
                    id="senderStreet"
                    ref={firstInputRef}
                    className={`form__input ${errors['senderAddress.street'] ? 'form__input--error' : ''}`}
                    value={form.senderAddress.street}
                    onChange={e => setAddress('senderAddress', 'street', e.target.value)}
                  />
                </div>
              </div>
              <div className="form__group form__group--3">
                <div className="form__field">
                  <div className="form__label-row">
                    <label htmlFor="senderCity" className={`form__label ${errors['senderAddress.city'] ? 'form__label--error' : ''}`}>City</label>
                    {err('senderAddress.city')}
                  </div>
                  <input id="senderCity" className={`form__input ${errors['senderAddress.city'] ? 'form__input--error' : ''}`} value={form.senderAddress.city} onChange={e => setAddress('senderAddress', 'city', e.target.value)} />
                </div>
                <div className="form__field">
                  <div className="form__label-row">
                    <label htmlFor="senderPostCode" className={`form__label ${errors['senderAddress.postCode'] ? 'form__label--error' : ''}`}>Post Code</label>
                    {err('senderAddress.postCode')}
                  </div>
                  <input id="senderPostCode" className={`form__input ${errors['senderAddress.postCode'] ? 'form__input--error' : ''}`} value={form.senderAddress.postCode} onChange={e => setAddress('senderAddress', 'postCode', e.target.value)} />
                </div>
                <div className="form__field">
                  <div className="form__label-row">
                    <label htmlFor="senderCountry" className={`form__label ${errors['senderAddress.country'] ? 'form__label--error' : ''}`}>Country</label>
                    {err('senderAddress.country')}
                  </div>
                  <input id="senderCountry" className={`form__input ${errors['senderAddress.country'] ? 'form__input--error' : ''}`} value={form.senderAddress.country} onChange={e => setAddress('senderAddress', 'country', e.target.value)} />
                </div>
              </div>
            </fieldset>

            {/* Bill To */}
            <fieldset className="form__fieldset">
              <legend className="form__legend">Bill To</legend>
              <div className="form__group">
                <div className="form__field">
                  <div className="form__label-row">
                    <label htmlFor="clientName" className={`form__label ${errors.clientName ? 'form__label--error' : ''}`}>Client's Name</label>
                    {err('clientName')}
                  </div>
                  <input id="clientName" className={`form__input ${errors.clientName ? 'form__input--error' : ''}`} value={form.clientName} onChange={e => set('clientName', e.target.value)} />
                </div>
              </div>
              <div className="form__group">
                <div className="form__field">
                  <div className="form__label-row">
                    <label htmlFor="clientEmail" className={`form__label ${errors.clientEmail ? 'form__label--error' : ''}`}>Client's Email</label>
                    {err('clientEmail')}
                  </div>
                  <input id="clientEmail" type="email" className={`form__input ${errors.clientEmail ? 'form__input--error' : ''}`} value={form.clientEmail} onChange={e => set('clientEmail', e.target.value)} />
                </div>
              </div>
              <div className="form__group">
                <div className="form__field">
                  <div className="form__label-row">
                    <label htmlFor="clientStreet" className={`form__label ${errors['clientAddress.street'] ? 'form__label--error' : ''}`}>Street Address</label>
                    {err('clientAddress.street')}
                  </div>
                  <input id="clientStreet" className={`form__input ${errors['clientAddress.street'] ? 'form__input--error' : ''}`} value={form.clientAddress.street} onChange={e => setAddress('clientAddress', 'street', e.target.value)} />
                </div>
              </div>
              <div className="form__group form__group--3">
                <div className="form__field">
                  <div className="form__label-row">
                    <label htmlFor="clientCity" className={`form__label ${errors['clientAddress.city'] ? 'form__label--error' : ''}`}>City</label>
                    {err('clientAddress.city')}
                  </div>
                  <input id="clientCity" className={`form__input ${errors['clientAddress.city'] ? 'form__input--error' : ''}`} value={form.clientAddress.city} onChange={e => setAddress('clientAddress', 'city', e.target.value)} />
                </div>
                <div className="form__field">
                  <div className="form__label-row">
                    <label htmlFor="clientPostCode" className={`form__label ${errors['clientAddress.postCode'] ? 'form__label--error' : ''}`}>Post Code</label>
                    {err('clientAddress.postCode')}
                  </div>
                  <input id="clientPostCode" className={`form__input ${errors['clientAddress.postCode'] ? 'form__input--error' : ''}`} value={form.clientAddress.postCode} onChange={e => setAddress('clientAddress', 'postCode', e.target.value)} />
                </div>
                <div className="form__field">
                  <div className="form__label-row">
                    <label htmlFor="clientCountry" className={`form__label ${errors['clientAddress.country'] ? 'form__label--error' : ''}`}>Country</label>
                    {err('clientAddress.country')}
                  </div>
                  <input id="clientCountry" className={`form__input ${errors['clientAddress.country'] ? 'form__input--error' : ''}`} value={form.clientAddress.country} onChange={e => setAddress('clientAddress', 'country', e.target.value)} />
                </div>
              </div>
            </fieldset>

            {/* Invoice Info */}
            <fieldset className="form__fieldset">
              <legend className="form__legend sr-only">Invoice Info</legend>
              <div className="form__group form__group--2">
                <div className="form__field">
                  <label htmlFor="createdAt" className="form__label">Invoice Date</label>
                  <input id="createdAt" type="date" className="form__input" value={form.createdAt} onChange={e => set('createdAt', e.target.value)} />
                </div>
                <div className="form__field">
                  <label htmlFor="paymentTerms" className="form__label">Payment Terms</label>
                  <select id="paymentTerms" className="form__input form__select" value={form.paymentTerms} onChange={e => set('paymentTerms', e.target.value)}>
                    <option value={1}>Net 1 Day</option>
                    <option value={7}>Net 7 Days</option>
                    <option value={14}>Net 14 Days</option>
                    <option value={30}>Net 30 Days</option>
                  </select>
                </div>
              </div>
              <div className="form__group">
                <div className="form__field">
                  <div className="form__label-row">
                    <label htmlFor="description" className={`form__label ${errors.description ? 'form__label--error' : ''}`}>Project Description</label>
                    {err('description')}
                  </div>
                  <input id="description" className={`form__input ${errors.description ? 'form__input--error' : ''}`} value={form.description} onChange={e => set('description', e.target.value)} />
                </div>
              </div>
            </fieldset>

            {/* Item List */}
            <div className="form__items">
              <h3 className="form__items-title">Item List</h3>
              {errors.items && <span className="form__error" role="alert">{errors.items}</span>}

              <div className="form__items-list">
                {form.items.map((item, i) => (
                  <div key={i} className="form__item">
                    <div className="form__item-name">
                      <div className="form__label-row">
                        <label htmlFor={`item-name-${i}`} className={`form__label ${errors[`item.${i}.name`] ? 'form__label--error' : ''}`}>Item Name</label>
                        {err(`item.${i}.name`)}
                      </div>
                      <input
                        id={`item-name-${i}`}
                        className={`form__input ${errors[`item.${i}.name`] ? 'form__input--error' : ''}`}
                        value={item.name}
                        onChange={e => setItem(i, 'name', e.target.value)}
                      />
                    </div>
                    <div className="form__item-qty">
                      <div className="form__label-row">
                        <label htmlFor={`item-qty-${i}`} className={`form__label ${errors[`item.${i}.quantity`] ? 'form__label--error' : ''}`}>Qty.</label>
                      </div>
                      <input
                        id={`item-qty-${i}`}
                        type="number"
                        min="1"
                        className={`form__input ${errors[`item.${i}.quantity`] ? 'form__input--error' : ''}`}
                        value={item.quantity}
                        onChange={e => setItem(i, 'quantity', e.target.value)}
                      />
                    </div>
                    <div className="form__item-price">
                      <div className="form__label-row">
                        <label htmlFor={`item-price-${i}`} className={`form__label ${errors[`item.${i}.price`] ? 'form__label--error' : ''}`}>Price</label>
                      </div>
                      <input
                        id={`item-price-${i}`}
                        type="number"
                        min="0"
                        step="0.01"
                        className={`form__input ${errors[`item.${i}.price`] ? 'form__input--error' : ''}`}
                        value={item.price}
                        onChange={e => setItem(i, 'price', e.target.value)}
                      />
                    </div>
                    <div className="form__item-total">
                      <label className="form__label">Total</label>
                      <p className="form__item-total-value fw-bold">
                        {parseFloat(item.total || 0).toFixed(2)}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="form__item-delete"
                      onClick={() => removeItem(i)}
                      aria-label={`Remove item ${item.name || i + 1}`}
                    >
                      <svg width="13" height="16" viewBox="0 0 13 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path fillRule="evenodd" clipRule="evenodd" d="M8.47 0l.9.9H13v1.8H0V.9h3.63L4.53 0h3.94zM1 14.1V3.6h11v10.5a1.8 1.8 0 01-1.8 1.8H2.8A1.8 1.8 0 011 14.1z" fill="#888EB0"/>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="form__add-item btn btn--add"
                onClick={addItem}
              >
                + Add New Item
              </button>
            </div>

            {/* Validation summary */}
            {Object.keys(errors).length > 0 && (
              <div className="form__errors-summary" role="alert" aria-live="assertive">
                <p>— All fields must be added</p>
                {errors.items && <p>— An item must be added</p>}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="form-drawer__footer">
            {!isEdit && (
              <>
                <button type="button" className="btn btn--secondary form__btn-discard" onClick={onClose}>Discard</button>
                <div className="form-drawer__footer-right">
                  <button type="button" className="btn btn--draft" onClick={handleSaveDraft}>Save as Draft</button>
                  <button type="button" className="btn btn--primary" onClick={handleSubmit}>Save &amp; Send</button>
                </div>
              </>
            )}
            {isEdit && (
              <>
                <button type="button" className="btn btn--secondary" onClick={onClose}>Cancel</button>
                <button type="button" className="btn btn--primary" onClick={handleSubmit}>Save Changes</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}