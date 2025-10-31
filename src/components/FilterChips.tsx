import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { PALETTE } from '../theme/palette';

type Chip = { id: string; label: string };

interface FilterChipsProps {
  chips: Chip[];
  activeId: string;
  onChange: (id: string) => void;
}

export function FilterChips({ chips, activeId, onChange }: FilterChipsProps) {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      contentContainerStyle={styles.row}
    >
      {chips.map(c => {
        const active = c.id === activeId;
        return (
          <TouchableOpacity
            key={c.id}
            onPress={() => onChange(c.id)}
            activeOpacity={0.85}
            style={[styles.chip, active ? styles.active : styles.inactive]}
          >
            <Text style={[styles.label, active ? styles.activeText : styles.inactiveText]}>
              {c.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { 
    paddingHorizontal: 16, 
    paddingVertical: 8,
    gap: 10 
  },
  chip: { 
    paddingVertical: 10, 
    paddingHorizontal: 16, 
    borderRadius: 20, 
    borderWidth: 1.5,
  },
  active: { 
    backgroundColor: PALETTE.primary, 
    borderColor: PALETTE.primary 
  },
  inactive: { 
    backgroundColor: 'transparent', 
    borderColor: PALETTE.textSecondary + '40' // 40 = 25% opacity
  },
  label: { 
    fontWeight: '600',
    fontSize: 14,
  },
  activeText: { 
    color: '#fff' 
  },
  inactiveText: { 
    color: PALETTE.textSecondary 
  },
});
