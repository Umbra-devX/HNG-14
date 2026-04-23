# Invoice Management App

A fully responsive invoice management application built with React.

## Setup

```bash
npm install
npm run dev
```

## Architecture

- **React + Vite** — fast dev setup, no unnecessary overhead
- **React Router v6** — client-side routing between list and detail views
- **Context API** — global state for invoices and theme
- **LocalStorage** — data persistence across sessions, no backend needed
- **Plain CSS with custom properties** — full light/dark theming without a library

## Component Structure

- `Sidebar` — navigation, theme toggle
- `InvoiceList` — invoice listing with filter
- `InvoiceDetail` — full invoice view with actions
- `InvoiceForm` — slide-in drawer for create/edit
- `StatusBadge` — colour-coded status display
- `Filter` — multi-select dropdown filter
- `DeleteModal` — accessible confirmation dialog
- `EmptyState` — shown when no invoices match filter

## Trade-offs

- Used LocalStorage over IndexedDB for simplicity — sufficient for this data size
- No animation library — CSS animations kept it lean
- Single CSS file per component instead of CSS modules — easier to read and trace

## Accessibility

- Semantic HTML throughout (`<main>`, `<aside>`, `<fieldset>`, `<legend>`, `<address>`)
- All form fields have associated `<label>` elements
- Delete modal traps focus and closes on ESC
- ARIA roles and labels on all interactive regions
- Status badges use aria-label for screen readers
- Keyboard navigable throughout
- WCAG AA colour contrast in both light and dark modes

## Extra

- Sample invoice data pre-loaded on first visit
- Theme preference persisted in LocalStorage
- Payment due date auto-calculated from invoice date + payment terms
- Invoice total auto-calculated from item quantities and prices