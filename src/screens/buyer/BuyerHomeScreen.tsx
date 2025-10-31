import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { colors } from '../../theme/colors';
import { supabase } from '../../services/supabase';
import { Pet, Listing } from '../../types';
import PetCard from '../../components/PetCard';
import BannerAd from '../../components/BannerAd';
import { AD_PLACEMENTS } from '../../services/admob';

export default function BuyerHomeScreen({ navigation }: any) {
  const [listings, setListings] = useState<(Listing & { pet: Pet })[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [userPreferences, setUserPreferences] = useState<any>(null);

  useEffect(() => {
    loadUserPreferences();
    loadListings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadUserPreferences = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('users')
        .select('preferred_species, preferred_dog_size, preferred_age')
        .eq('id', user.id)
        .single();

      setUserPreferences(data);
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const loadListings = async () => {
    try {
      // Fetch live listings with pet details
      const { data, error } = await supabase
        .from('listings')
        .select(`
          *,
          pet:pets(*)
        `)
        .eq('status', 'live')
        .in('type', ['adoption', 'litter_announcement'])
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Filter based on user preferences if set
      let filteredData = data || [];
      
      if (userPreferences) {
        filteredData = filteredData.filter((listing: any) => {
          const pet = listing.pet;
          if (!pet) return false;

          // Filter by species
          if (userPreferences.preferred_species && userPreferences.preferred_species !== 'both') {
            if (pet.species !== userPreferences.preferred_species) return false;
          }

          // Filter by dog size (if dog)
          if (pet.species === 'dog' && userPreferences.preferred_dog_size && userPreferences.preferred_dog_size !== 'any') {
            if (pet.size !== userPreferences.preferred_dog_size) return false;
          }

          // Filter by age
          if (userPreferences.preferred_age && userPreferences.preferred_age !== 'any') {
            const age = calculateAge(pet.date_of_birth);
            if (!matchesAgePreference(age, userPreferences.preferred_age)) return false;
          }

          return true;
        });
      }

      setListings(filteredData as any);
    } catch (error) {
      console.error('Error loading listings:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const calculateAge = (dateOfBirth: string) => {
    if (!dateOfBirth) return 0;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    const months = Math.floor((today.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
    return months / 12; // return age in years
  };

  const matchesAgePreference = (age: number, preference: string) => {
    if (preference === 'young') return age < 2;
    if (preference === 'adult') return age >= 2 && age <= 7;
    if (preference === 'senior') return age > 7;
    return true;
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadUserPreferences();
    loadListings();
  };

  const toggleFavorite = (petId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(petId)) {
        newFavorites.delete(petId);
      } else {
        newFavorites.add(petId);
      }
      return newFavorites;
    });
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading pets...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Discover Pets</Text>
          <Text style={styles.subtitle}>Find your perfect companion in Malta</Text>
        </View>
        <TouchableOpacity
          style={styles.preferencesButton}
          onPress={() => navigation.navigate('BuyerPreferences')}
        >
          <Text style={styles.preferencesIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {!userPreferences?.preferred_species && (
        <TouchableOpacity
          style={styles.preferenceBanner}
          onPress={() => navigation.navigate('BuyerPreferences')}
        >
          <Text style={styles.preferenceBannerText}>
            ✨ Set your preferences to see matching pets
          </Text>
        </TouchableOpacity>
      )}

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        {listings.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🐾</Text>
            <Text style={styles.emptyTitle}>No pets available yet</Text>
            <Text style={styles.emptyText}>
              {userPreferences?.preferred_species
                ? 'Try adjusting your preferences to see more pets'
                : 'Check back soon or set your preferences to get notified'}
            </Text>
          </View>
        ) : (
          <View style={styles.listingsGrid}>
            {listings.map((listing, index) => (
              <React.Fragment key={listing.id}>
                <PetCard
                  pet={listing.pet}
                  onPress={() => navigation.navigate('PetDetail', { petId: listing.pet.id, listingId: listing.id })}
                  onFavorite={() => toggleFavorite(listing.pet.id)}
                  isFavorited={favorites.has(listing.pet.id)}
                />
                {/* Show ad every 3 listings */}
                {(index + 1) % 3 === 0 && (
                  <BannerAd placement={AD_PLACEMENTS.BUYER_DISCOVER_FEED} />
                )}
              </React.Fragment>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.textSecondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  preferencesButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  preferencesIcon: {
    fontSize: 24,
  },
  preferenceBanner: {
    backgroundColor: colors.primary,
    padding: 16,
    marginHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
  },
  preferenceBannerText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  listingsGrid: {
    padding: 20,
    paddingTop: 0,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
