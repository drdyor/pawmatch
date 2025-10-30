import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../../theme/colors';
import { supabase } from '../../services/supabase';
import { Pet } from '../../types';

export default function BreederCreateLitterScreen({ navigation }: any) {
  const [loading, setLoading] = useState(false);
  const [myPets, setMyPets] = useState<Pet[]>([]);
  
  // Form state
  const [selectedDam, setSelectedDam] = useState<string>('');
  const [studName, setStudName] = useState('');
  const [breed, setBreed] = useState('');
  const [expectedDate, setExpectedDate] = useState('');
  const [pupsExpected, setPupsExpected] = useState('');
  const [price, setPrice] = useState('');
  const [deposit, setDeposit] = useState('');
  const [description, setDescription] = useState('');
  const [sendNotification, setSendNotification] = useState(true);

  useEffect(() => {
    loadMyPets();
  }, []);

  const loadMyPets = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .eq('owner_id', user.id)
        .eq('sex', 'female')
        .in('species', ['dog', 'cat']);

      if (error) throw error;
      setMyPets(data || []);
    } catch (error) {
      console.error('Error loading pets:', error);
    }
  };

  const createLitterAnnouncement = async () => {
    // Validation
    if (!selectedDam || !breed || !expectedDate || !pupsExpected || !price) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const priceInCents = Math.round(parseFloat(price) * 100);
    const depositInCents = deposit ? Math.round(parseFloat(deposit) * 100) : 0;

    if (isNaN(priceInCents) || priceInCents <= 0) {
      Alert.alert('Error', 'Please enter a valid price');
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get user's location
      const { data: userData } = await supabase
        .from('users')
        .select('city, country')
        .eq('id', user.id)
        .single();

      // Get dam pet details
      const selectedPet = myPets.find(p => p.id === selectedDam);

      // Create listing
      const { data: listing, error: listingError } = await supabase
        .from('listings')
        .insert({
          pet_id: selectedDam,
          owner_id: user.id,
          owner_role: 'breeder_independent', // or breeder_registered based on user
          type: 'litter_announcement',
          title: `${breed} Puppies - ${pupsExpected} Expected`,
          description: `Dam: ${selectedPet?.name}\nSire: ${studName}\n\n${description}`,
          price: priceInCents,
          deposit: depositInCents,
          status: 'live',
          city: userData?.city || 'Malta',
          country: userData?.country || 'Malta',
          available_date: expectedDate,
          pups_available: parseInt(pupsExpected),
          views: 0,
          photos: selectedPet?.photos || [],
        })
        .select()
        .single();

      if (listingError) throw listingError;

      // Send push notifications to matching buyers
      if (sendNotification && listing) {
        await sendNotificationsToMatchingBuyers(listing, selectedPet);
      }

      Alert.alert(
        'Success! 🎉',
        sendNotification
          ? `Litter announced! Matching buyers have been notified.`
          : 'Litter announced successfully!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const sendNotificationsToMatchingBuyers = async (listing: any, pet: Pet | undefined) => {
    try {
      // Find buyers with matching preferences
      const { data: matchingBuyers, error } = await supabase
        .from('users')
        .select('id, full_name, preferred_species, preferred_dog_size, preferred_age')
        .eq('role', 'buyer')
        .or(`preferred_species.eq.${pet?.species},preferred_species.eq.both`);

      if (error) throw error;

      // Filter by dog size if applicable
      let filteredBuyers = matchingBuyers || [];
      if (pet?.species === 'dog' && pet?.size) {
        filteredBuyers = filteredBuyers.filter(
          buyer => buyer.preferred_dog_size === pet.size || buyer.preferred_dog_size === 'any'
        );
      }

      // Create notifications for matching buyers
      const notifications = filteredBuyers.map(buyer => ({
        user_id: buyer.id,
        type: 'litter_alert',
        title: '🐾 New Litter Available!',
        body: `${breed} puppies available in ${listing.city}. ${pupsExpected} expected. €${(listing.price / 100).toFixed(0)} each.`,
        data: { listing_id: listing.id, pet_id: pet?.id },
        read: false,
      }));

      if (notifications.length > 0) {
        const { error: notifError } = await supabase
          .from('notifications')
          .insert(notifications);

        if (notifError) console.error('Error sending notifications:', notifError);
      }

      console.log(`Sent notifications to ${notifications.length} matching buyers`);
    } catch (error) {
      console.error('Error sending notifications:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Announce New Litter</Text>
        <Text style={styles.subtitle}>Let buyers know about your upcoming litter</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Dam (Mother) *</Text>
          {myPets.length === 0 ? (
            <Text style={styles.helperText}>
              You need to add a female pet first. Go to "My Pets" to add one.
            </Text>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.petSelector}>
              {myPets.map(pet => (
                <TouchableOpacity
                  key={pet.id}
                  style={[
                    styles.petOption,
                    selectedDam === pet.id && styles.petOptionSelected,
                  ]}
                  onPress={() => {
                    setSelectedDam(pet.id);
                    setBreed(pet.breed);
                  }}
                >
                  <Text style={styles.petOptionEmoji}>
                    {pet.species === 'dog' ? '🐕' : '🐈'}
                  </Text>
                  <Text style={styles.petOptionName}>{pet.name}</Text>
                  <Text style={styles.petOptionBreed}>{pet.breed}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Sire (Father) Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Champion Max"
            value={studName}
            onChangeText={setStudName}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Breed *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Border Collie"
            value={breed}
            onChangeText={setBreed}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Expected Ready Date *</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            value={expectedDate}
            onChangeText={setExpectedDate}
          />
          <Text style={styles.helperText}>When puppies will be ready for new homes (8 weeks old)</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Number of Puppies Expected *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 6"
            value={pupsExpected}
            onChangeText={setPupsExpected}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Price per Puppy (EUR) *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 800"
            value={price}
            onChangeText={setPrice}
            keyboardType="decimal-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Deposit Amount (EUR)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 200 (optional)"
            value={deposit}
            onChangeText={setDeposit}
            keyboardType="decimal-pad"
          />
          <Text style={styles.helperText}>Optional deposit to secure a puppy</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Tell buyers about this litter, health clearances, temperament, etc."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />
        </View>

        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setSendNotification(!sendNotification)}
        >
          <View style={styles.checkbox}>
            {sendNotification && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <View style={styles.checkboxLabel}>
            <Text style={styles.checkboxText}>Send push notification to matching buyers</Text>
            <Text style={styles.checkboxSubtext}>
              Notify buyers looking for {breed || 'this breed'}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={createLitterAnnouncement}
          disabled={loading || myPets.length === 0}
        >
          {loading ? (
            <ActivityIndicator color={colors.text} />
          ) : (
            <Text style={styles.submitButtonText}>Announce Litter</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  backButton: {
    marginBottom: 20,
  },
  backText: {
    fontSize: 16,
    color: colors.secondary,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  form: {
    padding: 20,
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: colors.surface,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  helperText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  petSelector: {
    flexDirection: 'row',
  },
  petOption: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    alignItems: 'center',
    minWidth: 100,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  petOptionSelected: {
    borderColor: colors.secondary,
    backgroundColor: colors.background,
  },
  petOptionEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  petOptionName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  petOptionBreed: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    fontSize: 16,
    color: colors.secondary,
  },
  checkboxLabel: {
    flex: 1,
  },
  checkboxText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  checkboxSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  submitButton: {
    backgroundColor: colors.secondary,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.background,
  },
});
