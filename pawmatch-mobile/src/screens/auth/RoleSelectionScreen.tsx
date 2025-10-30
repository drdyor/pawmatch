import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { Colors, Spacing } from '../../constants/Colors';

type UserRole = 'independent_owner' | 'breeder_professional' | 'buyer' | 'shelter' | 'vet';

interface RoleOption {
  role: UserRole;
  emoji: string;
  title: string;
  description: string;
  isPopular?: boolean;
}

const ROLES: RoleOption[] = [
  {
    role: 'independent_owner',
    emoji: '👤',
    title: 'Independent Pet Owner',
    description: 'I want to breed my pet once or twice (not a business)',
    isPopular: true, // ⭐ EMPHASIZED!
  },
  {
    role: 'breeder_professional',
    emoji: '🐕',
    title: 'Professional Breeder',
    description: 'Registered kennel or breeding program',
  },
  {
    role: 'buyer',
    emoji: '❤️',
    title: 'Looking for a Pet',
    description: 'Find my perfect companion or breeding partner',
  },
  {
    role: 'shelter',
    emoji: '🏠',
    title: 'Animal Shelter',
    description: 'Manage animals and find loving homes for rescues',
  },
  {
    role: 'vet',
    emoji: '⚕️',
    title: 'Veterinarian',
    description: 'Coordinate with pet owners and issue certificates',
  },
];

export default function RoleSelectionScreen({ navigation }: any) {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!selectedRole) {
      Alert.alert('Please select a role', 'Choose your role to continue');
      return;
    }

    setLoading(true);
    
    try {
      // TODO: Save role to backend/firebase
      // await updateProfile({ role: selectedRole });
      
      // Navigate based on role
      if (selectedRole === 'independent_owner' || selectedRole === 'breeder_professional') {
        navigation.replace('BreederOnboardingIntro');
      } else if (selectedRole === 'buyer') {
        navigation.replace('BuyerPreferencesScreen');
      } else {
        // Default navigation
        navigation.replace('Home');
      }
    } catch (error) {
      console.error('Error updating role:', error);
      Alert.alert('Error', 'Could not save role. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>I am a...</Text>
          <Text style={styles.subtitle}>
            Choose your role to personalize your experience
          </Text>

          <View style={styles.rolesContainer}>
            {ROLES.map((roleOption) => (
              <TouchableOpacity
                key={roleOption.role}
                style={[
                  styles.roleCard,
                  selectedRole === roleOption.role && styles.roleCardSelected,
                  roleOption.isPopular && styles.roleCardPopular,
                ]}
                onPress={() => setSelectedRole(roleOption.role)}
              >
                {roleOption.isPopular && (
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularText}>⭐ Most Common</Text>
                  </View>
                )}
                
                <View style={styles.roleHeader}>
                  <Text style={styles.roleEmoji}>{roleOption.emoji}</Text>
                  <View
                    style={[
                      styles.checkbox,
                      selectedRole === roleOption.role && styles.checkboxSelected,
                    ]}
                  >
                    {selectedRole === roleOption.role && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </View>
                </View>
                
                <Text style={styles.roleTitle}>{roleOption.title}</Text>
                <Text style={styles.roleDescription}>{roleOption.description}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.button, !selectedRole && styles.buttonDisabled]}
            onPress={handleContinue}
            disabled={!selectedRole || loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Continuing...' : 'Continue'}
            </Text>
          </TouchableOpacity>
          
          <Text style={styles.helpText}>
            Don't worry, you can change this later in settings
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.xl,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
  },
  rolesContainer: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  roleCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: Spacing.lg,
    borderWidth: 2,
    borderColor: Colors.border,
    position: 'relative',
  },
  roleCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: '#FFF9E6', // Light yellow tint
  },
  roleCardPopular: {
    borderColor: Colors.primary,
    borderWidth: 3,
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    right: 12,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  popularText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.text,
  },
  roleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  roleEmoji: {
    fontSize: 40,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkmark: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  roleDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: Colors.border,
  },
  buttonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  helpText: {
    textAlign: 'center',
    color: Colors.textSecondary,
    fontSize: 14,
    marginTop: Spacing.md,
  },
});
