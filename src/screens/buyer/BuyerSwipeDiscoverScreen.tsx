import React, { useState, useEffect, useRef, useCallback } from 'react';
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
} from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { LinearGradient } from 'expo-linear-gradient';
import { FilterChips } from '../../components/FilterChips';
import { MatchCelebration } from '../../components/MatchCelebration';
import { PALETTE, SHADOW } from '../../theme/palette';
import { colors } from '../../theme/colors';
import { supabase } from '../../services/supabase';
import { Listing, Pet } from '../../types';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const CARD_HEIGHT = Math.min(600, SCREEN_HEIGHT * 0.7);

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
  const [selectedCard, setSelectedCard] = useState<LitterCard | null>(null);
  const [matchVisible, setMatchVisible] = useState(false);
  const [matchedPet, setMatchedPet] = useState<string>('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const swiperRef = useRef<any>(null);

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

  const handleSwipeRight = useCallback(async (index: number) => {
    const card = filteredCards[index];
    if (!card) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from('favorites').insert({
        user_id: user.id,
        listing_id: card.id,
      });

      setFavorites(prev => new Set(prev).add(card.id));
      setMatchedPet(card.pet?.name || 'Pet');
      setMatchVisible(true);
    } catch (error: any) {
      console.error('Error saving favorite:', error);
    }
  }, [filteredCards]);

  const handleSwipeTop = useCallback(async (index: number) => {
    await handleSwipeRight(index);
  }, [handleSwipeRight]);

  const handleSwipeLeft = useCallback((index: number) => {
    console.log('Passed on:', filteredCards[index]?.pet?.name);
  }, [filteredCards]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={PALETTE.primary} />
        <Text style={styles.loadingText}>Loading pets...</Text>
      </View>
    );
  }

  if (filteredCards.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>No pets found</Text>
        <Text style={styles.emptySubtext}>Try adjusting your filters</Text>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={loadCards}
        >
          <Text style={styles.refreshButtonText}>Refresh</Text>
        </TouchableOpacity>
      </View>
    );
  }

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

      {/* Swipe Deck */}
      <View style={styles.deckContainer}>
        <Swiper
          ref={swiperRef}
          cards={filteredCards}
          renderCard={(card: LitterCard | undefined) => {
            if (!card || !card.pet) {
              return <View style={styles.card} />;
            }

            return (
              <TouchableOpacity
                style={[styles.card, SHADOW.card]}
                onPress={() => setSelectedCard(card)}
                activeOpacity={0.9}
              >
                <Image
                  source={{
                    uri: card.pet.photos?.[0] || card.photos?.[0] || 'https://via.placeholder.com/400x600'
                  }}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.75)']}
                  style={styles.cardGradient}
                />
                <View style={styles.cardContent}>
                  <Text style={styles.cardName}>{card.pet.name}</Text>
                  <Text style={styles.cardBreed}>{card.pet.breed}</Text>
                  {card.pet.status === 'available' && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>Available</Text>
                    </View>
                  )}
                  {card.type === 'litter_announcement' && (
                    <Text style={styles.cardInfo}>
                      {card.pups_available || 'Several'} puppies available
                    </Text>
                  )}
                  {card.price && card.price > 0 && (
                    <Text style={styles.cardPrice}>€{card.price}</Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          }}
          onSwipedLeft={handleSwipeLeft}
          onSwipedRight={handleSwipeRight}
          onSwipedTop={handleSwipeTop}
          onTapCard={(index: number) => {
            setSelectedCard(filteredCards[index]);
          }}
          cardIndex={0}
          backgroundColor="transparent"
          stackSize={3}
          stackScale={0.92}
          stackSeparation={16}
          disableTopSwipe={false}
          animateCardOpacity
          overlayLabels={{
            left: {
              title: 'NOPE',
              style: {
                label: {
                  backgroundColor: '#FE3C72',
                  borderColor: '#FE3C72',
                  color: '#fff',
                  borderWidth: 2,
                  borderRadius: 10,
                  padding: 12,
                  fontSize: 24,
                  fontWeight: 'bold',
                },
                wrapper: {
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  justifyContent: 'flex-start',
                  marginTop: 30,
                  marginLeft: -30,
                },
              },
            },
            right: {
              title: 'LIKE',
              style: {
                label: {
                  backgroundColor: '#4FC978',
                  borderColor: '#4FC978',
                  color: '#fff',
                  borderWidth: 2,
                  borderRadius: 10,
                  padding: 12,
                  fontSize: 24,
                  fontWeight: 'bold',
                },
                wrapper: {
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                  marginTop: 30,
                  marginLeft: 30,
                },
              },
            },
            top: {
              title: 'SAVE',
              style: {
                label: {
                  backgroundColor: '#E11D48',
                  borderColor: '#E11D48',
                  color: '#fff',
                  borderWidth: 2,
                  borderRadius: 10,
                  padding: 12,
                  fontSize: 24,
                  fontWeight: 'bold',
                },
                wrapper: {
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  marginTop: 20,
                },
              },
            },
          }}
        />

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.passButton]}
            onPress={() => swiperRef.current?.swipeLeft()}
          >
            <Text style={styles.actionButtonText}>✕</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.saveButton]}
            onPress={() => swiperRef.current?.swipeTop()}
          >
            <Text style={styles.actionButtonText}>★</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.likeButton]}
            onPress={() => swiperRef.current?.swipeRight()}
          >
            <Text style={styles.actionButtonText}>♥</Text>
          </TouchableOpacity>
        </View>

        {/* Card Counter */}
        {filteredCards.length > 0 && (
          <View style={styles.counter}>
            <Text style={styles.counterText}>
              {filteredCards.length} {filteredCards.length === 1 ? 'pet' : 'pets'} available
            </Text>
          </View>
        )}
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
  deckContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: SCREEN_WIDTH * 0.9,
    height: CARD_HEIGHT,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#fff',
    position: 'relative',
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
