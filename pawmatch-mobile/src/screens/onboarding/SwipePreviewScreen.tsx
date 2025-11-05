import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
} from 'react-native';
import { Header } from '../../components/ui/Header';
import { Card } from '../../components/ui/Card';
import { Toggle } from '../../components/ui/Toggle';
import { HealthBadges } from '../../components/ui/HealthBadges';

interface SwipePreviewScreenProps {
  onNext: (data: { initialTab?: string }) => void;
  onBack: () => void;
}

const SAMPLE_PETS = [
  {
    name: 'Max',
    breed: 'Border Collie',
    age: 4,
    distance: '3 km',
    health: [
      { type: 'vaccinated' as const, date: '2025-09-10' },
      { type: 'dna_tested' as const, date: '2025-06-20' },
    ],
    temperament: ['Friendly', 'Agile'],
    img: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=600&auto=format&fit=crop',
  },
  {
    name: 'Odin',
    breed: 'Australian Shepherd',
    age: 5,
    distance: '5 km',
    health: [{ type: 'vaccinated' as const, date: '2025-08-01' }],
    temperament: ['Energetic'],
    img: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?q=80&w=600&auto=format&fit=crop',
  },
  {
    name: 'Zeke',
    breed: 'Border Collie',
    age: 3,
    distance: '2 km',
    health: [{ type: 'dna_tested' as const, date: '2025-07-12' }],
    temperament: ['Gentle'],
    img: 'https://images.unsplash.com/photo-1477973770766-6228305816df?q=80&w=600&auto=format&fit=crop',
  },
];

