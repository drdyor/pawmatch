// screens/auth/RoleSelectionScreen.tsx - Web App Design
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  StatusBar,
} from 'react-native';
import { COLORS, FONTS } from '../../theme';

type UserRole = 'seeker' | 'breeder' | 'shelter' | 'vet' | 'owner';

interface RoleOption {
  role: UserRole;
  emoji: string;
  title: string;
  description: string;
}

const ROLES: RoleOption[] = [
  {
    role: 'owner',
    emoji: '💝',
    title: 'Pet Owner',
    description: 'Looking for a companion for your pet',
  },
  {
    role: 'breeder',
    emoji: '🏠',
    title: 'Breeder',
    description: 'Professional breeder offering services',
  },
  {
    role: 'shelter',
    emoji: '🏢',
    title: 'Shelter',
    description: 'Animal shelter with pets for adoption',
  },
  {
    role: 'seeker',
    emoji: '💝',
    title: 'Pet Seeker',
    description: 'Looking to adopt, foster, or buy a pet',
  },
  {
    role: 'vet',
    emoji: '✅',
    title: 'Veterinarian',
    description: 'Vet offering verification services',
  },
];

export default function RoleSelectionScreen({ navigation }: any) {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    
    // Navigate immediately like HTML
    if (role === 'breeder') {
      Alert.alert('Welcome, Breeder!', 'You can now list your breeding services and manage stud requests.');
      // navigation.replace('BreederHome');
    } else if (role === 'shelter') {
      Alert.alert('Welcome, Shelter!', 'You can now list pets for adoption and manage applications.');
      // navigation.replace('ShelterHome');
    } else if (role === 'vet') {
      Alert.alert('Welcome, Veterinarian!', 'You can now verify pet health records and provide consultations.');
      // navigation.replace('VetHome');
    } else if (role === 'seeker') {
      Alert.alert('Welcome, Pet Seeker!', 'Find your perfect companion from shelters and breeders.');
      // navigation.replace('BuyerSwipeDiscover');
    } else {
      // navigation.replace('Home');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      {/* Gradient Background */}
      <View style={styles.gradientBackground} />
      
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header with Malta Flag */}
          <View style={styles.header}>
            <View style={styles.flagContainer}>
              <Text style={styles.flag}>🇲🇹</Text>
            </View>
            <Text style={styles.title}>PawMatch Malta</Text>
            <Text style={styles.subtitle}>Choose your role to get started:</Text>
          </View>

          {/* Role Cards */}
          <View style={styles.rolesContainer}>
            {ROLES.map((roleOption) => (
              <TouchableOpacity
                key={roleOption.role}
                style={[
                  styles.roleCard,
                  selectedRole === roleOption.role && styles.roleCardSelected,
                ]}
                onPress={() => handleRoleSelect(roleOption.role)}
                activeOpacity={0.8}
              >
                <Text style={styles.roleEmoji}>{roleOption.emoji}</Text>
                <View style={styles.roleTextContainer}>
                  <Text style={styles.roleTitle}>{roleOption.title}</Text>
                  <Text style={styles.roleDescription}>{roleOption.description}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: COLORS.backgroundGradientStart,
    // For a proper gradient, you'd use expo-linear-gradient or react-native-linear-gradient
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  flagContainer: {
    marginBottom: 10,
  },
  flag: {
    fontSize: 40,
  },
  title: {
    fontFamily: FONTS.hero,
    fontSize: 36,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: FONTS.medium,
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  rolesContainer: {
    gap: 15,
  },
  roleCard: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: 20,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    minHeight: 80,
  },
  roleCardSelected: {
    backgroundColor: COLORS.primary,
    transform: [{ translateY: -2 }],
  },
  roleEmoji: {
    fontSize: 30,
    marginRight: 15,
  },
  roleTextContainer: {
    flex: 1,
  },
  roleTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  roleDescription: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: '#6B7280',
  },
});
