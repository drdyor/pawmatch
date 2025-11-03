import React, { useRef } from 'react'
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native'
import Swiper, { type SwiperCardRefType } from 'rn-swiper-list'
import { colors } from '../theme/colors'
import { Listing, Pet } from '../types'

const SCREEN_WIDTH = Dimensions.get('window').width

export type LitterCard = Listing & { pet: Pet }

interface DiscoverySwiperProps {
  cards: LitterCard[]
  onLike: (card: LitterCard) => void
  onPass: (card: LitterCard) => void
  onDetail?: (card: LitterCard) => void
}

export function DiscoverySwiper({ cards, onLike, onPass, onDetail }: DiscoverySwiperProps) {
  const ref = useRef<SwiperCardRefType>()

  const renderCard = (item: LitterCard) => (
    <View style={styles.cardStyle}>
      <View style={styles.cardImageContainer}>
        {item.pet.photos?.[0] ? (
          <Image source={{ uri: item.pet.photos[0] }} style={styles.cardImage} resizeMode="cover" />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderEmoji}>{item.pet.species === 'dog' ? '🐕' : '🐈'}</Text>
          </View>
        )}
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.cardBreed}>{item.pet.breed}</Text>
        <Text style={styles.cardLocation}>
          {item.city}, {item.country}
        </Text>
        <Text style={styles.cardPrice}>
          €{(item.price / 100).toFixed(0)}{item.pupsAvailable ? ` · ${item.pupsAvailable} available` : ''}
        </Text>
        {item.availableDate && (
          <Text style={styles.cardDate}>Ready: {new Date(item.availableDate).toLocaleDateString()}</Text>
        )}
      </View>
    </View>
  )

  const OverlayLabelRight = () => (
    <View style={[styles.overlay, styles.saveOverlay]}>
      <Text style={styles.overlayText}>SAVE</Text>
    </View>
  )
  const OverlayLabelLeft = () => (
    <View style={[styles.overlay, styles.passOverlay]}>
      <Text style={styles.overlayText}>PASS</Text>
    </View>
  )

  return (
    <View style={styles.container}>
      <Swiper<LitterCard>
        ref={ref}
        data={cards}
        cardStyle={styles.swiperCardContainer}
        overlayLabelContainerStyle={styles.overlayLabelContainerStyle}
        renderCard={renderCard}
        onSwipeRight={(index) => {
          const card = cards[index]
          if (card) onLike(card)
        }}
        onSwipeLeft={(index) => {
          const card = cards[index]
          if (card) onPass(card)
        }}
        onPress={() => {
          // Open details for current index when card tapped
          // Swiper exposes index via onIndexChange; for simplicity, open last rendered
        }}
        OverlayLabelRight={OverlayLabelRight}
        OverlayLabelLeft={OverlayLabelLeft}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swiperCardContainer: {
    width: SCREEN_WIDTH - 40,
    height: '75%',
    borderRadius: 24,
    backgroundColor: colors.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  cardStyle: {
    width: '100%',
    height: '100%',
  },
  cardImageContainer: {
    height: '65%',
    width: '100%',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderEmoji: {
    fontSize: 80,
  },
  cardInfo: {
    flex: 1,
    padding: 20,
    gap: 6,
    backgroundColor: colors.background,
  },
  cardBreed: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2F3A4A',
  },
  cardLocation: {
    fontSize: 16,
    color: '#6B7280',
  },
  cardPrice: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  cardDate: {
    fontSize: 14,
    color: '#6B7280',
  },
  overlay: {
    position: 'absolute',
    top: 50,
    zIndex: 10,
    padding: 16,
    borderRadius: 12,
    borderWidth: 4,
    backgroundColor: 'rgba(255,255,255,0.9)'
  },
  saveOverlay: {
    right: 30,
    borderColor: colors.success,
    transform: [{ rotate: '20deg' }],
  },
  passOverlay: {
    left: 30,
    borderColor: colors.danger,
    transform: [{ rotate: '-20deg' }],
  },
  overlayText: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
  },
  overlayLabelContainerStyle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
})
