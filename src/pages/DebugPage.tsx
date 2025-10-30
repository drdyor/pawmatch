import { FC } from 'react'

export const DebugPage: FC = () => {
  const envVars = {
    VITE_DEMO_MODE: import.meta.env.VITE_DEMO_MODE,
    VITE_HOST: import.meta.env.VITE_HOST,
    VITE_API_URL: import.meta.env.VITE_API_URL,
    MODE: import.meta.env.MODE,
    DEV: import.meta.env.DEV,
    PROD: import.meta.env.PROD,
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">🔍 Debug Page</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Environment Variables</h2>
          <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-auto">
            {JSON.stringify(envVars, null, 2)}
          </pre>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Status</h2>
          <div className="space-y-2">
            <p className="text-lg">
              ✅ <strong>React is working!</strong>
            </p>
            <p className="text-lg">
              {import.meta.env.VITE_DEMO_MODE !== 'false' ? (
                <span className="text-green-600">✅ Demo mode is ENABLED</span>
              ) : (
                <span className="text-red-600">❌ Demo mode is DISABLED</span>
              )}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Quick Links</h2>
          <div className="space-y-2">
            <a href="/" className="block text-blue-600 hover:underline">→ Go to Home</a>
            <a href="/discover" className="block text-blue-600 hover:underline">→ Go to Swipe Page</a>
            <a href="/dashboard" className="block text-blue-600 hover:underline">→ Go to Dashboard</a>
          </div>
        </div>
      </div>
    </div>
  )
}
