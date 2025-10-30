import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { Colors, Spacing } from '../constants/Colors';

interface Pet {
  id: string;
  name: string;
  breed: string;
  photo: string;
  voteCount: number;
  hasVoted: boolean;
}

interface VotingCardProps {
  pet: Pet;
  onVote: (petId: string) => void;
  onUnvote: (petId: string) => void;
}

export const VotingCard: React.FC<VotingCardProps> = ({ pet, onVote, onUnvote }) => {
  const [voted, setVoted] = useState(pet.hasVoted);
  const [count, setCount] = useState(pet.voteCount);

  const handleVote = () => {
    if (voted) {
      setVoted(false);
      setCount(count - 1);
      onUnvote(pet.id);
    } else {
      setVoted(true);
      setCount(count + 1);
      onVote(pet.id);
    }
  };

  return (
    <View style={styles.card}>
      <Image source={{ uri: pet.photo }} style={styles.photo} />
      
      <View style={styles.content}>
        <View style={styles.info}>
          <Text style={styles.name}>{pet.name}</Text>
          <Text style={styles.breed}>{pet.breed}</Text>
        </View>
        
        <View style={styles.voteSection}>
          <View style={styles.voteCount}>
            <Text style={styles.fireEmoji}>🔥</Text>
            <Text style={styles.countText}>{count}</Text>
            <Text style={styles.countLabel}>want puppies</Text>
          </View>
          
          <TouchableOpacity
            style={[styles.voteButton, voted && styles.voteButtonActive]}
            onPress={handleVote}
          >
            <Text style={[styles.voteButtonText, voted && styles.voteButtonTextActive]}>
              {voted ? '💛 Voted' : '🤍 Vote'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

interface BreedingPair {
  petA: Pet;
  petB: Pet;
  voteCount: number;
  preOrders: number;
  hasVoted: boolean;
}

interface PairVotingCardProps {
  pair: BreedingPair;
  onVote: (petAId: string, petBId: string, commitment: string) => void;
}

export const PairVotingCard: React.FC<PairVotingCardProps> = ({ pair, onVote }) => {
  const [showCommitment, setShowCommitment] = useState(false);

  const handleCommitment = (level: string) => {
    onVote(pair.petA.id, pair.petB.id, level);
    setShowCommitment(false);
  };

  return (
    <View style={styles.pairCard}>
      <View style={styles.pairPhotos}>
        <Image source={{ uri: pair.petA.photo }} style={styles.pairPhoto} />
        <View style={styles.heartOverlay}>
          <Text style={styles.heartEmoji}>💛</Text>
        </View>
        <Image source={{ uri: pair.petB.photo }} style={styles.pairPhoto} />
      </View>
      
      <View style={styles.pairContent}>
        <Text style={styles.pairTitle}>
          {pair.petA.name} × {pair.petB.name}
        </Text>
        <Text style={styles.pairBreeds}>
          {pair.petA.breed} + {pair.petB.breed}
        </Text>
        
        <View style={styles.pairStats}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{pair.voteCount}</Text>
            <Text style={styles.statLabel}>votes</Text>
          </View>
          {pair.preOrders > 0 && (
            <View style={styles.stat}>
              <Text style={[styles.statNumber, styles.preOrderNumber]}>{pair.preOrders}</Text>
              <Text style={styles.statLabel}>pre-orders!</Text>
            </View>
          )}
        </View>
        
        {!showCommitment ? (
          <TouchableOpacity
            style={[styles.voteButton, styles.pairVoteButton]}
            onPress={() => setShowCommitment(true)}
          >
            <Text style={styles.voteButtonText}>
              {pair.hasVoted ? '✅ Voted' : '💛 I want these puppies!'}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.commitmentOptions}>
            <Text style={styles.commitmentTitle}>How interested?</Text>
            <TouchableOpacity
              style={styles.commitmentButton}
              onPress={() => handleCommitment('interested')}
            >
              <Text style={styles.commitmentText}>👀 Interested</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.commitmentButton}
              onPress={() => handleCommitment('very_interested')}
            >
              <Text style={styles.commitmentText}>💛 Very Interested</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.commitmentButton, styles.commitmentButtonPrimary]}
              onPress={() => handleCommitment('pre_order')}
            >
              <Text style={[styles.commitmentText, styles.commitmentTextPrimary]}>
                🎯 Reserve a Puppy!
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      {pair.voteCount >= 100 && (
        <View style={styles.trendingBadge}>
          <Text style={styles.trendingText}>🔥 TRENDING</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
  },
  photo: {
    width: '100%',
    height: 200,
    backgroundColor: Colors.surface,
  },
  content: {
    padding: Spacing.md,
  },
  info: {
    marginBottom: Spacing.sm,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  breed: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  voteSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  voteCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  fireEmoji: {
    fontSize: 20,
  },
  countText: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  countLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  voteButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  voteButtonActive: {
    backgroundColor: '#FFF9E6',
    borderColor: Colors.primary,
  },
  voteButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  voteButtonTextActive: {
    color: Colors.text,
  },
  
  // Pair Card Styles
  pairCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: Colors.primary,
    marginBottom: Spacing.md,
    position: 'relative',
  },
  pairPhotos: {
    flexDirection: 'row',
    height: 150,
    position: 'relative',
  },
  pairPhoto: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  heartOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }],
    backgroundColor: Colors.white,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  heartEmoji: {
    fontSize: 24,
  },
  pairContent: {
    padding: Spacing.md,
  },
  pairTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
  },
  pairBreeds: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  pairStats: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.xl,
    marginBottom: Spacing.md,
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
  },
  preOrderNumber: {
    color: Colors.success,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  pairVoteButton: {
    width: '100%',
    alignItems: 'center',
  },
  commitmentOptions: {
    gap: Spacing.sm,
  },
  commitmentTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  commitmentButton: {
    paddingVertical: Spacing.sm,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  commitmentButtonPrimary: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  commitmentText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  commitmentTextPrimary: {
    color: Colors.text,
  },
  trendingBadge: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: Colors.danger,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trendingText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.white,
  },
});
