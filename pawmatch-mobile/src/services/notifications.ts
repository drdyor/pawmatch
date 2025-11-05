// NOTE: Push notifications are disabled for Expo Go (SDK 54+)
// To enable notifications, build a development build with: eas build --profile development
// This file provides stub implementations that log instead of crashing

import { Platform } from 'react-native';

const DEV_MODE = __DEV__;

// No-op notification handler for Expo Go
export const registerForPushNotificationsAsync = async () => {
  if (DEV_MODE) {
    console.log('[Notifications] Skipped - not available in Expo Go. Use dev build for push notifications.');
  }
  return null;
};

export const savePushToken = async (token: string) => {
  if (DEV_MODE) {
    console.log('[Notifications] Would save push token:', token);
  }
};

export const scheduleLitterAlertNotification = async (breedName: string, city: string, price: number) => {
  if (DEV_MODE) {
    console.log(`[Notifications] 🐾 New Litter: ${breedName} in ${city} - €${(price / 100).toFixed(0)}`);
  }
};

export const scheduleUrgentShelterAlert = async (animalCount: number, shelterCity: string) => {
  if (DEV_MODE) {
    console.log(`[Notifications] 🚨 Urgent: ${animalCount} animals at ${shelterCity} shelter need homes`);
  }
};

export const scheduleHeatNotification = async (femaleName: string, breed: string, city: string) => {
  if (DEV_MODE) {
    console.log(`[Notifications] 🔥 Heat: ${femaleName} (${breed}) in ${city}`);
  }
};

export const scheduleMatchNotification = async (studName: string, breed: string) => {
  if (DEV_MODE) {
    console.log(`[Notifications] 💛 Match: Someone interested in ${studName}`);
  }
};

export const scheduleMessageNotification = async (senderName: string, messagePreview: string) => {
  if (DEV_MODE) {
    console.log(`[Notifications] 💬 ${senderName}: ${messagePreview}`);
  }
};