export function SwipePreviewScreen({
  onNext,
  onBack,
}: SwipePreviewScreenProps) {
  const [index, setIndex] = useState(0);
  const [matched, setMatched] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [arrangements, setArrangements] = useState({
    pickOfLitter: false,
    splitPuppies: false,
    studFee: false,
  });

  const currentPet = SAMPLE_PETS[index];

  const handleFinishOnboarding = () => {
    // Show welcome modal first, then complete onboarding
    setShowWelcomeModal(true);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Header step={4} max={5} onBack={onBack} title="Independent Owner" />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Swipe preview</Text>
        <Text style={styles.subtitle}>
          Right = interested · Left = pass
        </Text>

        <Card style={styles.petCard}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: currentPet.img }}
              style={styles.image}
              resizeMode="cover"
            />
            <View style={styles.distanceBadge}>
              <Text style={styles.distanceIcon}>📍</Text>
              <Text style={styles.distanceText}>{currentPet.distance}</Text>
            </View>
          </View>

          <View style={styles.petInfo}>
            <View style={styles.petHeader}>
              <View style={styles.petDetails}>
                <Text style={styles.petName}>
                  {currentPet.name} · {currentPet.breed}
                </Text>
                <Text style={styles.petAge}>{currentPet.age} years</Text>
              </View>
              <HealthBadges health={currentPet.health} />
            </View>

            <View style={styles.temperamentList}>
              {currentPet.temperament.map((t) => (
                <View key={t} style={styles.temperamentChip}>
                  <Text style={styles.temperamentText}>{t}</Text>
                </View>
              ))}
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                onPress={() => setIndex((i) => (i + 1) % SAMPLE_PETS.length)}
                style={styles.passButton}
                activeOpacity={0.7}
              >
                <Text style={styles.passText}>Pass</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setMatched(true)}
                style={styles.likeButton}
                activeOpacity={0.8}
              >
                <Text style={styles.likeText}>Interested</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Card>

        <TouchableOpacity
          onPress={handleFinishOnboarding}
          style={styles.button}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Finish onboarding</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Welcome Modal - Shows AFTER finishing onboarding */}
      <Modal
        visible={showWelcomeModal}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setShowWelcomeModal(false);
          onNext({});
        }}
      >
        <View style={styles.modalOverlay}>
          <Card style={styles.modal}>
            <View style={styles.modalContent}>
              <Text style={styles.matchIcon}>🐾</Text>
              <Text style={styles.matchTitle}>Welcome to PawMatch!</Text>
              <Text style={styles.matchText}>
                Let's discover pets in your area searching for a mate
              </Text>

              <TouchableOpacity
                onPress={() => {
                  setShowWelcomeModal(false);
                  onNext({ initialTab: 'discover' });
                }}
                style={styles.welcomeButton}
                activeOpacity={0.8}
              >
                <Text style={styles.welcomeButtonText}>Start Discovering</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setShowWelcomeModal(false);
                  onNext({});
                }}
                style={styles.skipButton}
                activeOpacity={0.7}
              >
                <Text style={styles.skipButtonText}>Skip for Now</Text>
              </TouchableOpacity>
            </View>
          </Card>
        </View>
      </Modal>

      {/* Match Modal */}
      <Modal
        visible={matched}
        transparent
        animationType="fade"
        onRequestClose={() => setMatched(false)}
      >
        <View style={styles.modalOverlay}>
          <Card style={styles.modal}>
            <View style={styles.modalContent}>
              <Text style={styles.matchIcon}>❤️</Text>
              <Text style={styles.matchTitle}>It's a match!</Text>
              <Text style={styles.matchText}>
                Open chat and choose an arrangement:
              </Text>

              <View style={styles.arrangements}>
                <Toggle
                  checked={arrangements.pickOfLitter}
                  onChange={(val) =>
                    setArrangements({ ...arrangements, pickOfLitter: val })
                  }
                  label="Pick of litter"
                />
                <Toggle
                  checked={arrangements.splitPuppies}
                  onChange={(val) =>
                    setArrangements({ ...arrangements, splitPuppies: val })
                  }
                  label="Split puppies 50/50"
                />
                <Toggle
                  checked={arrangements.studFee}
                  onChange={(val) =>
                    setArrangements({ ...arrangements, studFee: val })
                  }
                  label="Stud fee"
                />
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  onPress={() => setMatched(false)}
                  style={styles.modalClose}
                  activeOpacity={0.7}
                >
                  <Text style={styles.modalCloseText}>Close</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setMatched(false);
                    onNext({ initialTab: 'messages' });
                  }}
                  style={styles.modalChat}
                  activeOpacity={0.8}
                >
                  <Text style={styles.modalChatText}>Open Chat</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Card>
        </View>
      </Modal>
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
  petCard: {
    overflow: 'hidden',
    marginBottom: 16,
  },
  imageContainer: {
    height: 400,
    backgroundColor: '#F5F5F5',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  distanceBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  distanceIcon: {
    fontSize: 12,
  },
  distanceText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#171717',
  },
  petInfo: {
    padding: 16,
  },
  petHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  petDetails: {
    flex: 1,
  },
  petName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#171717',
  },
  petAge: {
    fontSize: 13,
    color: '#737373',
    marginTop: 2,
  },
  temperamentList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  temperamentChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  temperamentText: {
    fontSize: 12,
    color: '#171717',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  passButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D4D4D4',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  passText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#171717',
  },
  likeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#FFC700',
  },
  likeText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  button: {
    backgroundColor: '#171717',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modal: {
    width: '100%',
    maxWidth: 400,
  },
  modalContent: {
    padding: 20,
    alignItems: 'center',
  },
  matchIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  matchTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#171717',
    marginBottom: 4,
  },
  matchText: {
    fontSize: 13,
    color: '#737373',
    marginBottom: 12,
  },
  arrangements: {
    width: '100%',
    gap: 8,
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
  },
  modalClose: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D4D4D4',
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#171717',
  },
  modalChat: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#FFC700',
    alignItems: 'center',
  },
  modalChatText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  welcomeButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#FFC700',
    alignItems: 'center',
    marginTop: 16,
  },
  welcomeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  skipButton: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  skipButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#737373',
  },
});
