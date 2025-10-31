import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { colors } from '../../theme/colors';
import { supabase } from '../../services/supabase';
import { Pet } from '../../types';

export default function PetDetailScreen({ navigation, route }: any) {
  const { petId, listingId } = route.params;
  const [pet, setPet] = useState<Pet | null>(null);
  const [owner, setOwner] = useState<any>(null);
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    loadPetDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadPetDetails = async () => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();
        setCurrentUser(userData);
      }

      // Load pet
      const { data: petData, error: petError } = await supabase
        .from('pets')
        .select('*')
        .eq('id', petId)
        .single();

      if (petError) throw petError;
      setPet(petData);

      // Load owner
      const { data: ownerData } = await supabase
        .from('users')
        .select('id, full_name, kennel_name, shelter_name, city, phone_number')
        .eq('id', petData.owner_id)
        .single();

      setOwner(ownerData);

      // Load listing if provided
      if (listingId) {
        const { data: listingData } = await supabase
          .from('listings')
          .select('*')
          .eq('id', listingId)
          .single();

        setListing(listingData);
      }
    } catch (error) {
      console.error('Error loading pet details:', error);
      Alert.alert('Error', 'Could not load pet details');
    } finally {
      setLoading(false);
    }
  };

  const handleContact = () => {
    if (!owner || !currentUser) return;
    
    const conversationId = [currentUser.id, owner.id].sort().join('_');
    
    navigation.navigate('ChatThread', {
      conversationId,
      otherUserId: owner.id,
      otherUserName: owner.kennel_name || owner.shelter_name || owner.full_name || 'Owner',
    });
  };

  const getAge = () => {
    if (!pet?.dateOfBirth) return 'Unknown age';
    const today = new Date();
    const birthDate = new Date(pet.dateOfBirth);
    const years = Math.floor((today.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 365));
    const months = Math.floor((today.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 30)) % 12;
    
    if (years === 0) return `${months} month${months !== 1 ? 's' : ''} old`;
    if (months === 0) return `${years} year${years !== 1 ? 's' : ''} old`;
    return `${years}y ${months}m old`;
  };

  const getOwnerName = () => {
    if (!owner) return 'Unknown';
    return owner.kennel_name || owner.shelter_name || owner.full_name || 'Owner';
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.secondary} />
      </View>
    );
  }

  if (!pet) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Pet not found</Text>
      </View>
    );
  }

  const isOwner = currentUser?.id === pet.ownerId;

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Photo Section */}
        <View style={styles.photoSection}>
          {pet.photos && pet.photos.length > 0 ? (
            <Image source={{ uri: pet.photos[0] }} style={styles.photo} resizeMode="cover" />
          ) : (
            <View style={styles.placeholderPhoto}>
              <Text style={styles.placeholderEmoji}>
                {pet.species === 'dog' ? '🐕' : pet.species === 'cat' ? '🐈' : '🐾'}
              </Text>
            </View>
          )}
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{pet.name}</Text>
              <Text style={styles.sex}>{pet.sex === 'male' ? '♂️' : '♀️'}</Text>
            </View>
            <Text style={styles.breed}>{pet.breed}</Text>
          </View>

          {/* Quick Stats */}
          <View style={styles.statsGrid}>
            <StatItem icon="📅" label="Age" value={getAge()} />
            <StatItem icon="📍" label="Location" value={pet.city || 'Malta'} />
            {pet.weight && <StatItem icon="⚖️" label="Weight" value={`${pet.weight} kg`} />}
            {pet.size && <StatItem icon="📏" label="Size" value={pet.size} />}
          </View>

          {/* Status Badge */}
          {pet.status && (
            <View style={styles.statusSection}>
              {pet.status === 'in_heat' && (
                <View style={[styles.statusBadge, { backgroundColor: colors.danger }]}>
                  <Text style={styles.statusText}>🔥 Currently in Heat</Text>
                </View>
              )}
              {pet.status === 'stud_available' && (
                <View style={[styles.statusBadge, { backgroundColor: colors.secondary }]}>
                  <Text style={styles.statusText}>💫 Available for Stud</Text>
                </View>
              )}
              {pet.status === 'at_risk' && (
                <View style={[styles.statusBadge, { backgroundColor: colors.danger }]}>
                  <Text style={styles.statusText}>🚨 Urgent - Needs Home</Text>
                </View>
              )}
            </View>
          )}

          {/* Listing Price */}
          {listing && (
            <View style={styles.priceSection}>
              <Text style={styles.priceLabel}>
                {listing.type === 'adoption' ? 'Adoption Fee' : 'Price'}
              </Text>
              <Text style={styles.price}>
                €{(listing.price / 100).toFixed(0)}
              </Text>
              {listing.deposit && listing.deposit > 0 && (
                <Text style={styles.deposit}>
                  Deposit: €{(listing.deposit / 100).toFixed(0)}
                </Text>
              )}
            </View>
          )}

          {/* Description */}
          {pet.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About {pet.name}</Text>
              <Text style={styles.description}>{pet.description}</Text>
            </View>
          )}

          {/* Health Records */}
          {pet.healthRecords && pet.healthRecords.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Health & Clearances</Text>
              <View style={styles.healthBadges}>
                {pet.healthRecords.map((record, index) => (
                  <View key={index} style={styles.healthBadge}>
                    <Text style={styles.healthBadgeText}>✓ {record.title}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Owner Info */}
          {owner && !isOwner && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Owner</Text>
              <View style={styles.ownerCard}>
                <View style={styles.ownerIcon}>
                  <Text style={styles.ownerEmoji}>👤</Text>
                </View>
                <View style={styles.ownerInfo}>
                  <Text style={styles.ownerName}>{getOwnerName()}</Text>
                  {owner.city && (
                    <Text style={styles.ownerLocation}>📍 {owner.city}</Text>
                  )}
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Action Buttons */}
      {!isOwner && (
        <View style={styles.bottomActions}>
          <TouchableOpacity style={styles.contactButton} onPress={handleContact}>
            <Text style={styles.contactButtonText}>💬 Contact Owner</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

function StatItem({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
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
  },
  errorText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  photoSection: {
    height: 400,
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  placeholderPhoto: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderEmoji: {
    fontSize: 120,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  backButtonText: {
    fontSize: 24,
    color: colors.text,
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },
  sex: {
    fontSize: 32,
  },
  breed: {
    fontSize: 20,
    color: colors.textSecondary,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  statusSection: {
    marginBottom: 20,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.background,
  },
  priceSection: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  priceLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  price: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
  },
  deposit: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  healthBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  healthBadge: {
    backgroundColor: colors.success,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  healthBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.background,
  },
  ownerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  ownerIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ownerEmoji: {
    fontSize: 32,
  },
  ownerInfo: {
    flex: 1,
  },
  ownerName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  ownerLocation: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  bottomActions: {
    padding: 20,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  contactButton: {
    backgroundColor: colors.secondary,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.background,
  },
});
