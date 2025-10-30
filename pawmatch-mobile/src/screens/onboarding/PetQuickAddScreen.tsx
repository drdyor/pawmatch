import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Header } from '../../components/ui/Header';
import { Card } from '../../components/ui/Card';
import { Chip } from '../../components/ui/Chip';
import { HealthBadges } from '../../components/ui/HealthBadges';

interface Pet {
  name: string;
  species: 'Dog' | 'Cat';
  breed: string;
  age: string;
  temperament: string[];
  badges: {
    vaccinated: boolean;
    dna: boolean;
  };
}

interface PetQuickAddScreenProps {
  onNext: (data: { pets: Pet[] }) => void;
  onBack: () => void;
}

const TEMPERAMENT_OPTIONS = [
  'Friendly',
  'Calm',
  'Energetic',
  'Gentle',
  'Good with kids',
  'Dog-park pro',
];

export function PetQuickAddScreen({ onNext, onBack }: PetQuickAddScreenProps) {
  const [pets, setPets] = useState<Pet[]>([]);
  const [draft, setDraft] = useState<Pet>({
    name: '',
    species: 'Dog',
    breed: '',
    age: '',
    temperament: [],
    badges: { vaccinated: true, dna: false },
  });

  const toggleTemperament = (t: string) => {
    setDraft((d) => ({
      ...d,
      temperament: d.temperament.includes(t)
        ? d.temperament.filter((x) => x !== t)
        : [...d.temperament, t],
    }));
  };

  const addPet = () => {
    if (!draft.name) return;
    setPets((p) => [...p, { ...draft }]);
    setDraft({
      name: '',
      species: draft.species,
      breed: '',
      age: '',
      temperament: [],
      badges: { vaccinated: true, dna: false },
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Header step={2} max={5} onBack={onBack} title="Independent Owner" />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Add your pet(s)</Text>
        <Text style={styles.subtitle}>
          Create quick profiles now—you can refine later.
        </Text>

        <Card style={styles.card}>
          <View style={styles.form}>
            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                  value={draft.name}
                  onChangeText={(name) => setDraft({ ...draft, name })}
                  placeholder="Luna"
                  style={styles.input}
                  placeholderTextColor="#A3A3A3"
                />
              </View>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Species</Text>
                <View style={styles.chipRow}>
                  <Chip
                    active={draft.species === 'Dog'}
                    onPress={() => setDraft({ ...draft, species: 'Dog' })}
                  >
                    🐶 Dog
                  </Chip>
                  <Chip
                    active={draft.species === 'Cat'}
                    onPress={() => setDraft({ ...draft, species: 'Cat' })}
                  >
                    🐱 Cat
                  </Chip>
                </View>
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Breed</Text>
                <TextInput
                  value={draft.breed}
                  onChangeText={(breed) => setDraft({ ...draft, breed })}
                  placeholder="Border Collie"
                  style={styles.input}
                  placeholderTextColor="#A3A3A3"
                />
              </View>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Age (years)</Text>
                <TextInput
                  value={draft.age}
                  onChangeText={(age) => setDraft({ ...draft, age })}
                  placeholder="3"
                  style={styles.input}
                  keyboardType="numeric"
                  placeholderTextColor="#A3A3A3"
                />
              </View>
            </View>

            <View>
              <Text style={styles.label}>Temperament</Text>
              <View style={styles.chipWrap}>
                {TEMPERAMENT_OPTIONS.map((tag) => (
                  <Chip
                    key={tag}
                    active={draft.temperament.includes(tag)}
                    onPress={() => toggleTemperament(tag)}
                  >
                    {tag}
                  </Chip>
                ))}
              </View>
            </View>

            <View>
              <Text style={styles.label}>Health badges</Text>
              <View style={styles.chipRow}>
                <Chip
                  active={draft.badges.vaccinated}
                  onPress={() =>
                    setDraft({
                      ...draft,
                      badges: {
                        ...draft.badges,
                        vaccinated: !draft.badges.vaccinated,
                      },
                    })
                  }
                >
                  ✅ Vaccinated
                </Chip>
                <Chip
                  active={draft.badges.dna}
                  onPress={() =>
                    setDraft({
                      ...draft,
                      badges: { ...draft.badges, dna: !draft.badges.dna },
                    })
                  }
                >
                  ✨ DNA Clear
                </Chip>
              </View>
            </View>

            <View>
              <Text style={styles.label}>Photos</Text>
              <TouchableOpacity style={styles.upload} activeOpacity={0.7}>
                <Text style={styles.uploadIcon}>⬆️</Text>
                <Text style={styles.uploadText}>
                  Drag & drop or click to add
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.addRow}>
              <TouchableOpacity
                onPress={addPet}
                style={styles.addButton}
                activeOpacity={0.7}
              >
                <Text style={styles.addIcon}>➕</Text>
                <Text style={styles.addText}>Add pet to list</Text>
              </TouchableOpacity>
              <Text style={styles.hint}>You can add multiple pets.</Text>
            </View>
          </View>
        </Card>

        {pets.length > 0 && (
          <Card style={styles.petList}>
            <Text style={styles.petListTitle}>My pets</Text>
            <View style={styles.pets}>
              {pets.map((p, i) => (
                <View key={i} style={styles.petCard}>
                  <View style={styles.petInfo}>
                    <Text style={styles.petName}>
                      {p.name} · {p.breed || p.species}
                    </Text>
                    <Text style={styles.petDetails}>
                      {p.age || '?'} yrs ·{' '}
                      {p.temperament.slice(0, 2).join(', ')}
                    </Text>
                    <HealthBadges
                      health={[
                        ...(p.badges?.vaccinated
                          ? [
                              {
                                type: 'vaccinated' as const,
                                date: new Date().toISOString().slice(0, 10),
                              },
                            ]
                          : []),
                        ...(p.badges?.dna
                          ? [
                              {
                                type: 'dna_tested' as const,
                                date: new Date().toISOString().slice(0, 10),
                              },
                            ]
                          : []),
                      ]}
                    />
                  </View>
                  <Text style={styles.ready}>Ready</Text>
                </View>
              ))}
            </View>
          </Card>
        )}

        <TouchableOpacity
          onPress={() => onNext({ pets })}
          style={styles.button}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#171717',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#737373',
    marginBottom: 16,
  },
  card: {
    padding: 16,
    marginBottom: 16,
  },
  form: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  label: {
    fontSize: 13,
    color: '#737373',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D4D4D4',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#171717',
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  upload: {
    borderWidth: 2,
    borderColor: '#D4D4D4',
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 32,
    alignItems: 'center',
    gap: 8,
  },
  uploadIcon: {
    fontSize: 20,
  },
  uploadText: {
    fontSize: 13,
    color: '#737373',
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D4D4D4',
  },
  addIcon: {
    fontSize: 16,
  },
  addText: {
    fontSize: 14,
    color: '#171717',
  },
  hint: {
    fontSize: 13,
    color: '#737373',
  },
  petList: {
    padding: 16,
    marginBottom: 16,
  },
  petListTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#171717',
    marginBottom: 8,
  },
  pets: {
    gap: 8,
  },
  petCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  petInfo: {
    flex: 1,
  },
  petName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#171717',
  },
  petDetails: {
    fontSize: 12,
    color: '#737373',
    marginTop: 2,
  },
  ready: {
    fontSize: 12,
    color: '#D97706',
  },
  button: {
    backgroundColor: '#FFC700',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
