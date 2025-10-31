// New Litter Card - Shows upcoming litters with breeding pair
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, FONTS } from '../theme';
import { Pet } from '../types';

export interface Litter {
  id: string;
  title: string;
  expectedDate: string; // When pups/kittens are due
  malePet: Pet; // Stud/dad
  femalePet: Pet; // Dam/mom
  expectedCount?: number; // Expected number of pups/kittens
  breed: string;
  status: 'breeding' | 'expecting' | 'born' | 'available';
  photos?: string[];
  description?: string;
  createdAt: string;
}

interface NewLitterCardProps {
  litter: Litter;
  onPress?: () => void;
  onViewPair?: () => void;
}

export default function NewLitterCard({
  litter,
  onPress,
  onViewPair,
}: NewLitterCardProps) {
  const daysUntil = Math.ceil(
    (new Date(litter.expectedDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  const isExpecting = daysUntil > 0;
  const isBorn = daysUntil < 0 && litter.status === 'born';

  const getStatusBadge = () => {
    if (litter.status === 'breeding') {
      return { label: '🧬 Breeding Now', color: COLORS.maltaRed, bg: '#FFE8E8' };
    } else if (litter.status === 'expecting' || isExpecting) {
      return { label: `🤰 ${daysUntil} days`, color: COLORS.secondary, bg: '#E6F2FF' };
    } else if (litter.status === 'born' || isBorn) {
      return { label: '🎉 Born!', color: COLORS.success, bg: '#E8F5E8' };
    } else {
      return { label: '🐾 Available', color: COLORS.primary, bg: '#FFE8E8' };
    }
  };

  const statusConfig = getStatusBadge();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Header with Status */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{litter.title}</Text>
          <Text style={styles.breed}>{litter.breed}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}>
          <Text style={[styles.statusText, { color: statusConfig.color }]}>
            {statusConfig.label}
          </Text>
        </View>
      </View>

      {/* Fused Photo of Breeding Pair */}
      <TouchableOpacity
        style={styles.fusedPhotoContainer}
        onPress={onViewPair}
        activeOpacity={0.8}
      >
        <Text style={styles.pairLabel}>Breeding Pair:</Text>
        <View style={styles.fusedImageWrapper}>
          {/* Male Pet - Left Side */}
          <View style={styles.fusedImageHalf}>
            <Image
              source={
                litter.malePet.photos && litter.malePet.photos.length > 0
                  ? { uri: litter.malePet.photos[0] }
                  : { uri: 'https://via.placeholder.com/200?text=PawMatch' }
              }
              style={styles.fusedImage}
              resizeMode="cover"
            />
            <View style={[styles.fusedGenderBadge, styles.genderMale]}>
              <Text style={styles.fusedGenderIcon}>♂</Text>
            </View>
            <View style={styles.fusedOverlay}>
              <Text style={styles.fusedName}>{litter.malePet.name}</Text>
            </View>
          </View>

          {/* Divider Line */}
          <View style={styles.fusedDivider}>
            <Text style={styles.fusedHeart}>💕</Text>
          </View>

          {/* Female Pet - Right Side */}
          <View style={styles.fusedImageHalf}>
            <Image
              source={
                litter.femalePet.photos && litter.femalePet.photos.length > 0
                  ? { uri: litter.femalePet.photos[0] }
                  : { uri: 'https://via.placeholder.com/200?text=PawMatch' }
              }
              style={styles.fusedImage}
              resizeMode="cover"
            />
            <View style={[styles.fusedGenderBadge, styles.genderFemale]}>
              <Text style={styles.fusedGenderIcon}>♀</Text>
            </View>
            <View style={styles.fusedOverlay}>
              <Text style={styles.fusedName}>{litter.femalePet.name}</Text>
            </View>
          </View>
        </View>
        
        {/* Breed Info Below Fused Photo */}
        <View style={styles.fusedBreedInfo}>
          <Text style={styles.fusedBreedText}>
            {litter.malePet.breed || 'Mixed'} × {litter.femalePet.breed || 'Mixed'}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Details */}
      <View style={styles.detailsContainer}>
        {litter.expectedCount && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Expected:</Text>
            <Text style={styles.detailValue}>{litter.expectedCount} pups/kittens</Text>
          </View>
        )}
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Due Date:</Text>
          <Text style={styles.detailValue}>
            {new Date(litter.expectedDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </Text>
        </View>
      </View>

      {/* Action Button */}
      {onViewPair && (
        <TouchableOpacity
          style={styles.viewPairButton}
          onPress={onViewPair}
        >
          <Text style={styles.viewPairText}>View Breeding Pair Details</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 20,
    color: COLORS.text,
    marginBottom: 4,
  },
  breed: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  pairLabel: {
    fontFamily: FONTS.semiBold,
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 12,
  },
  // Fused Photo Styles
  fusedPhotoContainer: {
    marginBottom: 12,
  },
  fusedImageWrapper: {
    flexDirection: 'row',
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 8,
    borderWidth: 2,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  fusedImageHalf: {
    flex: 1,
    position: 'relative',
  },
  fusedImage: {
    width: '100%',
    height: '100%',
  },
  fusedDivider: {
    width: 40,
    backgroundColor: 'rgba(255,255,255,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: COLORS.primary,
  },
  fusedHeart: {
    fontSize: 24,
  },
  fusedGenderBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  fusedGenderIcon: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  fusedOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  fusedName: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
  },
  fusedBreedInfo: {
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: COLORS.neutral,
    borderRadius: 12,
    alignItems: 'center',
  },
  fusedBreedText: {
    fontFamily: FONTS.semiBold,
    fontSize: 13,
    color: COLORS.text,
  },
  detailsContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  detailLabel: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  detailValue: {
    fontFamily: FONTS.semiBold,
    fontSize: 14,
    color: COLORS.text,
  },
  viewPairButton: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: COLORS.neutral,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  viewPairText: {
    fontFamily: FONTS.semiBold,
    fontSize: 14,
    color: COLORS.secondary,
  },
});
