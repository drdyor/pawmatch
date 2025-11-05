import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  FlatList,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../../theme/colors';
import { supabase } from '../../services/supabase';
import { useBreedSearch } from '../../hooks/useBreedSearch';

export default function BreederAddPetScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [species, setSpecies] = useState<'dog' | 'cat'>('dog');
  const [breed, setBreed] = useState('');
  const [breedQuery, setBreedQuery] = useState('');
  const [showBreedSuggestions, setShowBreedSuggestions] = useState(false);
  const [sex, setSex] = useState<'male' | 'female'>('female');
  
  // Age input: support both date and months
  const [ageInputMode, setAgeInputMode] = useState<'date' | 'months'>('months');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [ageYears, setAgeYears] = useState('');
  const [ageMonths, setAgeMonths] = useState('');
  
  const [weight, setWeight] = useState('');
  const [size, setSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [healthNotes, setHealthNotes] = useState('');
  const [isStudAvailable, setIsStudAvailable] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  // Breed search hook
  const { filteredBreeds, searchBreeds } = useBreedSearch();

  const pickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll access to add photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: 10,
    });

    if (!result.canceled && result.assets) {
      const newPhotos = result.assets.map(asset => asset.uri);
      setPhotos([...photos, ...newPhotos].slice(0, 10)); // Max 10 photos
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleBreedSearch = (query: string) => {
    setBreedQuery(query);
    setBreed(query);
    searchBreeds(query, species);
    setShowBreedSuggestions(query.length > 0);
  };

  const selectBreed = (selectedBreed: string) => {
    setBreed(selectedBreed);
    setBreedQuery(selectedBreed);
    setShowBreedSuggestions(false);
  };

  const calculateDateOfBirth = () => {
    if (ageInputMode === 'months' && (ageYears || ageMonths)) {
      const today = new Date();
      const years = parseInt(ageYears || '0');
      const months = parseInt(ageMonths || '0');
      
      today.setFullYear(today.getFullYear() - years);
      today.setMonth(today.getMonth() - months);
      
      return today.toISOString().split('T')[0];
    }
    return dateOfBirth || null;
  };

  const handleSave = async () => {
    // Validation
    if (!name || !breed) {
      Alert.alert('Error', 'Please fill in name and breed');
      return;
    }

    // Validate date format if using date mode
    if (ageInputMode === 'date' && dateOfBirth && !dateOfBirth.match(/^\d{4}-\d{2}-\d{2}$/)) {
      Alert.alert('Error', 'Date of birth must be in format YYYY-MM-DD');
      return;
    }

    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get user location
      const { data: userData } = await supabase
        .from('users')
        .select('city, country, role')
        .eq('id', user.id)
        .single();

      const weightNum = weight ? parseFloat(weight) : null;
      const calculatedDOB = calculateDateOfBirth();

      const { data: pet, error } = await supabase
        .from('pets')
        .insert({
          owner_id: user.id,
          owner_role: userData?.role || 'breeder_independent',
          name,
          species,
          breed,
          sex,
          date_of_birth: calculatedDOB,
          weight: weightNum,
          size: species === 'dog' ? size : null,
          city: userData?.city || 'Malta',
          country: userData?.country || 'Malta',
          status: isStudAvailable ? 'stud_available' : 'available',
          description: healthNotes || null,
          photos: photos,
        })
        .select()
        .single();

      if (error) throw error;

      // If female, prompt to track heat
      if (sex === 'female' && species === 'dog') {
        Alert.alert(
          'Success!',
          `${name} has been added. Would you like to start tracking heat cycles?`,
          [
            { text: 'Not Now', onPress: () => navigation.goBack() },
            {
              text: 'Track Heat',
              onPress: () => navigation.replace('HeatTracking', { petId: pet.id }),
            },
          ]
        );
      } else {
        Alert.alert('Success!', `${name} has been added to your breeding program.`);
        navigation.goBack();
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Add New Pet</Text>
        <Text style={styles.subtitle}>Add an animal to your breeding program</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Luna"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Species *</Text>
          <View style={styles.toggleGroup}>
            <TouchableOpacity
              style={[styles.toggleButton, species === 'dog' && styles.toggleButtonActive]}
              onPress={() => setSpecies('dog')}
            >
              <Text style={styles.toggleText}>🐕 Dog</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleButton, species === 'cat' && styles.toggleButtonActive]}
              onPress={() => setSpecies('cat')}
            >
              <Text style={styles.toggleText}>🐈 Cat</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Breed *</Text>
          <TextInput
            style={styles.input}
            placeholder="Start typing breed name..."
            value={breedQuery}
            onChangeText={handleBreedSearch}
            onFocus={() => breedQuery.length > 0 && setShowBreedSuggestions(true)}
          />
          {showBreedSuggestions && filteredBreeds.length > 0 && (
            <View style={styles.suggestionsContainer}>
              <ScrollView style={styles.suggestionsList} nestedScrollEnabled>
                {filteredBreeds.slice(0, 8).map((breedName, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.suggestionItem}
                    onPress={() => selectBreed(breedName)}
                  >
                    <Text style={styles.suggestionText}>{breedName}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Sex *</Text>
          <View style={styles.toggleGroup}>
            <TouchableOpacity
              style={[styles.toggleButton, sex === 'female' && styles.toggleButtonActive]}
              onPress={() => setSex('female')}
            >
              <Text style={styles.toggleText}>♀️ Female</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleButton, sex === 'male' && styles.toggleButtonActive]}
              onPress={() => setSex('male')}
            >
              <Text style={styles.toggleText}>♂️ Male</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Age</Text>
          <View style={styles.toggleGroup}>
            <TouchableOpacity
              style={[styles.toggleButton, ageInputMode === 'months' && styles.toggleButtonActive]}
              onPress={() => setAgeInputMode('months')}
            >
              <Text style={styles.toggleText}>Years/Months</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleButton, ageInputMode === 'date' && styles.toggleButtonActive]}
              onPress={() => setAgeInputMode('date')}
            >
              <Text style={styles.toggleText}>Birth Date</Text>
            </TouchableOpacity>
          </View>

          {ageInputMode === 'months' ? (
            <View style={styles.ageInputRow}>
              <View style={styles.ageInputHalf}>
                <Text style={styles.ageInputLabel}>Years</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  value={ageYears}
                  onChangeText={setAgeYears}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.ageInputHalf}>
                <Text style={styles.ageInputLabel}>Months</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  value={ageMonths}
                  onChangeText={setAgeMonths}
                  keyboardType="numeric"
                />
              </View>
            </View>
          ) : (
            <>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD (e.g., 2022-03-15)"
                value={dateOfBirth}
                onChangeText={setDateOfBirth}
              />
              <Text style={styles.helperText}>Format: YYYY-MM-DD</Text>
            </>
          )}
        </View>

        {species === 'dog' && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Size</Text>
            <View style={styles.toggleGroup}>
              <TouchableOpacity
                style={[styles.toggleButton, size === 'small' && styles.toggleButtonActive]}
                onPress={() => setSize('small')}
              >
                <Text style={styles.toggleText}>Small</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleButton, size === 'medium' && styles.toggleButtonActive]}
                onPress={() => setSize('medium')}
              >
                <Text style={styles.toggleText}>Medium</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleButton, size === 'large' && styles.toggleButtonActive]}
                onPress={() => setSize('large')}
              >
                <Text style={styles.toggleText}>Large</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.helperText}>
              Small: &lt;10kg • Medium: 10-25kg • Large: &gt;25kg
            </Text>
          </View>
        )}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Weight (kg)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 25"
            value={weight}
            onChangeText={setWeight}
            keyboardType="decimal-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Health & Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Health clearances, temperament, training, etc."
            value={healthNotes}
            onChangeText={setHealthNotes}
            multiline
            numberOfLines={4}
          />
        </View>

        {sex === 'male' && (
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setIsStudAvailable(!isStudAvailable)}
          >
            <View style={styles.checkbox}>
              {isStudAvailable && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <View style={styles.checkboxLabel}>
              <Text style={styles.checkboxText}>💫 Available for Stud</Text>
              <Text style={styles.checkboxSubtext}>
                Make this male available for breeding in the matches section
              </Text>
            </View>
          </TouchableOpacity>
        )}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Photos (Optional)</Text>
          <TouchableOpacity style={styles.photoPickerButton} onPress={pickImages}>
            <Text style={styles.photoPickerIcon}>📷</Text>
            <Text style={styles.photoPickerText}>Add Photos from Camera Roll</Text>
            <Text style={styles.photoPickerSubtext}>Tap to select up to 10 photos</Text>
          </TouchableOpacity>
          
          {photos.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photosPreview}>
              {photos.map((photo, index) => (
                <View key={index} style={styles.photoPreviewContainer}>
                  <Image source={{ uri: photo }} style={styles.photoPreview} />
                  <TouchableOpacity
                    style={styles.removePhotoButton}
                    onPress={() => removePhoto(index)}
                  >
                    <Text style={styles.removePhotoText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        <TouchableOpacity
          style={[styles.submitButton, saving && styles.submitButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color={colors.background} />
          ) : (
            <Text style={styles.submitButtonText}>Add Pet</Text>
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
  toggleGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  toggleButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.surface,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  toggleButtonActive: {
    borderColor: colors.secondary,
    backgroundColor: colors.background,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
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
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  infoIcon: {
    fontSize: 24,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
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
  suggestionsContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    maxHeight: 200,
    marginTop: 4,
  },
  suggestionsList: {
    maxHeight: 200,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  suggestionText: {
    fontSize: 16,
    color: colors.text,
  },
  ageInputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  ageInputHalf: {
    flex: 1,
    gap: 4,
  },
  ageInputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  photoPickerButton: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    gap: 8,
  },
  photoPickerIcon: {
    fontSize: 32,
  },
  photoPickerText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  photoPickerSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  photosPreview: {
    marginTop: 12,
  },
  photoPreviewContainer: {
    position: 'relative',
    marginRight: 12,
  },
  photoPreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: colors.surface,
  },
  removePhotoButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: colors.text,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removePhotoText: {
    color: colors.background,
    fontSize: 14,
    fontWeight: 'bold',
  },
});
