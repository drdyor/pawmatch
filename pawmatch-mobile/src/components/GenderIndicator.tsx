// Gender Indicator Component - Shows pet's sex with colored paw
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../theme';

interface GenderIndicatorProps {
  sex: 'male' | 'female' | 'unknown';
  size?: number;
}

export default function GenderIndicator({ sex, size = 40 }: GenderIndicatorProps) {
  const isFemale = sex === 'female';
  const isMale = sex === 'male';

  return (
    <View
      style={[
        styles.indicator,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: isFemale ? '#FF69B4' : isMale ? COLORS.secondary : COLORS.neutral,
        },
      ]}
    >
      <Text style={styles.icon}>🐾</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  indicator: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  icon: {
    fontSize: 20,
  },
});
