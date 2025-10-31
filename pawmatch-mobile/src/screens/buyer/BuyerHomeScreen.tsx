import React from 'react';
import AdoptionDiscoveryScreen from './AdoptionDiscoveryScreen';

// BuyerHomeScreen (Seeker/Adopter) uses Adoption Discovery - Scrollable Cards
export default function BuyerHomeScreen({ navigation }: any) {
  return <AdoptionDiscoveryScreen navigation={navigation} />;
}
