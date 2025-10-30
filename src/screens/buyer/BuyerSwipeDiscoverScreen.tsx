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
} from 'react-native';
import { colors } from '../../theme/colors';
import { supabase } from '../../services/supabase';
import { Listing, Pet } from '../../types';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

type LitterCard = Listing & { pet: Pet };

export default function BuyerSwipeDiscoverScreen({ navigation }: any) {
  const [cards, setCards] = useState<LitterCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

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
    setupRealtimeSubscription();
  }, []);

  const setupRealtimeSubscription = () => {
    // Subscribe to new listings
    const channel = supabase
      .channel('new_listings')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'listings',
          filter: 'status=eq.live',
        },
        () => {
          loadCards(); // Refresh deck
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const loadCards = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Get user preferences
      let userPrefs: any = null;
      if (user) {
        const { data } = await supabase
          .from('users')
          .select('preferred_species, preferred_dog_size, preferred_age')
          .eq('id', user.id)
          .single();
        userPrefs = data;
      }

      // Fetch live listings
      const { data, error } = await supabase
        .from('listings')
        .select(`*, pet:pets(*)`)
        .eq('status', 'live')
        .in('type', ['litter_announcement', 'adoption'])
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      // Filter by preferences
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

    setFavorites(prev => new Set(prev).add(card.id));
    
    // Save to database
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('favorites').insert({
        user_id: user.id,
        listing_id: card.id,
      });
    }

    Alert.alert('❤️ Saved!', 'You'll get updates about this litter.');
  };

  const handlePass = () => {
    // Just move to next
  };

  const handleDetail = () => {
    const card = cards[currentIndex];
    if (card) {
      navigation.navigate('PetDetail', {
        petId: card.pet.id,
        listingId: card.id,
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading litters...</Text>
      </View>
    );
  }

  if (currentIndex >= cards.length) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>✨</Text>
        <Text style={styles.emptyTitle}>No more nearby litters</Text>
        <Text style={styles.emptyText}>
          Widen your filters or follow more breeders to get alerts
        </Text>
        <View style={styles.emptyActions}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => navigation.navigate('BuyerPreferences')}
          >
            <Text style={styles.filterButtonText}>Adjust Filters</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={() => {
              setCurrentIndex(0);
              loadCards();
            }}
          >
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const currentCard = cards[currentIndex];
  const nextCard = cards[currentIndex + 1];

  return (
    <View style={styles.container}>
      {/* Filter Bar */}
      <TouchableOpacity
        style={styles.filterBar}
        onPress={() => navigation.navigate('BuyerPreferences')}
      >
        <Text style={styles.filterBarText}>🔎 Breeds · € · Preferences</Text>
      </TouchableOpacity>

      {/* Card Stack */}
      <View style={styles.cardContainer}>
        {/* Next card preview */}
        {nextCard && (
          <View style={[styles.cardPreview, { opacity: 0.5, transform: [{ scale: 0.95 }] }]}>
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
              transform: [{ translateX: position.x }, { translateY: position.y }, { rotate: rotation }],
            },
          ]}
          {...panResponder.panHandlers}
        >
          {/* SAVE overlay */}
          <Animated.View style={[styles.overlay, styles.saveOverlay, { opacity: likeOpacity }]}>
            <Text style={styles.overlayText}>SAVE</Text>
          </Animated.View>

          {/* PASS overlay */}
          <Animated.View style={[styles.overlay, styles.passOverlay, { opacity: nopeOpacity }]}>
            <Text style={styles.overlayText}>PASS</Text>
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
          </View>

          {/* Card Info */}
          <View style={styles.cardInfo}>
            <Text style={styles.cardBreed}>{currentCard.pet.breed}</Text>
            <Text style={styles.cardLocation}>
              {currentCard.city}, {currentCard.country}
            </Text>
            <Text style={styles.cardPrice}>
              €{(currentCard.price / 100).toFixed(0)}
              {currentCard.pupsAvailable && ` · ${currentCard.pupsAvailable} available`}
            </Text>
            {currentCard.availableDate && (
              <Text style={styles.cardDate}>
                Ready: {new Date(currentCard.availableDate).toLocaleDateString()}
              </Text>
            )}
            <View style={styles.badges}>
              {currentCard.deposit && (
                <Pill text={`Deposit €${(currentCard.deposit / 100).toFixed(0)}`} />
              )}
              <Pill text="Health checked" />
            </View>
          </View>
        </Animated.View>
      </View>

      {/* Bottom Actions */}
      <View style={styles.actions}>
        <CircleButton
          icon="✖️"
          color={colors.danger}
          onPress={() => forceSwipe('left')}
        />
        <CircleButton
          icon="ℹ️"
          color={colors.secondary}
          onPress={handleDetail}
          size="large"
        />
        <CircleButton
          icon="❤️"
          color={colors.success}
          onPress={() => forceSwipe('right')}
        />
      </View>

      {/* Counter */}
      <View style={styles.counter}>
        <Text style={styles.counterText}>
          {currentIndex + 1} / {cards.length}
        </Text>
      </View>
    </View>
  );
}

function Pill({ text }: { text: string }) {
  return (
    <View style={styles.pill}>
      <Text style={styles.pillText}>{text}</Text>
    </View>
  );
}

function CircleButton({
  icon,
  color,
  onPress,
  size = 'normal',
}: {
  icon: string;
  color: string;
  onPress: () => void;
  size?: 'normal' | 'large';
}) {
  const buttonSize = size === 'large' ? 72 : 64;
  
  return (
    <TouchableOpacity
      style={[
        styles.circleButton,
        { backgroundColor: color, width: buttonSize, height: buttonSize, borderRadius: buttonSize / 2 },
      ]}
      onPress={onPress}
    >
      <Text style={[styles.circleIcon, size === 'large' && { fontSize: 32 }]}>{icon}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF8F0',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  filterBar: {
    position: 'absolute',
    top: 60,
    alignSelf: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 10,
  },
  filterBarText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2F3A4A',
  },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
  cardPreview: {
    position: 'absolute',
    width: SCREEN_WIDTH - 40,
    height: '75%',
    backgroundColor: colors.background,
    borderRadius: 24,
  },
  card: {
    position: 'absolute',
    width: SCREEN_WIDTH - 40,
    height: '75%',
    backgroundColor: colors.background,
    borderRadius: 24,
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
    fontSize: 32,
    fontWeight: '800',
    color: colors.background,
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
  badges: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
  },
  pillText: {
    fontSize: 12,
    color: '#555',
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    paddingBottom: 40,
  },
  circleButton: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  circleIcon: {
    fontSize: 28,
  },
  counter: {
    position: 'absolute',
    top: 120,
    alignSelf: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  counterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2F3A4A',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: '#FFF8F0',
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2F3A4A',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  emptyActions: {
    flexDirection: 'row',
    gap: 12,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  filterButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  refreshButton: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  refreshButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2F3A4A',
  },
});
