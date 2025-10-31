import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
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
  hypoallergenic: boolean;
}

interface BreedSelectorProps {
  species: 'dog' | 'cat' | null;
  selectedBreed: string | null;
  onSelect: (breedName: string) => void;
  placeholder?: string;
}

export default function BreedSelector({
  species,
  selectedBreed,
  onSelect,
  placeholder = 'Select breed',
}: BreedSelectorProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [allBreeds, setAllBreeds] = useState<Breed[]>([]);
  const [filteredBreeds, setFilteredBreeds] = useState<Breed[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const loadBreeds = useCallback(async () => {
    if (!species) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('breeds')
        .select('*')
        .eq('species', species)
        .order('full_name');

      if (error) throw error;
      setAllBreeds(data || []);
      setFilteredBreeds(data || []);
    } catch (error) {
      console.error('Error loading breeds:', error);
    } finally {
      setLoading(false);
    }
  }, [species]);

  useEffect(() => {
    if (species) {
      loadBreeds();
    }
  }, [species, loadBreeds]);

  useEffect(() => {
    if (searchQuery.trim()) {
      // Fuzzy search - handles spelling variations
      const query = searchQuery.toLowerCase().trim();
      const filtered = allBreeds.filter((breed) => {
        const fullName = breed.full_name.toLowerCase();
        const baseName = breed.base_name?.toLowerCase() || '';
        // Match if query is contained in full name or base name
        return fullName.includes(query) || baseName.includes(query);
      });
      setFilteredBreeds(filtered);
    } else {
      setFilteredBreeds(allBreeds);
    }
  }, [searchQuery, allBreeds]);

  const handleSelect = (breed: Breed) => {
    onSelect(breed.full_name);
    setModalVisible(false);
    setSearchQuery('');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.selector}
        onPress={() => species && setModalVisible(true)}
        disabled={!species}
      >
        <Text style={[styles.selectorText, !selectedBreed && styles.placeholder]}>
          {selectedBreed || (species ? placeholder : 'Select species first...')}
        </Text>
        <Text style={styles.chevron}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Select {species === 'dog' ? 'Dog' : 'Cat'} Breed
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search breeds..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
              />
            </View>

            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.secondary} />
              </View>
            ) : (
              <FlatList
                data={filteredBreeds}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.breedItem}
                    onPress={() => handleSelect(item)}
                  >
                    <View style={styles.breedHeader}>
                      <Text style={styles.breedName}>{item.full_name}</Text>
                      {item.size_variant && (
                        <View style={styles.sizeBadge}>
                          <Text style={styles.sizeText}>{item.size_variant}</Text>
                        </View>
                      )}
                    </View>
                    {item.temperament_tags && item.temperament_tags.length > 0 && (
                      <Text style={styles.temperamentText} numberOfLines={1}>
                        {item.temperament_tags.slice(0, 4).join(' • ')}
                      </Text>
                    )}
                    {item.hypoallergenic && (
                      <Text style={styles.hypoallergenicText}>🌿 Hypoallergenic</Text>
                    )}
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>
                      {searchQuery ? 'No breeds found' : 'No breeds available'}
                    </Text>
                  </View>
                }
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    backgroundColor: colors.background,
  },
  selectorText: {
    fontSize: 16,
    color: '#2F3A4A',
  },
  placeholder: {
    color: '#9CA3AF',
  },
  chevron: {
    fontSize: 12,
    color: '#6B7280',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2F3A4A',
  },
  closeButton: {
    fontSize: 28,
    color: '#6B7280',
  },
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  breedItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  breedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  breedName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2F3A4A',
  },
  sizeBadge: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  sizeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.background,
    textTransform: 'capitalize',
  },
  temperamentText: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  hypoallergenicText: {
    fontSize: 12,
    color: colors.success,
    fontWeight: '500',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
});
