import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion'
import { FC } from 'react'

import { MidDog } from '../../../assets/images'

interface Pet {
  id: string
  name: string
  breed?: string
  age?: string
  size?: string
  weight?: string
  gender?: string
  city?: string
  images?: string[]
  description?: string
  adopted?: boolean
}

interface SwipeableCardProps {
  pet: Pet
  onSwipeLeft: () => void
  onSwipeRight: () => void
  onSwipeUp?: () => void
}

export const SwipeableCard: FC<SwipeableCardProps> = ({
  pet,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
}) => {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotate = useTransform(x, [-200, 0, 200], [-15, 0, 15])
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5])

  const likeOpacity = useTransform(x, [0, 100], [0, 1])
  const nopeOpacity = useTransform(x, [-100, 0], [1, 0])
  const superlikeOpacity = useTransform(y, [-100, 0], [1, 0])

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 150

    if (info.offset.y < -threshold && onSwipeUp) {
      onSwipeUp()
    } else if (info.offset.x > threshold) {
      onSwipeRight()
    } else if (info.offset.x < -threshold) {
      onSwipeLeft()
    }
  }

  const getAge = () => {
    if (!pet.age) return 'Age unknown'
    return `${pet.age} old`
  }

  const mainImage = pet.images && pet.images.length > 0 ? pet.images[0] : MidDog

  return (
    <motion.div
      className="absolute w-full h-full cursor-grab active:cursor-grabbing"
      style={{
        x,
        y,
        rotate,
        opacity,
      }}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      whileTap={{ scale: 0.95 }}
    >
      {/* LIKE overlay */}
      <motion.div
        style={{ opacity: likeOpacity }}
        className="absolute top-12 right-8 z-10 px-6 py-4 border-4 border-green-500 rounded-2xl rotate-[20deg]"
      >
        <span className="text-4xl font-extrabold text-white">
          INTERESTED
        </span>
      </motion.div>

      {/* NOPE overlay */}
      <motion.div
        style={{ opacity: nopeOpacity }}
        className="absolute top-12 left-8 z-10 px-6 py-4 border-4 border-red-500 rounded-2xl -rotate-[20deg]"
      >
        <span className="text-4xl font-extrabold text-white">PASS</span>
      </motion.div>

      {/* SUPER LIKE overlay */}
      {onSwipeUp && (
        <motion.div
          style={{ opacity: superlikeOpacity }}
          className="absolute top-8 left-1/2 -translate-x-1/2 z-10 px-6 py-4 border-4 border-blue-500 rounded-2xl"
        >
          <span className="text-4xl font-extrabold text-white">SUPER LIKE</span>
        </motion.div>
      )}

      {/* Card content */}
      <div className="w-full h-full bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Image section - 65% height */}
        <div className="relative h-[65%] w-full bg-gradient-to-br from-primary-100 to-primary-200">
          <img
            src={mainImage}
            alt={pet.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = MidDog
            }}
          />
          
          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>

        {/* Info section - 35% height */}
        <div className="h-[35%] p-6 flex flex-col justify-between bg-white">
          <div className="space-y-2">
            {/* Name and Age */}
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-gray-900 capitalize">
                {pet.name}
              </h2>
              <span className="text-lg text-gray-600">{getAge()}</span>
            </div>

            {/* Breed */}
            {pet.breed && (
              <p className="text-lg text-gray-600 capitalize">{pet.breed}</p>
            )}

            {/* Details row */}
            <div className="flex flex-wrap gap-3 items-center">
              {pet.city && (
                <div className="flex items-center gap-1 text-sm text-gray-700">
                  <span>📍</span>
                  <span>{pet.city}</span>
                </div>
              )}
              {pet.weight && (
                <div className="flex items-center gap-1 text-sm text-gray-700">
                  <span>⚖️</span>
                  <span>{pet.weight}</span>
                </div>
              )}
              {pet.size && (
                <div className="flex items-center gap-1 text-sm text-gray-700">
                  <span>📏</span>
                  <span className="capitalize">{pet.size}</span>
                </div>
              )}
              {pet.gender && (
                <div className="flex items-center gap-1 text-sm text-gray-700">
                  <span>{pet.gender === 'male' ? '♂️' : '♀️'}</span>
                  <span className="capitalize">{pet.gender}</span>
                </div>
              )}
            </div>

            {/* Description */}
            {pet.description && (
              <p className="text-sm text-gray-600 line-clamp-2 mt-2">
                {pet.description}
              </p>
            )}
          </div>

          {/* Adoption status badge */}
          {!pet.adopted && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-sm font-medium w-fit">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Available for adoption
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
