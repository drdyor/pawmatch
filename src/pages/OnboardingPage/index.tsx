import { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Multi-step onboarding flow
export const OnboardingPage: FC = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    role: '',
    name: '',
    location: '',
    species: '',
    breed: '',
    size: '',
    ageRange: '',
  })

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1)
    } else {
      // Save to localStorage for demo
      localStorage.setItem('user_onboarded', 'true')
      localStorage.setItem('user_data', JSON.stringify(formData))
      navigate('/discover')
    }
  }

  const handleRoleSelect = (role: string) => {
    setFormData({ ...formData, role })
    setTimeout(() => setStep(2), 300)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-10 w-full max-w-lg">
        
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Step {step} of 4</span>
            <span className="text-sm text-gray-500">{Math.round((step / 4) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Role Selection */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome to PawMatch! 🐾
              </h2>
              <p className="text-gray-600">
                Let's get you started. What brings you here?
              </p>
            </div>

            <div className="space-y-3">
              {[
                { role: 'adopter', icon: '❤️', title: 'Looking to Adopt', desc: 'Find your perfect pet companion' },
                { role: 'breeder', icon: '🐕', title: 'Professional Breeder', desc: 'Connect with potential buyers' },
                { role: 'shelter', icon: '🏠', title: 'Animal Shelter', desc: 'Find homes for rescue pets' },
                { role: 'vet', icon: '⚕️', title: 'Veterinarian', desc: 'Provide pet care services' },
              ].map((option) => (
                <button
                  key={option.role}
                  onClick={() => handleRoleSelect(option.role)}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-primary-400 hover:bg-primary-50 transition-all text-left group"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{option.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 group-hover:text-primary-600">
                        {option.title}
                      </h3>
                      <p className="text-sm text-gray-600">{option.desc}</p>
                    </div>
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Profile Info */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Tell us about yourself
              </h2>
              <p className="text-gray-600">
                This helps us personalize your experience
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Malta"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                />
              </div>
            </div>

            <button
              onClick={handleNext}
              disabled={!formData.name || !formData.location}
              className="w-full bg-primary-500 text-white font-semibold py-3 rounded-xl hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 3: Pet Preferences */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                What are you looking for?
              </h2>
              <p className="text-gray-600">
                Help us show you the perfect matches
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Species
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['Dog', 'Cat'].map((species) => (
                    <button
                      key={species}
                      onClick={() => setFormData({ ...formData, species })}
                      className={`p-4 border-2 rounded-xl font-medium transition-all ${
                        formData.species === species
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-primary-300'
                      }`}
                    >
                      {species === 'Dog' ? '🐕' : '🐈'} {species}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size Preference
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Small', 'Medium', 'Large'].map((size) => (
                    <button
                      key={size}
                      onClick={() => setFormData({ ...formData, size })}
                      className={`py-3 px-2 border-2 rounded-xl text-sm font-medium transition-all ${
                        formData.size === size
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-primary-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age Range
                </label>
                <select
                  value={formData.ageRange}
                  onChange={(e) => setFormData({ ...formData, ageRange: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                >
                  <option value="">Select age range</option>
                  <option value="puppy">Puppy/Kitten (0-1 year)</option>
                  <option value="young">Young (1-3 years)</option>
                  <option value="adult">Adult (3-7 years)</option>
                  <option value="senior">Senior (7+ years)</option>
                  <option value="any">Any Age</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleNext}
              disabled={!formData.species}
              className="w-full bg-primary-500 text-white font-semibold py-3 rounded-xl hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 4: Review & Complete */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                You're all set! 🎉
              </h2>
              <p className="text-gray-600">
                Ready to start matching with amazing pets
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Role:</span>
                <span className="font-medium capitalize">{formData.role}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium">{formData.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Location:</span>
                <span className="font-medium">{formData.location}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Looking for:</span>
                <span className="font-medium">{formData.species} ({formData.size})</span>
              </div>
            </div>

            <button
              onClick={handleNext}
              className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold py-3 rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg"
            >
              Start Swiping! 🐾
            </button>

            <button
              onClick={() => setStep(1)}
              className="w-full text-gray-600 text-sm hover:text-gray-900"
            >
              ← Go back and edit
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
