import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Image,
} from 'react-native';
import { Colors, Spacing } from '../constants/Colors';

type ArrangementType = 'share_puppies' | 'pick_of_litter' | 'stud_fee' | 'custom';

interface Match {
  id: string;
  yourPet: {
    name: string;
    breed: string;
    photo: string;
  };
  theirPet: {
    name: string;
    breed: string;
    photo: string;
    owner: string;
  };
}

interface MatchModalProps {
  visible: boolean;
  match: Match | null;
  onClose: () => void;
  onSelectArrangement: (matchId: string, arrangement: ArrangementType) => void;
}

const ARRANGEMENTS = [
  {
    type: 'share_puppies' as ArrangementType,
    emoji: '🤝',
    title: 'Share Puppies',
    description: 'Split the litter 50/50 or alternate picks',
    popular: true,
  },
  {
    type: 'pick_of_litter' as ArrangementType,
    emoji: '🥇',
    title: 'Pick of Litter',
    description: 'One owner gets first pick, then split the rest',
    popular: true,
  },
  {
    type: 'stud_fee' as ArrangementType,
    emoji: '💰',
    title: 'Stud Fee',
    description: 'Pay or receive a breeding fee',
  },
  {
    type: 'custom' as ArrangementType,
    emoji: '💬',
    title: 'Custom Arrangement',
    description: 'Discuss and agree on your own terms',
  },
];

export const MatchModal: React.FC<MatchModalProps> = ({
  visible,
  match,
  onClose,
  onSelectArrangement,
}) => {
  const [selectedArrangement, setSelectedArrangement] = useState<ArrangementType | null>(null);

  if (!match) return null;

  const handleContinue = () => {
    if (selectedArrangement) {
      onSelectArrangement(match.id, selectedArrangement);
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent presentationStyle="overFullScreen">
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Match Header */}
          <View style={styles.matchHeader}>
            <Text style={styles.matchTitle}>It's a Match! 🎉</Text>
            <Text style={styles.matchSubtitle}>
              You and {match.theirPet.owner} both swiped right!
            </Text>
          </View>

          {/* Pet Photos */}
          <View style={styles.petsContainer}>
            <View style={styles.petCard}>
              <Image source={{ uri: match.yourPet.photo }} style={styles.petPhoto} />
              <Text style={styles.petName}>{match.yourPet.name}</Text>
              <Text style={styles.petBreed}>{match.yourPet.breed}</Text>
              <Text style={styles.petLabel}>Your Pet</Text>
            </View>

            <View style={styles.heartContainer}>
              <Text style={styles.heartEmoji}>💛</Text>
            </View>

            <View style={styles.petCard}>
              <Image source={{ uri: match.theirPet.photo }} style={styles.petPhoto} />
              <Text style={styles.petName}>{match.theirPet.name}</Text>
              <Text style={styles.petBreed}>{match.theirPet.breed}</Text>
              <Text style={styles.petLabel}>{match.theirPet.owner}'s Pet</Text>
            </View>
          </View>

          <ScrollView style={styles.content}>
            <Text style={styles.sectionTitle}>What arrangement works for you?</Text>
            <Text style={styles.sectionSubtitle}>
              You can discuss details in the chat, this is just a starting point
            </Text>

            {/* Arrangement Options */}
            <View style={styles.arrangements}>
              {ARRANGEMENTS.map((arrangement) => (
                <TouchableOpacity
                  key={arrangement.type}
                  style={[
                    styles.arrangementCard,
                    selectedArrangement === arrangement.type && styles.arrangementCardSelected,
                  ]}
                  onPress={() => setSelectedArrangement(arrangement.type)}
                >
                  {arrangement.popular && (
                    <View style={styles.popularBadge}>
                      <Text style={styles.popularText}>Popular</Text>
                    </View>
                  )}
                  
                  <Text style={styles.arrangementEmoji}>{arrangement.emoji}</Text>
                  <Text style={styles.arrangementTitle}>{arrangement.title}</Text>
                  <Text style={styles.arrangementDescription}>{arrangement.description}</Text>
                  
                  <View
                    style={[
                      styles.radio,
                      selectedArrangement === arrangement.type && styles.radioSelected,
                    ]}
                  >
                    {selectedArrangement === arrangement.type && (
                      <View style={styles.radioDot} />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.buttonSecondary]}
              onPress={onClose}
            >
              <Text style={styles.buttonTextSecondary}>Decide Later</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.button,
                styles.buttonPrimary,
                !selectedArrangement && styles.buttonDisabled,
              ]}
              onPress={handleContinue}
              disabled={!selectedArrangement}
            >
              <Text style={styles.buttonText}>Start Chatting 💬</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  matchHeader: {
    alignItems: 'center',
    paddingTop: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  matchTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  matchSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  petsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  petCard: {
    alignItems: 'center',
    flex: 1,
  },
  petPhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: Spacing.sm,
    backgroundColor: Colors.surface,
  },
  petName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  petBreed: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  petLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  heartContainer: {
    marginHorizontal: Spacing.md,
  },
  heartEmoji: {
    fontSize: 40,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    maxHeight: 400,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  arrangements: {
    gap: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  arrangementCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: Spacing.lg,
    borderWidth: 2,
    borderColor: Colors.border,
    position: 'relative',
  },
  arrangementCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: '#FFF9E6',
  },
  popularBadge: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: Colors.success,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.white,
  },
  arrangementEmoji: {
    fontSize: 32,
    marginBottom: Spacing.sm,
  },
  arrangementTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  arrangementDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  radio: {
    position: 'absolute',
    top: Spacing.lg,
    right: Spacing.lg,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: Colors.primary,
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  button: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonPrimary: {
    backgroundColor: Colors.primary,
  },
  buttonSecondary: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  buttonDisabled: {
    backgroundColor: Colors.border,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  buttonTextSecondary: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
});
