import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../../theme/colors';
import { supabase } from '../../services/supabase';
import { Pet, HeatCycle } from '../../types';
import HeatCalendar from '../../components/HeatCalendar';
import HeatRing from '../../components/HeatRing';
import { toCamel, toSnake } from '../../lib/case';

export default function BreederHeatTrackingScreen({ navigation, route }: any) {
  const { petId } = route.params;
  const [pet, setPet] = useState<Pet | null>(null);
  const [currentCycle, setCurrentCycle] = useState<HeatCycle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPetAndCycle();
  }, []);

  const loadPetAndCycle = async () => {
    try {
      // Load pet
      const { data: petData, error: petError } = await supabase
        .from('pets')
        .select('*')
        .eq('id', petId)
        .single();

      if (petError) throw petError;
      // Convert snake_case DB data to camelCase for UI
      setPet(toCamel(petData) as Pet);

      // Load current heat cycle
      const { data: cycleData, error: cycleError } = await supabase
        .from('heat_cycles')
        .select('*')
        .eq('pet_id', petId)
        .order('start_date', { ascending: false })
        .limit(1)
        .single();

      if (cycleData) {
        // Convert snake_case to camelCase, then add computed fields
        const camelCycle = toCamel(cycleData) as any;
        const startDate = new Date(camelCycle.startDate || cycleData.start_date);
        const today = new Date();
        const daysDiff = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        
        setCurrentCycle({
          ...camelCycle,
          cycleDay: daysDiff + 1,
        } as HeatCycle);
      }
    } catch (error) {
      console.error('Error loading pet and cycle:', error);
    } finally {
      setLoading(false);
    }
  };

  const startNewCycle = async (startDate: string) => {
    try {
      // Calculate fertile window (days 8-14)
      const start = new Date(startDate);
      const fertileStart = new Date(start);
      fertileStart.setDate(start.getDate() + 7); // Day 8
      const fertileEnd = new Date(start);
      fertileEnd.setDate(start.getDate() + 13); // Day 14

      // Convert camelCase UI data to snake_case for DB
      const dbPayload = toSnake({
        petId: petId,
        startDate: startDate,
        cycleDay: 1,
        cycleLength: 21,
        fertileWindowStart: fertileStart.toISOString().split('T')[0],
        fertileWindowEnd: fertileEnd.toISOString().split('T')[0],
        notificationsSent: false,
      });

      const { data, error } = await supabase
        .from('heat_cycles')
        .insert(dbPayload)
        .select()
        .single();

      if (error) throw error;

      // Update pet status
      await supabase
        .from('pets')
        .update({ status: 'in_heat' })
        .eq('id', petId);

      Alert.alert('Success', 'Heat cycle started! You\'ll get reminders for progesterone testing.');
      loadPetAndCycle();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const sendStudNotifications = async () => {
    if (!currentCycle) return;

    Alert.alert(
      'Notify Stud Owners?',
      'Send push notifications to owners of available studs in your area?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send Notifications',
          onPress: async () => {
            try {
              // Find available studs of same breed
              // Note: pet is already in camelCase, but DB columns are snake_case
              const petOwnerId = (pet as any).ownerId || (pet as any).owner_id;
              const { data: studs, error } = await supabase
                .from('pets')
                .select('*, owner:users(*)')
                .eq('species', pet?.species)
                .eq('breed', pet?.breed)
                .eq('sex', 'male')
                .eq('status', 'stud_available')
                .neq('owner_id', petOwnerId);

              if (error) throw error;

              // Create notifications for stud owners
              // studs come from DB in snake_case, convert as needed
              const notifications = studs?.map(stud => {
                const camelStud = toCamel(stud);
                return {
                  user_id: camelStud.ownerId || stud.owner_id,
                  type: 'heat_notification',
                  title: '🔥 Female in Heat Nearby',
                  body: `${pet?.name} (${pet?.breed}) is in heat in ${pet?.city}. Day ${currentCycle.cycleDay} of cycle.`,
                  data: { pet_id: petId, heat_cycle_id: currentCycle.id },
                  read: false,
                };
              });

              if (notifications && notifications.length > 0) {
                await supabase.from('notifications').insert(notifications);

                // Mark notifications as sent (DB uses snake_case)
                await supabase
                  .from('heat_cycles')
                  .update({ notifications_sent: true })
                  .eq('id', currentCycle.id);

                Alert.alert('Success', `Notified ${notifications.length} stud owners!`);
                loadPetAndCycle();
              } else {
                Alert.alert('No Matches', 'No available studs found for this breed in your area.');
              }
            } catch (error: any) {
              Alert.alert('Error', error.message);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.secondary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Heat Tracking</Text>
        <Text style={styles.subtitle}>{pet?.name} • {pet?.breed}</Text>
      </View>

      {currentCycle ? (
        <>
          <View style={styles.ringSection}>
            <HeatRing cycleDay={currentCycle.cycleDay} cycleLength={currentCycle.cycleLength} />
            
            <View style={styles.infoCards}>
              <InfoCard
                icon="📅"
                label="Started"
                value={new Date((currentCycle as any).startDate || (currentCycle as any).start_date).toLocaleDateString()}
              />
              <InfoCard
                icon="🎯"
                label="Fertile Window"
                value="Days 8-14"
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Breeding Reminders</Text>
            <View style={styles.reminderCard}>
                {currentCycle.cycleDay < 8 && (
                <Text style={styles.reminderText}>
                  💡 {8 - currentCycle.cycleDay} days until fertile window
                </Text>
              )}
              {currentCycle.cycleDay >= 8 && currentCycle.cycleDay <= 14 && (
                <Text style={styles.reminderText}>
                  ✅ Currently in fertile window - best time for breeding
                </Text>
              )}
              {currentCycle.cycleDay > 14 && (
                <Text style={styles.reminderText}>
                  ⏰ Fertile window has passed
                </Text>
              )}
              
              <View style={styles.reminderActions}>
                {!((currentCycle as any).notificationsSent || (currentCycle as any).notifications_sent) && currentCycle.cycleDay >= 1 && (
                  <TouchableOpacity style={styles.notifyButton} onPress={sendStudNotifications}>
                    <Text style={styles.notifyButtonText}>
                      🔔 Notify Stud Owners
                    </Text>
                  </TouchableOpacity>
                )}
                {((currentCycle as any).notificationsSent || (currentCycle as any).notifications_sent) && (
                  <Text style={styles.notifiedText}>✅ Stud owners notified</Text>
                )}
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cycle Calendar</Text>
            <HeatCalendar
              startDate={(currentCycle as any).startDate || (currentCycle as any).start_date}
              cycleLength={currentCycle.cycleLength || 21}
            />
          </View>
        </>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📅</Text>
          <Text style={styles.emptyTitle}>No Active Heat Cycle</Text>
          <Text style={styles.emptyText}>
            Mark when {pet?.name} starts her heat cycle to track the fertile window
          </Text>
          
          <HeatCalendar onDateSelect={startNewCycle} />
          
          <Text style={styles.helperText}>
            💡 Tap a date above to mark the start of the heat cycle
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

function InfoCard({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.infoCard}>
      <Text style={styles.infoIcon}>{icon}</Text>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
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
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  ringSection: {
    padding: 20,
    alignItems: 'center',
  },
  infoCards: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    width: '100%',
  },
  infoCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  infoIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  section: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  reminderCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
  },
  reminderText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    marginBottom: 12,
  },
  reminderActions: {
    marginTop: 8,
  },
  notifyButton: {
    backgroundColor: colors.secondary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  notifyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.background,
  },
  notifiedText: {
    fontSize: 14,
    color: colors.success,
    textAlign: 'center',
    padding: 12,
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
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
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  helperText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 16,
  },
});
