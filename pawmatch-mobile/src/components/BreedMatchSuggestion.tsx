// Breed Matching Suggestion Component
// Shows potential matches when same breed is detected
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { colors } from '../theme/colors';
import { supabase } from '../services/supabase';

interface BreedMatch {
  petId: string;
  petName: string;
  ownerName: string;
  ownerRole: string;
  city: string;
  distance?: number;
}

interface BreedMatchSuggestionProps {
  breed: string;
  species: 'dog' | 'cat';
  userRole: 'breeder_registered' | 'breeder_independent' | 'independent_owner';
  onViewMatch: (match: BreedMatch) => void;
}

export default function BreedMatchSuggestion({
  breed,
  species,
  userRole,
  onViewMatch,
}: BreedMatchSuggestionProps) {
  const [matches, setMatches] = useState<BreedMatch[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (breed) {
      findMatches();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [breed, species]);

  const findMatches = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Normalize breed name (handle spelling variations)
      const normalizedBreed = breed.toLowerCase().trim();

      // Search for pets with same breed (fuzzy match)
      const { data: pets, error } = await supabase
        .from('pets')
        .select(`
          id,
          name,
          breed,
          city,
          owner_id,
          owner:users!pets_owner_id_fkey(full_name, role)
        `)
        .eq('species', species)
        .neq('owner_id', user.id)
        .in('status', ['available', 'stud_available'])
        .ilike('breed', `%${normalizedBreed}%`);

      if (error) throw error;

      // Get user location for distance calculation
      const { data: currentUser } = await supabase
        .from('users')
        .select('city')
        .eq('id', user.id)
        .single();

      const matchesList: BreedMatch[] = (pets || []).map((pet: any) => ({
        petId: pet.id,
        petName: pet.name,
        ownerName: pet.owner?.full_name || 'Unknown',
        ownerRole: pet.owner?.role || '',
        city: pet.city || 'Malta',
        distance: pet.city === currentUser?.city ? 0 : undefined, // Same city = 0, different = unknown
      }));

      setMatches(matchesList.slice(0, 5)); // Show top 5 matches
    } catch (error) {
      console.error('Error finding breed matches:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!breed || matches.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>✨ Same Breed Found!</Text>
        <Text style={styles.subtitle}>
          {matches.length} {matches.length === 1 ? 'potential match' : 'potential matches'} with {breed}
        </Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.matchesScroll}>
        {matches.map((match) => (
          <TouchableOpacity
            key={match.petId}
            style={styles.matchCard}
            onPress={() => onViewMatch(match)}
          >
            <Text style={styles.matchName}>{match.petName}</Text>
            <Text style={styles.matchOwner}>{match.ownerName}</Text>
            <View style={styles.matchBadge}>
              <Text style={styles.matchBadgeText}>
                📍 {match.city}
                {match.distance === 0 && ' • Same city'}
              </Text>
            </View>
            {match.ownerRole.includes('breeder') && (
              <Text style={styles.matchRole}>🏠 Breeder</Text>
            )}
            {match.ownerRole === 'independent_owner' && (
              <Text style={styles.matchRole}>💝 Pet Owner</Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.note}>
        💡 These are potential breeding partners or companions with the same breed!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.secondary,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  matchesScroll: {
    marginBottom: 12,
  },
  matchCard: {
    width: 160,
    padding: 12,
    backgroundColor: colors.background,
    borderRadius: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  matchName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  matchOwner: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  matchBadge: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 4,
  },
  matchBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.background,
  },
  matchRole: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  note: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
});
