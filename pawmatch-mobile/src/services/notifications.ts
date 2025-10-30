import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { supabase } from './supabase';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const registerForPushNotificationsAsync = async () => {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FFC700',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    alert('Failed to get push token for push notification!');
    return;
  }

  token = (await Notifications.getExpoPushTokenAsync({
    projectId: Constants.expoConfig?.extra?.eas?.projectId,
  })).data;

  return token;
};

export const savePushToken = async (token: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Save token to user profile
    await supabase
      .from('users')
      .update({ push_token: token })
      .eq('id', user.id);
  } catch (error) {
    console.error('Error saving push token:', error);
  }
};

export const scheduleLitterAlertNotification = async (breedName: string, city: string, price: number) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🐾 New Litter Available!',
      body: `${breedName} puppies available in ${city}. €${(price / 100).toFixed(0)} each.`,
      data: { type: 'litter_alert' },
    },
    trigger: null, // Send immediately
  });
};

export const scheduleUrgentShelterAlert = async (animalCount: number, shelterCity: string) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🚨 Urgent: Animals Need Homes',
      body: `${animalCount} animal${animalCount > 1 ? 's' : ''} at ${shelterCity} shelter need immediate foster/adoption. 72h deadline.`,
      data: { type: 'shelter_urgent' },
    },
    trigger: null,
  });
};

export const scheduleHeatNotification = async (femaleName: string, breed: string, city: string) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🔥 Female in Heat Nearby',
      body: `${femaleName} (${breed}) is in heat in ${city}. Breeding opportunity available.`,
      data: { type: 'heat_notification' },
    },
    trigger: null,
  });
};

export const scheduleMatchNotification = async (studName: string, breed: string) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '💛 New Match!',
      body: `Someone is interested in ${studName} for breeding. Check your messages!`,
      data: { type: 'match' },
    },
    trigger: null,
  });
};

export const scheduleMessageNotification = async (senderName: string, messagePreview: string) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `💬 ${senderName}`,
      body: messagePreview,
      data: { type: 'message' },
    },
    trigger: null,
  });
};
