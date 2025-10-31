// screens/buyer/BuyerSwipeDiscoverScreen.tsx - Web App Design
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
import { Listing, Pet } from '../../types';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

type LitterCard = Listing & { pet: Pet };

type FilterType = 'all' | 'dogs' | 'cats' | 'breeders' | 'adoption' | 'verified' | 'puppies' | 'pharaoh' | 'maltese' | 'local';

const FILTERS: { id: FilterType; label: string }[] = [
  { id: 'all', label: 'All Pets' },
  { id: 'dogs', label: 'Dogs' },
  { id: 'cats', label: 'Cats' },
  { id: 'breeders', label: 'Breeding' },
  { id: 'adoption', label: 'Adoption' },
  { id: 'verified', label: 'Verified' },
  { id: 'puppies', label: 'Puppies' },
  { id: 'pharaoh', label: 'Pharaoh Hounds' },
  { id: 'maltese', label: 'Maltese Dogs' },
  { id: 'local', label: 'Local Breeders' },
];

export default function BuyerSwipeDiscoverScreen({ navigation }: any) {
  const [cards, setCards] = useState<LitterCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [recentMatches] = useState([
    { id: '1', name: 'Luna', emoji: '🐕' },
    { id: '2', name: 'Whiskers', emoji: '🐱' },
    { id: '3', name: 'Max', emoji: '🦮' },
    { id: '4', name: 'Rocky', emoji: '🐶' },
  ]);

  const position = useRef(new Animated.ValueXY()).current;
  const rotation = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ['-15deg', '0deg', '15deg'],
    extrapolate: 'clamp',
  });

  const likeOpacity = position.x.interpolate({
    inputRange: [0, SCREEN_WIDTH / 4],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const nopeOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 4, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    loadCards();
  }, [activeFilter]);

  const loadCards = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      let userPrefs: any = null;
      if (user) {
        const { data } = await supabase
          .from('users')
          .select('preferred_species, preferred_dog_size, preferred_age')
          .eq('id', user.id)
          .single();
        userPrefs = data;
      }

      let query = supabase
        .from('listings')
        .select(`*, pet:pets(*)`)
        .eq('status', 'live')
        .in('type', ['litter_announcement', 'adoption'])
        .order('created_at', { ascending: false })
        .limit(50);

      // Apply filters
      if (activeFilter === 'dogs') {
        query = query.contains('pet', { species: 'dog' });
      } else if (activeFilter === 'cats') {
        query = query.contains('pet', { species: 'cat' });
      }

      const { data, error } = await query;

      if (error) throw error;

      let filtered = data || [];
      if (userPrefs?.preferred_species && userPrefs.preferred_species !== 'both') {
        filtered = filtered.filter((l: any) => l.pet?.species === userPrefs.preferred_species);
      }

      setCards(filtered as LitterCard[]);
    } catch (error) {
      console.error('Error loading cards:', error);
    } finally {
      setLoading(false);
    }
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      position.setValue({ x: gesture.dx, y: gesture.dy });
    },
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dx > SWIPE_THRESHOLD) {
        forceSwipe('right');
      } else if (gesture.dx < -SWIPE_THRESHOLD) {
        forceSwipe('left');
      } else {
        resetPosition();
      }
    },
  });

  const forceSwipe = (direction: 'left' | 'right') => {
    const x = direction === 'right' ? SCREEN_WIDTH + 100 : -SCREEN_WIDTH - 100;
    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: 250,
      useNativeDriver: false,
    }).start(() => {
      if (direction === 'right') {
        handleLike();
      } else {
        handlePass();
      }
      position.setValue({ x: 0, y: 0 });
      setCurrentIndex(prev => prev + 1);
    });
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
    }).start();
  };

  const handleLike = async () => {
    const card = cards[currentIndex];
    if (!card) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('favorites').insert({
        user_id: user.id,
        listing_id: card.id,
      });
    }

    Alert.alert('❤️ It\'s a Match!', `You and ${card.pet?.name || card.pet?.breed || 'this pet'} are perfect together!`);
  };

  const handlePass = () => {
    // Just move to next
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading pets...</Text>
      </View>
    );
  }

  if (currentIndex >= cards.length) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>✨</Text>
        <Text style={styles.emptyTitle}>No more nearby pets</Text>
        <Text style={styles.emptyText}>
          Widen your filters or follow more breeders to get alerts
        </Text>
      </View>
    );
  }

  const currentCard = cards[currentIndex];
  const nextCard = cards[currentIndex + 1];
  const showBreedingIndicator = currentCard.type === 'litter_announcement' || currentCard.pupsAvailable;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Gradient Background */}
      <View style={styles.gradientBackground} />

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Malta Flag Header */}
        <View style={styles.header}>
          <View style={styles.flagContainer}>
            <View style={styles.maltaFlag}>
              <Text style={styles.flag}>🇲🇹</Text>
            </View>
            <Text style={styles.title}>PawMatch Malta</Text>
          </View>
          <Text style={styles.subtitle}>Find your perfect furry companion in Malta</Text>
        </View>

        {/* Enhanced Filter Chips */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
          contentContainerStyle={styles.filterContent}
        >
          {FILTERS.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterChip,
                activeFilter === filter.id && styles.filterChipActive,
              ]}
              onPress={() => setActiveFilter(filter.id)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  activeFilter === filter.id && styles.filterChipTextActive,
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Swipe Cards Container */}
        <View style={styles.cardStackContainer}>
          {nextCard && (
            <View style={[styles.cardPreview]}>
              <View style={styles.cardImageContainer}>
                {nextCard.pet.photos?.[0] ? (
                  <Image
                    source={{ uri: nextCard.pet.photos[0] }}
                    style={styles.cardImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.placeholderImage}>
                    <Text style={styles.placeholderEmoji}>🐾</Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Current card */}
          <Animated.View
            style={[
              styles.card,
              {
                transform: [
                  { translateX: position.x },
                  { translateY: position.y },
                  { rotate: rotation },
                ],
              },
            ]}
            {...panResponder.panHandlers}
          >
            {/* LIKE overlay */}
            <Animated.View style={[styles.overlay, styles.likeOverlay, { opacity: likeOpacity }]}>
              <Text style={styles.overlayText}>LIKE</Text>
            </Animated.View>

            {/* NOPE overlay */}
            <Animated.View style={[styles.overlay, styles.nopeOverlay, { opacity: nopeOpacity }]}>
              <Text style={styles.overlayText}>NOPE</Text>
            </Animated.View>

            {/* Card Image */}
            <View style={styles.cardImageContainer}>
              {currentCard.pet.photos?.[0] ? (
                <Image
                  source={{ uri: currentCard.pet.photos[0] }}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.placeholderImage}>
                  <Text style={styles.placeholderEmoji}>
                    {currentCard.pet.species === 'dog' ? '🐕' : '🐈'}
                  </Text>
                </View>
              )}

              {/* Location Badge */}
              <View style={styles.locationBadge}>
                <Text style={styles.locationBadgeText}>
                  📍 {currentCard.city || 'Malta'}, {currentCard.country || 'MT'}
                </Text>
              </View>

              {/* Breeding Indicator */}
              {showBreedingIndicator && (
                <View style={styles.breedingIndicator}>
                  <Text style={styles.breedingIndicatorText}>
                    🐕 Breeding
                  </Text>
                </View>
              )}
            </View>

            {/* Card Info */}
            <View style={styles.cardInfo}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardBreed}>{currentCard.pet.breed || 'Pet'}</Text>
                {currentCard.pupsAvailable && (
                  <View style={styles.reputationBadge}>
                    <Text style={styles.reputationText}>
                      ⭐ {currentCard.pupsAvailable} available
                    </Text>
                  </View>
                )}
              </View>
              
              <View style={styles.badges}>
                <View style={styles.healthBadge}>
                  <Text style={styles.healthBadgeText}>✅ Vet-Verified</Text>
                </View>
                {currentCard.deposit && (
                  <View style={styles.pill}>
                    <Text style={styles.pillText}>
                      Deposit €{(currentCard.deposit / 100).toFixed(0)}
                    </Text>
                  </View>
                )}
              </View>

              <Text style={styles.cardPrice}>
                €{(currentCard.price / 100).toFixed(0)}
              </Text>
              {currentCard.availableDate && (
                <Text style={styles.cardDate}>
                  Ready: {new Date(currentCard.availableDate).toLocaleDateString()}
                </Text>
              )}
            </View>
          </Animated.View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.passButton]}
            onPress={() => forceSwipe('left')}
          >
            <Text style={styles.actionIcon}>✕</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.superButton]}
            onPress={() => forceSwipe('right')}
          >
            <Text style={styles.actionIcon}>⭐</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.likeButton]}
            onPress={() => forceSwipe('right')}
          >
            <Text style={styles.actionIcon}>♥</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Matches */}
        <View style={styles.recentMatchesSection}>
          <Text style={styles.sectionTitle}>Recent Matches</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.matchesContainer}
          >
            {recentMatches.map((match) => (
              <View key={match.id} style={styles.matchItem}>
                <View style={styles.matchAvatar}>
                  <Text style={styles.matchEmoji}>{match.emoji}</Text>
                </View>
                <Text style={styles.matchName}>{match.name}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Malta Pet Statistics */}
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>Malta Pet Community</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>96K+</Text>
              <Text style={styles.statLabel}>Registered Dogs</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>85K+</Text>
              <Text style={styles.statLabel}>Pet Owners</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>50+</Text>
              <Text style={styles.statLabel}>Vet Clinics</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: COLORS.backgroundGradientStart,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.backgroundGradientStart,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#fff',
  },
  header: {
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  flagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  maltaFlag: {
    width: 32,
    height: 24,
    borderRadius: 4,
    backgroundColor: COLORS.maltaBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flag: {
    fontSize: 16,
  },
  title: {
    fontFamily: FONTS.hero,
    fontSize: 36,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: FONTS.medium,
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginTop: 4,
  },
  filterContainer: {
    marginBottom: 20,
  },
  filterContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  filterChipActive: {
    backgroundColor: '#fff',
    borderColor: '#fff',
  },
  filterChipText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: COLORS.text,
  },
  cardStackContainer: {
    height: 500,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  cardPreview: {
    position: 'absolute',
    width: SCREEN_WIDTH - 40,
    height: 450,
    backgroundColor: '#fff',
    borderRadius: 20,
    opacity: 0.5,
    transform: [{ scale: 0.95 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    overflow: 'hidden',
  },
  card: {
    position: 'absolute',
    width: SCREEN_WIDTH - 40,
    height: 450,
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  overlay: {
    position: 'absolute',
    top: 50,
    zIndex: 10,
    padding: 16,
    borderRadius: 12,
    borderWidth: 4,
  },
  likeOverlay: {
    right: 30,
    borderColor: COLORS.success,
    transform: [{ rotate: '20deg' }],
  },
  nopeOverlay: {
    left: 30,
    borderColor: COLORS.danger,
    transform: [{ rotate: '-20deg' }],
  },
  overlayText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
  },
  cardImageContainer: {
    height: '65%',
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
  locationBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  locationBadgeText: {
    fontSize: 11,
    fontWeight: '500',
    color: COLORS.text,
  },
  breedingIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 15,
  },
  breedingIndicatorText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
  },
  cardInfo: {
    flex: 1,
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardBreed: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
  },
  reputationBadge: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  reputationText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.text,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  healthBadge: {
    backgroundColor: COLORS.success,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  healthBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#fff',
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
  },
  pillText: {
    fontSize: 12,
    color: '#555',
    fontWeight: '500',
  },
  cardPrice: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  cardDate: {
    fontSize: 14,
    color: '#6B7280',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  passButton: {
    backgroundColor: '#6C7B7F',
  },
  superButton: {
    backgroundColor: COLORS.secondary,
  },
  likeButton: {
    backgroundColor: COLORS.primary,
  },
  actionIcon: {
    fontSize: 24,
    color: '#fff',
  },
  recentMatchesSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  matchesContainer: {
    gap: 12,
  },
  matchItem: {
    alignItems: 'center',
    marginRight: 12,
  },
  matchAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  matchEmoji: {
    fontSize: 32,
  },
  matchName: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  statsContainer: {
    marginHorizontal: 20,
    marginBottom: 32,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: 16,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: COLORS.backgroundGradientStart,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 24,
  },
});
