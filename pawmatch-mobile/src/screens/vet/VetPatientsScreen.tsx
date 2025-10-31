// Vet Patients Screen - Only shows pets that vet has met in person
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
} from 'react-native';
import { colors } from '../../theme/colors';
import { supabase } from '../../services/supabase';

interface VetPatient {
  id: string;
  pet_id: string;
  pet_name: string;
  owner_name: string;
  breed: string;
  species: string;
  last_visit?: string;
  relationship_type: 'in_person' | 'verified';
  can_issue_certificate: boolean;
}

export default function VetPatientsScreen({ navigation }: any) {
  const [patients, setPatients] = useState<VetPatient[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Load vet-patient relationships (only in-person ones)
      const { data, error } = await supabase
        .from('vet_patients')
        .select(`
          id,
          pet_id,
          relationship_type,
          can_issue_certificate,
          created_at,
          pet:pets!vet_patients_pet_id_fkey(
            id,
            name,
            breed,
            species,
            owner_id,
            owner:users!pets_owner_id_fkey(full_name)
          )
        `)
        .eq('vet_id', user.id)
        .eq('relationship_type', 'in_person')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const patientsList: VetPatient[] = (data || []).map((vp: any) => ({
        id: vp.id,
        pet_id: vp.pet_id,
        pet_name: vp.pet?.name || 'Unknown',
        owner_name: vp.pet?.owner?.full_name || 'Unknown',
        breed: vp.pet?.breed || 'Unknown',
        species: vp.pet?.species || 'dog',
        last_visit: vp.created_at,
        relationship_type: vp.relationship_type,
        can_issue_certificate: vp.can_issue_certificate || false,
      }));

      setPatients(patientsList);
    } catch (error) {
      console.error('Error loading patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const addPatient = async (petId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Check if pet exists and get owner location
      const { data: petData, error: petError } = await supabase
        .from('pets')
        .select('owner_id, city, owner:users!pets_owner_id_fkey(city)')
        .eq('id', petId)
        .single();

      if (petError) throw petError;

      // Get vet location
      const { data: vetData, error: vetError } = await supabase
        .from('users')
        .select('city')
        .eq('id', user.id)
        .single();

      if (vetError) throw vetError;

      // Only allow if same city (local vet requirement)
      if (petData.city !== vetData.city && petData.owner?.city !== vetData.city) {
        Alert.alert(
          'Not Local',
          'You can only add patients from your city. Please verify the pet owner is local to your clinic.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Create in-person relationship
      const { error: insertError } = await supabase.from('vet_patients').insert({
        vet_id: user.id,
        pet_id: petId,
        relationship_type: 'in_person',
        can_issue_certificate: true,
        verified_at: new Date().toISOString(),
      });

      if (insertError) throw insertError;

      Alert.alert('Success', 'Patient added! You can now issue health certificates for this pet.');
      setShowAddModal(false);
      loadPatients();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const issueCertificate = async (patient: VetPatient) => {
    if (!patient.can_issue_certificate) {
      Alert.alert(
        'Not Eligible',
        'This pet does not have an in-person relationship. Only local vets can issue certificates.'
      );
      return;
    }

    Alert.alert(
      'Issue Certificate',
      `Would you like to issue a health certificate for ${patient.pet_name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Issue Certificate',
          onPress: () => {
            // Navigate to certificate issuance screen (to be implemented)
            navigation.navigate('IssueCertificate', { petId: patient.pet_id });
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.secondary} />
        <Text style={styles.loadingText}>Loading patients...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>My Patients</Text>
          <Text style={styles.subtitle}>
            Only pets you've met in person (local only)
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {patients.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🩺</Text>
          <Text style={styles.emptyTitle}>No patients yet</Text>
          <Text style={styles.emptyText}>
            Add pets you've examined in person to issue health certificates
          </Text>
          <Text style={styles.emptyNote}>
            💡 Only local pets (same city) can be added
          </Text>
        </View>
      ) : (
        <ScrollView style={styles.scroll}>
          {patients.map((patient) => (
            <TouchableOpacity
              key={patient.id}
              style={styles.patientCard}
              onPress={() => issueCertificate(patient)}
            >
              <View style={styles.patientHeader}>
                <View>
                  <Text style={styles.patientName}>{patient.pet_name}</Text>
                  <Text style={styles.patientOwner}>
                    Owner: {patient.owner_name}
                  </Text>
                  <Text style={styles.patientBreed}>
                    {patient.breed} • {patient.species}
                  </Text>
                </View>
                <View style={styles.certBadge}>
                  <Text style={styles.certBadgeText}>✓ Can Issue</Text>
                </View>
              </View>
              
              {patient.last_visit && (
                <Text style={styles.lastVisit}>
                  Last visit: {new Date(patient.last_visit).toLocaleDateString()}
                </Text>
              )}

              <TouchableOpacity
                style={styles.certificateButton}
                onPress={() => issueCertificate(patient)}
              >
                <Text style={styles.certificateButtonText}>
                  📄 Issue Health Certificate
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <AddPatientModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={addPatient}
      />
    </View>
  );
}

function AddPatientModal({ visible, onClose, onAdd }: any) {
  const [petId, setPetId] = useState('');
  const [searching, setSearching] = useState(false);

  const handleAdd = async () => {
    if (!petId.trim()) {
      Alert.alert('Error', 'Please enter a pet ID or name');
      return;
    }

    setSearching(true);
    try {
      // Search for pet by ID or name
      const { data, error } = await supabase
        .from('pets')
        .select('id, name')
        .or(`id.eq.${petId},name.ilike.%${petId}%`)
        .limit(1)
        .single();

      if (error) throw error;

      if (data) {
        await onAdd(data.id);
      }
    } catch (error: any) {
      Alert.alert('Error', 'Pet not found. Please verify the ID or name.');
    } finally {
      setSearching(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Patient</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.modalClose}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalBody}>
            <Text style={styles.modalText}>
              Add a pet you've examined in person. Only pets from your city can be added.
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Pet ID or Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter pet ID or search by name"
                value={petId}
                onChangeText={setPetId}
              />
            </View>

            <Text style={styles.modalNote}>
              💡 The pet owner must be from your city. This ensures you've actually met the pet in person.
            </Text>
          </View>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.addModalButton, searching && styles.buttonDisabled]}
              onPress={handleAdd}
              disabled={searching}
            >
              {searching ? (
                <ActivityIndicator color={colors.background} />
              ) : (
                <Text style={styles.addModalButtonText}>Add Patient</Text>
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
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
  addButton: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.background,
  },
  scroll: {
    flex: 1,
    padding: 20,
  },
  patientCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  patientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  patientName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  patientOwner: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  patientBreed: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  certBadge: {
    backgroundColor: colors.success,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    height: 'fit-content',
  },
  certBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.background,
  },
  lastVisit: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 8,
    marginBottom: 12,
  },
  certificateButton: {
    backgroundColor: colors.secondary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  certificateButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.background,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
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
    marginBottom: 8,
  },
  emptyNote: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
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
    justifyContent: 'space-between',
    alignItems: 'center',
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
  modalBody: {
    padding: 20,
  },
  modalText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 20,
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: 16,
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
  modalNote: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginTop: 8,
  },
  modalActions: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  addModalButton: {
    backgroundColor: colors.secondary,
  },
  addModalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.background,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
