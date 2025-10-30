import Constants from 'expo-constants';

// AdMob Configuration for PawMatch
export const adMobConfig = {
  androidAppId: Constants.expoConfig?.extra?.adMobAndroidAppId || process.env.EXPO_PUBLIC_ADMOB_ANDROID_APP_ID || '',
  iosAppId: Constants.expoConfig?.extra?.adMobIOSAppId || process.env.EXPO_PUBLIC_ADMOB_IOS_APP_ID || '',
  bannerId: Constants.expoConfig?.extra?.adMobBannerId || process.env.EXPO_PUBLIC_ADMOB_BANNER_ID || '',
  interstitialId: Constants.expoConfig?.extra?.adMobInterstitialId || '',
  rewardedId: Constants.expoConfig?.extra?.adMobRewardedId || '',
};

// Ad placement strategy for PawMatch:
// - Banner ads: Bottom of discovery feeds (Buyer, Breeder matches)
// - Interstitial ads: After major actions (posting litter, completing adoption)
// - Rewarded video ads: Boost listing visibility for 24 hours

export const AD_PLACEMENTS = {
  // Banner ads (non-intrusive, constant revenue)
  BUYER_DISCOVER_FEED: 'buyer_discover',
  BREEDER_MATCHES: 'breeder_matches',
  SHELTER_LISTINGS: 'shelter_listings',
  
  // Interstitial ads (between major flows)
  AFTER_LITTER_POST: 'after_litter_post',
  AFTER_ADOPTION_INQUIRY: 'after_inquiry',
  
  // Rewarded video ads (premium features)
  BOOST_LISTING: 'boost_listing',
  UNLOCK_PREMIUM_FILTER: 'unlock_filter',
};

export const shouldShowAd = (placement: string, userRole: string): boolean => {
  // Don't show ads to shelters (social good)
  if (userRole === 'shelter') return false;
  
  // Show ads to buyers and breeders
  if (userRole === 'buyer' || userRole.includes('breeder')) return true;
  
  // Minimal ads for vets
  if (userRole === 'vet' && placement === AD_PLACEMENTS.BUYER_DISCOVER_FEED) return false;
  
  return true;
};

// Revenue estimates (Malta market):
// - 1000 daily users
// - 50% see banner ads (shelters excluded)
// - €0.50 CPM (cost per 1000 impressions)
// - 5 ad views per session
// Monthly revenue: ~€375-750 from banner ads alone
// Interstitial ads: +€200-400/month
// Rewarded video: +€100-300/month
// Total estimated: €700-1500/month at 1000 DAU
