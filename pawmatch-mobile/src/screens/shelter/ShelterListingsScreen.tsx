import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { colors } from '../../theme/colors';
import { supabase } from '../../services/supabase';
import { Listing, Pet } from '../../types';
import { useNavigation } from '@react-navigation/native';

export default function ShelterListingsScreen() {
  const navigation = useNavigation();
  const [listings, setListings] = useState<(Listing & { pet?: Pet })[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Fetch adoption listings for this shelter
      const { data: listingsData, error } = await supabase
        .from('listings')
        .select('*, pet:pet_id(*)')
        .eq('owner_id', user.id)
        .eq('type', 'adoption')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data to include pet info
      const transformed = (listingsData || []).map((listing: any) => ({
        ...listing,
        pet: listing.pet || null,
      }));

      setListings(transformed);
    } catch (error: any) {
      console.error('Error loading listings:', error);
      Alert.alert('Error', 'Could not load listings');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const updateListingStatus = async (listingId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('listings')
        .update({ status: newStatus })
        .eq('id', listingId);

      if (error) throw error;
      loadListings();
    } catch (error: any) {
      Alert.alert('Error', 'Could not update listing');
    }
  };

  const deleteListing = async (listingId: string) => {
    Alert.alert(
      'Delete Listing',
      'Are you sure you want to delete this listing?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('listings')
                .delete()
                .eq('id', listingId);

              if (error) throw error;
              loadListings();
            } catch (error: any) {
              Alert.alert('Error', 'Could not delete listing');
            }
          },
        },
      ]
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadListings();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live':
        return colors.success;
      case 'reserved':
        return colors.secondary;
      case 'closed':
        return colors.textSecondary;
      default:
        return colors.textSecondary;
    }
  };

  const renderListingItem = ({ item }: { item: Listing & { pet?: Pet } }) => {
    const petPhoto = item.pet?.photos?.[0] || item.photos?.[0];

    return (
      <TouchableOpacity
        style={styles.listingCard}
        onPress={() =>
          navigation.navigate('PetDetail' as never, { petId: item.petId } as never)
        }
        activeOpacity={0.8}
      >
        <Image
          source={
            petPhoto
              ? { uri: petPhoto }
              : { uri: 'https://via.placeholder.com/200?text=PawMatch' }
          }
          style={styles.petImage}
          resizeMode="cover"
        />
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <View style={styles.headerLeft}>
              <Text style={styles.petName}>
                {item.pet?.name || item.title}
              </Text>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(item.status) + '20' },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    { color: getStatusColor(item.status) },
                  ]}
                >
                  {item.status.toUpperCase()}
                </Text>
              </View>
            </View>
          </View>
          <Text style={styles.petBreed}>{item.pet?.breed || 'Unknown'}</Text>
          <Text style={styles.petLocation}>
            {item.city}, {item.country}
          </Text>
          <View style={styles.statsRow}>
            <Text style={styles.views}>👁️ {item.views || 0} views</Text>
            {item.createdAt && (
              <Text style={styles.date}>
                {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            )}
          </View>
          <View style={styles.actionButtons}>
            {item.status === 'live' && (
              <TouchableOpacity
                style={[styles.actionButton, styles.reserveButton]}
                onPress={() => updateListingStatus(item.id, 'reserved')}
              >
                <Text style={styles.actionButtonText}>Mark Reserved</Text>
              </TouchableOpacity>
            )}
            {item.status === 'reserved' && (
              <TouchableOpacity
                style={[styles.actionButton, styles.closeButton]}
                onPress={() => updateListingStatus(item.id, 'closed')}
              >
                <Text style={styles.actionButtonText}>Mark Adopted</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.actionButton, styles.editButton]}
              onPress={() =>
                navigation.navigate('ShelterAddPet' as never, {
                  petId: item.petId,
                  editMode: true,
                } as never)
              }
            >
              <Text style={styles.actionButtonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => deleteListing(item.id)}
            >
              <Text style={styles.actionButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.secondary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Adoption Listings</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => navigation.navigate('ShelterAddPet' as never)}
        >
          <Text style={styles.createButtonText}>+ New Listing</Text>
        </TouchableOpacity>
      </View>

      {listings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📝</Text>
          <Text style={styles.emptyText}>No listings yet</Text>
          <Text style={styles.emptySubtext}>
            Create your first adoption listing to help pets find homes
          </Text>
          <TouchableOpacity
            style={styles.emptyCreateButton}
            onPress={() => navigation.navigate('ShelterAddPet' as never)}
          >
            <Text style={styles.emptyCreateButtonText}>Create Listing</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={listings}
          renderItem={renderListingItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
  },
  createButton: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  createButtonText: {
    color: colors.background,
    fontWeight: '600',
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyCreateButton: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyCreateButtonText: {
    color: colors.background,
    fontWeight: '600',
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  listingCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  petImage: {
    width: 120,
    height: 120,
  },
  cardContent: {
    flex: 1,
    padding: 16,
  },
  cardHeader: {
    marginBottom: 8,
  },
  headerLeft: {
    marginBottom: 4,
  },
  petName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  petBreed: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  petLocation: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  views: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  date: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    minWidth: 80,
  },
  reserveButton: {
    backgroundColor: colors.secondary + '20',
  },
  closeButton: {
    backgroundColor: colors.success + '20',
  },
  editButton: {
    backgroundColor: colors.primary + '20',
  },
  deleteButton: {
    backgroundColor: '#FF3B30' + '20',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});