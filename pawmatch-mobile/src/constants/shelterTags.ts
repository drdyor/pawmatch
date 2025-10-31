// Shelter Tags Constants for Quick Intake
export const TEMPERAMENT_TAGS = [
  'Gentle',
  'Friendly',
  'Affectionate',
  'Playful',
  'Curious',
  'Calm',
  'Shy',
  'Confident',
  'Independent',
  'Cuddly',
];

export const PERSONALITY_TAGS = [
  'Good with dogs',
  'Good with cats',
  'Good with small dogs',
  'Leash trained',
  'Crate trained',
  'House trained',
  'Quiet',
];

export const ENERGY_LEVELS = ['low', 'medium', 'high'] as const;

export type EnergyLevel = typeof ENERGY_LEVELS[number];
