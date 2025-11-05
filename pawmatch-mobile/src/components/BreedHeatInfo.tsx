import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from '../theme/colors';
import { supabase } from '../services/supabase';

interface BreedHeatInfoProps {
  breed: string;
  petId?: string;
}

interface BreedWarning {
  warning_key: string;
  warning_message: string;
  cycle_number: number;
  was_silent: boolean;
}

interface BreedInfo {
  size: string;
  firstHeat: string;
  cycleFrequency: string;
  heatDuration: string;
  fertileWindow: string;
  notes: string;
}

const BREED_HEAT_INFO: { [key: string]: BreedInfo } = {
  // Small breeds (6-25 lbs)
  'Maltese': {
    size: 'Small',
    firstHeat: '4-8 months',
    cycleFrequency: 'Every 4-6 months',
    heatDuration: '18-24 days',
    fertileWindow: 'Days 9-15',
    notes: 'Small breeds mature early. Watch for silent heats. May need assistance during breeding.'
  },
  'Yorkshire Terrier': {
    size: 'Small',
    firstHeat: '4-8 months',
    cycleFrequency: 'Every 4-6 months',
    heatDuration: '18-24 days',
    fertileWindow: 'Days 9-15',
    notes: 'Toy breeds can have irregular cycles. Monitor weight during pregnancy.'
  },
  'Chihuahua': {
    size: 'Small',
    firstHeat: '4-8 months',
    cycleFrequency: 'Every 4-6 months',
    heatDuration: '18-24 days',
    fertileWindow: 'Days 9-15',
    notes: 'Smallest breed. C-sections often needed. Breed only mature females.'
  },
  'Pomeranian': {
    size: 'Small',
    firstHeat: '4-8 months',
    cycleFrequency: 'Every 4-6 months',
    heatDuration: '18-24 days',
    fertileWindow: 'Days 9-15',
    notes: 'Spitz breed. Double coat affects heat detection. Regular grooming important.'
  },

  // Medium breeds (25-60 lbs)
  'Border Collie': {
    size: 'Medium',
    firstHeat: '6-12 months',
    cycleFrequency: 'Every 5-7 months',
    heatDuration: '18-24 days',
    fertileWindow: 'Days 9-16',
    notes: 'Highly intelligent working breed. Maintain mental stimulation during heat.'
  },
  'Australian Shepherd': {
    size: 'Medium',
    firstHeat: '6-12 months',
    cycleFrequency: 'Every 5-7 months',
    heatDuration: '18-24 days',
    fertileWindow: 'Days 9-16',
    notes: 'Herding breed. May show nesting behavior. Good mothers typically.'
  },
  'Cocker Spaniel': {
    size: 'Medium',
    firstHeat: '6-12 months',
    cycleFrequency: 'Every 5-7 months',
    heatDuration: '18-24 days',
    fertileWindow: 'Days 9-16',
    notes: 'Sporting breed. Regular ear cleaning important during heat cycles.'
  },
  'Beagle': {
    size: 'Medium',
    firstHeat: '6-12 months',
    cycleFrequency: 'Every 5-7 months',
    heatDuration: '18-24 days',
    fertileWindow: 'Days 9-16',
    notes: 'Hound breed. May be more vocal during heat. Pack animals, social.'
  },

  // Large breeds (60-90 lbs)
  'German Shepherd': {
    size: 'Large',
    firstHeat: '8-14 months',
    cycleFrequency: 'Every 6-8 months',
    heatDuration: '21-28 days',
    fertileWindow: 'Days 10-17',
    notes: 'Working breed. Hip/elbow screening before breeding. Strong protective instincts.'
  },
  'Golden Retriever': {
    size: 'Large',
    firstHeat: '8-14 months',
    cycleFrequency: 'Every 6-8 months',
    heatDuration: '21-28 days',
    fertileWindow: 'Days 10-17',
    notes: 'Sporting breed. Gentle temperament. Screen for hip dysplasia and eye issues.'
  },
  'Labrador Retriever': {
    size: 'Large',
    firstHeat: '8-14 months',
    cycleFrequency: 'Every 6-8 months',
    heatDuration: '21-28 days',
    fertileWindow: 'Days 10-17',
    notes: 'Most popular breed. High energy. Screen for hip/elbow dysplasia, eye issues.'
  },
  'Rottweiler': {
    size: 'Large',
    firstHeat: '8-14 months',
    cycleFrequency: 'Every 6-8 months',
    heatDuration: '21-28 days',
    fertileWindow: 'Days 10-17',
    notes: 'Guardian breed. Strong, protective. Careful socialization of puppies important.'
  },

  // Giant breeds (90+ lbs)
  'Great Dane': {
    size: 'Giant',
    firstHeat: '12-18 months',
    cycleFrequency: 'Every 8-12 months',
    heatDuration: '21-28 days',
    fertileWindow: 'Days 11-18',
    notes: 'Giant breed. Very late maturity. Bloat risk. Short lifespan - breed early.'
  },
  'Saint Bernard': {
    size: 'Giant',
    firstHeat: '12-18 months',
    cycleFrequency: 'Every 10-12 months',
    heatDuration: '21-28 days',
    fertileWindow: 'Days 11-18',
    notes: 'Giant breed. Cold weather adapted. Large litters common. Hip screening essential.'
  },
  'Mastiff': {
    size: 'Giant',
    firstHeat: '12-18 months',
    cycleFrequency: 'Every 8-12 months',
    heatDuration: '21-28 days',
    fertileWindow: 'Days 11-18',
    notes: 'Ancient breed. Gentle giants. Short muzzle - monitor breathing during heat.'
  }
};

