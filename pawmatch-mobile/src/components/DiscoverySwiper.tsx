import React, { useRef } from 'react'
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native'
import { Swiper, type SwiperCardRefType } from 'rn-swiper-list'
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
  const ref = useRef<SwiperCardRefType>(null)

  const calculateAge = (dateOfBirth: string): number => {
    if (!dateOfBirth) return 0;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    const months = Math.floor((today.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
    return Math.floor(months / 12); // return age in years
  };

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
        {/* Pet Info Overlay at Bottom-Left */}
        <View style={styles.infoOverlay}>
          <View style={styles.infoGradient}>
            <Text style={styles.petName}>{item.pet.name || 'Unknown'}, {calculateAge(item.pet.date_of_birth)}</Text>
            <Text style={styles.petBreed}>{item.pet.breed}, {item.pet.sex === 'male' ? 'Male' : 'Female'}</Text>
          </View>
        </View>
        {/* Play Button Overlay (if video available) */}
        {item.pet.photos && item.pet.photos.length > 1 && (
          <View style={styles.playButtonOverlay}>
            <Text style={styles.playButton}>▶</Text>
          </View>
        )}
      </View>
    </View>
  );

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

  // Handle empty cards array
  if (!cards || cards.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🐾</Text>
          <Text style={styles.emptyText}>No pets available</Text>
          <Text style={styles.emptySubtext}>Check back later or adjust your filters</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Swiper<LitterCard>
        ref={ref}
        data={cards}
        cardStyle={styles.swiperCardContainer}
        overlayLabelContainerStyle={styles.overlayLabelContainerStyle}
        renderCard={renderCard}
        onSwipeRight={(index: number) => {
          const card = cards[index]
          if (card) onLike(card)
        }}
        onSwipeLeft={(index: number) => {
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
    height: '100%',
    width: '100%',
    position: 'relative',
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
  infoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
  },
  infoGradient: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 16,
    justifyContent: 'flex-end',
  },
  petName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  petBreed: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  playButtonOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -30,
    marginTop: -30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    fontSize: 24,
    color: '#FFFFFF',
    marginLeft: 4,
  },
  cardInfo: {
    flex: 1,
    padding: 20,
    gap: 6,
    backgroundColor: colors.background,
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
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
})
