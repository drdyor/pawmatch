// Breeding Discovery Screen - Tinder-style Swipe (for Breeders/Owners)
// Different from Adoption Discovery - shows potential breeding matches
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Animated,
  PanResponder,
  Dimensions,
  ScrollView,
  StatusBar,
} from 'react-native';
import { COLORS, FONTS } from '../../theme';
import { supabase } from '../../services/supabase';
import { Pet, Listing } from '../../types';
import FilterChip from '../../components/FilterChip';
import DiscoveryCard from '../../components/DiscoveryCard';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

type BreedingFilter = 'all' | 'dogs' | 'cats' | 'pharaoh' | 'maltese' | 'local' | 'verified';

const BREEDING_FILTERS: { id: BreedingFilter; label: string }[] = [
  { id: 'all', label: 'All Pets' },
  { id: 'dogs', label: 'Dogs' },
  { id: 'cats', label: 'Cats' },
  { id: 'pharaoh', label: 'Pharaoh Hounds' },
  { id: 'maltese', label: 'Maltese Dogs' },
  { id: 'local', label: 'Local Breeders' },
  { id: 'verified', label: 'Verified' },
];

// Swipe wrapper for DiscoveryCard
interface SwipeCardProps {
  pet: Pet;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onInfo?: () => void;
  onSuperLike?: () => void;
  index: number;
  total: number;
}

function SwipeCard({ 
  pet, 
  onSwipeLeft, 
  onSwipeRight, 
  onInfo,
  onSuperLike,
  index, 
  total 
}: SwipeCardProps) {
  const pan = useRef(new Animated.ValueXY()).current;
  const rotate = pan.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        pan.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          onSwipeRight();
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          onSwipeLeft();
        } else {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (
    <Animated.View
      style={[
        {
          transform: [
            { translateX: pan.x },
            { translateY: pan.y },
            { rotate },
          ],
        },
      ]}
      {...panResponder.panHandlers}
    >
      <DiscoveryCard
        pet={pet}
        onSwipeLeft={onSwipeLeft}
        onSwipeRight={onSwipeRight}
        onInfo={onInfo}
        onSuperLike={onSuperLike}
        showActions={false} // Actions shown separately below
      />
    </Animated.View>
  );
}

