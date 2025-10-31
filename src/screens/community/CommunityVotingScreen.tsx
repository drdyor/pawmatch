// Community Voting Screen - Vote on pairings and popular pets
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  ToastAndroid,
} from 'react-native';
import { PALETTE } from '../../theme/palette';
import { SHADOW } from '../../theme/palette';

const VOTE_COLORS = {
  primary: '#E11D48',
  secondary: '#111827',
  bg: '#FFFFFF',
  text: '#111827',
} as const;

const HEALTH_BADGES = [
  { id: 'fiv', label: 'FIV/FeLV negative', icon: '??', color: '#10B981' },
  { id: 'hip', label: 'No hip dysplasia', icon: '??', color: '#10B981' },
  { id: 'vet', label: 'Vet checked', icon: '??', color: '#EF4444', date: '2026-09-10' },
  { id: 'dna', label: 'DNA tested clear', icon: '??', color: '#2563EB' },
] as const;

type VotePet = {
  id: string;
  name: string;
  breed: string;
  votes: number;
  health: string[];
  verified?: boolean;
  reputation?: number;
  photo_url?: string;
};

const DEMO_PETS: VotePet[] = [
  {
    id: 'luna',
    name: 'Luna',
    breed: 'Border Collie',
    votes: 500,
    health: ['fiv', 'hip', 'vet'],
    verified: true,
    reputation: 850,
    photo_url: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=400',
  },
  {
    id: 'max',
    name: 'Max',
    breed: 'German Shepherd',
    votes: 320,
    health: ['fiv', 'dna'],
    verified: true,
    reputation: 720,
    photo_url: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=400',
  },
  {
    id: 'bella',
    name: 'Bella',
    breed: 'Labrador',
    votes: 250,
    health: ['vet', 'dna'],
    verified: false,
    reputation: 610,
    photo_url: 'https://images.unsplash.com/photo-1543465346-992b53c0e8d4?q=80&w=400',
  },
  {
    id: 'charlie',
    name: 'Charlie',
    breed: 'Golden Retriever',
    votes: 170,
    health: ['hip', 'vet'],
    verified: true,
    reputation: 780,
    photo_url: 'https://images.unsplash.com/photo-1542060748-10c28b62716f?q=80&w=400',
  },
];

function VoteHealthBadges({ badges }: { badges: string[] }) {
  return (
    <View style={styles.badgeRow}>
      {badges.map((b) => {
        const meta = (HEALTH_BADGES as readonly any[]).find((h) => h.id === b);
        if (!meta) return null;
        return (
          <View key={b} style={[styles.badge, { backgroundColor: meta.color + '20' }]}>
            <Text style={[styles.badgeIcon, { color: meta.color }]}>{meta.icon}</Text>
            <Text style={[styles.badgeText, { color: meta.color }]}>{meta.label}</Text>
            {'date' in meta && meta.date && (
              <Text style={styles.badgeDate}>{meta.date}</Text>
            )}
          </View>
        );
      })}
    </View>
  );
}

