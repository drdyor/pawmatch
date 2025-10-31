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

      {/* Breeding Pair */}
      <View style={styles.pairContainer}>
        <Text style={styles.pairLabel}>Breeding Pair:</Text>
        
        <View style={styles.petsRow}>
          {/* Male Pet */}
          <TouchableOpacity
            style={styles.petCard}
            onPress={onViewPair}
            activeOpacity={0.7}
          >
            <View style={styles.petImageContainer}>
              <Image
                source={
                  litter.malePet.photos && litter.malePet.photos.length > 0
                    ? { uri: litter.malePet.photos[0] }
                    : require('../../assets/images/placeholder-pet.png')
                }
                style={styles.petImage}
                resizeMode="cover"
              />
              <View style={[styles.genderBadge, styles.genderMale]}>
                <Text style={styles.genderIcon}>♂</Text>
              </View>
            </View>
            <Text style={styles.petName}>{litter.malePet.name}</Text>
            <Text style={styles.petBreed}>{litter.malePet.breed || 'Mixed'}</Text>
          </TouchableOpacity>

          {/* Plus Icon */}
          <View style={styles.plusContainer}>
            <Text style={styles.plusIcon}>+</Text>
          </View>

          {/* Female Pet */}
          <TouchableOpacity
            style={styles.petCard}
            onPress={onViewPair}
            activeOpacity={0.7}
          >
            <View style={styles.petImageContainer}>
              <Image
                source={
                  litter.femalePet.photos && litter.femalePet.photos.length > 0
                    ? { uri: litter.femalePet.photos[0] }
                    : require('../../assets/images/placeholder-pet.png')
                }
                style={styles.petImage}
                resizeMode="cover"
              />
              <View style={[styles.genderBadge, styles.genderFemale]}>
                <Text style={styles.genderIcon}>♀</Text>
              </View>
            </View>
            <Text style={styles.petName}>{litter.femalePet.name}</Text>
            <Text style={styles.petBreed}>{litter.femalePet.breed || 'Mixed'}</Text>
          </TouchableOpacity>
        </View>
      </View>

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
  pairContainer: {
    marginBottom: 12,
  },
  pairLabel: {
    fontFamily: FONTS.semiBold,
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 12,
  },
  petsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  petCard: {
    flex: 1,
    alignItems: 'center',
  },
  petImageContainer: {
    position: 'relative',
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  petImage: {
    width: '100%',
    height: '100%',
  },
  genderBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  genderMale: {
    backgroundColor: COLORS.secondary,
  },
  genderFemale: {
    backgroundColor: '#FF69B4',
  },
  genderIcon: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  petName: {
    fontFamily: FONTS.semiBold,
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 2,
    textAlign: 'center',
  },
  petBreed: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  plusContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.neutral,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  plusIcon: {
    fontSize: 20,
    color: COLORS.textSecondary,
    fontWeight: '300',
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
