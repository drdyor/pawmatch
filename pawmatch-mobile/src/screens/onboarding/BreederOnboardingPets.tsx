import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { colors } from '../../theme/colors';
import { supabase } from '../../services/supabase';

interface PetDraft {
  name: string;
  breed: string;
  dateOfBirth: string;
  sex: 'male' | 'female';
  inHeatNow: boolean;
  enableReminders: boolean;
}

export default function BreederOnboardingPets({ navigation, route }: any) {
  const {
    userName,
    breederType,
    breeds,
    kennelSize,
    experience,
    kennelName,
    intents,
  } = route.params;

  const [pets, setPets] = useState<PetDraft[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [currentPet, setCurrentPet] = useState<PetDraft>({
    name: '',
    breed: breeds[0] || '',
    dateOfBirth: '',
    sex: 'female',
    inHeatNow: false,
    enableReminders: true,
  });
  const [completing, setCompleting] = useState(false);

  const addPet = () => {
    if (!currentPet.name || !currentPet.breed) {
      Alert.alert('Error', 'Please enter pet name and select breed');
      return;
    }

    setPets(prev => [...prev, currentPet]);
    setCurrentPet({
      name: '',
      breed: breeds[0] || '',
      dateOfBirth: '',
      sex: 'female',
      inHeatNow: false,
      enableReminders: true,
    });
    setShowAddForm(false);
  };

  const removePet = (index: number) => {
    setPets(prev => prev.filter((_, i) => i !== index));
  };

  const completeOnboarding = async () => {
    setCompleting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Update user profile
      const { error: userError } = await supabase
        .from('users')
        .update({
          full_name: userName,
          role: breederType === 'registered' ? 'breeder_registered' : 'breeder_independent',
          kennel_name: kennelName,
          country: 'Malta', // Will enhance with country selection
          city: 'Valletta', // Default, can change later
        })
        .eq('id', user.id);

      if (userError) throw userError;

      // Add pets
      for (const pet of pets) {
        const { data: petData, error: petError } = await supabase
          .from('pets')
          .insert({
            owner_id: user.id,
            owner_role: breederType === 'registered' ? 'breeder_registered' : 'breeder_independent',
            name: pet.name,
            species: breeds.some(b => ['Golden Retriever', 'Labrador', 'German Shepherd'].includes(b)) ? 'dog' : 'cat',
            breed: pet.breed,
            sex: pet.sex,
            date_of_birth: pet.dateOfBirth || null,
            status: pet.sex === 'male' ? 'available' : (pet.inHeatNow ? 'in_heat' : 'available'),
            city: 'Valletta',
            country: 'Malta',
          })
          .select()
          .single();

        if (petError) throw petError;

        // If female and in heat, create heat cycle
        if (pet.sex === 'female' && pet.inHeatNow && petData) {
          const today = new Date().toISOString().split('T')[0];
          const fertileStart = new Date();
          fertileStart.setDate(fertileStart.getDate() + 7);
          const fertileEnd = new Date();
          fertileEnd.setDate(fertileEnd.getDate() + 13);

          await supabase.from('heat_cycles').insert({
            pet_id: petData.id,
            start_date: today,
            cycle_day: 1,
            cycle_length: 21,
            fertile_window_start: fertileStart.toISOString().split('T')[0],
            fertile_window_end: fertileEnd.toISOString().split('T')[0],
            notifications_sent: false,
          });
        }
      }

      Alert.alert(
        '🎉 Welcome to PawMatch!',
        'Your breeder profile is complete. Let\'s explore your dashboard!',
        [{ text: 'Get Started', onPress: () => navigation.replace('BreederMain') }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setCompleting(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.progressBar}>
            <View style={[styles.progressDot, styles.progressComplete]} />
            <View style={[styles.progressLine, styles.progressComplete]} />
            <View style={[styles.progressDot, styles.progressComplete]} />
            <View style={[styles.progressLine, styles.progressComplete]} />
            <View style={[styles.progressDot, styles.progressActive]} />
          </View>
          
          <Text style={styles.title}>Add your female(s)</Text>
          <Text style={styles.subtitle}>
            We'll help track their heat cycles automatically. You can add males later for stud listings.
          </Text>
        </View>

        {/* Added Pets List */}
        {pets.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your pets ({pets.length})</Text>
            {pets.map((pet, index) => (
              <View key={index} style={styles.petCard}>
                <View style={styles.petInfo}>
                  <Text style={styles.petName}>
                    {pet.sex === 'female' ? '♀️' : '♂️'} {pet.name}
                  </Text>
                  <Text style={styles.petBreed}>{pet.breed}</Text>
                  {pet.inHeatNow && (
                    <View style={styles.heatBadge}>
                      <Text style={styles.heatText}>🔥 In Heat</Text>
                    </View>
                  )}
                </View>
                <TouchableOpacity onPress={() => removePet(index)}>
                  <Text style={styles.removeText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Add Pet Form */}
        {!showAddForm ? (
          <TouchableOpacity
            style={styles.addPetButton}
            onPress={() => setShowAddForm(true)}
          >
            <Text style={styles.addPetText}>+ Add Female Pet</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.addPetForm}>
            <Text style={styles.formTitle}>Add a female pet</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Luna"
                value={currentPet.name}
                onChangeText={name => setCurrentPet(p => ({ ...p, name }))}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Breed *</Text>
              <View style={styles.pillGroup}>
                {breeds.map((breed: string) => (
                  <TouchableOpacity
                    key={breed}
                    style={[
                      styles.pill,
                      currentPet.breed === breed && styles.pillSelected,
                    ]}
                    onPress={() => setCurrentPet(p => ({ ...p, breed }))}
                  >
                    <Text
                      style={[
                        styles.pillText,
                        currentPet.breed === breed && styles.pillTextSelected,
                      ]}
                    >
                      {breed}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Date of Birth (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                value={currentPet.dateOfBirth}
                onChangeText={dob => setCurrentPet(p => ({ ...p, dateOfBirth: dob }))}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Sex</Text>
              <View style={styles.pillGroup}>
                <TouchableOpacity
                  style={[
                    styles.pill,
                    currentPet.sex === 'female' && styles.pillSelected,
                  ]}
                  onPress={() => setCurrentPet(p => ({ ...p, sex: 'female' }))}
                >
                  <Text style={styles.pillText}>♀️ Female</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.pill,
                    currentPet.sex === 'male' && styles.pillSelected,
                  ]}
                  onPress={() => setCurrentPet(p => ({ ...p, sex: 'male' }))}
                >
                  <Text style={styles.pillText}>♂️ Male</Text>
                </TouchableOpacity>
              </View>
            </View>

            {currentPet.sex === 'female' && (
              <>
                <TouchableOpacity
                  style={styles.toggleRow}
                  onPress={() => setCurrentPet(p => ({ ...p, inHeatNow: !p.inHeatNow }))}
                >
                  <View style={styles.checkbox}>
                    {currentPet.inHeatNow && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <Text style={styles.toggleText}>🩸 In heat right now?</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.toggleRow}
                  onPress={() =>
                    setCurrentPet(p => ({ ...p, enableReminders: !p.enableReminders }))
                  }
                >
                  <View style={styles.checkbox}>
                    {currentPet.enableReminders && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <Text style={styles.toggleText}>🔔 Enable heat cycle reminders</Text>
                </TouchableOpacity>
              </>
            )}

            <View style={styles.formActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowAddForm(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={addPet}>
                <Text style={styles.saveText}>Add Pet</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Skip Option */}
        {pets.length === 0 && !showAddForm && (
          <TouchableOpacity onPress={completeOnboarding}>
            <Text style={styles.skipText}>Skip for now → I'll add pets later</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Bottom Actions */}
      {pets.length > 0 && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.finishButton, completing && styles.finishButtonDisabled]}
            onPress={completeOnboarding}
            disabled={completing}
          >
            <Text style={styles.finishButtonText}>
              {completing ? 'Setting up...' : '✨ Complete Setup'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 32,
  },
  progressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E5E7EB',
  },
  progressActive: {
    backgroundColor: colors.primary,
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  progressComplete: {
    backgroundColor: colors.success,
  },
  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2F3A4A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2F3A4A',
    marginBottom: 12,
  },
  petCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  petInfo: {
    flex: 1,
  },
  petName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2F3A4A',
    marginBottom: 4,
  },
  petBreed: {
    fontSize: 14,
    color: '#6B7280',
  },
  heatBadge: {
    backgroundColor: colors.warning,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  heatText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.background,
  },
  removeText: {
    fontSize: 24,
    color: '#6B7280',
    padding: 8,
  },
  addPetButton: {
    backgroundColor: colors.background,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.secondary,
    borderStyle: 'dashed',
  },
  addPetText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.secondary,
  },
  addPetForm: {
    backgroundColor: colors.background,
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2F3A4A',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2F3A4A',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#FFF8F0',
  },
  pillGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#FFF8F0',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  pillSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  pillText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  pillTextSelected: {
    color: '#000',
    fontWeight: '600',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
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
  toggleText: {
    fontSize: 16,
    color: '#2F3A4A',
  },
  formActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#FFF8F0',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  saveButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: colors.secondary,
    alignItems: 'center',
  },
  saveText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.background,
  },
  skipText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 20,
    textDecorationLine: 'underline',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 20,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFF8F0',
    gap: 12,
  },
  backButton: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2F3A4A',
  },
  finishButton: {
    flex: 1,
    backgroundColor: colors.success,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  finishButtonDisabled: {
    opacity: 0.6,
  },
  finishButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.background,
  },
});
