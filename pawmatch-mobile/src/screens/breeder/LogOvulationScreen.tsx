import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { format, addDays } from 'date-fns';
import { Pet, HeatCycle } from '../../types';
import { supabase } from '../../services/supabase';
import { useNavigation } from '@react-navigation/native';
import { BreedHeatInfo } from '../../components/BreedHeatInfo';

interface LogOvulationScreenProps {
  route?: {
    params?: {
      petId?: string;
    };
  };
}

export const LogOvulationScreen: React.FC<LogOvulationScreenProps> = ({ route }) => {
  const navigation = useNavigation();
  const [femalePets, setFemalePets] = useState<Pet[]>([]);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [heatStartDate, setHeatStartDate] = useState<string>('');
  const [estimatedOvulationDate, setEstimatedOvulationDate] = useState<string>('');
  const [fertileWindowStart, setFertileWindowStart] = useState<string>('');
  const [fertileWindowEnd, setFertileWindowEnd] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFemalePets();
    if (route?.params?.petId) {
      // Pre-select pet if coming from pet details
      setTimeout(() => {
        const pet = femalePets.find(p => p.id === route.params?.petId);
        if (pet) setSelectedPet(pet);
      }, 500);
    }
  }, []);

  const loadFemalePets = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .eq('owner_user_id', user.id)
        .eq('sex', 'female')
        .eq('species', 'dog')
        .order('name');

      if (error) throw error;
      setFemalePets(data || []);
    } catch (error) {
      console.error('Error loading female pets:', error);
      Alert.alert('Error', 'Failed to load your female dogs');
    }
  };

  const calculateFertileWindow = (heatStart: string) => {
    // Typical dog heat cycle: fertile window starts 7-10 days after heat starts
    // and lasts 4-7 days
    const startDate = new Date(heatStart);
    const fertileStart = addDays(startDate, 9); // Day 9-10 after heat start
    const fertileEnd = addDays(startDate, 16); // Fertile for about 7 days

    setFertileWindowStart(format(fertileStart, 'yyyy-MM-dd'));
    setFertileWindowEnd(format(fertileEnd, 'yyyy-MM-dd'));

    // Estimated ovulation is usually around the middle of fertile window
    const ovulationDate = addDays(fertileStart, 3);
    setEstimatedOvulationDate(format(ovulationDate, 'yyyy-MM-dd'));
  };

  const handleHeatStartSelect = (day: DateData) => {
    setHeatStartDate(day.dateString);
    calculateFertileWindow(day.dateString);
  };

  const saveHeatCycle = async () => {
    if (!selectedPet || !heatStartDate) {
      Alert.alert('Error', 'Please select a dog and heat start date');
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const heatCycleData = {
        pet_id: selectedPet.id,
        heat_start_date: heatStartDate,
        estimated_ovulation: estimatedOvulationDate || null,
        fertile_window_start: fertileWindowStart || null,
        fertile_window_end: fertileWindowEnd || null,
        notes: notes || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('heat_cycles')
        .insert([heatCycleData]);

      if (error) throw error;

      Alert.alert(
        'Success',
        `Heat cycle logged for ${selectedPet.name}! Fertile window: ${format(new Date(fertileWindowStart), 'MMM dd')} - ${format(new Date(fertileWindowEnd), 'MMM dd')}`,
        [
          {
            text: 'View Calendar',
            onPress: () => navigation.navigate('HeatTracking' as never),
          },
          { text: 'OK' }
        ]
      );

      // Reset form
      setSelectedPet(null);
      setHeatStartDate('');
      setEstimatedOvulationDate('');
      setFertileWindowStart('');
      setFertileWindowEnd('');
      setNotes('');

    } catch (error) {
      console.error('Error saving heat cycle:', error);
      Alert.alert('Error', 'Failed to save heat cycle data');
    } finally {
      setLoading(false);
    }
  };

  const markedDates = heatStartDate ? {
    [heatStartDate]: {
      selected: true,
      selectedColor: '#FF1493',
      selectedTextColor: '#ffffff'
    }
  } : {};

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Log Ovulation</Text>
        <Text style={styles.subtitle}>
          Track your female dogs' heat cycles and fertile windows
        </Text>
      </View>

      {/* Pet Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Dog</Text>
        <TouchableOpacity
          style={styles.petSelector}
          onPress={() => setIsModalVisible(true)}
        >
          <Text style={selectedPet ? styles.petSelected : styles.petPlaceholder}>
            {selectedPet ? `${selectedPet.name} (${selectedPet.breed})` : 'Choose a female dog...'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Calendar for Heat Start Date */}
      {selectedPet && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>When did the heat cycle start?</Text>
          <Text style={styles.sectionSubtitle}>
            Select the first day you noticed bleeding or swelling
          </Text>
          <Calendar
            onDayPress={handleHeatStartSelect}
            markedDates={markedDates}
            theme={{
              selectedDayBackgroundColor: '#FF1493',
              selectedDayTextColor: '#ffffff',
              todayTextColor: '#FF1493',
              arrowColor: '#FF1493',
              monthTextColor: '#FF1493',
            }}
          />
        </View>
      )}

      {/* Fertile Window Display */}
      {heatStartDate && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Calculated Fertile Window</Text>
          <View style={styles.fertileInfo}>
            <View style={styles.fertileItem}>
              <Text style={styles.fertileLabel}>Fertile Window:</Text>
              <Text style={styles.fertileValue}>
                {format(new Date(fertileWindowStart), 'MMM dd')} - {format(new Date(fertileWindowEnd), 'MMM dd, yyyy')}
              </Text>
            </View>
            <View style={styles.fertileItem}>
              <Text style={styles.fertileLabel}>Estimated Ovulation:</Text>
              <Text style={styles.fertileValue}>
                {format(new Date(estimatedOvulationDate), 'MMM dd, yyyy')}
              </Text>
            </View>
          </View>
          <Text style={styles.disclaimer}>
            These are estimates based on typical dog cycles. Consult your vet for accurate timing.
          </Text>
        </View>
      )}

      {/* Breed Information */}
      {selectedPet && (
        <BreedHeatInfo breed={selectedPet.breed} />
      )}

      {/* Notes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notes (Optional)</Text>
        <TextInput
          style={styles.notesInput}
          value={notes}
          onChangeText={setNotes}
          placeholder="Any observations about this heat cycle..."
          multiline
          numberOfLines={3}
        />
      </View>

      {/* Save Button */}
      <TouchableOpacity
        style={[styles.saveButton, (!selectedPet || !heatStartDate) && styles.saveButtonDisabled]}
        onPress={saveHeatCycle}
        disabled={!selectedPet || !heatStartDate || loading}
      >
        <Text style={styles.saveButtonText}>
          {loading ? 'Saving...' : 'Save Heat Cycle'}
        </Text>
      </TouchableOpacity>

      {/* Pet Selection Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Female Dog</Text>
            <ScrollView style={styles.petList}>
              {femalePets.map(pet => (
                <TouchableOpacity
                  key={pet.id}
                  style={styles.petItem}
                  onPress={() => {
                    setSelectedPet(pet);
                    setIsModalVisible(false);
                  }}
                >
                  <Text style={styles.petName}>{pet.name}</Text>
                  <Text style={styles.petBreed}>{pet.breed}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFC700',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.9,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  petSelector: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  petSelected: {
    fontSize: 16,
    color: '#333',
  },
  petPlaceholder: {
    fontSize: 16,
    color: '#999',
  },
  fertileInfo: {
    backgroundColor: '#f0f8f0',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#32CD32',
  },
  fertileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  fertileLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  fertileValue: {
    fontSize: 16,
    color: '#32CD32',
    fontWeight: 'bold',
  },
  disclaimer: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 8,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#FF1493',
    margin: 20,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  petList: {
    maxHeight: 300,
  },
  petItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  petName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  petBreed: {
    fontSize: 14,
    color: '#666',
  },
  closeButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#666',
  },
});