function VotePetCard({ pet, onVote, voteCount }: { pet: VotePet; onVote: (id: string) => void; voteCount: number }) {
  return (
    <View style={[styles.petCard, SHADOW.card]}>
      <Image
        source={{ uri: pet.photo_url || 'https://via.placeholder.com/100' }}
        style={styles.petImage}
      />
      <View style={styles.petInfo}>
        <Text style={styles.petName}>{pet.name}</Text>
        <Text style={styles.petBreed}>{pet.breed}</Text>
        <VoteHealthBadges badges={pet.health} />
        {pet.verified && (
          <Text style={styles.verified}>? Vet-verified until 2026-09-10</Text>
        )}
        {typeof pet.reputation === 'number' && (
          <Text style={styles.reputation}>Trusted Breeder ? {pet.reputation} pts</Text>
        )}
      </View>
      <View style={styles.voteCol}>
        <Text style={styles.voteCount}>{voteCount}</Text>
        <Text style={styles.voteLabel}>want</Text>
        <TouchableOpacity style={styles.voteButton} onPress={() => onVote(pet.id)}>
          <Text style={styles.voteButtonText}>Vote</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function DreamPairCard({ pair, onCommit }: { pair: { id: string; name1: string; name2: string }; onCommit: (id: string) => void }) {
  return (
    <View style={[styles.pairCard, SHADOW.card]}>
      <View style={styles.pairImages}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=300' }}
          style={styles.pairImage}
        />
        <View style={styles.heartCircle}>
          <Text style={styles.heart}>??</Text>
        </View>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=300' }}
          style={styles.pairImage}
        />
      </View>
      <Text style={styles.pairTitle}>{pair.name1} ? {pair.name2}</Text>
      <View style={styles.pairStats}>
        <Text style={styles.pairVotes}>250 votes</Text>
        <Text style={styles.pairPreorders}>50 pre-orders!</Text>
      </View>
      <TouchableOpacity style={styles.commitButton} onPress={() => onCommit(pair.id)}>
        <Text style={styles.commitButtonText}>I want these puppies!</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function CommunityVotingScreen() {
  const [voteMap, setVoteMap] = useState<Record<string, number>>(
    DEMO_PETS.reduce((acc, p) => {
      acc[p.id] = p.votes;
      return acc;
    }, {} as Record<string, number>)
  );
  const [activeTab, setActiveTab] = useState<'pets' | 'pairs'>('pets');

  const handleVote = (id: string) => {
    setVoteMap((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    
    if (Platform.OS === 'android') {
      ToastAndroid.show('Vote counted!', ToastAndroid.SHORT);
    }
  };

  const handleCommit = (id: string) => {
    Alert.alert('Join Waitlist', `You've joined the waitlist for this pairing!`);
  };

  const sortedPets = useMemo(() => {
    return [...DEMO_PETS].sort((a, b) => (voteMap[b.id] || b.votes) - (voteMap[a.id] || a.votes));
  }, [voteMap]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>?? Community Voting</Text>
        <Text style={styles.subtitle}>Vote for the puppies you want to see</Text>
        
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'pets' && styles.tabActive]}
            onPress={() => setActiveTab('pets')}
          >
            <Text style={[styles.tabText, activeTab === 'pets' && styles.tabTextActive]}>
              Popular Pets
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'pairs' && styles.tabActive]}
            onPress={() => setActiveTab('pairs')}
          >
            <Text style={[styles.tabText, activeTab === 'pairs' && styles.tabTextActive]}>
              Dream Pairs
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {activeTab === 'pets' ? (
          <>
            {sortedPets.map((pet) => (
              <VotePetCard
                key={pet.id}
                pet={pet}
                onVote={handleVote}
                voteCount={voteMap[pet.id] ?? pet.votes}
              />
            ))}
          </>
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Dream Pairs</Text>
            <DreamPairCard
              pair={{ id: 'luna-max', name1: 'Luna', name2: 'Max' }}
              onCommit={handleCommit}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: VOTE_COLORS.bg,
  },
  header: {
    padding: 16,
    backgroundColor: '#F7F7F7',
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: VOTE_COLORS.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    marginBottom: 12,
  },
  tabBar: {
    flexDirection: 'row',
    gap: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFF',
    ...SHADOW.small,
  },
  tabActive: {
    backgroundColor: '#000',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
  },
  tabTextActive: {
    color: '#fff',
  },
  content: {
    padding: 16,
  },
  section: {
    padding: 16,
    backgroundColor: '#F7F7F7',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: VOTE_COLORS.text,
  },
  petCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
  },
  petImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  petInfo: {
    flex: 1,
    marginLeft: 12,
  },
  petName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: VOTE_COLORS.text,
    marginBottom: 4,
  },
  petBreed: {
    fontSize: 15,
    color: '#6B7280',
    marginBottom: 6,
  },
  verified: {
    fontSize: 12,
    color: '#10B981',
    marginTop: 4,
  },
  reputation: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  voteCol: {
    alignItems: 'center',
    marginLeft: 12,
    justifyContent: 'center',
  },
  voteCount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: VOTE_COLORS.text,
  },
  voteLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  voteButton: {
    backgroundColor: VOTE_COLORS.primary,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 6,
  },
  voteButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  badgeDate: {
    fontSize: 10,
    marginLeft: 4,
    color: '#6B7280',
  },
  pairCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  pairImages: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  pairImage: {
    width: 140,
    height: 140,
    borderRadius: 12,
  },
  heartCircle: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 8,
    marginHorizontal: -20,
    zIndex: 1,
    ...SHADOW.small,
  },
  heart: {
    fontSize: 20,
  },
  pairTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: VOTE_COLORS.text,
  },
  pairStats: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 12,
  },
  pairVotes: {
    fontSize: 16,
    fontWeight: '600',
    color: VOTE_COLORS.text,
  },
  pairPreorders: {
    fontSize: 16,
    fontWeight: '600',
    color: VOTE_COLORS.primary,
  },
  commitButton: {
    backgroundColor: VOTE_COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  commitButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
  },
});
