import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { colors } from '../../theme/colors';

const BREEDS_DOG = [
  'Golden Retriever',
  'Labrador Retriever',
  'German Shepherd',
  'French Bulldog',
  'Border Collie',
  'Poodle',
  'Maltese',
  'Chihuahua',
  'Beagle',
  'Yorkshire Terrier',
  'Mixed Breed',
];

const BREEDS_CAT = [
  'Persian',
  'Maine Coon',
  'British Shorthair',
  'Siamese',
  'Ragdoll',
  'Bengal',
  'Mixed Breed',
];

export default function BreederOnboardingIntro({ navigation, route }: any) {
  const { userName } = route.params;
  
  const [breederType, setBreederType] = useState<'independent' | 'registered' | null>(null);
  const [breeds, setBreeds] = useState<string[]>([]);
  const [customBreed, setCustomBreed] = useState('');
  const [kennelSize, setKennelSize] = useState<'1-3' | '4-10' | '10+' | null>(null);
  const [experience, setExperience] = useState<'first' | '1-3' | '3-5' | '5+' | null>(null);
  const [kennelName, setKennelName] = useState('');
  const [showDogs, setShowDogs] = useState(true);
  const [showCats, setShowCats] = useState(false);

  const toggleBreed = (breed: string) => {
    setBreeds(prev =>
      prev.includes(breed) ? prev.filter(b => b !== breed) : [...prev, breed]
    );
  };

  const addCustomBreed = () => {
    if (customBreed.trim() && !breeds.includes(customBreed.trim())) {
      setBreeds(prev => [...prev, customBreed.trim()]);
      setCustomBreed('');
    }
  };

  const canContinue = breederType && breeds.length > 0 && kennelSize && experience;

  const handleContinue = () => {
    navigation.navigate('BreederOnboardingIntent', {
      userName,
      breederType,
      breeds,
      kennelSize,
      experience,
      kennelName: breederType === 'registered' ? kennelName : null,
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.progressBar}>
            <View style={[styles.progressDot, styles.progressActive]} />
            <View style={styles.progressLine} />
            <View style={styles.progressDot} />
            <View style={styles.progressLine} />
            <View style={styles.progressDot} />
          </View>
          
          <Text style={styles.title}>Welcome, {userName}! 🐾</Text>
          <Text style={styles.subtitle}>
            Let's set up your PawMatch breeder profile. This helps buyers find you and understand your breeding program.
          </Text>
        </View>

        {/* Breeder Type */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>I am a...</Text>
          <View style={styles.pillGroup}>
            <PillButton
              label="Independent / First-time"
              selected={breederType === 'independent'}
              onPress={() => setBreederType('independent')}
            />
            <PillButton
              label="Registered Kennel"
              selected={breederType === 'registered'}
              onPress={() => setBreederType('registered')}
            />
          </View>
        </View>

        {/* Kennel Name (if registered) */}
        {breederType === 'registered' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Kennel Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Pawsome Maltese"
              value={kennelName}
              onChangeText={setKennelName}
            />
          </View>
        )}

        {/* Breeds */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Breeds I work with</Text>
          
          <View style={styles.speciesToggle}>
            <TouchableOpacity
              style={[styles.speciesButton, showDogs && styles.speciesButtonActive]}
              onPress={() => setShowDogs(!showDogs)}
            >
              <Text style={styles.speciesText}>🐕 Dogs</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.speciesButton, showCats && styles.speciesButtonActive]}
              onPress={() => setShowCats(!showCats)}
            >
              <Text style={styles.speciesText}>🐈 Cats</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.pillGroup}>
            {showDogs && BREEDS_DOG.map(breed => (
              <PillButton
                key={breed}
                label={breed}
                selected={breeds.includes(breed)}
                onPress={() => toggleBreed(breed)}
              />
            ))}
            {showCats && BREEDS_CAT.map(breed => (
              <PillButton
                key={breed}
                label={breed}
                selected={breeds.includes(breed)}
                onPress={() => toggleBreed(breed)}
              />
            ))}
          </View>

          <View style={styles.customBreedRow}>
            <TextInput
              style={[styles.input, styles.customInput]}
              placeholder="Other breed..."
              value={customBreed}
              onChangeText={setCustomBreed}
            />
            <TouchableOpacity style={styles.addButton} onPress={addCustomBreed}>
              <Text style={styles.addButtonText}>+ Add</Text>
            </TouchableOpacity>
          </View>

          {breeds.length > 0 && (
            <Text style={styles.selectedCount}>
              ✓ Selected: {breeds.join(', ')}
            </Text>
          )}
        </View>

        {/* Kennel Size */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How many breeding dogs/cats?</Text>
          <View style={styles.pillGroup}>
            <PillButton label="1–3 animals" selected={kennelSize === '1-3'} onPress={() => setKennelSize('1-3')} />
            <PillButton label="4–10 animals" selected={kennelSize === '4-10'} onPress={() => setKennelSize('4-10')} />
            <PillButton label="10+ animals" selected={kennelSize === '10+'} onPress={() => setKennelSize('10+')} />
          </View>
        </View>

        {/* Experience */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Breeding experience</Text>
          <View style={styles.pillGroup}>
            <PillButton label="First litter" selected={experience === 'first'} onPress={() => setExperience('first')} />
            <PillButton label="1–3 years" selected={experience === '1-3'} onPress={() => setExperience('1-3')} />
            <PillButton label="3–5 years" selected={experience === '3-5'} onPress={() => setExperience('3-5')} />
            <PillButton label="5+ years" selected={experience === '5+'} onPress={() => setExperience('5+')} />
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.continueButton, !canContinue && styles.continueButtonDisabled]}
          onPress={handleContinue}
          disabled={!canContinue}
        >
          <Text style={styles.continueButtonText}>
            Continue → Your Focus
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function PillButton({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity
      style={[styles.pill, selected && styles.pillSelected]}
      onPress={onPress}
    >
      <Text style={[styles.pillText, selected && styles.pillTextSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2F3A4A',
    marginBottom: 16,
  },
  pillGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  pill: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  pillSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  pillText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#6B7280',
  },
  pillTextSelected: {
    color: '#000',
    fontWeight: '600',
  },
  speciesToggle: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  speciesButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.background,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  speciesButtonActive: {
    borderColor: colors.secondary,
    backgroundColor: colors.background,
  },
  speciesText: {
    fontSize: 16,
    fontWeight: '600',
  },
  customBreedRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: colors.background,
  },
  customInput: {
    flex: 1,
  },
  addButton: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 20,
    borderRadius: 12,
    justifyContent: 'center',
  },
  addButtonText: {
    color: colors.background,
    fontWeight: '600',
    fontSize: 14,
  },
  selectedCount: {
    fontSize: 14,
    color: colors.success,
    marginTop: 12,
  },
  footer: {
    padding: 20,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFF8F0',
  },
  continueButton: {
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
