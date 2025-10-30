import React from 'react'
import ReactDOM from 'react-dom/client'

// TEMPORARY: Use simple app to prove deployment works
import SimpleApp from './SimpleApp.tsx'

// Complex app disabled until axios issue resolved
// All imports commented out to avoid loading problematic dependencies

// Simple version - just render the working app
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <SimpleApp />
  </React.StrictMode>
)
