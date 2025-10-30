import { useFormik } from 'formik'
import { FC, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'

import { IconApple, IconGoogle, IconWhatsapp } from '../../../assets/icons'
import { BackgroundLogin } from '../../../assets/images'
import { PetsLoveLogo } from '../../../assets/logos'
import { BaseLoading } from '../../../components/common/BaseLoading'
import { signInWithGoogle, isFirebaseConfigured } from '../../../config/firebase'

export const LoginGoogle: FC = () => {
  const [loading, setLoading] = useState(false)
  const [isSignup, setIsSignup] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const urlParams = new URLSearchParams(window.location.search)
  const token = urlParams.get('token')
  const { t } = useTranslation(['common', 'login'])

  useEffect(() => {
    if (token) {
      document.cookie = `token=${token}; path=/`
      window.location.href = '/discover'
    }
  }, [token])

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Please enter a valid email')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    confirmPassword: isSignup
      ? Yup.string()
          .oneOf([Yup.ref('password')], 'Passwords must match')
          .required('Please confirm your password')
      : Yup.string(),
  })

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setError('')
      setSuccess('')
      setLoading(true)

      // Demo mode - simulate signup/login
      setTimeout(() => {
        const demoToken = 'demo_token_' + Date.now()
        document.cookie = `token=${demoToken}; path=/`
        localStorage.setItem('demo_email', values.email)
        setSuccess(isSignup ? 'Account created!' : 'Logged in!')
        
        // Check if user has completed onboarding
        const hasOnboarded = localStorage.getItem('user_onboarded')
        
        setTimeout(() => {
          if (isSignup || !hasOnboarded) {
            // New user → go to onboarding
            window.location.href = '/onboarding'
          } else {
            // Returning user → go straight to swipe
            window.location.href = '/discover'
          }
        }, 500)
      }, 1000)
    },
  })

  const handleGoogleSignIn = async () => {
    if (!isFirebaseConfigured) {
      // Demo mode
      setLoading(true)
      setTimeout(() => {
        const demoToken = 'demo_token_' + Date.now()
        document.cookie = `token=${demoToken}; path=/`
        
        // Check onboarding status
        const hasOnboarded = localStorage.getItem('user_onboarded')
        window.location.href = hasOnboarded ? '/discover' : '/onboarding'
      }, 500)
      return
    }

    try {
      setLoading(true)
      setError('')
      const user = await signInWithGoogle()
      const firebaseToken = await user.getIdToken()
      document.cookie = `token=${firebaseToken}; path=/`
      window.location.href = '/discover'
    } catch (err: any) {
      setLoading(false)
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign in cancelled')
      } else {
        setError('Sign in failed. Try email/password instead.')
      }
    }
  }

  const { values, errors, touched, handleSubmit, handleChange, handleBlur } = formik

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-primary-100 to-primary-200">
        <BaseLoading large />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-primary-100 to-primary-200 px-4 py-8">
      <img
        alt="background"
        src={BackgroundLogin}
        className="fixed inset-0 w-full h-full object-cover opacity-30"
      />
      
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-10">
          
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary-100 rounded-full flex items-center justify-center">
                <PetsLoveLogo width={48} height={48} />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              {isSignup ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-sm text-gray-600">
              {isSignup ? 'Sign up to start matching with pets' : 'Sign in to continue'}
            </p>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">{success}</p>
            </div>
          )}

          {/* Social Login Buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={handleGoogleSignIn}
              type="button"
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border-2 border-gray-200 rounded-xl hover:border-primary-400 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md font-medium text-gray-700 text-sm sm:text-base"
            >
              <IconGoogle />
              <span>Continue with Google</span>
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleGoogleSignIn}
                type="button"
                className="flex items-center justify-center gap-2 px-4 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-200 shadow-sm hover:shadow-md font-medium text-sm"
              >
                <IconApple />
                <span className="hidden sm:inline">Apple</span>
              </button>

              <button
                onClick={handleGoogleSignIn}
                type="button"
                className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all duration-200 shadow-sm hover:shadow-md font-medium text-sm"
              >
                <IconWhatsapp />
                <span className="hidden sm:inline">WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-medium">
                Or {isSignup ? 'sign up' : 'sign in'} with email
              </span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="you@example.com"
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all text-sm sm:text-base ${
                  touched.email && errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {touched.email && errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={isSignup ? 'new-password' : 'current-password'}
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="••••••••"
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all text-sm sm:text-base ${
                  touched.password && errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {touched.password && errors.password && (
                <p className="mt-1 text-xs text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password (Signup only) */}
            {isSignup && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all text-sm sm:text-base ${
                    touched.confirmPassword && errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {touched.confirmPassword && errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>
                )}
              </div>
            )}

            {/* Forgot Password (Login only) */}
            {!isSignup && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setError('Password reset coming soon!')}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 transition-all shadow-lg hover:shadow-xl text-sm sm:text-base"
            >
              {isSignup ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          {/* Toggle Signup/Login */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={() => {
                  setIsSignup(!isSignup)
                  setError('')
                  setSuccess('')
                  formik.resetForm()
                }}
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                {isSignup ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>

          {/* Terms */}
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-500">
              By continuing, you agree to PawMatch's{' '}
              <a href="/terms" className="text-primary-600 hover:underline">
                Terms of Service
              </a>
            </p>
          </div>

          {/* Demo Mode Badge */}
          {!isFirebaseConfigured && (
            <div className="mt-4 text-center">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                Demo Mode Active
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
