import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { Header } from '../../components/ui/Header';
import { Card } from '../../components/ui/Card';
import { Toggle } from '../../components/ui/Toggle';

interface HeatTrackerScreenProps {
  onNext: (data: { heatMatch: boolean }) => void;
  onBack: () => void;
}

function computeFertileWindow(): Set<number> {
  return new Set([8, 9, 10, 11, 12, 13, 14]);
}

export function HeatTrackerScreen({ onNext, onBack }: HeatTrackerScreenProps) {
  const [enabled, setEnabled] = useState(true);
  const days = useMemo(() => Array.from({ length: 28 }, (_, i) => i + 1), []);
  const fertile = useMemo(() => computeFertileWindow(), []);
  const heatStart = 1;
  const cycleDay = 10;
  const cycleDayPercent = (cycleDay / 28) * 100;

  return (
    <SafeAreaView style={styles.safe}>
      <Header step={3} max={5} onBack={onBack} title="Independent Owner" />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.icon}>📅</Text>
          <Text style={styles.title}>Heat tracker</Text>
        </View>
        <Text style={styles.subtitle}>
          Predict fertile days and auto-suggest matches during the window.
        </Text>

        <Card style={styles.card}>
          <View style={styles.statsRow}>
            <View>
              <Text style={styles.statLabel}>Cycle day</Text>
              <Text style={styles.statValue}>
                {cycleDay}{' '}
                <Text style={styles.statSubtext}>/ 28</Text>
              </Text>
            </View>
            <View style={styles.progressCircle}>
              <Svg width={64} height={64} viewBox="0 0 36 36">
                <Path
                  d="M18 2 a 16 16 0 1 1 0 32 a 16 16 0 1 1 0 -32"
                  fill="none"
                  stroke="#F5F5F5"
                  strokeWidth="4"
                />
                <Path
                  d="M18 2 a 16 16 0 1 1 0 32"
                  fill="none"
                  stroke="#FFC700"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={`${cycleDayPercent}, 100`}
                />
              </Svg>
              <View style={styles.progressText}>
                <Text style={styles.progressPercent}>
                  {Math.round(cycleDayPercent)}%
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.calendar}>
            {days.map((d) => (
              <View
                key={d}
                style={[
                  styles.day,
                  d === heatStart && styles.dayHeatStart,
                  fertile.has(d) && styles.dayFertile,
                ]}
              >
                <Text
                  style={[
                    styles.dayText,
                    (d === heatStart || fertile.has(d)) && styles.dayTextActive,
                  ]}
                >
                  {d}
                </Text>
              </View>
            ))}
          </View>

          <Text style={styles.legend}>
            Red = heat start · Amber = fertile window
          </Text>
        </Card>

        <Toggle
          checked={enabled}
          onChange={setEnabled}
          label="Enable matchmaking during fertile window"
          subtitle="We'll notify compatible nearby pets when your pet is likely fertile."
        />

        <TouchableOpacity
          onPress={() => onNext({ heatMatch: enabled })}
          style={styles.button}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  icon: {
    fontSize: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#171717',
  },
  subtitle: {
    fontSize: 15,
    color: '#737373',
    marginBottom: 16,
  },
  card: {
    padding: 16,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statLabel: {
    fontSize: 13,
    color: '#737373',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '600',
    color: '#171717',
  },
  statSubtext: {
    fontSize: 13,
    color: '#737373',
  },
  progressCircle: {
    width: 64,
    height: 64,
    position: 'relative',
  },
  progressText: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressPercent: {
    fontSize: 12,
    color: '#737373',
  },
  calendar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  day: {
    width: 38,
    aspectRatio: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayHeatStart: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FCA5A5',
  },
  dayFertile: {
    backgroundColor: '#FFF8E6',
    borderColor: '#FFD966',
  },
  dayText: {
    fontSize: 13,
    color: '#171717',
  },
  dayTextActive: {
    fontWeight: '600',
  },
  legend: {
    fontSize: 12,
    color: '#737373',
    marginTop: 8,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#FFC700',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
