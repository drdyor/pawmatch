import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { Pet } from '../types';

interface PetCardProps {
  pet: Pet;
  onPress?: () => void;
  onFavorite?: () => void;
  isFavorited?: boolean;
}

export default function PetCard({ pet, onPress, onFavorite, isFavorited }: PetCardProps) {
  const getAge = () => {
    if (!pet.dateOfBirth) return 'Unknown age';
    const today = new Date();
    const birthDate = new Date(pet.dateOfBirth);
    const months = Math.floor((today.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
    
    if (months < 12) return `${months} month${months !== 1 ? 's' : ''} old`;
    const years = Math.floor(months / 12);
    return `${years} year${years !== 1 ? 's' : ''} old`;
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.imageContainer}>
        {pet.photos && pet.photos.length > 0 ? (
          <Image source={{ uri: pet.photos[0] }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderEmoji}>
              {pet.species === 'dog' ? '🐕' : pet.species === 'cat' ? '🐈' : '🐾'}
            </Text>
          </View>
        )}
        
        {onFavorite && (
          <TouchableOpacity style={styles.favoriteButton} onPress={onFavorite}>
            <Text style={styles.favoriteIcon}>{isFavorited ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
        )}

        {pet.status === 'in_heat' && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>In Heat</Text>
          </View>
        )}
        
        {pet.status === 'stud_available' && (
          <View style={[styles.badge, styles.studBadge]}>
            <Text style={styles.badgeText}>Stud Available</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{pet.name}</Text>
          <Text style={styles.sex}>{pet.sex === 'male' ? '♂️' : '♀️'}</Text>
        </View>

        <Text style={styles.breed}>{pet.breed}</Text>
        
        <View style={styles.details}>
          <Text style={styles.detailText}>{getAge()}</Text>
          {pet.size && <Text style={styles.detailText}> • {pet.size}</Text>}
          {pet.city && <Text style={styles.detailText}> • {pet.city}</Text>}
        </View>

        {pet.description && (
          <Text style={styles.description} numberOfLines={2}>
            {pet.description}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    width: '100%',
    height: 240,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderEmoji: {
    fontSize: 64,
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  favoriteIcon: {
    fontSize: 24,
  },
  badge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  studBadge: {
    backgroundColor: colors.secondary,
  },
  badgeText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },
  sex: {
    fontSize: 20,
  },
  breed: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  description: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
});
