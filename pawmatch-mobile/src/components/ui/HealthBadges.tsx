import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface HealthBadge {
  type: 'fiv_felv' | 'hip_score' | 'dna_tested' | 'vaccinated' | 'vet_checked' | 'custom';
  date?: string;
}

interface HealthBadgesProps {
  health?: HealthBadge[];
}

const HEALTH_META = {
  fiv_felv: { label: 'FIV/FeLV negative', icon: '🐱', color: '#34C759' },
  hip_score: { label: 'No hip dysplasia', icon: '🦴', color: '#34C759' },
  dna_tested: { label: 'DNA tested clear', icon: '🧬', color: '#2F80ED' },
  vaccinated: { label: 'Vaccinated', icon: '💉', color: '#FF9500' },
  vet_checked: { label: 'Vet checked', icon: '⚕️', color: '#FF3B30' },
  custom: { label: 'Health certified', icon: '✅', color: '#9B59B6' },
};

export function HealthBadges({ health = [] }: HealthBadgesProps) {
  if (health.length === 0) return null;

  return (
    <View style={styles.container}>
      {health.map((h, idx) => {
        const meta = HEALTH_META[h.type] || HEALTH_META.custom;
        return (
          <View
            key={idx}
            style={[
              styles.badge,
              {
                backgroundColor: `${meta.color}20`,
                borderColor: meta.color,
              },
            ]}
          >
            <Text style={styles.icon}>{meta.icon}</Text>
            <Text style={[styles.label, { color: meta.color }]}>
              {meta.label}
            </Text>
            {h.date && (
              <Text style={[styles.date, { color: meta.color }]}>
                {h.date}
              </Text>
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  icon: {
    fontSize: 12,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
  },
  date: {
    fontSize: 10,
    opacity: 0.7,
    marginLeft: 4,
  },
});
