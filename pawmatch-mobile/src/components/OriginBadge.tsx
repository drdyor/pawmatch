// Origin Badge Component - Shows pet's origin country (important for breeding)
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../theme';

interface OriginBadgeProps {
  country: string;
  isMalta?: boolean;
}

export default function OriginBadge({ country, isMalta }: OriginBadgeProps) {
  const isMaltaPet = isMalta || country === 'Malta';

  if (!country) return null;

  return (
    <View
      style={[
        styles.badge,
        isMaltaPet && styles.badgeMalta,
      ]}
    >
      <Text style={[styles.text, isMaltaPet && styles.textMalta]}>
        {isMaltaPet ? '🇲🇹' : '🌍'} {country}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: COLORS.neutral,
    alignSelf: 'flex-start',
  },
  badgeMalta: {
    backgroundColor: COLORS.success,
  },
  text: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.text,
    fontFamily: FONTS.semiBold,
  },
  textMalta: {
    color: '#fff',
  },
});
