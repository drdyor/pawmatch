import React from 'react';
import BuyerSwipeDiscoverScreen from './BuyerSwipeDiscoverScreen';

// BuyerHomeScreen now uses the swipe discover screen with web app design
export default function BuyerHomeScreen({ navigation }: any) {
  return <BuyerSwipeDiscoverScreen navigation={navigation} />;
}
