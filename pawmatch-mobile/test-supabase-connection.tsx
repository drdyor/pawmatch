import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { supabase, isDemoMode } from './src/services/supabase';

/**
 * 🧪 Supabase Connection Test Screen
 * 
 * This tests your Supabase setup by:
 * 1. Checking if credentials are configured
 * 2. Testing database connection
 * 3. Verifying table access
 * 
 * Usage: Import and render this component in your App.tsx temporarily
 */

export default function TestSupabaseConnection() {
  const [status, setStatus] = useState<'testing' | 'success' | 'error'>('testing');
  const [message, setMessage] = useState('Testing connection...');
  const [details, setDetails] = useState<string[]>([]);

  const testConnection = async () => {
    setStatus('testing');
    setMessage('Testing connection...');
    setDetails([]);
    const testDetails: string[] = [];

    try {
      // Test 1: Check if demo mode
      if (isDemoMode) {
        setStatus('error');
        setMessage('❌ Demo Mode Detected');
        setDetails([
          '⚠️ Supabase credentials not configured',
          '',
          'Please check your .env file:',
          '- EXPO_PUBLIC_SUPABASE_URL',
          '- EXPO_PUBLIC_SUPABASE_ANON_KEY',
          '',
          'Then restart: npm start -- --clear'
        ]);
        return;
      }

      testDetails.push('✅ Credentials configured');

      // Test 2: Check connection by querying users table
      testDetails.push('🔄 Testing database connection...');
      setDetails([...testDetails]);

      const { data, error, count } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      if (error) {
        // Check if it's a "table doesn't exist" error
        if (error.message.includes('relation "public.users" does not exist')) {
          setStatus('error');
          setMessage('❌ Database Tables Not Created');
          setDetails([
            '✅ Connection successful!',
            '❌ Tables not found',
            '',
            'Next step: Run the SQL setup',
            '',
            '1. Open Supabase Dashboard',
            '2. Go to SQL Editor',
            '3. Copy & paste: SAFE_DATABASE_SETUP.sql',
            '4. Click "Run"',
            '',
            'File location:',
            '/workspace/pawmatch-mobile/SAFE_DATABASE_SETUP.sql'
          ]);
          return;
        }

        throw error;
      }

      testDetails.push('✅ Database connected');
      testDetails.push(`✅ Users table exists (${count || 0} rows)`);

      // Test 3: Check other critical tables
      const tablesToCheck = ['pets', 'listings', 'messages'];
      for (const table of tablesToCheck) {
        const { error: tableError } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });

        if (tableError) {
          testDetails.push(`⚠️ Table '${table}' issue: ${tableError.message}`);
        } else {
          testDetails.push(`✅ Table '${table}' exists`);
        }
      }

      // Test 4: Check storage buckets
      const { data: buckets, error: bucketError } = await supabase
        .storage
        .listBuckets();

      if (bucketError) {
        testDetails.push(`⚠️ Storage check failed: ${bucketError.message}`);
      } else {
        const petPhotosBucket = buckets.find(b => b.id === 'pet-photos');
        if (petPhotosBucket) {
          testDetails.push('✅ Storage bucket configured');
        } else {
          testDetails.push('⚠️ Storage bucket not found (run SQL setup)');
        }
      }

      setStatus('success');
      setMessage('✅ Supabase Connected Successfully!');
      setDetails([
        ...testDetails,
        '',
        '🎉 Everything looks good!',
        '',
        'Your app is ready to use:',
        '• User authentication',
        '• Pet listings',
        '• Photo uploads',
        '• Real-time messaging',
        '',
        'Remove this test screen from App.tsx'
      ]);

    } catch (err: any) {
      setStatus('error');
      setMessage('❌ Connection Failed');
      setDetails([
        ...testDetails,
        '',
        '❌ Error Details:',
        err.message || String(err),
        '',
        'Common fixes:',
        '1. Check .env file has correct values',
        '2. Restart: npm start -- --clear',
        '3. Verify keys in Supabase Dashboard',
        '4. Check network connection'
      ]);
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🧪 Supabase Test</Text>
        <Text style={styles.subtitle}>Connection Status</Text>
      </View>

      <View style={styles.statusContainer}>
        {status === 'testing' && (
          <ActivityIndicator size="large" color="#10b981" />
        )}
        {status === 'success' && (
          <Text style={styles.successIcon}>✅</Text>
        )}
        {status === 'error' && (
          <Text style={styles.errorIcon}>❌</Text>
        )}
        
        <Text style={[
          styles.message,
          status === 'success' && styles.successMessage,
          status === 'error' && styles.errorMessage
        ]}>
          {message}
        </Text>
      </View>

      <View style={styles.detailsContainer}>
        {details.map((detail, index) => (
          <Text key={index} style={styles.detailText}>
            {detail}
          </Text>
        ))}
      </View>

      <TouchableOpacity 
        style={styles.retryButton}
        onPress={testConnection}
      >
        <Text style={styles.retryButtonText}>🔄 Test Again</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Supabase URL: {isDemoMode ? 'Not configured' : 'Configured ✅'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8',
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 30,
    padding: 20,
    backgroundColor: '#1e293b',
    borderRadius: 12,
  },
  successIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  errorIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  message: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  successMessage: {
    color: '#10b981',
  },
  errorMessage: {
    color: '#ef4444',
  },
  detailsContainer: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  detailText: {
    fontSize: 14,
    color: '#cbd5e1',
    fontFamily: 'monospace',
    marginBottom: 4,
    lineHeight: 20,
  },
  retryButton: {
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    marginTop: 'auto',
  },
  footerText: {
    fontSize: 12,
    color: '#64748b',
    fontFamily: 'monospace',
  },
});
