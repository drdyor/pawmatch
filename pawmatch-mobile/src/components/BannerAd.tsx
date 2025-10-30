import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

// This is a placeholder for Google AdMob banner ad
// When you add expo-ads-admob package, replace this with:
// import { AdMobBanner } from 'expo-ads-admob';

interface BannerAdProps {
  placement: string;
}

export default function BannerAd({ placement }: BannerAdProps) {
  // For development, show placeholder
  // In production, this would be a real AdMob banner
  
  const __DEV__ = process.env.NODE_ENV === 'development';
  
  if (__DEV__) {
    return (
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>
          📢 Ad Space ({placement})
        </Text>
      </View>
    );
  }

  // Production AdMob banner would go here:
  // return (
  //   <AdMobBanner
  //     bannerSize="banner"
  //     adUnitID={adMobConfig.bannerId}
  //     servePersonalizedAds={false} // GDPR compliant
  //     onDidFailToReceiveAdWithError={(error) => console.log(error)}
  //   />
  // );

  return null;
}

const styles = StyleSheet.create({
  placeholder: {
    height: 50,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    margin: 12,
  },
  placeholderText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
