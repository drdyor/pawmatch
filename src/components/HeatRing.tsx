import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

interface HeatRingProps {
  cycleDay: number;
  cycleLength: number;
}

export default function HeatRing({ cycleDay, cycleLength }: HeatRingProps) {
  const progress = Math.min(cycleDay / cycleLength, 1);
  const circumference = 2 * Math.PI * 50;
  const strokeDashoffset = circumference * (1 - progress);

  // Determine status based on cycle day
  const getStatus = () => {
    if (cycleDay >= 8 && cycleDay <= 14) {
      return { text: 'Fertile Window', color: colors.warning };
    } else if (cycleDay > 14 && cycleDay <= cycleLength) {
      return { text: 'Heat Cycle', color: colors.secondary };
    } else {
      return { text: 'In Heat', color: colors.danger };
    }
  };

  const status = getStatus();

  return (
    <View style={styles.container}>
      <svg width="120" height="120" style={styles.svg}>
        {/* Background circle */}
        <circle
          cx="60"
          cy="60"
          r="50"
          stroke={colors.border}
          strokeWidth="10"
          fill="none"
        />
        
        {/* Progress circle */}
        <circle
          cx="60"
          cy="60"
          r="50"
          stroke={status.color}
          strokeWidth="10"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
        />
      </svg>
      
      <View style={styles.content}>
        <Text style={styles.dayNumber}>{cycleDay}</Text>
        <Text style={styles.dayLabel}>Day {cycleDay}</Text>
        <Text style={styles.totalDays}>of {cycleLength}</Text>
      </View>

      <View style={[styles.statusBadge, { backgroundColor: status.color }]}>
        <Text style={styles.statusText}>{status.text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    position: 'relative',
  },
  svg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  content: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
  },
  dayLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: -4,
  },
  totalDays: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  statusBadge: {
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.background,
  },
});
