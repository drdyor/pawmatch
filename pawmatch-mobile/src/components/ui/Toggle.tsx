import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

interface ToggleProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  subtitle?: string;
}

export function Toggle({ checked, onChange, label, subtitle }: ToggleProps) {
  return (
    <TouchableOpacity
      onPress={() => onChange(!checked)}
      style={[
        styles.container,
        checked ? styles.containerActive : styles.containerInactive,
      ]}
      activeOpacity={0.7}
    >
      <View style={[styles.checkbox, checked && styles.checkboxActive]}>
        {checked && <Text style={styles.checkmark}>✓</Text>}
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.label}>{label}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  containerActive: {
    backgroundColor: '#FFF8E6',
    borderColor: '#FFD966',
  },
  containerInactive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E5E5',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D4D4D4',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  checkboxActive: {
    backgroundColor: '#FFC700',
    borderColor: '#FFC700',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    color: '#171717',
  },
  subtitle: {
    fontSize: 13,
    color: '#737373',
    marginTop: 2,
  },
});
