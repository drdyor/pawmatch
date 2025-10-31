// New Litters Screen - Shows upcoming litters with breeding pairs
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { COLORS, FONTS } from '../../theme';
import { supabase } from '../../services/supabase';
import NewLitterCard, { Litter } from '../../components/NewLitterCard';
import { Pet } from '../../types';

export default function NewLittersScreen({ navigation }: any) {
  const [litters, setLitters] = useState<Litter[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadLitters();
  }, []);

  const loadLitters = async () => {
    try {
      setLoading(true);
      
      // Fetch litter announcements from listings
      const { data: listings, error } = await supabase
        .from('listings')
        .select('*, pet:pet_id(*)')
        .eq('type', 'litter_announcement')
        .eq('status', 'live')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      // Fetch breeding pair pets for each listing
      const transformedLitters: Litter[] = await Promise.all(
        (listings || []).map(async (listing: any) => {
          // Try to fetch male and female pets from metadata or related tables
          let malePet: Pet | null = null;
          let femalePet: Pet | null = null;

          // Check if listing has metadata with pet IDs
          if (listing.metadata?.male_pet_id && listing.metadata?.female_pet_id) {
            const { data: pets } = await supabase
              .from('pets')
              .select('*')
              .in('id', [listing.metadata.male_pet_id, listing.metadata.female_pet_id]);

            if (pets) {
              malePet = pets.find(p => p.id === listing.metadata.male_pet_id && p.sex === 'male') || null;
              femalePet = pets.find(p => p.id === listing.metadata.female_pet_id && p.sex === 'female') || null;
            }
          }

          // Fallback: Parse from title if metadata not available
          if (!malePet || !femalePet) {
            const titleParts = listing.title?.split(' x ') || [];
            const maleBreed = titleParts[0]?.trim() || 'Unknown';
            const femaleBreed = titleParts[1]?.trim() || 'Unknown';

            if (!malePet) {
              malePet = {
                id: listing.metadata?.male_pet_id || `temp-male-${listing.id}`,
                ownerId: listing.owner_id,
                ownerRole: listing.owner_role || 'breeder_registered',
                name: 'Stud',
                species: listing.pet?.species || 'dog',
                breed: maleBreed,
                sex: 'male',
                dateOfBirth: new Date().toISOString(),
                photos: listing.pet?.photos || [],
                healthRecords: [],
                status: 'stud_available',
                city: listing.city || '',
                country: listing.country || '',
                createdAt: listing.created_at,
              } as Pet;
            }

            if (!femalePet) {
              femalePet = {
                id: listing.metadata?.female_pet_id || `temp-female-${listing.id}`,
                ownerId: listing.owner_id,
                ownerRole: listing.owner_role || 'breeder_registered',
                name: 'Dam',
                species: listing.pet?.species || 'dog',
                breed: femaleBreed,
                sex: 'female',
                dateOfBirth: new Date().toISOString(),
                photos: listing.pet?.photos || [],
                healthRecords: [],
                status: 'in_heat',
                city: listing.city || '',
                country: listing.country || '',
                createdAt: listing.created_at,
              } as Pet;
            }
          }

        return {
          id: listing.id,
          title: listing.title,
          expectedDate: listing.availableDate || new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
          malePet: malePet!,
          femalePet: femalePet!,
          expectedCount: listing.pupsAvailable,
          breed: `${malePet!.breed} × ${femalePet!.breed}`,
          status: listing.status === 'live' ? 'expecting' : 'breeding',
          photos: listing.photos || [],
          description: listing.description,
          createdAt: listing.created_at,
        };
      })
    );

      setLitters(transformedLitters);
    } catch (error: any) {
      console.error('Error loading litters:', error.message);
      // Show mock data for demo
      setLitters(getMockLitters());
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getMockLitters = (): Litter[] => {
    const mockMale: Pet = {
      id: 'mock-male-1',
      ownerId: 'owner-1',
      ownerRole: 'breeder_registered',
      name: 'Max',
      species: 'dog',
      breed: 'German Shepherd',
      sex: 'male',
      dateOfBirth: new Date(2020, 0, 1).toISOString(),
      photos: ['https://images.unsplash.com/photo-1517423447168-cb804aafa6e0?w=400'],
      healthRecords: [],
      status: 'stud_available',
      city: 'Valletta',
      country: 'Malta',
      createdAt: new Date().toISOString(),
    };

    const mockFemale: Pet = {
      id: 'mock-female-1',
      ownerId: 'owner-2',
      ownerRole: 'breeder_registered',
      name: 'Bella',
      species: 'dog',
      breed: 'German Shepherd',
      sex: 'female',
      dateOfBirth: new Date(2021, 0, 1).toISOString(),
      photos: ['https://images.unsplash.com/photo-1554692918-08fa0fdc9db3?w=400'],
      healthRecords: [],
      status: 'in_heat',
      city: 'Sliema',
      country: 'Malta',
      createdAt: new Date().toISOString(),
    };

    return [
      {
        id: 'litter-1',
        title: 'German Shepherd Litter',
        expectedDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
        malePet: mockMale,
        femalePet: mockFemale,
        expectedCount: 6,
        breed: 'German Shepherd × German Shepherd',
        status: 'expecting',
        description: 'Champion bloodline breeding',
        createdAt: new Date().toISOString(),
      },
    ];
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadLitters();
  };

  const handleViewPair = (litter: Litter) => {
    navigation.navigate('BreedingPairDetails', {
      malePetId: litter.malePet.id,
      femalePetId: litter.femalePet.id,
      litterId: litter.id,
    });
  };

  const handleLitterPress = (litter: Litter) => {
    navigation.navigate('LitterDetails', { litterId: litter.id });
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>New Litters</Text>
          <Text style={styles.subtitle}>
            Upcoming litters and their breeding pairs
          </Text>
        </View>

        {/* Litters List */}
        {litters.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No upcoming litters yet</Text>
            <Text style={styles.emptySubtext}>
              Check back later for new breeding announcements
            </Text>
          </View>
        ) : (
          litters.map((litter) => (
            <NewLitterCard
              key={litter.id}
              litter={litter}
              onPress={() => handleLitterPress(litter)}
              onViewPair={() => handleViewPair(litter)}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.neutral,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 28,
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: FONTS.regular,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: FONTS.semiBold,
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