// Default info for unknown breeds
const DEFAULT_INFO: BreedInfo = {
  size: 'Medium',
  firstHeat: '6-12 months',
  cycleFrequency: 'Every 6 months',
  heatDuration: '21 days',
  fertileWindow: 'Days 9-16',
  notes: 'Heat cycles vary by individual dog. Consult your veterinarian for breed-specific advice.'
};

export const BreedHeatInfo: React.FC<BreedHeatInfoProps> = ({ breed, petId }) => {
  const info = BREED_HEAT_INFO[breed] || DEFAULT_INFO;
  const isKnownBreed = breed in BREED_HEAT_INFO;
  const [warnings, setWarnings] = useState<BreedWarning[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (petId) {
      loadWarnings();
    }
  }, [petId]);

  const loadWarnings = async () => {
    if (!petId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('vw_breed_warnings')
        .select('*')
        .eq('pet_id', petId);

      if (error) throw error;
      setWarnings(data || []);
    } catch (error) {
      console.error('Error loading breed warnings:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {isKnownBreed ? `${breed} Heat Cycle Info` : 'General Heat Cycle Info'}
        </Text>
        <View style={[styles.sizeBadge, { backgroundColor: getSizeColor(info.size) }]}>
          <Text style={styles.sizeText}>{info.size}</Text>
        </View>
      </View>

      {/* Veterinarian-Approved Warnings */}
      {warnings.length > 0 && (
        <View style={styles.warningsSection}>
          <Text style={styles.warningsSectionTitle}>⚠️ Important Breeding Guidance</Text>
          {warnings.map((warning, index) => (
            <View key={index} style={[
              styles.warningCard,
              warning.warning_key === 'silent_first' && styles.warningHigh,
              warning.warning_key === 'late_maturity' && styles.warningMedium
            ]}>
              <Text style={styles.warningIcon}>
                {warning.warning_key === 'silent_first' ? '🔔' : 
                 warning.warning_key === 'late_maturity' ? '⏳' : '📋'}
              </Text>
              <Text style={styles.warningText}>{warning.warning_message}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.infoGrid}>
        <InfoItem
          icon="🕐"
          label="First Heat"
          value={info.firstHeat}
        />
        <InfoItem
          icon="📅"
          label="Cycle Frequency"
          value={info.cycleFrequency}
        />
        <InfoItem
          icon="⏱️"
          label="Heat Duration"
          value={info.heatDuration}
        />
        <InfoItem
          icon="🎯"
          label="Fertile Window"
          value={info.fertileWindow}
        />
      </View>

      <View style={styles.notesSection}>
        <Text style={styles.notesTitle}>💡 Breed Notes</Text>
        <Text style={styles.notesText}>{info.notes}</Text>
      </View>

      {!isKnownBreed && (
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            ⚠️ Breed not in database. Showing general guidelines. Consult your vet for specific advice.
          </Text>
        </View>
      )}
    </View>
  );
};

const InfoItem: React.FC<{ icon: string; label: string; value: string }> = ({
  icon,
  label,
  value,
}) => (
  <View style={styles.infoItem}>
    <Text style={styles.infoIcon}>{icon}</Text>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const getSizeColor = (size: string): string => {
  switch (size.toLowerCase()) {
    case 'small': return '#FF6B6B';
    case 'medium': return '#4ECDC4';
    case 'large': return '#45B7D1';
    case 'giant': return '#96CEB4';
    default: return '#95A5A6';
  }
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
  },
  sizeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sizeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  infoItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  infoIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  notesSection: {
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  notesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  notesText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  disclaimer: {
    backgroundColor: '#FFF3CD',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
  },
  disclaimerText: {
    fontSize: 12,
    color: '#856404',
    lineHeight: 16,
  },
  warningsSection: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#fff8e1',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ff9800',
  },
  warningsSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#e65100',
    marginBottom: 12,
  },
  warningCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 10,
    marginBottom: 8,
    backgroundColor: '#fff',
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#ff9800',
  },
  warningHigh: {
    borderLeftColor: '#f44336',
    backgroundColor: '#ffebee',
  },
  warningMedium: {
    borderLeftColor: '#ff9800',
    backgroundColor: '#fff8e1',
  },
  warningIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
});
