// Enhanced Shelter Pet Upload with Click-Through Selections
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../../theme/colors';
import { supabase } from '../../services/supabase';
import BreedSelector from '../../components/BreedSelector';

// Click-through selection options
const TEMPERAMENT_OPTIONS = [
  'Friendly',
  'Calm',
  'Energetic',
  'Playful',
  'Gentle',
  'Confident',
  'Shy',
  'Independent',
  'Affectionate',
  'Good with kids',
  'Good with dogs',
  'Good with cats',
  'Dog-park pro',
  'Needs training',
  'Well-trained',
];

const PERSONALITY_TRAITS = [
  'Loves attention',
  'Lap pet',
  'Active',
  'Low maintenance',
  'High energy',
  'Chill',
  'Vocal',
  'Quiet',
];

const URGENCY_REASONS = [
  'Behavioral issues',
  'Medical condition',
  'Long stay (30+ days)',
  'Shelter at capacity',
  'Euthanasia scheduled',
  'Special needs',
];

export default function ShelterAddPetScreen({ navigation }: any) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Basic Info
  const [name, setName] = useState('');
  const [species, setSpecies] = useState<'dog' | 'cat' | null>(null);
  const [breed, setBreed] = useState<string | null>(null);
  const [sex, setSex] = useState<'male' | 'female'>('male');
  const [estimatedAge, setEstimatedAge] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  
  // Temperament & Personality (Click-through)
  const [selectedTemperament, setSelectedTemperament] = useState<string[]>([]);
  const [selectedPersonality, setSelectedPersonality] = useState<string[]>([]);
  const [safeForChildren, setSafeForChildren] = useState<boolean | null>(null);
  
  // Urgency
  const [isUrgent, setIsUrgent] = useState(false);
  const [urgencyReason, setUrgencyReason] = useState<string[]>([]);
  const [euthanasiaDate, setEuthanasiaDate] = useState('');
  
  // Notes
  const [description, setDescription] = useState('');
  const [intakeReason, setIntakeReason] = useState('');

  const toggleSelection = (array: string[], setArray: (val: string[]) => void, item: string) => {
    if (array.includes(item)) {
      setArray(array.filter(i => i !== item));
    } else {
      setArray([...array, item]);
    }
  };

  const handleSave = async () => {
    if (!name || !species || !breed) {
      Alert.alert('Missing Info', 'Please fill in name, species, and breed');
      return;
    }
    
    if (safeForChildren === null) {
      Alert.alert(
        'Important: Child Safety',
        'Please specify if this animal is safe for small children. This information is critical for adoptive families.',
        [{ text: 'OK' }]
      );
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: userData } = await supabase
        .from('users')
        .select('city, country')
        .eq('id', user.id)
        .single();

      // Estimate date of birth
      let dateOfBirth = null;
      if (estimatedAge) {
        const today = new Date();
        const months = parseInt(estimatedAge);
        if (!isNaN(months)) {
          const birth = new Date(today);
          birth.setMonth(today.getMonth() - months);
          dateOfBirth = birth.toISOString().split('T')[0];
        }
      }

      // Determine status
      let status: 'available' | 'at_risk' = 'available';
      if (isUrgent || urgencyReason.length > 0 || euthanasiaDate) {
        status = 'at_risk';
      }

      const petData: any = {
        owner_id: user.id,
        owner_role: 'shelter',
        name,
        species,
        breed,
        sex,
        date_of_birth: dateOfBirth,
        city: userData?.city || 'Malta',
        country: userData?.country || 'Malta',
        status,
        photos,
        description: `${description}\n\nTemperament: ${selectedTemperament.join(', ')}\nPersonality: ${selectedPersonality.join(', ')}\nIntake reason: ${intakeReason}`,
        health_records: [],
        // Save child safety as metadata for easy filtering
        metadata: {
          safeForChildren: safeForChildren, // true, false, or null
          temperament: selectedTemperament,
          personality: selectedPersonality,
          ...(isUrgent ? {
            urgent: true,
            urgencyReasons: urgencyReason,
            euthanasiaDate: euthanasiaDate || null,
          } : {}),
        },
      };

      // Add urgency metadata
      if (isUrgent) {
        petData.metadata = {
          urgent: true,
          urgencyReasons: urgencyReason,
          euthanasiaDate: euthanasiaDate || null,
        };
      }

      const { error } = await supabase.from('pets').insert(petData);
      if (error) throw error;

      // Create urgent notification if needed
      if (status === 'at_risk') {
        await supabase.from('notifications').insert({
          user_id: user.id,
          type: 'shelter_urgent',
          title: '🚨 Urgent: At-Risk Animal Added',
          body: `${name} needs immediate foster/adoption`,
          read: false,
        });
      }

      Alert.alert('Success', 'Animal added successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <View>
      <Text style={styles.stepTitle}>Basic Information</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Pet Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Max, Luna"
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

      {species && (
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Breed *</Text>
          <BreedSelector
            species={species}
            selectedBreed={breed}
            onSelect={setBreed}
            placeholder="Select or search breed"
          />
        </View>
      )}

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Sex</Text>
        <View style={styles.toggleGroup}>
          <TouchableOpacity
            style={[styles.toggleButton, sex === 'male' && styles.toggleButtonActive]}
            onPress={() => setSex('male')}
          >
            <Text style={styles.toggleText}>♂️ Male</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, sex === 'female' && styles.toggleButtonActive]}
            onPress={() => setSex('female')}
          >
            <Text style={styles.toggleText}>♀️ Female</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Estimated Age (months)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 24"
          value={estimatedAge}
          onChangeText={setEstimatedAge}
          keyboardType="numeric"
        />
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View>
      <Text style={styles.stepTitle}>Temperament & Personality</Text>
      <Text style={styles.stepSubtitle}>Tap to select - can choose multiple</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Temperament</Text>
        <View style={styles.chipGrid}>
          {TEMPERAMENT_OPTIONS.map((trait) => (
            <TouchableOpacity
              key={trait}
              style={[
                styles.chip,
                selectedTemperament.includes(trait) && styles.chipSelected,
              ]}
              onPress={() => toggleSelection(selectedTemperament, setSelectedTemperament, trait)}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedTemperament.includes(trait) && styles.chipTextSelected,
                ]}
              >
                {trait}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Personality Traits</Text>
        <View style={styles.chipGrid}>
          {PERSONALITY_TRAITS.map((trait) => (
            <TouchableOpacity
              key={trait}
              style={[
                styles.chip,
                selectedPersonality.includes(trait) && styles.chipSelected,
              ]}
              onPress={() => toggleSelection(selectedPersonality, setSelectedPersonality, trait)}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedPersonality.includes(trait) && styles.chipTextSelected,
                ]}
              >
                {trait}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Small Child Friendly - HIGHLIGHTED */}
      <View style={[styles.inputGroup, styles.importantSection]}>
        <View style={styles.importantHeader}>
          <Text style={styles.importantLabel}>🛡️ Safe for Small Children? *</Text>
          <View style={styles.requiredBadge}>
            <Text style={styles.requiredText}>REQUIRED</Text>
          </View>
        </View>
        <Text style={styles.importantSubtext}>
          This is critical information for families considering adoption
        </Text>
        <View style={styles.toggleGroup}>
          <TouchableOpacity
            style={[
              styles.toggleButtonLarge,
              safeForChildren === true && styles.toggleButtonActiveGreen,
            ]}
            onPress={() => setSafeForChildren(true)}
          >
            <Text style={[styles.toggleText, safeForChildren === true && styles.toggleTextActive]}>
              ✅ Yes - Safe
            </Text>
            <Text style={styles.toggleSubtext}>Tested with children</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButtonLarge,
              safeForChildren === false && styles.toggleButtonActiveRed,
            ]}
            onPress={() => setSafeForChildren(false)}
          >
            <Text style={[styles.toggleText, safeForChildren === false && styles.toggleTextActive]}>
              ❌ No - Not Safe
            </Text>
            <Text style={styles.toggleSubtext}>May not be suitable</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButtonLarge,
              safeForChildren === null && styles.toggleButtonActiveNeutral,
            ]}
            onPress={() => setSafeForChildren(null)}
          >
            <Text style={[styles.toggleText, safeForChildren === null && styles.toggleTextActive]}>
              ❓ Unknown
            </Text>
            <Text style={styles.toggleSubtext}>Not yet tested</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View>
      <Text style={styles.stepTitle}>Urgency Status</Text>
      
      <TouchableOpacity
        style={[styles.checkboxContainer, isUrgent && styles.checkboxContainerSelected]}
        onPress={() => setIsUrgent(!isUrgent)}
      >
        <View style={styles.checkbox}>
          {isUrgent && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <View style={styles.checkboxLabel}>
          <Text style={styles.checkboxText}>🚨 Urgent - Euthanasia Risk</Text>
          <Text style={styles.checkboxSubtext}>
            Mark if this animal needs immediate foster/adoption
          </Text>
        </View>
      </TouchableOpacity>

      {isUrgent && (
        <>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Why is this urgent? (Select all that apply)</Text>
            <View style={styles.chipGrid}>
              {URGENCY_REASONS.map((reason) => (
                <TouchableOpacity
                  key={reason}
                  style={[
                    styles.chip,
                    urgencyReason.includes(reason) && styles.chipSelected,
                  ]}
                  onPress={() => toggleSelection(urgencyReason, setUrgencyReason, reason)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      urgencyReason.includes(reason) && styles.chipTextSelected,
                    ]}
                  >
                    {reason}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Euthanasia Date (if scheduled)</Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              value={euthanasiaDate}
              onChangeText={setEuthanasiaDate}
            />
          </View>
        </>
      )}

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Intake Reason / Background</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Why was this animal brought to the shelter?"
          value={intakeReason}
          onChangeText={setIntakeReason}
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Additional Notes</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Any other important information..."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Add Animal</Text>
        <Text style={styles.subtitle}>Step {step} of 3</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </ScrollView>

      <View style={styles.footer}>
        {step > 1 && (
          <TouchableOpacity
            style={styles.backFooterButton}
            onPress={() => setStep(step - 1)}
          >
            <Text style={styles.backFooterButtonText}>← Previous</Text>
          </TouchableOpacity>
        )}
        
        {step < 3 ? (
          <TouchableOpacity
            style={[
              styles.nextButton, 
              (!name || !species || !breed || (step === 2 && safeForChildren === null)) && styles.nextButtonDisabled
            ]}
            onPress={() => {
              if (step === 2 && safeForChildren === null) {
                Alert.alert(
                  'Required Information',
                  'Please specify if this animal is safe for small children before continuing. This is critical for families.',
                  [{ text: 'OK' }]
                );
                return;
              }
              setStep(step + 1);
            }}
            disabled={!name || !species || !breed || (step === 2 && safeForChildren === null)}
          >
            <Text style={styles.nextButtonText}>
              {step === 2 && safeForChildren === null ? '⚠️ Set Child Safety' : 'Next →'}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.saveButton, loading && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.background} />
            ) : (
              <Text style={styles.saveButtonText}>Save Animal</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
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
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    fontSize: 16,
    color: colors.secondary,
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  importantSection: {
    backgroundColor: '#F0FDF4',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.success,
    marginBottom: 24,
  },
  importantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  importantLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },
  requiredBadge: {
    backgroundColor: colors.danger,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  requiredText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.background,
    letterSpacing: 0.5,
  },
  importantSubtext: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
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
  toggleGroup: {
    flexDirection: 'row',
    gap: 12,
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
  toggleButtonLarge: {
    flex: 1,
    padding: 18,
    borderRadius: 12,
    backgroundColor: colors.surface,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.border,
    marginBottom: 8,
  },
  toggleButtonActive: {
    borderColor: colors.success,
    backgroundColor: colors.background,
  },
  toggleButtonActiveGreen: {
    borderColor: colors.success,
    backgroundColor: '#F0FDF4',
    borderWidth: 3,
  },
  toggleButtonActiveRed: {
    borderColor: colors.danger,
    backgroundColor: '#FEF2F2',
    borderWidth: 3,
  },
  toggleButtonActiveNeutral: {
    borderColor: colors.warning,
    backgroundColor: '#FFFBEB',
    borderWidth: 3,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  toggleTextActive: {
    color: colors.text,
    fontWeight: '700',
  },
  toggleSubtext: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  chipTextSelected: {
    color: colors.text,
    fontWeight: '600',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
  },
  checkboxContainerSelected: {
    borderColor: colors.danger,
    backgroundColor: '#FFF5F5',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    fontSize: 16,
    color: colors.danger,
    fontWeight: '700',
  },
  checkboxLabel: {
    flex: 1,
  },
  checkboxText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  checkboxSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 12,
  },
  backFooterButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.surface,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  backFooterButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  nextButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.secondary,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.background,
  },
  saveButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.success,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonWarning: {
    backgroundColor: colors.warning,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.background,
  },
});
