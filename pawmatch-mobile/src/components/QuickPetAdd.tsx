import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import { Colors, Spacing } from '../constants/Colors';

const TEMPERAMENT_OPTIONS = [
  'Friendly',
  'Energetic',
  'Calm',
  'Playful',
  'Loyal',
  'Protective',
  'Gentle',
  'Intelligent',
  'Independent',
  'Affectionate',
];

const HEALTH_BADGES = [
  { id: 'vaccinated', label: '💉 Vaccinated' },
  { id: 'dna_tested', label: '🧬 DNA Tested' },
  { id: 'hip_scored', label: '🦴 Hip Scored' },
  { id: 'vet_verified', label: '✅ Vet Verified' },
];

interface Pet {
  name: string;
  species: 'dog' | 'cat' | '';
  breed: string;
  age: string;
  sex: 'male' | 'female' | '';
  temperament: string[];
  health: string[];
}

interface QuickPetAddProps {
  visible: boolean;
  onClose: () => void;
  onSave: (pets: Pet[]) => void;
}

export const QuickPetAdd: React.FC<QuickPetAddProps> = ({ visible, onClose, onSave }) => {
  const [pets, setPets] = useState<Pet[]>([
    {
      name: '',
      species: '',
      breed: '',
      age: '',
      sex: '',
      temperament: [],
      health: [],
    },
  ]);

  const [currentPetIndex, setCurrentPetIndex] = useState(0);

  const currentPet = pets[currentPetIndex];

  const updatePet = (field: keyof Pet, value: any) => {
    const newPets = [...pets];
    newPets[currentPetIndex] = { ...newPets[currentPetIndex], [field]: value };
    setPets(newPets);
  };

  const toggleTemperament = (trait: string) => {
    const current = currentPet.temperament;
    const newTemperament = current.includes(trait)
      ? current.filter((t) => t !== trait)
      : [...current, trait];
    updatePet('temperament', newTemperament);
  };

  const toggleHealth = (badge: string) => {
    const current = currentPet.health;
    const newHealth = current.includes(badge)
      ? current.filter((h) => h !== badge)
      : [...current, badge];
    updatePet('health', newHealth);
  };

  const addAnotherPet = () => {
    setPets([
      ...pets,
      {
        name: '',
        species: '',
        breed: '',
        age: '',
        sex: '',
        temperament: [],
        health: [],
      },
    ]);
    setCurrentPetIndex(pets.length);
  };

  const removePet = (index: number) => {
    if (pets.length === 1) {
      Alert.alert('Cannot remove', 'You need at least one pet');
      return;
    }
    const newPets = pets.filter((_, i) => i !== index);
    setPets(newPets);
    if (currentPetIndex >= newPets.length) {
      setCurrentPetIndex(newPets.length - 1);
    }
  };

  const handleSave = () => {
    // Validate
    const incompletePets = pets.filter(
      (p) => !p.name || !p.species || !p.breed || !p.age || !p.sex
    );
    if (incompletePets.length > 0) {
      Alert.alert('Incomplete Info', 'Please fill in all required fields for each pet');
      return;
    }

    onSave(pets);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Your Pet{pets.length > 1 ? 's' : ''}</Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.saveButton}>Save</Text>
          </TouchableOpacity>
        </View>

        {/* Pet Tabs */}
        {pets.length > 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tabsContainer}
          >
            {pets.map((pet, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.tab, currentPetIndex === index && styles.tabActive]}
                onPress={() => setCurrentPetIndex(index)}
              >
                <Text style={[styles.tabText, currentPetIndex === index && styles.tabTextActive]}>
                  {pet.name || `Pet ${index + 1}`}
                </Text>
                {pets.length > 1 && (
                  <TouchableOpacity
                    onPress={() => removePet(index)}
                    style={styles.removeTab}
                  >
                    <Text style={styles.removeTabText}>×</Text>
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        <ScrollView style={styles.content}>
          {/* Name */}
          <View style={styles.section}>
            <Text style={styles.label}>Pet Name *</Text>
            <TextInput
              style={styles.input}
              value={currentPet.name}
              onChangeText={(text) => updatePet('name', text)}
              placeholder="Luna"
              placeholderTextColor={Colors.textSecondary}
            />
          </View>

          {/* Species */}
          <View style={styles.section}>
            <Text style={styles.label}>Species *</Text>
            <View style={styles.chips}>
              {(['dog', 'cat'] as const).map((species) => (
                <TouchableOpacity
                  key={species}
                  style={[
                    styles.chip,
                    currentPet.species === species && styles.chipSelected,
                  ]}
                  onPress={() => updatePet('species', species)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      currentPet.species === species && styles.chipTextSelected,
                    ]}
                  >
                    {species === 'dog' ? '🐕 Dog' : '🐱 Cat'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Breed */}
          <View style={styles.section}>
            <Text style={styles.label}>Breed *</Text>
            <TextInput
              style={styles.input}
              value={currentPet.breed}
              onChangeText={(text) => updatePet('breed', text)}
              placeholder="Border Collie"
              placeholderTextColor={Colors.textSecondary}
            />
          </View>

          {/* Age */}
          <View style={styles.section}>
            <Text style={styles.label}>Age *</Text>
            <TextInput
              style={styles.input}
              value={currentPet.age}
              onChangeText={(text) => updatePet('age', text)}
              placeholder="3 years"
              placeholderTextColor={Colors.textSecondary}
            />
          </View>

          {/* Sex */}
          <View style={styles.section}>
            <Text style={styles.label}>Sex *</Text>
            <View style={styles.chips}>
              {(['male', 'female'] as const).map((sex) => (
                <TouchableOpacity
                  key={sex}
                  style={[
                    styles.chip,
                    currentPet.sex === sex && styles.chipSelected,
                  ]}
                  onPress={() => updatePet('sex', sex)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      currentPet.sex === sex && styles.chipTextSelected,
                    ]}
                  >
                    {sex === 'male' ? '♂️ Male' : '♀️ Female'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Temperament */}
          <View style={styles.section}>
            <Text style={styles.label}>Temperament</Text>
            <Text style={styles.sublabel}>Select all that apply</Text>
            <View style={styles.chips}>
              {TEMPERAMENT_OPTIONS.map((trait) => (
                <TouchableOpacity
                  key={trait}
                  style={[
                    styles.chip,
                    currentPet.temperament.includes(trait) && styles.chipSelected,
                  ]}
                  onPress={() => toggleTemperament(trait)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      currentPet.temperament.includes(trait) && styles.chipTextSelected,
                    ]}
                  >
                    {trait}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Health Badges */}
          <View style={styles.section}>
            <Text style={styles.label}>Health & Certifications</Text>
            <View style={styles.chips}>
              {HEALTH_BADGES.map((badge) => (
                <TouchableOpacity
                  key={badge.id}
                  style={[
                    styles.chip,
                    styles.healthChip,
                    currentPet.health.includes(badge.id) && styles.chipSelected,
                  ]}
                  onPress={() => toggleHealth(badge.id)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      currentPet.health.includes(badge.id) && styles.chipTextSelected,
                    ]}
                  >
                    {badge.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Photo Placeholder */}
          <TouchableOpacity style={styles.photoPlaceholder}>
            <Text style={styles.photoText}>📸 Add Photo</Text>
            <Text style={styles.photoSubtext}>(Optional)</Text>
          </TouchableOpacity>

          {/* Add Another Pet */}
          <TouchableOpacity style={styles.addAnotherButton} onPress={addAnotherPet}>
            <Text style={styles.addAnotherText}>+ Add Another Pet</Text>
          </TouchableOpacity>

          <View style={{ height: Spacing.xxl }} />
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  cancelButton: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  saveButton: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
  },
  tabsContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    marginRight: Spacing.sm,
  },
  tabActive: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginRight: Spacing.xs,
  },
  tabTextActive: {
    color: Colors.text,
    fontWeight: '700',
  },
  removeTab: {
    marginLeft: Spacing.xs,
  },
  removeTabText: {
    fontSize: 20,
    color: Colors.danger,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  section: {
    marginTop: Spacing.lg,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  sublabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  chipTextSelected: {
    color: Colors.text,
    fontWeight: '600',
  },
  healthChip: {
    paddingHorizontal: Spacing.md,
  },
  photoPlaceholder: {
    marginTop: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  photoText: {
    fontSize: 18,
    color: Colors.textSecondary,
  },
  photoSubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  addAnotherButton: {
    marginTop: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
  },
  addAnotherText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
  },
});
