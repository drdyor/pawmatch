// Intent Badge Component - Shows what the pet/listing is looking for
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../theme';

type IntentType = 'breeding' | 'adoption' | 'sale' | 'playdate';

interface IntentBadgeProps {
  intent: IntentType;
  size?: 'small' | 'medium' | 'large';
}

const INTENT_CONFIG: Record<
  IntentType,
  { label: string; icon: string; color: string; bg: string }
> = {
  breeding: {
    label: 'Breeding',
    icon: '🧬',
    color: COLORS.maltaRed,
    bg: '#FFE8E8',
  },
  adoption: {
    label: 'Adoption',
    icon: '🏠',
    color: COLORS.success,
    bg: '#E8F5E8',
  },
  sale: {
    label: 'For Sale',
    icon: '💰',
    color: '#E67E22',
    bg: '#FFF4E6',
  },
  playdate: {
    label: 'Play Dates',
    icon: '🎾',
    color: COLORS.secondary,
    bg: '#E6F2FF',
  },
};

export default function IntentBadge({ intent, size = 'medium' }: IntentBadgeProps) {
  const config = INTENT_CONFIG[intent] || INTENT_CONFIG.adoption;

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: config.bg, borderColor: config.color },
        size === 'small' && styles.badgeSmall,
        size === 'large' && styles.badgeLarge,
      ]}
    >
      <Text style={styles.icon}>{config.icon}</Text>
      <Text
        style={[
          styles.label,
          { color: config.color },
          size === 'small' && styles.labelSmall,
          size === 'large' && styles.labelLarge,
        ]}
      >
        {config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    alignSelf: 'flex-start',
    gap: 4,
  },
  badgeSmall: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeLarge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
  },
  icon: {
    fontSize: 12,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: FONTS.semiBold,
  },
  labelSmall: {
    fontSize: 8,
  },
  labelLarge: {
    fontSize: 12,
  },
});
