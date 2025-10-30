import { AnimatePresence } from 'framer-motion'
import { FC, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { IconClose, IconUser } from '../../assets/icons'
import { BaseButton } from '../../components/common/BaseButton'
import { BaseLoading } from '../../components/common/BaseLoading'
import { SwipeableCard } from '../../components/common/SwipeableCard'
import { useGetPets } from '../../hooks/pets/useGetPets'

export const SwipeDiscoverPage: FC = () => {
  const { t } = useTranslation(['common', 'searchPet'])
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState<'left' | 'right' | null>(null)
  
  const { data, isLoading } = useGetPets({
    page: 1,
    adopted: false,
  })

  const pets = data?.pets || []
  const currentPet = pets[currentIndex]

  useEffect(() => {
    // Preload next images
    if (pets[currentIndex + 1]?.images?.[0]) {
      const img = new Image()
      img.src = pets[currentIndex + 1].images[0]
    }
  }, [currentIndex, pets])

  const handleSwipeLeft = () => {
    setDirection('left')
    setTimeout(() => {
      setCurrentIndex((prev) => Math.min(prev + 1, pets.length - 1))
      setDirection(null)
    }, 300)
  }

  const handleSwipeRight = () => {
    setDirection('right')
    setTimeout(() => {
      setCurrentIndex((prev) => Math.min(prev + 1, pets.length - 1))
      setDirection(null)
    }, 300)
  }

  const handleSwipeUp = () => {
    // Super like - navigate to detail page
    if (currentPet) {
      navigate(`/pet/${currentPet.id}`)
    }
  }

  const handleUndo = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
    }
  }

  const handleReset = () => {
    setCurrentIndex(0)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <BaseLoading large />
      </div>
    )
  }

  if (!pets || pets.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
        <div className="text-center space-y-6 p-8">
          <div className="text-6xl">🐾</div>
          <h2 className="text-3xl font-bold text-gray-900">
            {t('searchPet:noPetsAvailable')}
          </h2>
          <p className="text-gray-600 max-w-md">
            Check back later for new pets available for adoption
          </p>
          <BaseButton
            text={t('common:backToHome')}
            onClick={() => navigate('/dashboard')}
          />
        </div>
      </div>
    )
  }

  if (currentIndex >= pets.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
        <div className="text-center space-y-6 p-8 max-w-md">
          <div className="text-6xl">✨</div>
          <h2 className="text-3xl font-bold text-gray-900">
            You've seen all pets!
          </h2>
          <p className="text-gray-600">
            That's everyone in your area. Check back later for new additions!
          </p>
          <div className="flex gap-4 justify-center">
            <BaseButton
              style="secondary"
              text="Start Over"
              onClick={handleReset}
            />
            <BaseButton
              text="Back to Home"
              onClick={() => navigate('/dashboard')}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-primary-100 to-primary-200 overflow-hidden">
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-6">
        <button
          onClick={() => navigate('/dashboard')}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-lg hover:shadow-xl transition-shadow"
        >
          <IconClose className="w-6 h-6" />
        </button>

        <div className="px-6 py-3 bg-white rounded-full shadow-lg">
          <span className="text-sm font-semibold text-gray-700">
            {currentIndex + 1} / {pets.length}
          </span>
        </div>

        <button
          onClick={() => navigate('/settings')}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-lg hover:shadow-xl transition-shadow"
        >
          <IconUser className="w-6 h-6" />
        </button>
      </div>

      {/* Instructions */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 z-10 bg-white px-6 py-3 rounded-full shadow-lg">
        <p className="text-sm font-medium text-gray-700">
          Swipe right to like • Swipe left to pass • Swipe up for details
        </p>
      </div>

      {/* Card Stack */}
      <div className="relative flex items-center justify-center" style={{ height: 'calc(100vh - 250px)' }}>
        <div className="relative w-full max-w-md h-full px-4">
          <AnimatePresence>
            {pets.slice(currentIndex, currentIndex + 2).map((pet, index) => (
              <div
                key={pet.id}
                className="absolute inset-0"
                style={{
                  zIndex: pets.length - index,
                  transform: `scale(${1 - index * 0.05}) translateY(${index * 10}px)`,
                  opacity: index === 0 ? 1 : 0.5,
                  pointerEvents: index === 0 ? 'auto' : 'none',
                }}
              >
                {index === 0 && (
                  <SwipeableCard
                    pet={pet}
                    onSwipeLeft={handleSwipeLeft}
                    onSwipeRight={handleSwipeRight}
                    onSwipeUp={handleSwipeUp}
                  />
                )}
              </div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center justify-center gap-6 z-10">
        {/* Pass Button */}
        <button
          onClick={handleSwipeLeft}
          className="w-16 h-16 flex items-center justify-center rounded-full bg-white shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-200 border-2 border-red-200"
          aria-label="Pass"
        >
          <span className="text-3xl">✖️</span>
        </button>

        {/* Undo Button */}
        {currentIndex > 0 && (
          <button
            onClick={handleUndo}
            className="w-14 h-14 flex items-center justify-center rounded-full bg-white shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-200"
            aria-label="Undo"
          >
            <span className="text-2xl">↩️</span>
          </button>
        )}

        {/* Super Like Button */}
        <button
          onClick={handleSwipeUp}
          className="w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-blue-600 shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-200 text-white"
          aria-label="Super Like"
        >
          <span className="text-4xl">⭐</span>
        </button>

        {/* Like Button */}
        <button
          onClick={handleSwipeRight}
          className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-green-600 shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-200 text-white"
          aria-label="Like"
        >
          <span className="text-3xl">❤️</span>
        </button>
      </div>
    </div>
  )
}
