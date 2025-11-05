import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Pet, HeatCycle } from '../../types';
import { supabase } from '../../services/supabase';
import { OvulationCalendar } from '../../components/OvulationCalendar';
import { format, addDays, isWithinInterval, parseISO } from 'date-fns';

export const HeatTrackingScreen: React.FC = () => {
  const navigation = useNavigation();
  const [femalePets, setFemalePets] = useState<Pet[]>([]);
  const [heatCycles, setHeatCycles] = useState<HeatCycle[]>([]);
  const [selectedPetId, setSelectedPetId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([loadFemalePets(), loadHeatCycles()]);
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'Failed to load heat tracking data');
    } finally {
      setLoading(false);
    }
  };

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
    }
  };

  const loadHeatCycles = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('heat_cycles')
        .select('*')
        .in('pet_id', femalePets.map(pet => pet.id))
        .order('heat_start_date', { ascending: false });

      if (error) throw error;
      setHeatCycles(data || []);
    } catch (error) {
      console.error('Error loading heat cycles:', error);
    }
  };

  const getPetStatus = (pet: Pet) => {
    const petCycles = heatCycles.filter(cycle => cycle.pet_id === pet.id);
    if (petCycles.length === 0) return { status: 'No cycles logged', color: '#666' };

    const latestCycle = petCycles[0];
    const now = new Date();

    // Check if currently in heat
    const heatStart = parseISO(latestCycle.heat_start_date);
    const heatEndEstimate = addDays(heatStart, 21); // Typical heat lasts ~21 days

    if (now >= heatStart && now <= heatEndEstimate) {
      // Check if in fertile window
      if (latestCycle.fertile_window_start && latestCycle.fertile_window_end) {
        const fertileStart = parseISO(latestCycle.fertile_window_start);
        const fertileEnd = parseISO(latestCycle.fertile_window_end);

        if (isWithinInterval(now, { start: fertileStart, end: fertileEnd })) {
          return { status: 'In Fertile Window', color: '#32CD32' };
        }
      }
      return { status: 'In Heat', color: '#FF1493' };
    }

    // Calculate next heat estimate
    const nextHeatEstimate = addDays(heatStart, 180); // ~6 months cycle
    if (now > heatEndEstimate && now < nextHeatEstimate) {
      const daysUntilNext = Math.ceil((nextHeatEstimate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return { status: `${daysUntilNext} days until next heat`, color: '#FFA500' };
    }

    return { status: 'Not in cycle', color: '#666' };
  };

  const handlePetPress = (pet: Pet) => {
    setSelectedPetId(selectedPetId === pet.id ? '' : pet.id);
  };

  const handleLogOvulation = (pet?: Pet) => {
    navigation.navigate('LogOvulation' as never, { petId: pet?.id } as never);
  };

  const renderPetCard = ({ item: pet }: { item: Pet }) => {
    const { status, color } = getPetStatus(pet);
    const petCycles = heatCycles.filter(cycle => cycle.pet_id === pet.id);

    return (
      <TouchableOpacity
        style={[styles.petCard, selectedPetId === pet.id && styles.petCardSelected]}
        onPress={() => handlePetPress(pet)}
      >
        <View style={styles.petHeader}>
          <View style={styles.petInfo}>
            <Text style={styles.petName}>{pet.name}</Text>
            <Text style={styles.petBreed}>{pet.breed}</Text>
          </View>
          <View style={[styles.statusIndicator, { backgroundColor: color }]}>
            <Text style={styles.statusText}>{status}</Text>
          </View>
        </View>

        <View style={styles.petStats}>
          <Text style={styles.statText}>
            {petCycles.length} heat cycle{petCycles.length !== 1 ? 's' : ''} logged
          </Text>
          {petCycles.length > 0 && (
            <Text style={styles.lastCycleText}>
              Last heat: {format(parseISO(petCycles[0].heat_start_date), 'MMM dd, yyyy')}
            </Text>
          )}
        </View>

        <View style={styles.petActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleLogOvulation(pet)}
          >
            <Text style={styles.actionButtonText}>Log Heat</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading heat tracking data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Heat Tracking</Text>
        <Text style={styles.subtitle}>
          Monitor your female dogs' ovulation cycles
        </Text>
      </View>

      {femalePets.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No Female Dogs</Text>
          <Text style={styles.emptyText}>
            Add female dogs to your account to start tracking heat cycles
          </Text>
          <TouchableOpacity
            style={styles.addPetButton}
            onPress={() => navigation.navigate('AddPet' as never)}
          >
            <Text style={styles.addPetButtonText}>Add Female Dog</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.summary}>
            <Text style={styles.summaryTitle}>Your Female Dogs</Text>
            <Text style={styles.summaryText}>
              {femalePets.length} dog{femalePets.length !== 1 ? 's' : ''} • {heatCycles.length} total cycles logged
            </Text>
          </View>

          <FlatList
            data={femalePets}
            keyExtractor={(item) => item.id}
            renderItem={renderPetCard}
            style={styles.petList}
            showsVerticalScrollIndicator={false}
          />

          <TouchableOpacity
            style={styles.logButton}
            onPress={() => handleLogOvulation()}
          >
            <Text style={styles.logButtonText}>+ Log New Heat Cycle</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Calendar View - Only show when a pet is selected */}
      {selectedPetId && (
        <View style={styles.calendarContainer}>
          <Text style={styles.calendarTitle}>
            Tap any date to log a new heat cycle
          </Text>
          <OvulationCalendar
            femalePets={femalePets}
            selectedPetId={selectedPetId}
            onDatePress={(date) => {
              const pet = femalePets.find(p => p.id === selectedPetId);
              if (pet) {
                handleLogOvulation(pet);
              }
            }}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
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
  summary: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  summaryText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  petList: {
    flex: 1,
  },
  petCard: {
    margin: 8,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  petCardSelected: {
    borderColor: '#FFC700',
    borderWidth: 2,
  },
  petHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  petInfo: {
    flex: 1,
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
  statusIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  petStats: {
    marginBottom: 12,
  },
  statText: {
    fontSize: 14,
    color: '#666',
  },
  lastCycleText: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  petActions: {
    flexDirection: 'row',
  },
  actionButton: {
    backgroundColor: '#FF1493',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  logButton: {
    backgroundColor: '#FF1493',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  logButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  calendarContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  calendarTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  addPetButton: {
    backgroundColor: '#FFC700',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addPetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
