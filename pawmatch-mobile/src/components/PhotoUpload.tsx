import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ActionSheetIOS,
  Platform,
} from 'react-native';
import { colors } from '../theme/colors';
import { pickImage, takePhoto, uploadToSupabase } from '../services/imageUpload';

interface PhotoUploadProps {
  onUpload: (url: string) => void;
  currentPhoto?: string;
  watermark?: boolean;
  label?: string;
  bucket?: string;
  userId: string;
}

export default function PhotoUpload({
  onUpload,
  currentPhoto,
  watermark = true,
  label = 'Upload Photo',
  bucket = 'pet-photos',
  userId,
}: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [localUri, setLocalUri] = useState<string | null>(null);

  const showOptions = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Take Photo', 'Choose from Library'],
          cancelButtonIndex: 0,
        },
        async (buttonIndex) => {
          if (buttonIndex === 1) {
            await handleTakePhoto();
          } else if (buttonIndex === 2) {
            await handlePickImage();
          }
        }
      );
    } else {
      Alert.alert('Upload Photo', 'Choose an option', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Take Photo', onPress: handleTakePhoto },
        { text: 'Choose from Library', onPress: handlePickImage },
      ]);
    }
  };

  const handleTakePhoto = async () => {
    const uri = await takePhoto(watermark);
    if (uri) {
      setLocalUri(uri);
      await uploadImage(uri);
    }
  };

  const handlePickImage = async () => {
    const uris = await pickImage({ watermark });
    if (uris && uris.length > 0) {
      setLocalUri(uris[0]);
      await uploadImage(uris[0]);
    }
  };

  const uploadImage = async (uri: string) => {
    setUploading(true);
    try {
      const timestamp = Date.now();
      const filename = `${userId}/photo_${timestamp}.jpg`;

      const publicUrl = await uploadToSupabase(uri, bucket, filename);
      
      if (publicUrl) {
        onUpload(publicUrl);
        Alert.alert('Success', 'Photo uploaded successfully!');
      }
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Error', 'Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  const displayPhoto = localUri || currentPhoto;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      
      <TouchableOpacity
        style={styles.uploadArea}
        onPress={showOptions}
        disabled={uploading}
      >
        {uploading ? (
          <View style={styles.uploadingState}>
            <ActivityIndicator size="large" color={colors.secondary} />
            <Text style={styles.uploadingText}>Uploading...</Text>
            {watermark && (
              <Text style={styles.watermarkNote}>Adding watermark...</Text>
            )}
          </View>
        ) : displayPhoto ? (
          <View style={styles.imageContainer}>
            <Image source={{ uri: displayPhoto }} style={styles.image} resizeMode="cover" />
            <View style={styles.imageOverlay}>
              <TouchableOpacity style={styles.changeButton} onPress={showOptions}>
                <Text style={styles.changeButtonText}>Change Photo</Text>
              </TouchableOpacity>
            </View>
            {watermark && (
              <View style={styles.watermarkBadge}>
                <Text style={styles.watermarkText}>🐾 Watermarked</Text>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📷</Text>
            <Text style={styles.emptyText}>Tap to add photo</Text>
            <Text style={styles.emptySubtext}>Camera or Library</Text>
          </View>
        )}
      </TouchableOpacity>

      {watermark && !currentPhoto && (
        <Text style={styles.helperText}>
          💡 Photos will be watermarked with PawMatch branding for protection
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2F3A4A',
    marginBottom: 12,
  },
  uploadArea: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    backgroundColor: colors.surface,
  },
  uploadingState: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  uploadingText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  watermarkNote: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  imageContainer: {
    height: 200,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 12,
    alignItems: 'center',
  },
  changeButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  changeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  watermarkBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  watermarkText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.background,
  },
  emptyState: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2F3A4A',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  helperText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 8,
  },
});
