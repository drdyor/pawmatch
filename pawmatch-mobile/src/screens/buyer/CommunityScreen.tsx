// screens/buyer/CommunityScreen.tsx - Community Voting/Arranged Marriage
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import { COLORS, FONTS } from '../../theme';
import { CommunityPairing, Pet } from '../../types';

// Mock data for demonstration
const MOCK_PAIRINGS: CommunityPairing[] = [
  {
    id: 'pair-1',
    malePet: {
      id: 'pet-1',
      ownerId: 'owner-1',
      ownerRole: 'breeder_registered',
      name: 'Max',
      species: 'dog',
      breed: 'Pharaoh Hound',
      sex: 'male',
      dateOfBirth: '2020-01-01',
      photos: [],
      healthRecords: [],
      status: 'stud_available',
      city: 'Valletta',
      country: 'Malta',
      createdAt: '2024-01-01',
    },
    femalePet: {
      id: 'pet-2',
      ownerId: 'owner-2',
      ownerRole: 'breeder_registered',
      name: 'Luna',
      species: 'dog',
      breed: 'Maltese',
      sex: 'female',
      dateOfBirth: '2021-01-01',
      photos: [],
      healthRecords: [],
      status: 'available',
      city: 'Sliema',
      country: 'Malta',
      createdAt: '2024-01-01',
    },
    requestedBy: 'user-123',
    votes: 45,
    waitlist: ['user-456', 'user-789'],
    createdAt: '2024-01-15',
  },
];

export default function CommunityScreen({ navigation }: any) {
  const [pairings, setPairings] = useState(MOCK_PAIRINGS);
  const [votes, setVotes] = useState<Record<string, number>>({});

  const handleVote = (pairingId: string) => {
    setVotes(prev => ({
      ...prev,
      [pairingId]: (prev[pairingId] || 0) + 1,
    }));
    Alert.alert('Voted!', 'Your vote has been counted.');
  };

  const handleJoinWaitlist = (pairingId: string) => {
    const pairing = pairings.find(p => p.id === pairingId);
    Alert.alert(
      'Join Waitlist',
      `You have joined the waitlist for ${pairing?.malePet.name} x ${pairing?.femalePet.name}`
    );
  };

  const sortedPairings = [...pairings].sort(
    (a, b) => (votes[b.id] || b.votes) - (votes[a.id] || a.votes)
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.gradientBackground} />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>🗳️ Community Matchmaking</Text>
          <Text style={styles.subtitle}>Vote for the perfect pairings</Text>
        </View>

        {/* Pairings List */}
        <View style={styles.listContainer}>
          {sortedPairings.map((pairing) => {
            const totalVotes = (votes[pairing.id] || 0) + pairing.votes;
            return (
              <View key={pairing.id} style={styles.pairingCard}>
                <View style={styles.pairingHeader}>
                  <Text style={styles.pairingName}>
                    {pairing.malePet.name} x {pairing.femalePet.name}
                  </Text>
                  <View style={styles.voteContainer}>
                    <Text style={styles.voteCount}>{totalVotes}</Text>
                    <Text style={styles.voteLabel}>Votes</Text>
                  </View>
                </View>

                <View style={styles.pairingDetails}>
                  <Text style={styles.breedInfo}>
                    {pairing.malePet.breed} x {pairing.femalePet.breed}
                  </Text>
                  <Text style={styles.requestedBy}>
                    Requested by: User {pairing.requestedBy.slice(-3)}
                  </Text>
                </View>

                <View style={styles.badges}>
                  <View style={[styles.badge, styles.verifiedBadge]}>
                    <Text style={styles.badgeText}>✅ Vet-Verified</Text>
                  </View>
                  <View style={[styles.badge, styles.stagBadge]}>
                    <Text style={styles.badgeText}>Stag Available</Text>
                  </View>
                </View>

                <View style={styles.actions}>
                  <TouchableOpacity
                    style={styles.voteButton}
                    onPress={() => handleVote(pairing.id)}
                  >
                    <Text style={styles.voteButtonText}>👍 Vote</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.waitlistButton}
                    onPress={() => handleJoinWaitlist(pairing.id)}
                  >
                    <Text style={styles.waitlistButtonText}>Join Waitlist</Text>
                  </TouchableOpacity>
                </View>

                {pairing.waitlist.length > 0 && (
                  <Text style={styles.waitlistInfo}>
                    {pairing.waitlist.length} people on waitlist
                  </Text>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: COLORS.backgroundGradientStart,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: 'transparent',
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: FONTS.medium,
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  pairingCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  pairingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  pairingName: {
    fontFamily: FONTS.semiBold,
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
  },
  voteContainer: {
    alignItems: 'center',
  },
  voteCount: {
    fontFamily: FONTS.bold,
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
  },
  voteLabel: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: '#6B7280',
  },
  pairingDetails: {
    marginBottom: 12,
  },
  breedInfo: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 4,
  },
  requestedBy: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: '#6B7280',
  },
  badges: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  verifiedBadge: {
    backgroundColor: 'rgba(39, 174, 96, 0.2)',
  },
  stagBadge: {
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
  },
  badgeText: {
    fontFamily: FONTS.semiBold,
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.text,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  voteButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  voteButtonText: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  waitlistButton: {
    flex: 1,
    backgroundColor: COLORS.secondary,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  waitlistButtonText: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  waitlistInfo: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
  },
});
