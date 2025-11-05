import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { colors } from '../../theme/colors';
import { supabase } from '../../services/supabase';
import { BreedFilter } from '../../components/BreedFilter';

type EnergyLevel = 'very_relaxed' | 'mid_energy' | 'high_energy' | null;
type AgePreference = 'puppy' | 'young' | 'adult' | 'senior' | null;
type SizePreference = 'xs_small' | 'medium' | 'large_xl' | null;
type GenderPreference = 'male' | 'female' | 'both' | null;

const ACTIVITIES = [
  'Outdoor Play',
  'Indoor Play',
  'Trails/Hiking',
  'Gentle Walks',
  'Jogging',
  'Swimming',
  'Fetch/Chase',
  'Lots of Cuddles',
  'Bike Alongs',
  'Park Picnics',
  'City Exploring',
  'Brunch Bunch',
  'Agility',
];

export default function BuyerPreferencesScreen({ navigation }: any) {
  const [energyLevel, setEnergyLevel] = useState<EnergyLevel>(null);
  const [agePreference, setAgePreference] = useState<AgePreference[]>([]);
  const [sizePreference, setSizePreference] = useState<SizePreference>(null);
  const [activities, setActivities] = useState<string[]>([]);
  const [genderPreference, setGenderPreference] = useState<GenderPreference>(null);
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('users')
        .select('preferred_energy_level, preferred_age, preferred_dog_size, preferred_activities, preferred_gender, preferred_breeds')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        setEnergyLevel(data.preferred_energy_level || null);
        setAgePreference(data.preferred_age ? (Array.isArray(data.preferred_age) ? data.preferred_age : [data.preferred_age]) : []);
        setSizePreference(data.preferred_dog_size || null);
        setActivities(data.preferred_activities || []);
        setGenderPreference(data.preferred_gender || null);
        setSelectedBreeds(data.preferred_breeds || []);
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const savePreferences = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('users')
        .update({
          preferred_energy_level: energyLevel,
          preferred_age: agePreference.length > 0 ? agePreference : null,
          preferred_dog_size: sizePreference,
          preferred_activities: activities,
          preferred_gender: genderPreference,
          preferred_breeds: selectedBreeds.length > 0 ? selectedBreeds : null,
        })
        .eq('id', user.id);

      if (error) throw error;

      Alert.alert('Success', 'Preferences saved! Your discovery feed will show matching pets.');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleAgePreference = (age: AgePreference) => {
    if (agePreference.includes(age)) {
      setAgePreference(agePreference.filter(a => a !== age));
    } else {
      setAgePreference([...agePreference, age]);
    }
  };

  const toggleActivity = (activity: string) => {
    if (activities.includes(activity)) {
      setActivities(activities.filter(a => a !== activity));
    } else {
      setActivities([...activities, activity]);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Picky Pup? No problem!</Text>
        <Text style={styles.subtitle}>Let's narrow it down...</Text>
      </View>

      {/* Energy Level */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Filter By Energy Level</Text>
        <View style={styles.buttonRow}>
          <FilterButton
            label="Very Relaxed"
            selected={energyLevel === 'very_relaxed'}
            onPress={() => setEnergyLevel(energyLevel === 'very_relaxed' ? null : 'very_relaxed')}
          />
          <FilterButton
            label="Mid-Energy"
            selected={energyLevel === 'mid_energy'}
            onPress={() => setEnergyLevel(energyLevel === 'mid_energy' ? null : 'mid_energy')}
          />
          <FilterButton
            label="High Energy"
            selected={energyLevel === 'high_energy'}
            onPress={() => setEnergyLevel(energyLevel === 'high_energy' ? null : 'high_energy')}
          />
        </View>
      </View>

      {/* Age Preference */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Filter By Pet Age Preference</Text>
        <View style={styles.buttonRow}>
          <FilterButton
            label="Puppy - 2 y.o."
            selected={agePreference.includes('puppy')}
            onPress={() => toggleAgePreference('puppy')}
          />
          <FilterButton
            label="3 - 6 y.o."
            selected={agePreference.includes('young')}
            onPress={() => toggleAgePreference('young')}
          />
          <FilterButton
            label="7 or Older"
            selected={agePreference.includes('senior')}
            onPress={() => toggleAgePreference('senior')}
          />
        </View>
      </View>

      {/* Size Preference */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Filter By Pet Size Preference</Text>
        <View style={styles.buttonRow}>
          <FilterButton
            label="XS - Small"
            selected={sizePreference === 'xs_small'}
            onPress={() => setSizePreference(sizePreference === 'xs_small' ? null : 'xs_small')}
          />
          <FilterButton
            label="Medium"
            selected={sizePreference === 'medium'}
            onPress={() => setSizePreference(sizePreference === 'medium' ? null : 'medium')}
          />
          <FilterButton
            label="Large - XL"
            selected={sizePreference === 'large_xl'}
            onPress={() => setSizePreference(sizePreference === 'large_xl' ? null : 'large_xl')}
          />
        </View>
      </View>

      {/* Activities */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Filter By Favorite Activities</Text>
        <View style={styles.activityGrid}>
          {ACTIVITIES.map(activity => (
            <FilterButton
              key={activity}
              label={activity}
              selected={activities.includes(activity)}
              onPress={() => toggleActivity(activity)}
            />
          ))}
        </View>
      </View>

      {/* Gender */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Filter By Male/Female Dogs</Text>
        <View style={styles.buttonRow}>
          <FilterButton
            label="Male Dogs"
            selected={genderPreference === 'male'}
            onPress={() => setGenderPreference(genderPreference === 'male' ? null : 'male')}
          />
          <FilterButton
            label="Female Dogs"
            selected={genderPreference === 'female'}
            onPress={() => setGenderPreference(genderPreference === 'female' ? null : 'female')}
          />
        </View>
      </View>

      {/* Breed Selection */}
      <View style={styles.section}>
        <BreedFilter selectedBreeds={selectedBreeds} onBreedsChange={setSelectedBreeds} />
      </View>

      <TouchableOpacity
        style={[styles.saveButton, loading && styles.saveButtonDisabled]}
        onPress={savePreferences}
        disabled={loading}
      >
        <Text style={styles.saveButtonText}>
          {loading ? 'Saving...' : 'Save Preferences'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.note}>
        💡 Tip: You can change these preferences anytime. Your discovery feed will update automatically.
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
  activityGrid: {
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
