import { createContext, useContext, useState, useEffect } from 'react'
import { sampleInvoices } from '../data/sampleInvoices'

const InvoiceContext = createContext()

export function InvoiceProvider({ children }) {
  const [invoices, setInvoices] = useState(() => {
    const stored = localStorage.getItem('invoices')
    if (stored) return JSON.parse(stored)
    return sampleInvoices
  })

  useEffect(() => {
    localStorage.setItem('invoices', JSON.stringify(invoices))
  }, [invoices])

  const addInvoice = (invoice) => {
    setInvoices(prev => [invoice, ...prev])
  }

  const updateInvoice = (id, updated) => {
    setInvoices(prev =>
      prev.map(inv => inv.id === id ? { ...inv, ...updated } : inv)
    )
  }

  const deleteInvoice = (id) => {
    setInvoices(prev => prev.filter(inv => inv.id !== id))
  }

  const markAsPaid = (id) => {
    updateInvoice(id, { status: 'paid' })
  }

  return (
    <InvoiceContext.Provider value={{
      invoices,
      addInvoice,
      updateInvoice,
      deleteInvoice,
      markAsPaid
    }}>
      {children}
    </InvoiceContext.Provider>
  )
}

export function useInvoices() {
  return useContext(InvoiceContext)
}