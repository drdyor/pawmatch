// Enhanced theme with Malta colors + existing PawMatch colors
export const PALETTE = {
  // Malta-themed colors
  primary: '#FF6B6B',
  secondary: '#4ECDC4',
  accent: '#FFE66D',
  success: '#27AE60',
  warning: '#F39C12',
  neutral: '#F7F7F7',
  text: '#2C3E50',
  maltaBlue: '#003366',
  maltaRed: '#C8102E',
  
  // Existing PawMatch brand colors
  pawmatchYellow: '#FFC700',
  pawmatchBlue: '#2F80ED',
  background: '#FFFFFF',
  surface: '#F8F9FA',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  danger: '#FF3B30',
  info: '#007AFF',
  
  // Role colors
  breeder: '#2F80ED',
  shelter: '#34C759',
  buyer: '#FF9500',
  vet: '#8E44AD',
};

export const SHADOW = {
  card: {
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  small: {
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
};

// Export for compatibility with existing code
export const colors = PALETTE;
