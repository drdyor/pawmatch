// Buyer Swipe Discover Screen - PROPER Tinder-style with react-native-deck-swiper
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
  { id: 'breeders', label: 'Breeders' },
  { id: 'shelters', label: 'Shelters' },
  { id: 'verified', label: 'Verified' },
  { id: 'puppies', label: 'Puppies' },
];

export default function BuyerSwipeDiscoverScreen({ navigation }: any) {
  const [cards, setCards] = useState<LitterCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedCard, setSelectedCard] = useState<LitterCard | null>(null);
  const [matchVisible, setMatchVisible] = useState(false);
  const [matchedPet, setMatchedPet] = useState<string>('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [recentMatches, setRecentMatches] = useState<LitterCard[]>([]);
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
      case 'verified':
        filtered = filtered.filter(c => c.pet?.verified === true);
        break;
    }
    
    return filtered;
  }, [cards, activeFilter]);

  const handleSwipeRight = useCallback(async (index: number) => {
    const card = filteredCards[index];
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
      setRecentMatches(prev => [card, ...prev.filter(c => c.id !== card.id)].slice(0, 12));
      setMatchedPet(card.pet?.name || 'Pet');
      setMatchVisible(true);
    } catch (error: any) {
      console.error('Error saving favorite:', error);
    }
  }, [filteredCards]);

  const handleSwipeTop = useCallback(async (index: number) => {
    // Top swipe = Super Like = Save
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
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>PawMatch</Text>
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

      {/* Swipe Deck Container */}
      <View style={styles.deckContainer}>
        <Swiper
          ref={swiperRef}
          cards={filteredCards}
          renderCard={(card: LitterCard | undefined) => {
            if (!card || !card.pet) {
              return (
                <View style={styles.emptyCard}>
                  <Text style={styles.emptyCardText}>No more cards</Text>
                </View>
              );
            }

            return (
              <View style={[styles.card, SHADOW.card]}>
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
                  
                  {/* Health badges */}
                  <View style={styles.badgeRow}>
                    {card.pet.verified && (
                      <View style={styles.healthBadge}>
                        <Text style={styles.healthBadgeText}>✓ Verified</Text>
                      </View>
                    )}
                    {card.type === 'litter_announcement' && (
                      <View style={[styles.healthBadge, styles.healthBadgePending]}>
                        <Text style={styles.healthBadgeText}>⭐ Litter</Text>
                      </View>
                    )}
                  </View>

                  {/* Reputation score */}
                  {card.pet.reputation && (
                    <View style={styles.reputationScore}>
                      <Text style={styles.reputationText}>
                        🏆 {card.pet.reputation} pts
                      </Text>
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
              </View>
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
          animateOverlayLabelsOpacity
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
            style={[styles.actionButton, styles.superButton]}
            onPress={() => swiperRef.current?.swipeTop()}
          >
            <Text style={styles.actionButtonText}>⭐</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.likeButton]}
            onPress={() => swiperRef.current?.swipeRight()}
          >
            <Text style={styles.actionButtonText}>♥</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Matches */}
      {recentMatches.length > 0 && (
        <View style={styles.recentMatchesContainer}>
          <Text style={styles.recentMatchesTitle}>Recent Matches</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recentMatchesRow}>
            {recentMatches.map((match) => (
              <TouchableOpacity
                key={match.id}
                style={styles.recentMatchItem}
                onPress={() => setSelectedCard(match)}
              >
                <View style={styles.recentMatchAvatar}>
                  <Image
                    source={{
                      uri: match.pet?.photos?.[0] || 'https://via.placeholder.com/64'
                    }}
                    style={styles.recentMatchImage}
                  />
                </View>
                <Text style={styles.recentMatchName}>{match.pet?.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

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
    paddingBottom: 12,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '800',
    fontFamily: 'System',
    marginBottom: 4,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
  },
  filterContainer: {
    marginBottom: 12,
  },
  deckContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCard: {
    width: SCREEN_WIDTH * 0.9,
    height: CARD_HEIGHT,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCardText: {
    fontSize: 18,
    color: '#666',
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
    height: 200,
  },
  cardContent: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 20,
  },
  cardName: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  cardBreed: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 12,
    opacity: 0.9,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  healthBadge: {
    backgroundColor: '#27AE60',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  healthBadgePending: {
    backgroundColor: '#F39C12',
  },
  healthBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  reputationScore: {
    backgroundColor: 'rgba(255, 215, 0, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  reputationText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  cardInfo: {
    color: '#fff',
    fontSize: 14,
    marginTop: 4,
    opacity: 0.9,
  },
  cardPrice: {
    color: '#FFE66D',
    fontSize: 22,
    fontWeight: '800',
    marginTop: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
    paddingVertical: 20,
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
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
        elevation: 8,
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
  superButton: {
    backgroundColor: '#4ECDC4',
  },
  likeButton: {
    backgroundColor: '#FF6B6B',
  },
  recentMatchesContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  recentMatchesTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  recentMatchesRow: {
    gap: 12,
    paddingRight: 16,
  },
  recentMatchItem: {
    alignItems: 'center',
  },
  recentMatchAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
    marginBottom: 4,
  },
  recentMatchImage: {
    width: '100%',
    height: '100%',
  },
  recentMatchName: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
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
