/**
 * Dog Breed Dataset Helper
 * 
 * Provides utilities for accessing the Dog-Breeds-Dataset submodule.
 * Uses environment variable for easy swapping to AI-generated dataset later.
 * 
 * NOTE: For Expo Go, uses hardcoded breed list. Submodule images not accessible in Expo Go.
 */

// For Expo Go, we can't access submodule files, so use empty string
// In production build, this can be set via environment variable
const IMG_BASE = (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_DOG_DATASET_PATH) 
  ? process.env.EXPO_PUBLIC_DOG_DATASET_PATH 
  : ""; // Empty for Expo Go compatibility

export interface BreedMetadata {
  name: string;
  folder: string;
  imageCount?: number;
}

/**
 * Get the base path for dataset images
 */
export function getDatasetPath(): string {
  return IMG_BASE;
}

/**
 * Get image path for a specific breed
 * @param breedName - Name of the breed (e.g., "golden retriever")
 * @param imageIndex - Optional image index (default: 1)
 */
export function getBreedImage(breedName: string, imageIndex: number = 1): string {
  if (!IMG_BASE) {
    // Return empty string for Expo Go - images will use placeholder
    return "";
  }
  // Normalize breed name to match folder structure
  const normalizedBreed = breedName.toLowerCase().replace(/\s+/g, '_');
  const imageName = `${normalizedBreed}_${String(imageIndex).padStart(3, '0')}.jpg`;
  return `${IMG_BASE}${normalizedBreed}/${imageName}`;
}

/**
 * Get all available breeds from the dataset
 * This works in Expo Go - uses hardcoded list
 */
export function getAllBreeds(): string[] {
  // Popular breeds from the dataset
  return [
    'Golden Retriever',
    'German Shepherd',
    'Labrador Retriever',
    'Border Collie',
    'Great Dane',
    'Maltese',
    'Yorkshire Terrier',
    'Australian Shepherd',
    'Saint Bernard',
    'Poodle',
    'Cocker Spaniel',
    'Beagle',
    'Rottweiler',
    'Bulldog',
    'Boxer',
    'Dachshund',
    'Siberian Husky',
    'Chihuahua',
    'Pomeranian',
    'French Bulldog',
  ];
}

/**
 * Get breed metadata (placeholder for future expansion)
 */
export function getBreedMetadata(breedName: string): BreedMetadata | null {
  const breeds = getAllBreeds();
  const normalized = breedName.toLowerCase();
  
  const match = breeds.find(b => b.toLowerCase() === normalized);
  if (!match) return null;

  return {
    name: match,
    folder: match.toLowerCase().replace(/\s+/g, '_'),
  };
}

/**
 * Search breeds by partial name match
 */
export function searchBreeds(query: string): string[] {
  const breeds = getAllBreeds();
  const lowerQuery = query.toLowerCase();
  
  return breeds.filter(breed => 
    breed.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Popular cross-breeds for breeding (as mentioned by user)
 */
export const POPULAR_CROSS_BREEDS = [
  'Poodle',
  'Cocker Spaniel',
  'Yorkshire Terrier',
];

