import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { colors } from '../../theme/colors';
import { supabase } from '../../services/supabase';
import { BreedFilter } from '../../components/BreedFilter';

interface BuyerFilterOnboardingProps {
  onNext: () => void;
  onBack: () => void;
}

export function BuyerFilterOnboarding({ onNext, onBack }: BuyerFilterOnboardingProps) {
  const [energyLevel, setEnergyLevel] = useState<string | null>(null);
  const [agePreference, setAgePreference] = useState<string[]>([]);
  const [sizePreference, setSizePreference] = useState<string | null>(null);
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
  const [genderPreference, setGenderPreference] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        onNext(); // Continue even if not logged in
        return;
      }

      await supabase
        .from('users')
        .update({
          preferred_energy_level: energyLevel,
          preferred_age: agePreference.length > 0 ? agePreference : null,
          preferred_dog_size: sizePreference,
          preferred_breeds: selectedBreeds.length > 0 ? selectedBreeds : null,
          preferred_gender: genderPreference,
        })
        .eq('id', user.id);

      onNext();
    } catch (error) {
      console.error('Error saving preferences:', error);
      onNext(); // Continue even if save fails
    } finally {
      setSaving(false);
    }
  };

  const toggleAgePreference = (age: string) => {
    if (agePreference.includes(age)) {
      setAgePreference(agePreference.filter(a => a !== age));
    } else {
      setAgePreference([...agePreference, age]);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Picky Pup? No problem!</Text>
        <Text style={styles.subtitle}>Let's narrow it down...</Text>
      </View>

      {/* Simplified filters for onboarding */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Filter By Energy Level</Text>
        <View style={styles.buttonRow}>
          <FilterButton label="Very Relaxed" selected={energyLevel === 'very_relaxed'} onPress={() => setEnergyLevel(energyLevel === 'very_relaxed' ? null : 'very_relaxed')} />
          <FilterButton label="Mid-Energy" selected={energyLevel === 'mid_energy'} onPress={() => setEnergyLevel(energyLevel === 'mid_energy' ? null : 'mid_energy')} />
          <FilterButton label="High Energy" selected={energyLevel === 'high_energy'} onPress={() => setEnergyLevel(energyLevel === 'high_energy' ? null : 'high_energy')} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Filter By Pet Age Preference</Text>
        <View style={styles.buttonRow}>
          <FilterButton label="Puppy - 2 y.o." selected={agePreference.includes('puppy')} onPress={() => toggleAgePreference('puppy')} />
          <FilterButton label="3 - 6 y.o." selected={agePreference.includes('young')} onPress={() => toggleAgePreference('young')} />
          <FilterButton label="7 or Older" selected={agePreference.includes('senior')} onPress={() => toggleAgePreference('senior')} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Filter By Pet Size Preference</Text>
        <View style={styles.buttonRow}>
          <FilterButton label="XS - Small" selected={sizePreference === 'xs_small'} onPress={() => setSizePreference(sizePreference === 'xs_small' ? null : 'xs_small')} />
          <FilterButton label="Medium" selected={sizePreference === 'medium'} onPress={() => setSizePreference(sizePreference === 'medium' ? null : 'medium')} />
          <FilterButton label="Large - XL" selected={sizePreference === 'large_xl'} onPress={() => setSizePreference(sizePreference === 'large_xl' ? null : 'large_xl')} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Filter By Male/Female Dogs</Text>
        <View style={styles.buttonRow}>
          <FilterButton label="Male Dogs" selected={genderPreference === 'male'} onPress={() => setGenderPreference(genderPreference === 'male' ? null : 'male')} />
          <FilterButton label="Female Dogs" selected={genderPreference === 'female'} onPress={() => setGenderPreference(genderPreference === 'female' ? null : 'female')} />
        </View>
      </View>

      <View style={styles.section}>
        <BreedFilter selectedBreeds={selectedBreeds} onBreedsChange={setSelectedBreeds} />
      </View>

      <TouchableOpacity
        style={[styles.saveButton, saving && styles.saveButtonDisabled]}
        onPress={handleSave}
        disabled={saving}
      >
        <Text style={styles.saveButtonText}>
          {saving ? 'Saving...' : 'Continue'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.note}>
        💡 You can change these preferences anytime in your profile settings.
      </Text>
    </ScrollView>
  );
}

function FilterButton({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.filterButton, selected && styles.filterButtonSelected]}
      onPress={onPress}
    >
      <Text style={[styles.filterButtonText, selected && styles.filterButtonTextSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  backButton: {
    marginBottom: 20,
  },
  backText: {
    fontSize: 16,
    color: colors.secondary,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  section: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  filterButtonSelected: {
    backgroundColor: '#D4EDDA',
    borderColor: '#28A745',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  filterButtonTextSelected: {
    color: '#155724',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: colors.primary,
    margin: 20,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  note: {
    fontSize: 14,
    color: colors.textSecondary,
    padding: 20,
    paddingTop: 0,
    lineHeight: 20,
  },
});

