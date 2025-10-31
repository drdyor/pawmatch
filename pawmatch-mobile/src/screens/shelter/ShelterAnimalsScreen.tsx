import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Modal,
} from 'react-native';
import { colors } from '../../theme/colors';
import { supabase } from '../../services/supabase';
import { Pet } from '../../types';

export default function ShelterAnimalsScreen({ navigation }: any) {
  const [animals, setAnimals] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showIntakeModal, setShowIntakeModal] = useState(false);

  useEffect(() => {
    loadAnimals();
  }, []);

  const loadAnimals = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnimals(data || []);
    } catch (error) {
      console.error('Error loading animals:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadAnimals();
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.success} />
        <Text style={styles.loadingText}>Loading animals...</Text>
      </View>
    );
  }

  const atRiskAnimals = animals.filter(a => a.status === 'at_risk');
  const availableAnimals = animals.filter(a => a.status !== 'at_risk' && a.status !== 'adopted');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Animals</Text>
          <Text style={styles.subtitle}>{animals.length} in care</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('ShelterAddPet')}
        >
          <Text style={styles.addButtonText}>+ Intake</Text>
        </TouchableOpacity>
      </View>

      {/* Urgent alerts banner */}
      {atRiskAnimals.length > 0 && (
        <TouchableOpacity
          style={styles.urgentBanner}
          onPress={() => navigation.navigate('UrgentAlerts')}
        >
          <Text style={styles.urgentIcon}>🚨</Text>
          <View style={styles.urgentContent}>
            <Text style={styles.urgentTitle}>{atRiskAnimals.length} Urgent Alert{atRiskAnimals.length > 1 ? 's' : ''}</Text>
            <Text style={styles.urgentText}>Tap to send foster/adoption alerts</Text>
          </View>
        </TouchableOpacity>
      )}

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.success} />
        }
      >
        {animals.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🐾</Text>
            <Text style={styles.emptyTitle}>No animals yet</Text>
            <Text style={styles.emptyText}>
              Add your first animal intake to get started
            </Text>
          </View>
        ) : (
          <View style={styles.animalsGrid}>
            {animals.map((animal) => (
              <AnimalCard
                key={animal.id}
                animal={animal}
                onPress={() => navigation.navigate('PetDetail', { petId: animal.id })}
              />
            ))}
          </View>
        )}
      </ScrollView>

      <IntakeModal
        visible={showIntakeModal}
        onClose={() => setShowIntakeModal(false)}
        onSuccess={() => {
          setShowIntakeModal(false);
          loadAnimals();
        }}
      />
    </View>
  );
}

