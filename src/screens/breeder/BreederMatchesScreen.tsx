import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { colors } from '../../theme/colors';
import { supabase } from '../../services/supabase';
import { Pet } from '../../types';
import SwipeableCard from '../../components/SwipeableCard';

export default function BreederMatchesScreen({ navigation }: any) {
  const [availableStuds, setAvailableStuds] = useState<Pet[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [myFemalePets, setMyFemalePets] = useState<Pet[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Load my female pets
      const { data: females } = await supabase
        .from('pets')
        .select('*')
        .eq('owner_id', user.id)
        .eq('sex', 'female');

      setMyFemalePets(females || []);

      // If no females, show message
      if (!females || females.length === 0) {
        setLoading(false);
        return;
      }

      // Load available studs (exclude my own)
      const { data: studs, error } = await supabase
        .from('pets')
        .select('*')
        .eq('sex', 'male')
        .eq('status', 'stud_available')
        .neq('owner_id', user.id);

      if (error) throw error;

      // Filter studs by breed match if we have females
      const matchingStuds = studs?.filter(stud => 
        females.some(female => female.breed === stud.breed)
      ) || [];

      setAvailableStuds(matchingStuds);
    } catch (error) {
      console.error('Error loading studs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSwipeLeft = () => {
    // Pass - just move to next
    setCurrentIndex(prev => prev + 1);
  };

  const handleSwipeRight = async () => {
    // Interested - create match request
    const currentStud = availableStuds[currentIndex];
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Create notification for stud owner
      await supabase.from('notifications').insert({
        user_id: currentStud.ownerId,
        type: 'match',
        title: '💛 Breeding Interest',
        body: `Someone is interested in ${currentStud.name} for breeding. Check your messages!`,
        data: { pet_id: currentStud.id, from_user_id: user.id },
        read: false,
      });

      Alert.alert('Match Request Sent!', `The owner of ${currentStud.name} has been notified.`);
    } catch (error) {
      console.error('Error creating match:', error);
    }

    setCurrentIndex(prev => prev + 1);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.secondary} />
        <Text style={styles.loadingText}>Finding matches...</Text>
      </View>
    );
  }

  if (myFemalePets.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyIcon}>🐕</Text>
        <Text style={styles.emptyTitle}>Add a Female First</Text>
        <Text style={styles.emptyText}>
          To find stud matches, you need to add at least one female pet to your breeding program.
        </Text>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('My Pets')}
        >
          <Text style={styles.actionButtonText}>Go to My Pets</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (currentIndex >= availableStuds.length) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyIcon}>✨</Text>
        <Text style={styles.emptyTitle}>No More Studs</Text>
        <Text style={styles.emptyText}>
          You've seen all available studs for your breed. Check back later for new matches!
        </Text>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            setCurrentIndex(0);
            loadData();
          }}
        >
          <Text style={styles.actionButtonText}>Refresh</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Find Stud Matches</Text>
        <Text style={styles.subtitle}>
          Swipe right to express interest • Left to pass
        </Text>
      </View>

      <View style={styles.cardContainer}>
        {/* Show next 2 cards in stack */}
        {availableStuds.slice(currentIndex, currentIndex + 2).map((stud, index) => {
          if (index === 0) {
            // Top card - swipeable
            return (
              <SwipeableCard
                key={stud.id}
                pet={stud}
                onSwipeLeft={handleSwipeLeft}
                onSwipeRight={handleSwipeRight}
              />
            );
          } else {
            // Next card - static preview
            return (
              <View
                key={stud.id}
                style={[
                  styles.nextCard,
                  { transform: [{ scale: 0.95 }], opacity: 0.5 },
                ]}
              />
            );
          }
        })}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.passButton]}
          onPress={handleSwipeLeft}
        >
          <Text style={styles.buttonIcon}>👎</Text>
          <Text style={styles.buttonLabel}>Pass</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.likeButton]}
          onPress={handleSwipeRight}
        >
          <Text style={styles.buttonIcon}>💛</Text>
          <Text style={styles.buttonLabel}>Interested</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.counter}>
        <Text style={styles.counterText}>
          {currentIndex + 1} / {availableStuds.length}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.textSecondary,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  nextCard: {
    position: 'absolute',
    width: '90%',
    height: '85%',
    backgroundColor: colors.surface,
    borderRadius: 24,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  actionButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  passButton: {
    backgroundColor: colors.danger,
  },
  likeButton: {
    backgroundColor: colors.primary,
  },
  buttonIcon: {
    fontSize: 32,
    marginBottom: 4,
  },
  buttonLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.background,
  },
  counter: {
    position: 'absolute',
    top: 70,
    right: 20,
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  counterText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
});
