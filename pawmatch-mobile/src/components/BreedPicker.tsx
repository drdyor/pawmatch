// Breed Picker with Typo-Proof Autocomplete (Snack-safe)
import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { suggestBreeds, getCanonicalBreed } from '../lib/breeds';
import { COLORS, FONTS } from '../theme';

interface BreedPickerProps {
  initialSpecies?: 'dog' | 'cat';
  onSelect: (result: { species: 'dog' | 'cat'; breed: string }) => void;
  placeholder?: string;
}

export default function BreedPicker({
  initialSpecies = 'dog',
  onSelect,
  placeholder = 'Start typing breed...',
}: BreedPickerProps) {
  const [species, setSpecies] = useState<'dog' | 'cat'>(initialSpecies);
  const [query, setQuery] = useState('');
  
  const suggestions = useMemo(() => suggestBreeds(query, species), [query, species]);

  const handleSelect = (breed: string) => {
    const canonical = getCanonicalBreed(breed, species);
    onSelect({ species, breed: canonical || breed });
    setQuery('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.speciesToggle}>
        {(['dog', 'cat'] as const).map((s) => (
          <TouchableOpacity
            key={s}
            onPress={() => {
              setSpecies(s);
              setQuery(''); // Reset query when switching species
            }}
            style={[styles.speciesButton, species === s && styles.speciesButtonActive]}
          >
            <Text style={[styles.speciesText, species === s && styles.speciesTextActive]}>
              {s === 'dog' ? '🐕 Dog' : '🐈 Cat'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        placeholder={placeholder}
        value={query}
        onChangeText={setQuery}
        autoCapitalize="words"
        style={styles.input}
      />

      {query.length > 0 && suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item}
            style={styles.suggestionsList}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleSelect(item)}
                style={styles.suggestionItem}
              >
                <Text style={styles.suggestionText}>{item}</Text>
                {query.toLowerCase() !== item.toLowerCase() && (
                  <Text style={styles.suggestionHint}>← Did you mean this?</Text>
                )}
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No matches found. Try typing differently.</Text>
              </View>
            }
            keyboardShouldPersistTaps="handled"
          />
        </View>
      )}
      
      {query.length > 2 && suggestions.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>
            No matches. You can add "{query}" as a custom breed.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  speciesToggle: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  speciesButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#EEE',
    alignItems: 'center',
  },
  speciesButtonActive: {
    backgroundColor: COLORS.secondary,
  },
  speciesText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 14,
  },
  speciesTextActive: {
    color: '#fff',
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#DDD',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: COLORS.text,
  },
  suggestionsContainer: {
    maxHeight: 220,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DDD',
    marginTop: 4,
  },
  suggestionsList: {
    maxHeight: 220,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F1F1',
  },
  suggestionText: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  },
  suggestionHint: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  emptyState: {
    padding: 12,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
