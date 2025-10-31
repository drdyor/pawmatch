// Enhanced Discovery Card Component (Improved UI, based on web demo logic)
// Used in both Breeding and Adoption Discovery screens
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, FONTS } from '../theme';
import { Pet } from '../types';

interface DiscoveryCardProps {
  pet: Pet;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onInfo?: () => void;
  onSuperLike?: () => void;
  showActions?: boolean;
}

export default function DiscoveryCard({
  pet,
  onSwipeLeft,
  onSwipeRight,
  onInfo,
  onSuperLike,
  showActions = true,
}: DiscoveryCardProps) {
  // Get intent badge configuration
  const getIntentBadge = () => {
    const intent = pet.listing_type || 'adoption';
    const configs: Record<string, { label: string; color: string; bg: string }> = {
      breeding: {
        label: '🧬 Breeding',
        color: COLORS.maltaRed,
        bg: '#FFE8E8',
      },
      adoption: {
        label: '🏠 Adoption',
        color: COLORS.success,
        bg: '#E8F5E8',
      },
      sale: {
        label: '💰 For Sale',
        color: '#E67E22',
        bg: '#FFF4E6',
      },
      playdate: {
        label: '🎾 Play Dates',
        color: COLORS.secondary,
        bg: '#E6F2FF',
      },
    };
    return configs[intent] || configs.adoption;
  };

  const intentConfig = getIntentBadge();
  const ageDisplay = pet.age_months
    ? pet.age_months >= 12
      ? `${Math.floor(pet.age_months / 12)}y`
      : `${pet.age_months}mo`
    : 'Young';

  return (
    <View style={styles.card}>
      {/* Image Container */}
      <View style={styles.imageContainer}>
        <Image
          source={
            pet.photos && pet.photos.length > 0
              ? { uri: pet.photos[0] }
              : { uri: 'https://via.placeholder.com/400?text=PawMatch' }
          }
          style={styles.image}
          resizeMode="cover"
        />

        {/* Gender Indicator */}
        <View
          style={[
            styles.genderIndicator,
            pet.sex === 'female' ? styles.genderFemale : styles.genderMale,
          ]}
        >
          <Text style={styles.genderIcon}>🐾</Text>
        </View>

        {/* Origin Country Badge (Malta) */}
        {pet.country === 'Malta' && (
          <View style={styles.originBadge}>
            <Text style={styles.originText}>🇲🇹 Malta</Text>
          </View>
        )}

        {/* Intent Badge */}
        <View style={[styles.intentBadge, { backgroundColor: intentConfig.bg }]}>
          <Text style={[styles.intentText, { color: intentConfig.color }]}>
            {intentConfig.label}
          </Text>
        </View>

        {/* Watermark */}
        <View style={styles.watermark}>
          <Text style={styles.watermarkText}>PawMatch MT</Text>
        </View>

        {/* Tinder-style Bottom Info Overlay */}
        <View style={styles.overlay}>
          <View style={styles.overlayContent}>
            <View style={styles.nameRow}>
              <Text style={styles.petName}>
                {pet.name}, {ageDisplay}
              </Text>
              {pet.health_badges?.includes('vet_checked') && (
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedText}>✓</Text>
                </View>
              )}
            </View>
            <Text style={styles.petBreed}>
              {pet.breed || 'Mixed'}
            </Text>
            {pet.city && (
              <Text style={styles.petLocation}>
                📍 {pet.city}, {pet.country || 'Malta'}
              </Text>
            )}
            {/* Quick tags - minimal info */}
            {pet.metadata?.temperament && pet.metadata.temperament.length > 0 && (
              <View style={styles.quickTagsContainer}>
                {pet.metadata.temperament.slice(0, 2).map((tag: string) => (
                  <View key={tag} style={styles.quickTag}>
                    <Text style={styles.quickTagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    maxWidth: 400,
    height: '85%', // Larger card like Tinder
    maxHeight: 650,
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  imageContainer: {
    width: '100%',
    height: '100%', // Full height - photo takes entire card
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  genderIndicator: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  genderFemale: {
    backgroundColor: '#FF69B4',
  },
  genderMale: {
    backgroundColor: COLORS.secondary,
  },
  genderIcon: {
    fontSize: 20,
  },
  originBadge: {
    position: 'absolute',
    top: 15,
    left: 15,
    backgroundColor: COLORS.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  originText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  intentBadge: {
    position: 'absolute',
    bottom: 60,
    left: 15,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  intentText: {
    fontSize: 10,
    fontWeight: '700',
  },
  watermark: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  watermarkText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.text,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  overlayContent: {
    gap: 6,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  petName: {
    fontFamily: FONTS.bold,
    fontSize: 32,
    color: '#fff',
    fontWeight: '800',
  },
  verifiedBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  verifiedText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  petBreed: {
    fontFamily: FONTS.medium,
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
  petLocation: {
    fontFamily: FONTS.regular,
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
  },
  quickTagsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  quickTag: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  quickTagText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  infoContainer: {
    // Removed - info now only in overlay for Tinder-style
    display: 'none',
  },
  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 8,
  },
  description: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 8,
  },
  originRow: {
    marginBottom: 8,
  },
  originLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  tag: {
    backgroundColor: COLORS.neutral,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    color: COLORS.text,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  healthBadge: {
    backgroundColor: COLORS.success,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  healthBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 12,
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  dislikeButton: {
    borderWidth: 2,
    borderColor: COLORS.maltaRed,
  },
  infoButton: {
    borderWidth: 2,
    borderColor: COLORS.secondary,
  },
  superLikeButton: {
    borderWidth: 2,
    borderColor: COLORS.accent,
  },
  likeButton: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  actionButtonText: {
    fontSize: 24,
  },
});
