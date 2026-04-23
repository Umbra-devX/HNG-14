import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { InvoiceProvider } from './context/InvoiceContext'
import Sidebar from './components/Sidebar'
import InvoiceList from './pages/InvoiceList'
import InvoiceDetail from './pages/InvoiceDetail'
import InvoiceForm from './components/InvoiceForm'

function App() {
  const [formOpen, setFormOpen] = useState(false)
  const [editInvoice, setEditInvoice] = useState(null)

  const openNew = () => {
    setEditInvoice(null)
    setFormOpen(true)
  }

  const openEdit = (invoice) => {
    setEditInvoice(invoice)
    setFormOpen(true)
  }

  const closeForm = () => {
    setFormOpen(false)
    setEditInvoice(null)
  }

  return (
    <ThemeProvider>
      <InvoiceProvider>
        <BrowserRouter>
          <div className="app-layout">
            <Sidebar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<InvoiceList onNewInvoice={openNew} />} />
                <Route path="/invoice/:id" element={<InvoiceDetail onEditInvoice={openEdit} />} />
              </Routes>
            </main>
            {formOpen && (
              <InvoiceForm
                onClose={closeForm}
                editInvoice={editInvoice}
              />
            )}
          </div>
        </BrowserRouter>
      </InvoiceProvider>
    </ThemeProvider>
  )
}

export default App