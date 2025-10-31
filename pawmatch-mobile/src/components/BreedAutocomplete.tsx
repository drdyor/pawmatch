import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../theme/colors';
import { supabase } from '../services/supabase';

interface Breed {
  id: string;
  species: string;
  full_name: string;
  base_name: string;
  size_variant: string | null;
  temperament_tags: string[];
}

interface BreedAutocompleteProps {
  species: 'dog' | 'cat' | null;
  onSelect: (breedName: string) => void;
  placeholder?: string;
  value?: string;
}

export default function BreedAutocomplete({
  species,
  onSelect,
  placeholder = 'Search breeds...',
  value = '',
}: BreedAutocompleteProps) {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<Breed[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const searchBreeds = useCallback(async (searchText: string) => {
    if (!species) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('breeds')
        .select('*')
        .eq('species', species)
        .ilike('full_name', `%${searchText}%`)
        .order('full_name')
        .limit(10);

      if (error) throw error;
      setSuggestions(data || []);
      setShowDropdown(true);
    } catch (error) {
      console.error('Error searching breeds:', error);
    } finally {
      setLoading(false);
    }
  }, [species]);

  useEffect(() => {
    if (query.length >= 2 && species) {
      searchBreeds(query);
    } else {
      setSuggestions([]);
    }
  }, [query, species, searchBreeds]); // searchBreeds already memoized with useCallback

  const handleSelect = (breed: Breed) => {
    setQuery(breed.full_name);
    onSelect(breed.full_name);
    setShowDropdown(false);
    setSuggestions([]);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={species ? placeholder : 'Select species first...'}
        value={query}
        onChangeText={setQuery}
        onFocus={() => query.length >= 2 && setShowDropdown(true)}
        editable={!!species}
      />

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.secondary} />
        </View>
      )}

      {showDropdown && suggestions.length > 0 && (
        <View style={styles.dropdown}>
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => handleSelect(item)}
              >
                <View style={styles.suggestionMain}>
                  <Text style={styles.suggestionName}>{item.full_name}</Text>
                  {item.size_variant && (
                    <Text style={styles.suggestionSize}>
                      {item.size_variant}
                    </Text>
                  )}
                </View>
                {item.temperament_tags && item.temperament_tags.length > 0 && (
                  <Text style={styles.suggestionTags} numberOfLines={1}>
                    {item.temperament_tags.slice(0, 3).join(', ')}
                  </Text>
                )}
              </TouchableOpacity>
            )}
            style={styles.suggestionsList}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      )}

      {!species && (
        <Text style={styles.helperText}>
          💡 Select species (dog/cat) first to search breeds
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  dropdown: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    maxHeight: 300,
    zIndex: 1000,
  },
  suggestionsList: {
    maxHeight: 300,
  },
  suggestionItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  suggestionMain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  suggestionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2F3A4A',
  },
  suggestionSize: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.secondary,
    textTransform: 'capitalize',
  },
  suggestionTags: {
    fontSize: 12,
    color: '#6B7280',
  },
  helperText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 8,
  },
});
