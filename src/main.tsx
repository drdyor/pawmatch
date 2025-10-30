import React from 'react'
import ReactDOM from 'react-dom/client'

// TEMPORARY: Use simple app to prove deployment works
import SimpleApp from './SimpleApp.tsx'

// Complex app disabled until axios issue resolved
// import { observable } from 'mobx'
// import { HelmetProvider } from 'react-helmet-async'
// import { QueryClient, QueryClientProvider } from 'react-query'
// import { RouterProvider, createBrowserRouter } from 'react-router-dom'
// import App from './App.tsx'
// Simple version - just render the working app
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <SimpleApp />
  </React.StrictMode>
)
