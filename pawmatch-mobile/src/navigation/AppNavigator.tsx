import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Screens
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import SignInScreen from '../screens/auth/SignInScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import RoleSelectionScreen from '../screens/auth/RoleSelectionScreen';

// Buyer Screens
import BuyerHomeScreen from '../screens/buyer/BuyerHomeScreen';
import BuyerFavoritesScreen from '../screens/buyer/BuyerFavoritesScreen';
import BuyerAlertsScreen from '../screens/buyer/BuyerAlertsScreen';
import BuyerProfileScreen from '../screens/buyer/BuyerProfileScreen';

// Breeder Screens
import BreederHomeScreen from '../screens/breeder/BreederHomeScreen';
import BreederPetsScreen from '../screens/breeder/BreederPetsScreen';
import BreederMatchesScreen from '../screens/breeder/BreederMatchesScreen';
import BreederProfileScreen from '../screens/breeder/BreederProfileScreen';

// Shelter Screens
import ShelterHomeScreen from '../screens/shelter/ShelterHomeScreen';
import ShelterAnimalsScreen from '../screens/shelter/ShelterAnimalsScreen';
import ShelterListingsScreen from '../screens/shelter/ShelterListingsScreen';
import ShelterProfileScreen from '../screens/shelter/ShelterProfileScreen';

// Vet Screens
import VetHomeScreen from '../screens/vet/VetHomeScreen';
import VetPatientsScreen from '../screens/vet/VetPatientsScreen';
import VetProfileScreen from '../screens/vet/VetProfileScreen';

// Shared Screens
import MessagesScreen from '../screens/shared/MessagesScreen';
import PetDetailScreen from '../screens/shared/PetDetailScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Buyer Tabs
function BuyerTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#FFC700',
        tabBarInactiveTintColor: '#6B7280',
      }}
    >
      <Tab.Screen name="Discover" component={BuyerHomeScreen} />
      <Tab.Screen name="Favorites" component={BuyerFavoritesScreen} />
      <Tab.Screen name="Alerts" component={BuyerAlertsScreen} />
      <Tab.Screen name="Profile" component={BuyerProfileScreen} />
    </Tab.Navigator>
  );
}

// Breeder Tabs
function BreederTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#2F80ED',
        tabBarInactiveTintColor: '#6B7280',
      }}
    >
      <Tab.Screen name="Home" component={BreederHomeScreen} />
      <Tab.Screen name="My Pets" component={BreederPetsScreen} />
      <Tab.Screen name="Matches" component={BreederMatchesScreen} />
      <Tab.Screen name="Profile" component={BreederProfileScreen} />
    </Tab.Navigator>
  );
}

// Shelter Tabs
function ShelterTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#34C759',
        tabBarInactiveTintColor: '#6B7280',
      }}
    >
      <Tab.Screen name="Home" component={ShelterHomeScreen} />
      <Tab.Screen name="Animals" component={ShelterAnimalsScreen} />
      <Tab.Screen name="Listings" component={ShelterListingsScreen} />
      <Tab.Screen name="Profile" component={ShelterProfileScreen} />
    </Tab.Navigator>
  );
}

// Vet Tabs
function VetTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#8E44AD',
        tabBarInactiveTintColor: '#6B7280',
      }}
    >
      <Tab.Screen name="Home" component={VetHomeScreen} />
      <Tab.Screen name="Patients" component={VetPatientsScreen} />
      <Tab.Screen name="Profile" component={VetProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator({ userRole }: { userRole: string | null }) {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!userRole ? (
          // Auth Stack
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
          </>
        ) : (
          // Main App Stack based on role
          <>
            {userRole === 'buyer' && (
              <Stack.Screen name="BuyerMain" component={BuyerTabs} />
            )}
            {(userRole === 'breeder_registered' || userRole === 'breeder_independent') && (
              <Stack.Screen name="BreederMain" component={BreederTabs} />
            )}
            {userRole === 'shelter' && (
              <Stack.Screen name="ShelterMain" component={ShelterTabs} />
            )}
            {userRole === 'vet' && (
              <Stack.Screen name="VetMain" component={VetTabs} />
            )}
            
            {/* Shared Screens */}
            <Stack.Screen name="Messages" component={MessagesScreen} />
            <Stack.Screen name="PetDetail" component={PetDetailScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
