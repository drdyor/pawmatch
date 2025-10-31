// Buyer Swipe Discover Screen - Works in Expo Snack
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
  Platform,
  Modal,
  ScrollView,
  Animated,
  PanResponder,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FilterChips } from '../../components/FilterChips';
import { MatchCelebration } from '../../components/MatchCelebration';
import { PALETTE, SHADOW } from '../../theme/palette';
import { supabase } from '../../services/supabase';
import { Listing, Pet } from '../../types';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const CARD_HEIGHT = Math.min(600, SCREEN_HEIGHT * 0.7);
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

type LitterCard = Listing & { pet: Pet };

const FILTER_CHIPS = [
  { id: 'all', label: 'All Pets' },
  { id: 'dogs', label: 'Dogs' },
  { id: 'cats', label: 'Cats' },
  { id: 'breeders', label: 'Breeding' },
  { id: 'adoption', label: 'Adoption' },
  { id: 'verified', label: 'Verified' },
  { id: 'puppies', label: 'Puppies' },
  { id: 'maltese', label: 'Maltese Dogs' },
  { id: 'local', label: 'Local Breeders' },
];

export default function BuyerSwipeDiscoverScreen({ navigation }: any) {
  const [cards, setCards] = useState<LitterCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCard, setSelectedCard] = useState<LitterCard | null>(null);
  const [matchVisible, setMatchVisible] = useState(false);
  const [matchedPet, setMatchedPet] = useState<string>('');
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
          loadCards();
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
      
      let userPrefs: any = null;
      if (user) {
        const { data } = await supabase
          .from('users')
          .select('preferred_species, preferred_dog_size, preferred_age')
          .eq('id', user.id)
          .single();
        userPrefs = data;
      }

      const { data, error } = await supabase
        .from('listings')
        .select(`*, pet:pets(*)`)
        .eq('status', 'live')
        .in('type', ['litter_announcement', 'adoption'])
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      let filtered = data || [];
      if (userPrefs?.preferred_species && userPrefs.preferred_species !== 'both') {
        filtered = filtered.filter((l: any) => l.pet?.species === userPrefs.preferred_species);
      }

      setCards(filtered as LitterCard[]);
    } catch (error: any) {
      console.error('Error loading cards:', error);
      Alert.alert('Error', 'Failed to load listings');
    } finally {
      setLoading(false);
    }
  };

  const filteredCards = React.useMemo(() => {
    let filtered = cards;
    
    switch (activeFilter) {
      case 'dogs':
        filtered = filtered.filter(c => c.pet?.species === 'dog');
        break;
      case 'cats':
        filtered = filtered.filter(c => c.pet?.species === 'cat');
        break;
      case 'adoption':
        filtered = filtered.filter(c => c.type === 'adoption');
        break;
      case 'breeders':
        filtered = filtered.filter(c => c.type === 'litter_announcement');
        break;
      case 'puppies':
        filtered = filtered.filter(c => {
          if (!c.pet?.date_of_birth) return false;
          const age = new Date().getFullYear() - new Date(c.pet.date_of_birth).getFullYear();
          return age < 1;
        });
        break;
      case 'maltese':
        filtered = filtered.filter(c => 
          c.pet?.breed?.toLowerCase().includes('maltese')
        );
        break;
    }
    
    return filtered;
  }, [cards, activeFilter]);

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
    const card = filteredCards[currentIndex];
    if (!card) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('favorites').insert({
          user_id: user.id,
          listing_id: card.id,
        });
      }

      setFavorites(prev => new Set(prev).add(card.id));
      setMatchedPet(card.pet?.name || 'Pet');
      setMatchVisible(true);
    } catch (error: any) {
      console.error('Error saving favorite:', error);
    }
  };

  const handlePass = () => {
    // Just move to next
    console.log('Passed on:', filteredCards[currentIndex]?.pet?.name);
  };

  const handleSave = async () => {
    await handleLike();
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={PALETTE.primary} />
        <Text style={styles.loadingText}>Loading pets...</Text>
      </View>
    );
  }

  if (filteredCards.length === 0 || currentIndex >= filteredCards.length) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>No more pets found</Text>
        <Text style={styles.emptySubtext}>Try adjusting your filters</Text>
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
    );
  }

  const currentCard = filteredCards[currentIndex];
  const nextCard = filteredCards[currentIndex + 1];

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={styles.container}
    >
      {/* Malta Header */}
      <View style={styles.header}>
        <View style={styles.flag}>
          <Text style={styles.flagText}>🇲🇹</Text>
        </View>
        <Text style={styles.headerTitle}>PawMatch Malta</Text>
        <Text style={styles.headerSubtitle}>Find your perfect furry companion</Text>
      </View>

      {/* Filter Chips */}
      <View style={styles.filterContainer}>
        <FilterChips
          chips={FILTER_CHIPS}
          activeId={activeFilter}
          onChange={setActiveFilter}
        />
      </View>

      {/* Card Stack */}
      <View style={styles.cardContainer}>
        {/* Next card preview */}
        {nextCard && (
          <View style={[styles.cardPreview, { opacity: 0.5, transform: [{ scale: 0.95 }] }]}>
            <Image
              source={{
                uri: nextCard.pet.photos?.[0] || nextCard.photos?.[0] || 'https://via.placeholder.com/400x600'
              }}
              style={styles.cardImage}
              resizeMode="cover"
            />
          </View>
        )}

        {/* Current card */}
        {currentCard && currentCard.pet && (
          <Animated.View
            style={[
              styles.card,
              {
                transform: [{ translateX: position.x }, { translateY: position.y }, { rotate: rotation }],
              },
            ]}
            {...panResponder.panHandlers}
          >
            {/* Like overlay */}
            <Animated.View style={[styles.overlay, styles.likeOverlay, { opacity: likeOpacity }]}>
              <Text style={styles.overlayText}>LIKE</Text>
            </Animated.View>

            {/* Pass overlay */}
            <Animated.View style={[styles.overlay, styles.passOverlay, { opacity: nopeOpacity }]}>
              <Text style={styles.overlayText}>NOPE</Text>
            </Animated.View>

            <TouchableOpacity
              style={styles.cardTouchable}
              onPress={() => setSelectedCard(currentCard)}
              activeOpacity={1}
            >
              <Image
                source={{
                  uri: currentCard.pet.photos?.[0] || currentCard.photos?.[0] || 'https://via.placeholder.com/400x600'
                }}
                style={styles.cardImage}
                resizeMode="cover"
              />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.75)']}
                style={styles.cardGradient}
              />
              <View style={styles.cardContent}>
                <Text style={styles.cardName}>{currentCard.pet.name}</Text>
                <Text style={styles.cardBreed}>{currentCard.pet.breed}</Text>
                {currentCard.pet.status === 'available' && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>Available</Text>
                  </View>
                )}
                {currentCard.type === 'litter_announcement' && (
                  <Text style={styles.cardInfo}>
                    {currentCard.pups_available || 'Several'} puppies available
                  </Text>
                )}
                {currentCard.price && currentCard.price > 0 && (
                  <Text style={styles.cardPrice}>€{currentCard.price}</Text>
                )}
              </View>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.passButton]}
          onPress={() => forceSwipe('left')}
        >
          <Text style={styles.actionButtonText}>✕</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.saveButton]}
          onPress={handleSave}
        >
          <Text style={styles.actionButtonText}>★</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.likeButton]}
          onPress={() => forceSwipe('right')}
        >
          <Text style={styles.actionButtonText}>♥</Text>
        </TouchableOpacity>
      </View>

      {/* Card Counter */}
      <View style={styles.counter}>
        <Text style={styles.counterText}>
          {currentIndex + 1} / {filteredCards.length}
        </Text>
      </View>

      {/* Match Celebration */}
      <MatchCelebration
        visible={matchVisible}
        name={matchedPet}
        onClose={() => setMatchVisible(false)}
      />

      {/* Pet Details Modal */}
      <Modal
        visible={!!selectedCard}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedCard(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setSelectedCard(null)}
            >
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>
            {selectedCard && selectedCard.pet && (
              <ScrollView>
                <Image
                  source={{
                    uri: selectedCard.pet.photos?.[0] || 'https://via.placeholder.com/400'
                  }}
                  style={styles.modalImage}
                />
                <View style={styles.modalDetails}>
                  <Text style={styles.modalName}>{selectedCard.pet.name}</Text>
                  <Text style={styles.modalBreed}>{selectedCard.pet.breed}</Text>
                  <Text style={styles.modalDescription}>
                    {selectedCard.description || 'No description available.'}
                  </Text>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => {
                      navigation.navigate('PetDetail', { listingId: selectedCard.id });
                      setSelectedCard(null);
                    }}
                  >
                    <Text style={styles.modalButtonText}>View Full Details</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF8F0',
  },
  loadingText: {
    marginTop: 12,
    color: PALETTE.textSecondary,
    fontSize: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '700',
    color: PALETTE.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: PALETTE.textSecondary,
  },
  refreshButton: {
    marginTop: 16,
    backgroundColor: PALETTE.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  refreshButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 16,
    alignItems: 'center',
    paddingBottom: 12,
  },
  flag: {
    width: 44,
    height: 30,
    borderRadius: 6,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    overflow: 'hidden',
  },
  flagText: {
    fontSize: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 4,
  },
  headerSubtitle: {
    color: '#ffffffcc',
    fontSize: 14,
  },
  filterContainer: {
    marginBottom: 12,
  },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardPreview: {
    position: 'absolute',
    width: SCREEN_WIDTH * 0.9,
    height: CARD_HEIGHT,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  card: {
    position: 'absolute',
    width: SCREEN_WIDTH * 0.9,
    height: CARD_HEIGHT,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#fff',
    ...SHADOW.card,
  },
  cardTouchable: {
    width: '100%',
    height: '100%',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 160,
  },
  cardContent: {
    position: 'absolute',
    left: 14,
    right: 14,
    bottom: 16,
  },
  cardName: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  cardBreed: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 8,
    opacity: 0.9,
  },
  badge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  cardInfo: {
    color: '#fff',
    fontSize: 14,
    marginTop: 8,
    opacity: 0.9,
  },
  cardPrice: {
    color: '#FFE66D',
    fontSize: 20,
    fontWeight: '800',
    marginTop: 8,
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
    borderColor: '#4FC978',
    backgroundColor: 'rgba(79, 201, 120, 0.9)',
    transform: [{ rotate: '20deg' }],
  },
  passOverlay: {
    left: 30,
    borderColor: '#FE3C72',
    backgroundColor: 'rgba(254, 60, 114, 0.9)',
    transform: [{ rotate: '-20deg' }],
  },
  overlayText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
  },
  actionButtons: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: 40,
  },
  actionButton: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 24,
  },
  passButton: {
    backgroundColor: '#6C7B7F',
  },
  saveButton: {
    backgroundColor: '#E11D48',
  },
  likeButton: {
    backgroundColor: '#4FC978',
  },
  counter: {
    position: 'absolute',
    top: 120,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  counterText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: SCREEN_WIDTH * 0.95,
    height: '85%',
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
  },
  modalClose: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalImage: {
    width: '100%',
    height: '48%',
  },
  modalDetails: {
    padding: 20,
  },
  modalName: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4,
  },
  modalBreed: {
    fontSize: 18,
    color: '#666',
    marginBottom: 16,
  },
  modalDescription: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: PALETTE.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
