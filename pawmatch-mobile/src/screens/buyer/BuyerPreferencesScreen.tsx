import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { colors } from '../../theme/colors';
import { supabase } from '../../services/supabase';

type Species = 'dog' | 'cat' | 'both';
type DogSize = 'small' | 'medium' | 'large' | 'any';
type Age = 'young' | 'adult' | 'senior' | 'any';

export default function BuyerPreferencesScreen({ navigation }: any) {
  const [species, setSpecies] = useState<Species>('both');
  const [dogSize, setDogSize] = useState<DogSize>('any');
  const [age, setAge] = useState<Age>('any');
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
        .select('preferred_species, preferred_dog_size, preferred_age')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        setSpecies(data.preferred_species || 'both');
        setDogSize(data.preferred_dog_size || 'any');
        setAge(data.preferred_age || 'any');
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
          preferred_species: species,
          preferred_dog_size: dogSize,
          preferred_age: age,
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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Adoption Preferences</Text>
        <Text style={styles.subtitle}>Help us find your perfect companion</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What type of pet?</Text>
        <View style={styles.optionGroup}>
          <OptionButton
            label="Dogs 🐕"
            selected={species === 'dog'}
            onPress={() => setSpecies('dog')}
          />
          <OptionButton
            label="Cats 🐈"
            selected={species === 'cat'}
            onPress={() => setSpecies('cat')}
          />
          <OptionButton
            label="Both 🐾"
            selected={species === 'both'}
            onPress={() => setSpecies('both')}
          />
        </View>
      </View>

      {(species === 'dog' || species === 'both') && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dog Size Preference</Text>
          <View style={styles.optionGroup}>
            <OptionButton
              label="Small"
              selected={dogSize === 'small'}
              onPress={() => setDogSize('small')}
              sublabel="< 10kg"
            />
            <OptionButton
              label="Medium"
              selected={dogSize === 'medium'}
              onPress={() => setDogSize('medium')}
              sublabel="10-25kg"
            />
            <OptionButton
              label="Large"
              selected={dogSize === 'large'}
              onPress={() => setDogSize('large')}
              sublabel="> 25kg"
            />
            <OptionButton
              label="Any Size"
              selected={dogSize === 'any'}
              onPress={() => setDogSize('any')}
            />
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Age Preference</Text>
        <View style={styles.optionGroup}>
          <OptionButton
            label="Young"
            selected={age === 'young'}
            onPress={() => setAge('young')}
            sublabel="< 2 years"
          />
          <OptionButton
            label="Adult"
            selected={age === 'adult'}
            onPress={() => setAge('adult')}
            sublabel="2-7 years"
          />
          <OptionButton
            label="Senior"
            selected={age === 'senior'}
            onPress={() => setAge('senior')}
            sublabel="> 7 years"
          />
          <OptionButton
            label="Any Age"
            selected={age === 'any'}
            onPress={() => setAge('any')}
          />
        </View>
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

function OptionButton({
  label,
  sublabel,
  selected,
  onPress,
}: {
  label: string;
  sublabel?: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.optionButton, selected && styles.optionButtonSelected]}
      onPress={onPress}
    >
      <Text style={[styles.optionLabel, selected && styles.optionLabelSelected]}>
        {label}
      </Text>
      {sublabel && (
        <Text style={[styles.optionSublabel, selected && styles.optionSublabelSelected]}>
          {sublabel}
        </Text>
      )}
      {selected && <Text style={styles.checkmark}>✓</Text>}
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
    fontSize: 32,
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
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  optionGroup: {
    gap: 12,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.background,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  optionLabelSelected: {
    color: colors.text,
  },
  optionSublabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginRight: 12,
  },
  optionSublabelSelected: {
    color: colors.textSecondary,
  },
  checkmark: {
    fontSize: 20,
    color: colors.primary,
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
