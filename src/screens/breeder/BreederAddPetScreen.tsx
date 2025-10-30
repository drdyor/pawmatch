import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../../theme/colors';
import { supabase } from '../../services/supabase';

export default function BreederAddPetScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [species, setSpecies] = useState<'dog' | 'cat'>('dog');
  const [breed, setBreed] = useState('');
  const [sex, setSex] = useState<'male' | 'female'>('female');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [weight, setWeight] = useState('');
  const [size, setSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [healthNotes, setHealthNotes] = useState('');
  const [isStudAvailable, setIsStudAvailable] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    // Validation
    if (!name || !breed) {
      Alert.alert('Error', 'Please fill in name and breed');
      return;
    }

    // Validate date format
    if (dateOfBirth && !dateOfBirth.match(/^\d{4}-\d{2}-\d{2}$/)) {
      Alert.alert('Error', 'Date of birth must be in format YYYY-MM-DD');
      return;
    }

    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get user location
      const { data: userData } = await supabase
        .from('users')
        .select('city, country, role')
        .eq('id', user.id)
        .single();

      const weightNum = weight ? parseFloat(weight) : null;

      const { data: pet, error } = await supabase
        .from('pets')
        .insert({
          owner_id: user.id,
          owner_role: userData?.role || 'breeder_independent',
          name,
          species,
          breed,
          sex,
          date_of_birth: dateOfBirth || null,
          weight: weightNum,
          size: species === 'dog' ? size : null,
          city: userData?.city || 'Malta',
          country: userData?.country || 'Malta',
          status: isStudAvailable ? 'stud_available' : 'available',
          description: healthNotes || null,
          photos: [],
        })
        .select()
        .single();

      if (error) throw error;

      // If female, prompt to track heat
      if (sex === 'female' && species === 'dog') {
        Alert.alert(
          'Success!',
          `${name} has been added. Would you like to start tracking heat cycles?`,
          [
            { text: 'Not Now', onPress: () => navigation.goBack() },
            {
              text: 'Track Heat',
              onPress: () => navigation.replace('HeatTracking', { petId: pet.id }),
            },
          ]
        );
      } else {
        Alert.alert('Success!', `${name} has been added to your breeding program.`);
        navigation.goBack();
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Add New Pet</Text>
        <Text style={styles.subtitle}>Add an animal to your breeding program</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Luna"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Species *</Text>
          <View style={styles.toggleGroup}>
            <TouchableOpacity
              style={[styles.toggleButton, species === 'dog' && styles.toggleButtonActive]}
              onPress={() => setSpecies('dog')}
            >
              <Text style={styles.toggleText}>🐕 Dog</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleButton, species === 'cat' && styles.toggleButtonActive]}
              onPress={() => setSpecies('cat')}
            >
              <Text style={styles.toggleText}>🐈 Cat</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Breed *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Border Collie"
            value={breed}
            onChangeText={setBreed}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Sex *</Text>
          <View style={styles.toggleGroup}>
            <TouchableOpacity
              style={[styles.toggleButton, sex === 'female' && styles.toggleButtonActive]}
              onPress={() => setSex('female')}
            >
              <Text style={styles.toggleText}>♀️ Female</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleButton, sex === 'male' && styles.toggleButtonActive]}
              onPress={() => setSex('male')}
            >
              <Text style={styles.toggleText}>♂️ Male</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date of Birth</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD (e.g., 2022-03-15)"
            value={dateOfBirth}
            onChangeText={setDateOfBirth}
          />
          <Text style={styles.helperText}>Format: YYYY-MM-DD</Text>
        </View>

        {species === 'dog' && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Size</Text>
            <View style={styles.toggleGroup}>
              <TouchableOpacity
                style={[styles.toggleButton, size === 'small' && styles.toggleButtonActive]}
                onPress={() => setSize('small')}
              >
                <Text style={styles.toggleText}>Small</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleButton, size === 'medium' && styles.toggleButtonActive]}
                onPress={() => setSize('medium')}
              >
                <Text style={styles.toggleText}>Medium</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleButton, size === 'large' && styles.toggleButtonActive]}
                onPress={() => setSize('large')}
              >
                <Text style={styles.toggleText}>Large</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.helperText}>
              Small: &lt;10kg • Medium: 10-25kg • Large: &gt;25kg
            </Text>
          </View>
        )}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Weight (kg)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 25"
            value={weight}
            onChangeText={setWeight}
            keyboardType="decimal-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Health & Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Health clearances, temperament, training, etc."
            value={healthNotes}
            onChangeText={setHealthNotes}
            multiline
            numberOfLines={4}
          />
        </View>

        {sex === 'male' && (
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setIsStudAvailable(!isStudAvailable)}
          >
            <View style={styles.checkbox}>
              {isStudAvailable && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <View style={styles.checkboxLabel}>
              <Text style={styles.checkboxText}>💫 Available for Stud</Text>
              <Text style={styles.checkboxSubtext}>
                Make this male available for breeding in the matches section
              </Text>
            </View>
          </TouchableOpacity>
        )}

        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>💡</Text>
          <Text style={styles.infoText}>
            You can add photos and health records after creating the pet profile.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, saving && styles.submitButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color={colors.background} />
          ) : (
            <Text style={styles.submitButtonText}>Add Pet</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  form: {
    padding: 20,
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: colors.surface,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  helperText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  toggleGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  toggleButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.surface,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  toggleButtonActive: {
    borderColor: colors.secondary,
    backgroundColor: colors.background,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    fontSize: 16,
    color: colors.secondary,
  },
  checkboxLabel: {
    flex: 1,
  },
  checkboxText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  checkboxSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  infoIcon: {
    fontSize: 24,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  submitButton: {
    backgroundColor: colors.secondary,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.background,
  },
});