function AnimalCard({ animal, onPress }: { animal: Pet; onPress: () => void }) {
  const getAge = () => {
    if (!animal.dateOfBirth) return 'Unknown age';
    const today = new Date();
    const birthDate = new Date(animal.dateOfBirth);
    const months = Math.floor((today.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
    
    if (months < 12) return `${months} month${months !== 1 ? 's' : ''}`;
    const years = Math.floor(months / 12);
    return `${years} year${years !== 1 ? 's' : ''}`;
  };

  const getTimeInShelter = () => {
    const today = new Date();
    const intake = new Date(animal.createdAt);
    const days = Math.floor((today.getTime() - intake.getTime()) / (1000 * 60 * 60 * 24));
    return `${days} day${days !== 1 ? 's' : ''} in shelter`;
  };

  return (
    <TouchableOpacity style={styles.animalCard} onPress={onPress}>
      {animal.status === 'at_risk' && (
        <View style={styles.atRiskBadge}>
          <Text style={styles.atRiskText}>🚨 At Risk</Text>
        </View>
      )}

      <View style={styles.animalIcon}>
        <Text style={styles.animalEmoji}>
          {animal.species === 'dog' ? '🐕' : animal.species === 'cat' ? '🐈' : '🐾'}
        </Text>
      </View>

      <View style={styles.animalInfo}>
        <Text style={styles.animalName}>{animal.name}</Text>
        <Text style={styles.animalBreed}>
          {animal.breed} • {animal.sex === 'male' ? '♂️' : '♀️'}
        </Text>
        <Text style={styles.animalAge}>{getAge()}</Text>
        <Text style={styles.animalTime}>{getTimeInShelter()}</Text>
      </View>

      {animal.status === 'available' && (
        <View style={styles.statusDot} />
      )}
    </TouchableOpacity>
  );
}

function IntakeModal({ visible, onClose, onSuccess }: any) {
  const [name, setName] = useState('');
  const [species, setSpecies] = useState<'dog' | 'cat'>('dog');
  const [breed, setBreed] = useState('');
  const [sex, setSex] = useState<'male' | 'female'>('male');
  const [estimatedAge, setEstimatedAge] = useState('');
  const [intakeReason, setIntakeReason] = useState('');
  const [atRisk, setAtRisk] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name || !breed) {
      Alert.alert('Error', 'Please fill in name and breed');
      return;
    }

    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: userData } = await supabase
        .from('users')
        .select('city, country')
        .eq('id', user.id)
        .single();

      // Estimate date of birth from age
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

      const { error } = await supabase.from('pets').insert({
        owner_id: user.id,
        owner_role: 'shelter',
        name,
        species,
        breed,
        sex,
        date_of_birth: dateOfBirth,
        city: userData?.city || 'Malta',
        country: userData?.country || 'Malta',
        status: atRisk ? 'at_risk' : 'available',
        description: intakeReason,
        photos: [],
      });

      if (error) throw error;

      // If at risk, create notification
      if (atRisk) {
        await supabase.from('notifications').insert({
          user_id: user.id,
          type: 'shelter_urgent',
          title: '🚨 At-Risk Animal Added',
          body: `${name} is at risk. Consider sending urgent alerts.`,
          read: false,
        });
      }

      Alert.alert('Success', 'Animal added to shelter');
      onSuccess();
      resetForm();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setName('');
    setBreed('');
    setEstimatedAge('');
    setIntakeReason('');
    setAtRisk(false);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Animal Intake</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.modalClose}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalForm}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Max"
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
                placeholder="e.g., Mixed, Labrador"
                value={breed}
                onChangeText={setBreed}
              />
            </View>

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

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Intake Reason / Notes</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Why was this animal brought to the shelter?"
                value={intakeReason}
                onChangeText={setIntakeReason}
                multiline
                numberOfLines={3}
              />
            </View>

            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setAtRisk(!atRisk)}
            >
              <View style={styles.checkbox}>
                {atRisk && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <View style={styles.checkboxLabel}>
                <Text style={styles.checkboxText}>🚨 At Risk (Euthanasia within 72 hours)</Text>
                <Text style={styles.checkboxSubtext}>
                  Mark urgent if this animal needs immediate foster/adoption
                </Text>
              </View>
            </TouchableOpacity>
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.modalButton, styles.saveButton, saving && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color={colors.background} />
              ) : (
                <Text style={styles.saveButtonText}>Add Animal</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.textSecondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  addButton: {
    backgroundColor: colors.success,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.background,
  },
  urgentBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.danger,
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  urgentIcon: {
    fontSize: 32,
  },
  urgentContent: {
    flex: 1,
  },
  urgentTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.background,
    marginBottom: 2,
  },
  urgentText: {
    fontSize: 14,
    color: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  animalsGrid: {
    padding: 20,
    paddingTop: 0,
    gap: 12,
  },
  animalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    position: 'relative',
  },
  atRiskBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.danger,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  atRiskText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.background,
  },
  animalIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  animalEmoji: {
    fontSize: 32,
  },
  animalInfo: {
    flex: 1,
  },
  animalName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  animalBreed: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  animalAge: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  animalTime: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.success,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
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
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  modalClose: {
    fontSize: 28,
    color: colors.textSecondary,
  },
  modalForm: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
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
    minHeight: 80,
    textAlignVertical: 'top',
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
    borderColor: colors.success,
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
    marginTop: 8,
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
  modalActions: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  modalButton: {
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: colors.success,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.background,
  },
});
