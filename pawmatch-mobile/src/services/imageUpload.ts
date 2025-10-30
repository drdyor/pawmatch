import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
import { supabase } from './supabase';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

// Watermark configuration
const WATERMARK_CONFIG = {
  text: 'PawMatch 🐾',
  opacity: 0.15,
  fontSize: 48,
  color: '#FFFFFF',
  position: 'center' as const,
};

export const pickImage = async (options?: {
  allowsMultiple?: boolean;
  watermark?: boolean;
}): Promise<string[] | null> => {
  try {
    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please allow access to your photos to upload images.'
      );
      return null;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultiple: options?.allowsMultiple || false,
      allowsEditing: !options?.allowsMultiple,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (result.canceled) {
      return null;
    }

    const uris = result.assets.map(asset => asset.uri);

    // Apply watermark if requested
    if (options?.watermark) {
      const watermarkedUris = await Promise.all(
        uris.map(uri => addWatermark(uri))
      );
      return watermarkedUris;
    }

    return uris;
  } catch (error) {
    console.error('Error picking image:', error);
    Alert.alert('Error', 'Failed to pick image');
    return null;
  }
};

export const takePhoto = async (watermark: boolean = false): Promise<string | null> => {
  try {
    // Request camera permissions
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please allow camera access to take photos.'
      );
      return null;
    }

    // Launch camera
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (result.canceled) {
      return null;
    }

    const uri = result.assets[0].uri;

    // Apply watermark if requested
    if (watermark) {
      return await addWatermark(uri);
    }

    return uri;
  } catch (error) {
    console.error('Error taking photo:', error);
    Alert.alert('Error', 'Failed to take photo');
    return null;
  }
};

export const addWatermark = async (uri: string): Promise<string> => {
  try {
    // Get image dimensions
    const image = await manipulateAsync(uri, [], {});
    const { width, height } = image;

    // Calculate watermark position (center)
    const watermarkWidth = width * 0.6;
    const watermarkHeight = 80;
    const x = (width - watermarkWidth) / 2;
    const y = (height - watermarkHeight) / 2;

    // Create watermark overlay
    // Note: For production, you'd create an actual watermark image
    // For now, we'll add a semi-transparent overlay
    const result = await manipulateAsync(
      uri,
      [
        {
          resize: {
            width: Math.min(width, 1200), // Max width 1200px
          },
        },
      ],
      {
        compress: 0.8,
        format: SaveFormat.JPEG,
      }
    );

    // TODO: Add actual text watermark using Canvas API or external library
    // For MVP, we're just compressing and resizing
    // Production would overlay "PawMatch 🐾" text

    return result.uri;
  } catch (error) {
    console.error('Error adding watermark:', error);
    return uri; // Return original if watermarking fails
  }
};

export const uploadToSupabase = async (
  uri: string,
  bucket: string,
  path: string
): Promise<string | null> => {
  try {
    // Convert URI to blob
    const response = await fetch(uri);
    const blob = await response.blob();

    // Convert blob to ArrayBuffer
    const arrayBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = reject;
      reader.readAsArrayBuffer(blob);
    });

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, arrayBuffer, {
        contentType: 'image/jpeg',
        upsert: false,
      });

    if (error) throw error;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading to Supabase:', error);
    Alert.alert('Upload Failed', 'Could not upload image. Please try again.');
    return null;
  }
};

// Complete workflow: Pick image, watermark, upload
export const pickWatermarkAndUpload = async (
  bucket: string,
  userId: string,
  prefix: string = 'photo'
): Promise<string | null> => {
  // Pick image
  const uris = await pickImage({ watermark: true });
  if (!uris || uris.length === 0) return null;

  const uri = uris[0];

  // Generate unique filename
  const timestamp = Date.now();
  const filename = `${userId}/${prefix}_${timestamp}.jpg`;

  // Upload to Supabase
  return await uploadToSupabase(uri, bucket, filename);
};
