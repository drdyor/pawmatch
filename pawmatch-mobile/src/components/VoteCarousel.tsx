// Community Voting Component - Accessible from both Discoveries
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { COLORS, FONTS } from '../theme';
import { CommunityPairing } from '../types';

interface VoteCarouselProps {
  pairings: CommunityPairing[];
  onVote: (pairingId: string) => void;
  onJoinWaitlist: (pairingId: string) => void;
}

export default function VoteCarousel({
  pairings,
  onVote,
  onJoinWaitlist,
}: VoteCarouselProps) {
  const [votedPairs, setVotedPairs] = useState<Set<string>>(new Set());

  const handleVote = (pairingId: string) => {
    if (!votedPairs.has(pairingId)) {
      setVotedPairs(new Set([...votedPairs, pairingId]));
      onVote(pairingId);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🗳️ Community Matchmaking</Text>
        <Text style={styles.subtitle}>Vote for the perfect pairings</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {pairings.map((pairing) => {
          const hasVoted = votedPairs.has(pairing.id);
          return (
            <View key={pairing.id} style={styles.card}>
              <View style={styles.pairingImages}>
                <View style={styles.petImageContainer}>
                  <Image
                    source={
                      pairing.malePet.photos && pairing.malePet.photos.length > 0
                        ? { uri: pairing.malePet.photos[0] }
                        : require('../assets/images/placeholder-pet.png')
                    }
                    style={styles.petImage}
                  />
                  <Text style={styles.petLabel}>♂️ {pairing.malePet.name}</Text>
                </View>
                <Text style={styles.plus}>+</Text>
                <View style={styles.petImageContainer}>
                  <Image
                    source={
                      pairing.femalePet.photos && pairing.femalePet.photos.length > 0
                        ? { uri: pairing.femalePet.photos[0] }
                        : require('../assets/images/placeholder-pet.png')
                    }
                    style={styles.petImage}
                  />
                  <Text style={styles.petLabel}>♀️ {pairing.femalePet.name}</Text>
                </View>
              </View>

              <View style={styles.info}>
                <Text style={styles.breedInfo}>
                  {pairing.malePet.breed || 'Mixed'} × {pairing.femalePet.breed || 'Mixed'}
                </Text>
                <View style={styles.stats}>
                  <View style={styles.voteCount}>
                    <Text style={styles.voteCountText}>❤️ {pairing.votes}</Text>
                    <Text style={styles.voteLabel}>Votes</Text>
                  </View>
                  <View style={styles.waitlistCount}>
                    <Text style={styles.waitlistCountText}>📋 {pairing.waitlist.length}</Text>
                    <Text style={styles.waitlistLabel}>Waitlist</Text>
                  </View>
                </View>
              </View>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={[styles.voteButton, hasVoted && styles.voteButtonVoted]}
                  onPress={() => handleVote(pairing.id)}
                  disabled={hasVoted}
                >
                  <Text style={styles.voteButtonText}>
                    {hasVoted ? '✓ Voted' : 'Vote'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.waitlistButton}
                  onPress={() => onJoinWaitlist(pairing.id)}
                >
                  <Text style={styles.waitlistButtonText}>Join Waitlist</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.neutral,
    paddingVertical: 16,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 20,
    color: COLORS.text,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 16,
  },
  card: {
    width: 280,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  pairingImages: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  petImageContainer: {
    alignItems: 'center',
    flex: 1,
  },
  petImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 6,
  },
  petLabel: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: '600',
    textAlign: 'center',
  },
  plus: {
    fontSize: 24,
    color: COLORS.textSecondary,
    marginHorizontal: 8,
  },
  info: {
    marginBottom: 12,
  },
  breedInfo: {
    fontFamily: FONTS.semiBold,
    fontSize: 14,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  voteCount: {
    alignItems: 'center',
  },
  voteCountText: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: COLORS.primary,
  },
  voteLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  waitlistCount: {
    alignItems: 'center',
  },
  waitlistCountText: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: COLORS.secondary,
  },
  waitlistLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  actions: {
    gap: 8,
  },
  voteButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  voteButtonVoted: {
    backgroundColor: COLORS.success,
  },
  voteButtonText: {
    color: '#fff',
    fontFamily: FONTS.bold,
    fontSize: 14,
  },
  waitlistButton: {
    backgroundColor: COLORS.neutral,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  waitlistButtonText: {
    color: COLORS.text,
    fontFamily: FONTS.medium,
    fontSize: 14,
  },
});
