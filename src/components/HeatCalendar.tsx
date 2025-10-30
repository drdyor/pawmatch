import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors } from '../theme/colors';

interface HeatCalendarProps {
  startDate?: string;
  cycleLength?: number;
  onDateSelect?: (date: string) => void;
}

export default function HeatCalendar({ startDate, cycleLength = 21, onDateSelect }: HeatCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(startDate || null);
  
  // Generate calendar days (current month + next month)
  const generateCalendarDays = () => {
    const today = new Date();
    const days = [];
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    // Generate 60 days starting from today
    for (let i = 0; i < 60; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date);
    }
    
    return days;
  };

  const days = generateCalendarDays();

  const handleDatePress = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    setSelectedDate(dateStr);
    onDateSelect?.(dateStr);
  };

  const getDayStatus = (date: Date) => {
    if (!selectedDate) return 'normal';
    
    const start = new Date(selectedDate);
    const daysDiff = Math.floor((date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 0) return 'heat-start';
    if (daysDiff > 0 && daysDiff <= cycleLength) {
      // Fertile window is typically days 8-14
      if (daysDiff >= 8 && daysDiff <= 14) return 'fertile';
      return 'heat-cycle';
    }
    
    return 'normal';
  };

  const formatDate = (date: Date) => {
    return date.getDate();
  };

  const formatDayName = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const formatMonthHeader = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Group days by month
  const groupedDays: { [key: string]: Date[] } = {};
  days.forEach(day => {
    const monthKey = formatMonthHeader(day);
    if (!groupedDays[monthKey]) {
      groupedDays[monthKey] = [];
    }
    groupedDays[monthKey].push(day);
  });

  return (
    <View style={styles.container}>
      <View style={styles.legend}>
        <LegendItem color={colors.danger} label="Heat Start" />
        <LegendItem color={colors.warning} label="Fertile Window" />
        <LegendItem color={colors.secondary} label="Heat Cycle" />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
        {Object.entries(groupedDays).map(([month, monthDays]) => (
          <View key={month} style={styles.monthSection}>
            <Text style={styles.monthHeader}>{month}</Text>
            <View style={styles.daysGrid}>
              {monthDays.map((day, index) => {
                const status = getDayStatus(day);
                const isToday = day.toDateString() === new Date().toDateString();
                
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.dayCell,
                      status === 'heat-start' && styles.heatStart,
                      status === 'fertile' && styles.fertile,
                      status === 'heat-cycle' && styles.heatCycle,
                      isToday && styles.today,
                    ]}
                    onPress={() => handleDatePress(day)}
                  >
                    <Text style={styles.dayName}>{formatDayName(day)}</Text>
                    <Text style={[
                      styles.dayNumber,
                      (status !== 'normal' || isToday) && styles.dayNumberActive,
                    ]}>
                      {formatDate(day)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  scroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  monthSection: {
    marginRight: 24,
  },
  monthHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  daysGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  dayCell: {
    width: 60,
    padding: 8,
    borderRadius: 12,
    backgroundColor: colors.background,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  today: {
    borderColor: colors.text,
  },
  heatStart: {
    backgroundColor: colors.danger,
  },
  fertile: {
    backgroundColor: colors.warning,
  },
  heatCycle: {
    backgroundColor: colors.secondary,
  },
  dayName: {
    fontSize: 10,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  dayNumberActive: {
    color: colors.background,
  },
});
