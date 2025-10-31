// Adoption Discovery Screen - Scrollable Cards (for Seekers/Adopters)
// Different from Breeding Discovery - shows shelter animals for adoption
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  FlatList,
  StatusBar,
} from 'react-native';
import { COLORS, FONTS } from '../../theme';
import { supabase } from '../../services/supabase';
import { Pet } from '../../types';
import FilterChip from '../../components/FilterChip';

type AdoptionFilter = 'all' | 'dogs' | 'cats' | 'urgent' | 'child_safe' | 'house_trained';

const ADOPTION_FILTERS: { id: AdoptionFilter; label: string }[] = [
  { id: 'all', label: 'All Pets' },
  { id: 'dogs', label: 'Dogs' },
  { id: 'cats', label: 'Cats' },
  { id: 'urgent', label: 'Urgent' },
  { id: 'child_safe', label: 'Child Safe' },
  { id: 'house_trained', label: 'House Trained' },
];

export default function AdoptionDiscoveryScreen({ navigation }: any) {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<AdoptionFilter>('all');

  useEffect(() => {
    loadAdoptionListings();
  }, [activeFilter]);

  const loadAdoptionListings = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('pets')
        .select('*, profiles:owner_id(*)')
        .eq('listing_type', 'adoption')
        .eq('status', 'available')
        .order('created_at', { ascending: false })
        .limit(50);

      // Apply filters
      if (activeFilter === 'dogs') {
        query = query.eq('species', 'dog');
      } else if (activeFilter === 'cats') {
        query = query.eq('species', 'cat');
      } else if (activeFilter === 'child_safe') {
        query = query.eq('metadata->safeForChildren', true);
      } else if (activeFilter === 'house_trained') {
        query = query.eq('house_trained', true);
      } else if (activeFilter === 'urgent') {
        query = query.eq('status', 'at_risk');
      }

      const { data, error } = await query;

      if (error) throw error;
      setPets(data || []);
    } catch (error: any) {
      console.error('Error loading adoption listings:', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadAdoptionListings();
  };

  const handleApplyToAdopt = (pet: Pet) => {
    navigation.navigate('PetDetail', { petId: pet.id });
    // In PetDetail, there will be an "Apply to Adopt" button
  };

  const renderPetCard = ({ item: pet }: { item: Pet }) => {
    const isUrgent = pet.status === 'at_risk';
    const childSafe = pet.metadata?.safeForChildren === true;
    const daysLeft = pet.metadata?.euthanasiaDate
      ? Math.ceil(
          (new Date(pet.metadata.euthanasiaDate).getTime() - Date.now()) /
            (1000 * 60 * 60 * 24)
        )
      : null;

    return (
      <TouchableOpacity
        style={[styles.petCard, isUrgent && styles.petCardUrgent]}
        onPress={() => navigation.navigate('PetDetail', { petId: pet.id })}
      >
        <View style={styles.petImageContainer}>
          <Image
            source={
              pet.photos && pet.photos.length > 0
                ? { uri: pet.photos[0] }
                : require('../../assets/images/placeholder-pet.png')
            }
            style={styles.petImage}
            resizeMode="cover"
          />
          {isUrgent && (
            <View style={styles.urgentBadge}>
              <Text style={styles.urgentText}>
                {daysLeft !== null ? `⚠️ ${daysLeft} days left` : '⚠️ Urgent'}
              </Text>
            </View>
          )}
          {childSafe && (
            <View style={styles.childSafeBadge}>
              <Text style={styles.childSafeText}>✅ Safe with kids</Text>
            </View>
          )}
        </View>

        <View style={styles.petInfo}>
          <Text style={styles.petName}>{pet.name}</Text>
          <Text style={styles.petBreed}>
            {pet.breed || 'Mixed'} • {pet.sex || 'Unknown'}
          </Text>
          {pet.city && (
            <Text style={styles.petLocation}>📍 {pet.city}, {pet.country}</Text>
          )}
          {pet.metadata?.temperament && pet.metadata.temperament.length > 0 && (
            <View style={styles.tagsContainer}>
              {pet.metadata.temperament.slice(0, 3).map((tag: string) => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}
          <TouchableOpacity
            style={styles.applyButton}
            onPress={() => handleApplyToAdopt(pet)}
          >
            <Text style={styles.applyButtonText}>Apply to Adopt</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      {/* Malta Flag Header */}
      <View style={styles.header}>
        <View style={styles.flagContainer}>
          <Text style={styles.flag}>🇲🇹</Text>
        </View>
        <Text style={styles.title}>Adoption Discovery</Text>
        <Text style={styles.subtitle}>Find your perfect companion</Text>
      </View>

      {/* Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      >
        {ADOPTION_FILTERS.map((filter) => (
          <FilterChip
            key={filter.id}
            label={filter.label}
            active={activeFilter === filter.id}
            onPress={() => setActiveFilter(filter.id)}
          />
        ))}
      </ScrollView>

      {/* Pet Cards Grid/List */}
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={pets}
          renderItem={renderPetCard}
          keyExtractor={(item) => item.id}
          numColumns={1}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No pets available for adoption right now.</Text>
              <Text style={styles.emptySubtext}>Check back soon!</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral,
  },
  header: {
    backgroundColor: COLORS.backgroundGradientStart,
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
    backgroundColor: '#fff',
    paddingVertical: 12,
  },
  filtersContent: {
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
  },
  petCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  petCardUrgent: {
    borderWidth: 2,
    borderColor: COLORS.maltaRed,
  },
  petImageContainer: {
    width: '100%',
    height: 250,
    position: 'relative',
  },
  petImage: {
    width: '100%',
    height: '100%',
  },
  urgentBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: COLORS.maltaRed,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  urgentText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
  childSafeBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: COLORS.success,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  childSafeText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
  petInfo: {
    padding: 16,
  },
  petName: {
    fontFamily: FONTS.bold,
    fontSize: 22,
    color: COLORS.text,
    marginBottom: 4,
  },
  petBreed: {
    fontFamily: FONTS.regular,
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  petLocation: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    gap: 6,
  },
  tag: {
    backgroundColor: COLORS.neutral,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    color: COLORS.text,
  },
  applyButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    alignItems: 'center',
    marginTop: 8,
  },
  applyButtonText: {
    color: '#fff',
    fontFamily: FONTS.bold,
    fontSize: 16,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});
