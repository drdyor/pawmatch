import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { colors } from '../theme/colors';
import { getAllBreeds, searchBreeds, POPULAR_CROSS_BREEDS } from '../utils/dogDataset';

interface BreedFilterProps {
  selectedBreeds: string[];
  onBreedsChange: (breeds: string[]) => void;
}

export function BreedFilter({ selectedBreeds, onBreedsChange }: BreedFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllBreeds, setShowAllBreeds] = useState(false);

  const allBreeds = getAllBreeds();
  const filteredBreeds = searchQuery
    ? searchBreeds(searchQuery)
    : showAllBreeds
    ? allBreeds
    : POPULAR_CROSS_BREEDS;

  const toggleBreed = (breed: string) => {
    if (selectedBreeds.includes(breed)) {
      onBreedsChange(selectedBreeds.filter(b => b !== breed));
    } else {
      onBreedsChange([...selectedBreeds, breed]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Filter By Breed</Text>
      
      {/* Search Input */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search breeds..."
        placeholderTextColor="#999"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Popular Cross-Breeds Section */}
      {!searchQuery && !showAllBreeds && (
        <View style={styles.section}>
          <Text style={styles.subsectionTitle}>Popular Cross-Breeds</Text>
          <View style={styles.breedGrid}>
            {POPULAR_CROSS_BREEDS.map(breed => (
              <BreedButton
                key={breed}
                breed={breed}
                selected={selectedBreeds.includes(breed)}
                onPress={() => toggleBreed(breed)}
              />
            ))}
          </View>
        </View>
      )}

      {/* All Breeds Section */}
      <View style={styles.section}>
        {!showAllBreeds && !searchQuery && (
          <TouchableOpacity
            style={styles.seeMoreButton}
            onPress={() => setShowAllBreeds(true)}
          >
            <Text style={styles.seeMoreText}>See More Breeds &gt;&gt;</Text>
          </TouchableOpacity>
        )}
        
        {showAllBreeds && (
          <ScrollView style={styles.breedScroll} nestedScrollEnabled>
            <View style={styles.breedGrid}>
              {filteredBreeds.map(breed => (
                <BreedButton
                  key={breed}
                  breed={breed}
                  selected={selectedBreeds.includes(breed)}
                  onPress={() => toggleBreed(breed)}
                />
              ))}
            </View>
          </ScrollView>
        )}
      </View>

      {/* Selected Breeds Summary */}
      {selectedBreeds.length > 0 && (
        <View style={styles.selectedContainer}>
          <Text style={styles.selectedTitle}>Selected ({selectedBreeds.length}):</Text>
          <View style={styles.selectedChips}>
            {selectedBreeds.map(breed => (
              <View key={breed} style={styles.selectedChip}>
                <Text style={styles.selectedChipText}>{breed}</Text>
                <TouchableOpacity
                  onPress={() => toggleBreed(breed)}
                  style={styles.removeButton}
                >
                  <Text style={styles.removeText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

function BreedButton({
  breed,
  selected,
  onPress,
}: {
  breed: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.breedButton, selected && styles.breedButtonSelected]}
      onPress={onPress}
    >
      <Text style={[styles.breedButtonText, selected && styles.breedButtonTextSelected]}>
        {breed}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  section: {
    marginBottom: 16,
  },
  subsectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 12,
  },
  breedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  breedButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  breedButtonSelected: {
    backgroundColor: '#D4EDDA',
    borderColor: '#28A745',
  },
  breedButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  breedButtonTextSelected: {
    color: '#155724',
  },
  breedScroll: {
    maxHeight: 200,
  },
  seeMoreButton: {
    padding: 12,
    alignItems: 'center',
  },
  seeMoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  selectedContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
  },
  selectedTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  selectedChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  selectedChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text,
    marginRight: 6,
  },
  removeButton: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeText: {
    fontSize: 10,
    color: colors.text,
    fontWeight: 'bold',
  },
});

