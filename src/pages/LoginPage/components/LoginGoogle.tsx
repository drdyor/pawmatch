import axios from 'axios'
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

export const LoginGoogle: FC = () => {
  const [successEmailLogin, setSuccessEmailLogin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isSignup, setIsSignup] = useState(false)
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
      loginEmailCallback(values.email)
      formik.resetForm()
    },
  })

  const signInWithGoogle = async () => {
    const { data } = await axios.get('/api/auth/google/')
    location.href = data?.location
  }

  const signInWithApple = async () => {
    // TODO: Implement Apple Sign In
    console.log('Apple Sign In - Coming soon!')
  }

  const signInWithWhatsApp = async () => {
    // TODO: Implement WhatsApp login
    console.log('WhatsApp login - Coming soon!')
  }

  const loginEmailCallback = async (email: string) => {
    try {
      setLoading(true)
      await axios.post('/api/auth/email/', {
        email: email,
        texts: {
          subject: t('login:subject'),
          hello: t('login:hello'),
          loginDescription: t('login:loginDescription'),
          login: t('login:login'),
          warning: t('login:warning'),
          thanks: t('login:thanks'),
          welcome: t('login:welcome'),
        },
      })
      setSuccessEmailLogin(true)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  const { values, errors, handleSubmit, handleChange } = formik

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
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
              <h1 className="text-3xl font-bold text-gray-900">Pet's Love</h1>
              <p className="mt-2 text-sm text-gray-600">
                {isSignup ? 'Create your account' : 'Welcome back!'}
              </p>
            </div>
          </div>

          {successEmailLogin ? (
            <div className="text-center space-y-4 py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                {t('login:emailSent')}
              </h2>
              <p className="text-gray-600">
                Check your inbox for the magic link to sign in
              </p>
            </div>
          ) : (
            <>
              {/* Social Login Buttons */}
              <div className="space-y-3">
                <button
                  onClick={signInWithGoogle}
                  className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-white border-2 border-gray-200 rounded-xl hover:border-primary-400 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md font-medium text-gray-700"
                >
                  <IconGoogle width={20} height={20} />
                  Continue with Google
                </button>

                <button
                  onClick={signInWithApple}
                  className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-200 shadow-sm hover:shadow-md font-medium"
                >
                  <IconApple width={20} height={20} fill="white" />
                  Continue with Apple
                </button>

                <button
                  onClick={signInWithWhatsApp}
                  className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all duration-200 shadow-sm hover:shadow-md font-medium"
                >
                  <IconWhatsapp width={20} height={20} />
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
                    Or continue with email
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
                  text={isSignup ? 'Create Account' : 'Send Magic Link'}
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
                  {t('login:terms')}
                </a>
              </div>
            </>
          )}
        </div>

        {/* Additional Info */}
        <p className="mt-8 text-center text-sm text-gray-600">
          By continuing, you agree to Pet's Love's Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}
