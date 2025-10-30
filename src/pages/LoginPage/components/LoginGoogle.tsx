import { useFormik } from 'formik'
import { FC, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'

import { IconApple, IconGoogle, IconWhatsapp } from '../../../assets/icons'
import { BackgroundLogin } from '../../../assets/images'
import { PetsLoveLogo } from '../../../assets/logos'
import { BaseButton } from '../../../components/common/BaseButton'
import { BaseInput } from '../../../components/common/BaseInput'
import { BaseLoading } from '../../../components/common/BaseLoading'
import { signInWithGoogle, isFirebaseConfigured } from '../../../config/firebase'

export const LoginGoogle: FC = () => {
  const [successEmailLogin, setSuccessEmailLogin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isSignup, setIsSignup] = useState(false)
  const [error, setError] = useState('')
  const urlParams = new URLSearchParams(window.location.search)
  const token = urlParams.get('token')
  const { t } = useTranslation(['common', 'login'])

  useEffect(() => {
    setSuccessEmailLogin(false)
    if (token) {
      setLoading(true)
      document.cookie = `token=${token}; path=/`
      window.location.href = '/dashboard'
    }
    setTimeout(() => setLoading(false), 500)
  }, [token])

  const loginSchema = Yup.object().shape({
    email: Yup.string()
      .email(t('common:emailInvalid'))
      .required(t('common:requiredField')),
  })

  const formik = useFormik({
    validationSchema: loginSchema,
    initialValues: {
      email: '',
    },
    onSubmit: async (values) => {
      handleDemoLogin(values.email)
      formik.resetForm()
    },
  })

  const handleDemoLogin = (email?: string) => {
    // Create a demo session and redirect to discover page
    const demoToken = 'demo_token_' + Date.now()
    document.cookie = `token=${demoToken}; path=/`
    if (email) {
      localStorage.setItem('demo_email', email)
    }
    setLoading(true)
    setTimeout(() => {
      window.location.href = '/discover'
    }, 500)
  }

  const handleGoogleSignIn = async () => {
    if (!isFirebaseConfigured) {
      // Fall back to demo mode
      handleDemoLogin()
      return
    }

    try {
      setLoading(true)
      setError('')
      const user = await signInWithGoogle()
      
      // Store user info
      const firebaseToken = await user.getIdToken()
      document.cookie = `token=${firebaseToken}; path=/`
      localStorage.setItem('user_email', user.email || '')
      localStorage.setItem('user_name', user.displayName || '')
      
      // Redirect to discover page
      window.location.href = '/discover'
    } catch (err: any) {
      setLoading(false)
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign in cancelled')
      } else if (err.code === 'auth/popup-blocked') {
        setError('Please allow popups for this site')
      } else {
        setError('Sign in failed. Try demo mode!')
      }
      console.error('Google sign in error:', err)
    }
  }

  const handleAppleSignIn = async () => {
    setError('Apple Sign In coming soon! Try demo mode.')
  }

  const handleWhatsAppSignIn = async () => {
    setError('WhatsApp login coming soon! Try demo mode.')
  }

  const { values, errors, handleSubmit, handleChange } = formik

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-primary-50 via-primary-100 to-primary-200">
        <BaseLoading large />
      </div>
    )
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-primary-100 to-primary-200">
      <img
        alt="background"
        src={BackgroundLogin}
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      />
      
      <div className="relative z-10 w-full max-w-md mx-4 sm:mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-12 space-y-8">
          {/* Logo and Title */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
                <PetsLoveLogo width={56} height={56} />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">PawMatch</h1>
              <p className="mt-2 text-sm text-gray-600">
                {isSignup ? 'Create your account' : 'Welcome back!'}
              </p>
            </div>
            
            {/* Firebase Status Badge */}
            {!isFirebaseConfigured && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                Demo Mode (Firebase not configured)
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {successEmailLogin ? (
            <div className="text-center space-y-4 py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                You're all set!
              </h2>
              <p className="text-gray-600">
                Redirecting you to discover pets...
              </p>
            </div>
          ) : (
            <>
              {/* Social Login Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleGoogleSignIn}
                  className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-white border-2 border-gray-200 rounded-xl hover:border-primary-400 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md font-medium text-gray-700"
                >
                  <IconGoogle />
                  {isFirebaseConfigured ? 'Continue with Google' : 'Try Demo with Google'}
                </button>

                <button
                  onClick={handleAppleSignIn}
                  className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-200 shadow-sm hover:shadow-md font-medium"
                >
                  <IconApple />
                  Continue with Apple
                </button>

                <button
                  onClick={handleWhatsAppSignIn}
                  className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all duration-200 shadow-sm hover:shadow-md font-medium"
                >
                  <IconWhatsapp />
                  Continue with WhatsApp
                </button>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500 font-medium">
                    Or try with email
                  </span>
                </div>
              </div>

              {/* Email Form */}
              <div className="space-y-4">
                <BaseInput
                  type="email"
                  name="email"
                  value={values.email}
                  error={errors.email}
                  label={t('common:email')}
                  handleChange={handleChange}
                  placeholder="you@example.com"
                />

                <BaseButton
                  onClick={handleSubmit}
                  wFull
                  style="primary"
                  text="Continue with Email (Demo)"
                />
              </div>

              {/* Toggle Login/Signup */}
              <div className="text-center">
                <button
                  onClick={() => setIsSignup(!isSignup)}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  {isSignup
                    ? 'Already have an account? Sign in'
                    : "Don't have an account? Sign up"}
                </button>
              </div>

              {/* Terms Link */}
              <div className="text-center pt-4 border-t border-gray-200">
                <a
                  href="/terms"
                  className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Terms of Service & Privacy Policy
                </a>
              </div>
            </>
          )}
        </div>

        {/* Additional Info */}
        <p className="mt-8 text-center text-sm text-gray-600">
          {isFirebaseConfigured 
            ? 'By continuing, you agree to PawMatch\'s Terms of Service'
            : '🎭 Demo mode active - Setup Firebase for full auth features'
          }
        </p>

        {/* Setup Instructions Link */}
        {!isFirebaseConfigured && (
          <div className="mt-4 text-center">
            <a 
              href="/FIREBASE_SETUP.md" 
              target="_blank"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium underline"
            >
              📖 View Firebase Setup Instructions
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
