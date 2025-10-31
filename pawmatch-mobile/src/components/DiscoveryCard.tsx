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
              : require('../../assets/images/placeholder-pet.png')
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

        {/* Info Overlay */}
        <View style={styles.overlay}>
          <View style={styles.overlayContent}>
            <Text style={styles.petName}>
              {pet.name} • {ageDisplay}
            </Text>
            <Text style={styles.petBreed}>
              {pet.breed || 'Mixed'} • {pet.city || pet.country || 'Malta'}
            </Text>
          </View>
        </View>
      </View>

      {/* Card Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.description} numberOfLines={3}>
          {pet.description || `${pet.name} is looking for a loving ${pet.listing_type === 'adoption' ? 'home' : 'connection'}.`}
        </Text>

        {/* Origin Country (if not Malta) */}
        {pet.country && pet.country !== 'Malta' && (
          <View style={styles.originRow}>
            <Text style={styles.originLabel}>Origin: {pet.country}</Text>
          </View>
        )}

        {/* Temperament Tags */}
        {pet.metadata?.temperament && pet.metadata.temperament.length > 0 && (
          <View style={styles.tagsContainer}>
            {pet.metadata.temperament.slice(0, 3).map((tag: string) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Health Badges */}
        {pet.health_badges && pet.health_badges.length > 0 && (
          <View style={styles.badgesContainer}>
            {pet.health_badges.includes('vet_checked') && (
              <View style={styles.healthBadge}>
                <Text style={styles.healthBadgeText}>✅ Vet Checked</Text>
              </View>
            )}
            {pet.health_badges.includes('dna_verified') && (
              <View style={styles.healthBadge}>
                <Text style={styles.healthBadgeText}>🧬 DNA Verified</Text>
              </View>
            )}
          </View>
        )}

        {/* Action Buttons */}
        {showActions && (
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[styles.actionButton, styles.dislikeButton]}
              onPress={onSwipeLeft}
            >
              <Text style={styles.actionButtonText}>✕</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.infoButton]}
              onPress={onInfo}
            >
              <Text style={styles.actionButtonText}>ℹ️</Text>
            </TouchableOpacity>
            {onSuperLike && (
              <TouchableOpacity
                style={[styles.actionButton, styles.superLikeButton]}
                onPress={onSuperLike}
              >
                <Text style={styles.actionButtonText}>⭐</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.actionButton, styles.likeButton]}
              onPress={onSwipeRight}
            >
              <Text style={styles.actionButtonText}>❤️</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    maxWidth: 400,
    height: '70%',
    maxHeight: 600,
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
    height: '65%',
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
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 15,
  },
  overlayContent: {
    gap: 4,
  },
  petName: {
    fontFamily: FONTS.bold,
    fontSize: 24,
    color: '#fff',
    fontWeight: '800',
  },
  petBreed: {
    fontFamily: FONTS.medium,
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
  },
  infoContainer: {
    padding: 20,
    height: '35%',
    justifyContent: 'space-between',
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