export default function BreedingDiscoveryScreen({ navigation }: any) {
  const [pets, setPets] = useState<Pet[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<BreedingFilter>('all');

  useEffect(() => {
    loadBreedingMatches();
  }, [activeFilter]);

  const loadBreedingMatches = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('pets')
        .select('*, profiles:owner_id(*)')
        .eq('listing_type', 'breeding')
        .eq('available_for_breeding', true)
        .order('created_at', { ascending: false })
        .limit(50);

      // Apply filters
      if (activeFilter === 'dogs') {
        query = query.eq('species', 'dog');
      } else if (activeFilter === 'cats') {
        query = query.eq('species', 'cat');
      } else if (activeFilter === 'pharaoh') {
        query = query.ilike('breed', '%pharaoh%');
      } else if (activeFilter === 'maltese') {
        query = query.ilike('breed', '%maltese%');
      } else if (activeFilter === 'verified') {
        query = query.contains('health_badges', ['vet_checked']);
      }

      const { data, error } = await query;

      if (error) throw error;
      setPets(data || []);
      setCurrentIndex(0);
    } catch (error: any) {
      console.error('Error loading breeding matches:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSwipeLeft = () => {
    // Pass - move to next
    if (currentIndex < pets.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleSwipeRight = async () => {
    // Like - potential match
    const currentPet = pets[currentIndex];
    if (!currentPet) return;

    // Check if it's a match (mutual like logic would go here)
    Alert.alert('❤️ Potential Match!', `You liked ${currentPet.name}. Check your matches to see if they liked you back!`);

    // Move to next card
    if (currentIndex < pets.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      Alert.alert('No more pets', 'You\'ve seen all available matches. Check back later!');
    }
  };

  const handleSuperLike = () => {
    const currentPet = pets[currentIndex];
    if (currentPet) {
      Alert.alert('⭐ Super Like!', `You super liked ${currentPet.name}!`);
      handleSwipeRight();
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (pets.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.header}>
          <Text style={styles.title}>No Breeding Matches</Text>
          <Text style={styles.subtitle}>Check back later for new potential matches</Text>
        </View>
      </View>
    );
  }

  const currentPet = pets[currentIndex];
  const nextPet = currentIndex < pets.length - 1 ? pets[currentIndex + 1] : null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      {/* Malta Flag Header */}
      <View style={styles.header}>
        <View style={styles.flagContainer}>
          <Text style={styles.flag}>🇲🇹</Text>
        </View>
        <Text style={styles.title}>Breeding Discovery</Text>
        <Text style={styles.subtitle}>Find the perfect breeding partner</Text>
      </View>

      {/* Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      >
        {BREEDING_FILTERS.map((filter) => (
          <FilterChip
            key={filter.id}
            label={filter.label}
            active={activeFilter === filter.id}
            onPress={() => setActiveFilter(filter.id)}
          />
        ))}
      </ScrollView>

      {/* Swipe Cards - Tinder-style stacking */}
      <View style={styles.cardsContainer}>
        {/* Show next 2 cards behind for stacking effect */}
        {currentIndex < pets.length - 1 && (
          <View style={[styles.card, styles.cardBehind, { zIndex: 1 }]}>
            <Image
              source={
                pets[currentIndex + 1].photos && pets[currentIndex + 1].photos.length > 0
                  ? { uri: pets[currentIndex + 1].photos[0] }
                  : require('../../assets/images/placeholder-pet.png')
              }
              style={styles.cardImage}
              resizeMode="cover"
            />
          </View>
        )}
        {currentIndex < pets.length - 2 && (
          <View style={[styles.card, styles.cardBehind, { zIndex: 0, opacity: 0.4, transform: [{ scale: 0.92 }] }]}>
            <Image
              source={
                pets[currentIndex + 2].photos && pets[currentIndex + 2].photos.length > 0
                  ? { uri: pets[currentIndex + 2].photos[0] }
                  : require('../../assets/images/placeholder-pet.png')
              }
              style={styles.cardImage}
              resizeMode="cover"
            />
          </View>
        )}
        {/* Current card on top */}
        {currentPet && (
          <SwipeCard
            pet={currentPet}
            onSwipeLeft={handleSwipeLeft}
            onSwipeRight={handleSwipeRight}
            onInfo={() => navigation.navigate('PetDetail', { petId: currentPet.id })}
            onSuperLike={handleSuperLike}
            index={currentIndex}
            total={pets.length}
          />
        )}
      </View>

      {/* Tinder-style Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.passButton]} 
          onPress={handleSwipeLeft}
          activeOpacity={0.7}
        >
          <Text style={styles.actionButtonText}>✕</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.superLikeButton]} 
          onPress={handleSuperLike}
          activeOpacity={0.7}
        >
          <Text style={styles.superLikeIcon}>⭐</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.likeButton]} 
          onPress={handleSwipeRight}
          activeOpacity={0.7}
        >
          <Text style={styles.likeIcon}>❤️</Text>
        </TouchableOpacity>
      </View>
      
      {/* Card Counter (Tinder-style) */}
      <Text style={styles.cardCounter}>
        {currentIndex + 1} / {pets.length}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundGradientStart,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  flagContainer: {
    marginBottom: 10,
  },
  flag: {
    fontSize: 40,
  },
  title: {
    fontFamily: FONTS.hero,
    fontSize: 28,
    color: '#fff',
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: FONTS.medium,
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  filtersContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 12,
  },
  filtersContent: {
    paddingHorizontal: 16,
  },
  cardsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    paddingHorizontal: 20,
  },
  card: {
    position: 'absolute',
    width: SCREEN_WIDTH * 0.92,
    height: '80%',
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
  cardBehind: {
    transform: [{ scale: 0.96 }],
    opacity: 0.6,
    zIndex: 1,
    marginTop: 10, // Slight offset for stacking effect
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 20,
  },
  cardInfo: {
    gap: 8,
  },
  cardName: {
    fontFamily: FONTS.bold,
    fontSize: 28,
    color: '#fff',
  },
  cardBreed: {
    fontFamily: FONTS.medium,
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
  },
  locationBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
  },
  locationText: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: '500',
  },
  cardDescription: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 8,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  healthBadge: {
    backgroundColor: COLORS.success,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 30,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  actionButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 2,
  },
  passButton: {
    borderColor: COLORS.maltaRed,
  },
  superLikeButton: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  likeButton: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  actionButtonText: {
    fontSize: 32,
    color: COLORS.maltaRed,
    fontWeight: '300',
  },
  superLikeIcon: {
    fontSize: 28,
    color: '#fff',
  },
  likeIcon: {
    fontSize: 32,
    color: '#fff',
  },
  cardCounter: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 20,
    fontFamily: FONTS.medium,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundGradientStart,
  },
});
