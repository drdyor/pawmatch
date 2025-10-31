// Reusable Filter Chip Component (Picky Pup style)
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../theme';

interface FilterChipProps {
  label: string;
  active: boolean;
  onPress: () => void;
  size?: 'small' | 'medium' | 'large';
}

export default function FilterChip({ 
  label, 
  active, 
  onPress,
  size = 'medium'
}: FilterChipProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.chip,
        active && styles.chipActive,
        size === 'small' && styles.chipSmall,
        size === 'large' && styles.chipLarge,
      ]}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.chipText,
          active && styles.chipTextActive,
          size === 'small' && styles.chipTextSmall,
          size === 'large' && styles.chipTextLarge,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    margin: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipActive: {
    borderColor: COLORS.secondary,
    backgroundColor: '#DFF2FF',
  },
  chipSmall: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  chipLarge: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
  },
  chipText: {
    color: COLORS.text,
    fontWeight: '500',
    fontSize: 14,
  },
  chipTextActive: {
    color: COLORS.text,
    fontWeight: '700',
  },
  chipTextSmall: {
    fontSize: 12,
  },
  chipTextLarge: {
    fontSize: 16,
  },
});
