import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';

const INTENTS = [
  { id: 'track_heat', label: 'Track heat cycles', icon: '📅' },
  { id: 'find_stud', label: 'Find a stud for my female', icon: '🔗' },
  { id: 'advertise_stud', label: 'Advertise stud services', icon: '🐕' },
  { id: 'announce_litters', label: 'Announce litters', icon: '🐾' },
  { id: 'sell_puppies', label: 'Sell puppies ethically', icon: '🏠' },
  { id: 'connect_breeders', label: 'Connect with other breeders', icon: '💬' },
  { id: 'share_health', label: 'Share DNA or health results', icon: '🧬' },
  { id: 'vet_collab', label: 'Collaborate with vets', icon: '🩺' },
];

export default function BreederOnboardingIntent({ navigation, route }: any) {
  const { userName, breederType, breeds, kennelSize, experience, kennelName } = route.params;
  const [selectedIntents, setSelectedIntents] = useState<string[]>([]);

  const toggleIntent = (intentId: string) => {
    setSelectedIntents(prev =>
      prev.includes(intentId) ? prev.filter(i => i !== intentId) : [...prev, intentId]
    );
  };

  const handleContinue = () => {
    navigation.navigate('BreederOnboardingPets', {
      userName,
      breederType,
      breeds,
      kennelSize,
      experience,
      kennelName,
      intents: selectedIntents,
    });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.progressBar}>
            <View style={[styles.progressDot, styles.progressComplete]} />
            <View style={[styles.progressLine, styles.progressComplete]} />
            <View style={[styles.progressDot, styles.progressActive]} />
            <View style={styles.progressLine} />
            <View style={styles.progressDot} />
          </View>
          
          <Text style={styles.title}>What brings you to PawMatch?</Text>
          <Text style={styles.subtitle}>
            Choose all that apply — we'll tailor your dashboard for you.
          </Text>
        </View>

        {/* Intent Pills */}
        <View style={styles.intentGrid}>
          {INTENTS.map(intent => (
            <TouchableOpacity
              key={intent.id}
              style={[
                styles.intentCard,
                selectedIntents.includes(intent.id) && styles.intentCardSelected,
              ]}
              onPress={() => toggleIntent(intent.id)}
            >
              <Text style={styles.intentIcon}>{intent.icon}</Text>
              <Text
                style={[
                  styles.intentLabel,
                  selectedIntents.includes(intent.id) && styles.intentLabelSelected,
                ]}
              >
                {label}
              </Text>
              {selectedIntents.includes(intent.id) && (
                <View style={styles.checkmark}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {selectedIntents.length > 0 && (
          <View style={styles.selectionSummary}>
            <Text style={styles.summaryText}>
              ✨ Great! We'll set up: {selectedIntents.map(id => INTENTS.find(i => i.id === id)?.label).join(', ')}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.continueButton,
            selectedIntents.length === 0 && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={selectedIntents.length === 0}
        >
          <Text style={styles.continueButtonText}>
            Continue → Add Your Pets
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 32,
  },
  progressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E5E7EB',
  },
  progressActive: {
    backgroundColor: colors.primary,
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  progressComplete: {
    backgroundColor: colors.success,
  },
  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2F3A4A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
  },
  intentGrid: {
    gap: 12,
  },
  intentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    gap: 12,
  },
  intentCardSelected: {
    borderColor: colors.primary,
    backgroundColor: '#FFFBEB',
  },
  intentIcon: {
    fontSize: 28,
  },
  intentLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
  },
  intentLabelSelected: {
    color: '#000',
    fontWeight: '600',
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: colors.background,
    fontSize: 14,
    fontWeight: '700',
  },
  selectionSummary: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  summaryText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFF8F0',
    gap: 12,
  },
  backButton: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2F3A4A',
  },
  continueButton: {
    flex: 1,
    backgroundColor: colors.secondary,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.background,
  },
});
