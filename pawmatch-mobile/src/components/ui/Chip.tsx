import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';

interface ChipProps {
  active?: boolean;
  children: React.ReactNode;
  onPress?: () => void;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export function Chip({ active = false, children, onPress, icon, style }: ChipProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.chip,
        active ? styles.chipActive : styles.chipInactive,
        style,
      ]}
      activeOpacity={0.7}
    >
      {icon}
      <Text style={[styles.text, active && styles.textActive]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  chipActive: {
    backgroundColor: '#FFC700',
    borderColor: '#FFC700',
  },
  chipInactive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E5E5',
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
    color: '#737373',
  },
  textActive: {
    color: '#FFFFFF',
  },
});
