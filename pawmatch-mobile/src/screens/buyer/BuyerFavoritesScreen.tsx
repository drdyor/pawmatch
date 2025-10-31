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

export default function BuyerFavoritesScreen() {
  const navigation = useNavigation();
  const [favorites, setFavorites] = useState<(Listing & { pet?: Pet })[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Fetch favorites with listing and pet data
      const { data: favoritesData, error } = await supabase
        .from('favorites')
        .select('*, listing:listing_id(*, pet:pet_id(*))')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data to include pet info
      const transformed = (favoritesData || []).map((fav: any) => ({
        ...fav.listing,
        pet: fav.listing?.pet || null,
      }));

      setFavorites(transformed);
    } catch (error: any) {
      console.error('Error loading favorites:', error);
      Alert.alert('Error', 'Could not load favorites');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const removeFavorite = async (listingId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('listing_id', listingId);

      if (error) throw error;

      // Reload favorites
      loadFavorites();
    } catch (error: any) {
      Alert.alert('Error', 'Could not remove favorite');
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadFavorites();
  };

  const renderFavoriteItem = ({ item }: { item: Listing & { pet?: Pet } }) => {
    const petPhoto = item.pet?.photos?.[0] || item.photos?.[0];

    return (
      <TouchableOpacity
        style={styles.favoriteCard}
        onPress={() => navigation.navigate('PetDetail' as never, { petId: item.petId } as never)}
        activeOpacity={0.8}
      >
        <Image
          source={
            petPhoto
              ? { uri: petPhoto }
              : require('../../assets/images/placeholder-pet.png')
          }
          style={styles.petImage}
          resizeMode="cover"
        />
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.petName}>{item.pet?.name || item.title}</Text>
            <TouchableOpacity
              onPress={() => removeFavorite(item.id)}
              style={styles.removeButton}
            >
              <Text style={styles.removeIcon}>❌</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.petBreed}>{item.pet?.breed || 'Unknown'}</Text>
          <Text style={styles.petLocation}>
            {item.city}, {item.country}
          </Text>
          {item.price && (
            <Text style={styles.price}>
              {new Intl.NumberFormat('en-MT', {
                style: 'currency',
                currency: 'EUR',
              }).format(item.price / 100)}
            </Text>
          )}
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
      <Text style={styles.title}>Favorites</Text>
      
      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>❤️</Text>
          <Text style={styles.emptyText}>No favorites yet</Text>
          <Text style={styles.emptySubtext}>
            Swipe right on pets you like to save them here
          </Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderFavoriteItem}
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
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 20,
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
  },
  listContent: {
    paddingBottom: 20,
  },
  favoriteCard: {
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
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  petName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
  },
  removeButton: {
    padding: 4,
  },
  removeIcon: {
    fontSize: 16,
  },
  petBreed: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  petLocation: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.secondary,
    marginTop: 4,
  },
});