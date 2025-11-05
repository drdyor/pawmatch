import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { colors } from '../../theme/colors';
import { supabase } from '../../services/supabase';
import { Listing, Pet } from '../../types';
import { DiscoverySwiper, type LitterCard } from '../../components/DiscoverySwiper';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

export default function BuyerSwipeDiscoverScreen({ navigation }: any) {
  const [cards, setCards] = useState<LitterCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Swiping handled by rn-swiper-list via DiscoverySwiper

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
          .select('preferred_species, preferred_dog_size, preferred_age, preferred_energy_level, preferred_activities, preferred_breeds, preferred_gender')
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
      
      // Species filter
      if (userPrefs?.preferred_species && userPrefs.preferred_species !== 'both') {
        filtered = filtered.filter((l: any) => l.pet?.species === userPrefs.preferred_species);
      }

      // Breed filter (multi-select)
      if (userPrefs?.preferred_breeds && Array.isArray(userPrefs.preferred_breeds) && userPrefs.preferred_breeds.length > 0) {
        filtered = filtered.filter((l: any) => 
          userPrefs.preferred_breeds.some((breed: string) => 
            l.pet?.breed?.toLowerCase().includes(breed.toLowerCase())
          )
        );
      }

      // Gender filter
      if (userPrefs?.preferred_gender && userPrefs.preferred_gender !== 'both') {
        filtered = filtered.filter((l: any) => l.pet?.sex === userPrefs.preferred_gender);
      }

      // Size filter
      if (userPrefs?.preferred_dog_size && userPrefs.preferred_dog_size !== 'any') {
        filtered = filtered.filter((l: any) => {
          const petSize = l.pet?.size;
          if (!petSize) return false;
          
          if (userPrefs.preferred_dog_size === 'xs_small') {
            return petSize === 'small';
          } else if (userPrefs.preferred_dog_size === 'medium') {
            return petSize === 'medium';
          } else if (userPrefs.preferred_dog_size === 'large_xl') {
            return petSize === 'large';
          }
          return true;
        });
      }

      // Age filter
      if (userPrefs?.preferred_age && Array.isArray(userPrefs.preferred_age) && userPrefs.preferred_age.length > 0) {
        filtered = filtered.filter((l: any) => {
          if (!l.pet?.date_of_birth) return false;
          const age = calculateAge(l.pet.date_of_birth);
          
          return userPrefs.preferred_age.some((agePref: string) => {
            if (agePref === 'puppy') return age < 2;
            if (agePref === 'young') return age >= 2 && age <= 6;
            if (agePref === 'senior') return age > 7;
            return true;
          });
        });
      }

      // Energy level and activities filtering would require pet metadata
      // For now, we'll skip these if pets don't have activity/energy fields

      setCards(filtered as LitterCard[]);
    } catch (error) {
      console.error('Error loading cards:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (dateOfBirth: string): number => {
    if (!dateOfBirth) return 0;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    const months = Math.floor((today.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
    return months / 12; // return age in years
  };

  const forceSwipe = (direction: 'left' | 'right') => {
    // no-op: retained for bottom controls; DiscoverySwiper calls handlers directly
    if (direction === 'right') handleLike(); else handlePass();
    setCurrentIndex(prev => prev + 1);
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

    Alert.alert('Saved!', "You'll get updates about this litter.");
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

  // Handle empty cards
  if (!cards || cards.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logoIcon}>
              <Text style={styles.logoHeart}>❤️</Text>
              <Text style={styles.logoPaw}>🐾</Text>
            </View>
            <Text style={styles.logoText}>PawMatch</Text>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity
              style={styles.headerIconButton}
              onPress={() => navigation.navigate('BuyerPreferences')}
            >
              <Text style={styles.headerIcon}>⚙️</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerIconButton}
              onPress={() => navigation.navigate('BuyerHome')}
            >
              <Text style={styles.headerIcon}>⊞</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>✨</Text>
          <Text style={styles.emptyTitle}>No pets available</Text>
          <Text style={styles.emptyText}>
            Widen your filters or check back later for new listings
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
      </View>
    );
  }

  if (currentIndex >= cards.length) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logoIcon}>
              <Text style={styles.logoHeart}>❤️</Text>
              <Text style={styles.logoPaw}>🐾</Text>
            </View>
            <Text style={styles.logoText}>PawMatch</Text>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity
              style={styles.headerIconButton}
              onPress={() => navigation.navigate('BuyerPreferences')}
            >
              <Text style={styles.headerIcon}>⚙️</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerIconButton}
              onPress={() => navigation.navigate('BuyerHome')}
            >
              <Text style={styles.headerIcon}>⊞</Text>
            </TouchableOpacity>
          </View>
        </View>
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
      </View>
    );
  }

  const currentCard = cards[currentIndex];

  return (
    <View style={styles.container}>
      {/* Header with PawMatch Logo */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logoIcon}>
            <Text style={styles.logoHeart}>❤️</Text>
            <Text style={styles.logoPaw}>🐾</Text>
          </View>
          <Text style={styles.logoText}>PawMatch</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity
            style={styles.headerIconButton}
            onPress={() => navigation.navigate('BuyerPreferences')}
          >
            <Text style={styles.headerIcon}>⚙️</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerIconButton}
            onPress={() => navigation.navigate('BuyerHome')}
          >
            <Text style={styles.headerIcon}>⊞</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Card Stack via rn-swiper-list */}
      <View style={styles.cardContainer}>
        <DiscoverySwiper
          cards={cards}
          onLike={(c) => { handleLike(); setCurrentIndex(i => Math.min(i + 1, cards.length)); }}
          onPass={() => { handlePass(); setCurrentIndex(i => Math.min(i + 1, cards.length)); }}
          onDetail={(c) => navigation.navigate('PetDetail', { petId: c.pet.id, listingId: c.id })}
        />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: colors.background,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF4444',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  logoHeart: {
    fontSize: 20,
    position: 'absolute',
  },
  logoPaw: {
    fontSize: 14,
    position: 'absolute',
    top: 4,
    left: 4,
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  headerIconButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIcon: {
    fontSize: 20,
    color: colors.text,
  },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
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
