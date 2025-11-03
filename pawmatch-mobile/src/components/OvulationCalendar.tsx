import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Calendar, DateData, CalendarList } from 'react-native-calendars';
import { format, addDays, isWithinInterval, parseISO } from 'date-fns';
import { HeatCycle, Pet } from '../types';
import { supabase } from '../services/supabase';

interface OvulationCalendarProps {
  femalePets: Pet[];
  onDatePress?: (date: DateData) => void;
  selectedPetId?: string;
}

interface MarkedDates {
  [date: string]: {
    selected?: boolean;
    selectedColor?: string;
    selectedTextColor?: string;
    marked?: boolean;
    dotColor?: string;
    periods?: Array<{
      startingDay?: boolean;
      endingDay?: boolean;
      color: string;
    }>;
  };
}

export const OvulationCalendar: React.FC<OvulationCalendarProps> = ({
  femalePets,
  onDatePress,
  selectedPetId,
}) => {
  const [heatCycles, setHeatCycles] = useState<HeatCycle[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');

  useEffect(() => {
    loadHeatCycles();
  }, [femalePets, selectedPetId]);

  const loadHeatCycles = async () => {
    try {
      let query = supabase
        .from('heat_cycles')
        .select('*')
        .in('pet_id', femalePets.map(pet => pet.id));

      if (selectedPetId) {
        query = query.eq('pet_id', selectedPetId);
      }

      const { data, error } = await query.order('heat_start_date', { ascending: false });

      if (error) throw error;
      setHeatCycles(data || []);
    } catch (error) {
      console.error('Error loading heat cycles:', error);
    }
  };

  const getMarkedDates = (): MarkedDates => {
    const marked: MarkedDates = {};

    heatCycles.forEach(cycle => {
      const pet = femalePets.find(p => p.id === cycle.pet_id);
      if (!pet) return;

      const heatStart = parseISO(cycle.heat_start_date);
      const fertileStart = cycle.fertile_window_start ? parseISO(cycle.fertile_window_start) : null;
      const fertileEnd = cycle.fertile_window_end ? parseISO(cycle.fertile_window_end) : null;
      const ovulationDate = cycle.estimated_ovulation ? parseISO(cycle.estimated_ovulation) : null;

      // Mark heat start date (pink/red for heat)
      const heatStartStr = format(heatStart, 'yyyy-MM-dd');
      if (!marked[heatStartStr]) {
        marked[heatStartStr] = {};
      }
      marked[heatStartStr].marked = true;
      marked[heatStartStr].dotColor = '#FF1493'; // Deep pink for heat start

      // Mark fertile window (green period)
      if (fertileStart && fertileEnd) {
        const fertileDates = [];
        let current = fertileStart;
        while (current <= fertileEnd) {
          fertileDates.push(format(current, 'yyyy-MM-dd'));
          current = addDays(current, 1);
        }

        fertileDates.forEach(dateStr => {
          if (!marked[dateStr]) {
            marked[dateStr] = {};
          }
          if (!marked[dateStr].periods) {
            marked[dateStr].periods = [];
          }
          marked[dateStr].periods!.push({
            startingDay: dateStr === fertileDates[0],
            endingDay: dateStr === fertileDates[fertileDates.length - 1],
            color: '#32CD32', // Lime green for fertile window
          });
        });
      }

      // Mark estimated ovulation date (gold star)
      if (ovulationDate) {
        const ovulationStr = format(ovulationDate, 'yyyy-MM-dd');
        if (!marked[ovulationStr]) {
          marked[ovulationStr] = {};
        }
        marked[ovulationStr].marked = true;
        marked[ovulationStr].dotColor = '#FFD700'; // Gold for ovulation
      }
    });

    return marked;
  };

  const handleDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
    onDatePress?.(day);

    // Check if this date has any heat cycle events
    const events = heatCycles.filter(cycle => {
      const heatStart = format(parseISO(cycle.heat_start_date), 'yyyy-MM-dd');
      const fertileStart = cycle.fertile_window_start ? format(parseISO(cycle.fertile_window_start), 'yyyy-MM-dd') : null;
      const fertileEnd = cycle.fertile_window_end ? format(parseISO(cycle.fertile_window_end), 'yyyy-MM-dd') : null;
      const ovulation = cycle.estimated_ovulation ? format(parseISO(cycle.estimated_ovulation), 'yyyy-MM-dd') : null;

      return heatStart === day.dateString ||
             fertileStart === day.dateString ||
             fertileEnd === day.dateString ||
             ovulation === day.dateString;
    });

    if (events.length > 0) {
      const petNames = events.map(event => {
        const pet = femalePets.find(p => p.id === event.pet_id);
        return pet?.name || 'Unknown Pet';
      }).join(', ');

      Alert.alert(
        `Heat Cycle Events - ${format(parseISO(day.dateString), 'MMM dd, yyyy')}`,
        `Events for: ${petNames}`,
        [{ text: 'OK' }]
      );
    }
  };

  const markedDates = getMarkedDates();

  return (
    <View style={styles.container}>
      <View style={styles.legend}>
        <Text style={styles.legendTitle}>Legend:</Text>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#FF1493' }]} />
          <Text style={styles.legendText}>Heat Start</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#32CD32' }]} />
          <Text style={styles.legendText}>Fertile Window</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#FFD700' }]} />
          <Text style={styles.legendText}>Estimated Ovulation</Text>
        </View>
      </View>

      <Calendar
        markedDates={markedDates}
        onDayPress={handleDayPress}
        markingType="multi-period"
        theme={{
          backgroundColor: '#ffffff',
          calendarBackground: '#ffffff',
          textSectionTitleColor: '#b6c1cd',
          selectedDayBackgroundColor: '#00adf5',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#00adf5',
          dayTextColor: '#2d4150',
          textDisabledColor: '#dd99ee',
          dotColor: '#00adf5',
          selectedDotColor: '#ffffff',
          arrowColor: '#00adf5',
          monthTextColor: '#00adf5',
          indicatorColor: '#00adf5',
          textDayFontSize: 16,
          textMonthFontSize: 18,
          textDayHeaderFontSize: 14
        }}
      />

      {selectedPetId && (
        <View style={styles.petInfo}>
          <Text style={styles.petInfoTitle}>
            Tracking: {femalePets.find(p => p.id === selectedPetId)?.name}
          </Text>
          <Text style={styles.petInfoSubtitle}>
            {heatCycles.filter(c => c.pet_id === selectedPetId).length} heat cycles logged
          </Text>
        </View>
      )}

      <ScrollView style={styles.upcomingEvents}>
        <Text style={styles.eventsTitle}>Upcoming Fertile Windows</Text>
        {heatCycles
          .filter(cycle => cycle.fertile_window_start && cycle.fertile_window_end)
          .filter(cycle => {
            const fertileEnd = parseISO(cycle.fertile_window_end!);
            return fertileEnd >= new Date();
          })
          .sort((a, b) => parseISO(a.fertile_window_start!).getTime() - parseISO(b.fertile_window_start!).getTime())
          .slice(0, 5)
          .map(cycle => {
            const pet = femalePets.find(p => p.id === cycle.pet_id);
            return (
              <View key={cycle.id} style={styles.eventItem}>
                <Text style={styles.eventPet}>{pet?.name || 'Unknown'}</Text>
                <Text style={styles.eventDate}>
                  {format(parseISO(cycle.fertile_window_start!), 'MMM dd')} - {format(parseISO(cycle.fertile_window_end!), 'MMM dd, yyyy')}
                </Text>
              </View>
            );
          })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  legend: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#666',
  },
  petInfo: {
    padding: 16,
    backgroundColor: '#FFC700',
    alignItems: 'center',
  },
  petInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  petInfoSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  upcomingEvents: {
    flex: 1,
    padding: 16,
  },
  eventsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  eventItem: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#32CD32',
  },
  eventPet: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  eventDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
});
