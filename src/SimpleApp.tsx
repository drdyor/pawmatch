import React from 'react';

/**
 * SIMPLE WORKING APP - No dependencies, no axios, no complexity
 * Just proves the deployment works
 */
export default function SimpleApp() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '20px',
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '60px 40px',
        maxWidth: '600px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        textAlign: 'center',
      }}>
        <h1 style={{
          fontSize: '48px',
          margin: '0 0 20px 0',
          color: '#2d3748',
        }}>
          🐾 PawMatch
        </h1>
        
        <p style={{
          fontSize: '20px',
          color: '#718096',
          marginBottom: '30px',
        }}>
          Your app is successfully deployed!
        </p>

        <div style={{
          background: '#f7fafc',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '30px',
        }}>
          <p style={{ margin: '0 0 10px 0', color: '#2d3748' }}>
            ✅ <strong>React</strong> is working
          </p>
          <p style={{ margin: '0 0 10px 0', color: '#2d3748' }}>
            ✅ <strong>Vercel</strong> deployment successful
          </p>
          <p style={{ margin: '0', color: '#2d3748' }}>
            ✅ <strong>Build</strong> completed
          </p>
        </div>

        <p style={{ color: '#718096', fontSize: '14px' }}>
          The full app with Supabase integration will be restored once we resolve the axios issue.
          For now, this proves everything else works perfectly!
        </p>
      </div>
    </div>
  );
}
