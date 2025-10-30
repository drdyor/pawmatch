import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { colors } from '../../theme/colors';
import { supabase } from '../../services/supabase';
import { UserRole } from '../../types';

type RoleOption = {
  id: UserRole;
  title: string;
  description: string;
  icon: string;
  color: string;
};

const roles: RoleOption[] = [
  {
    id: 'buyer',
    title: 'Buyer / Adopter',
    description: 'Find your perfect pet companion',
    icon: '🏠',
    color: colors.buyer,
  },
  {
    id: 'breeder_independent',
    title: 'Independent Breeder',
    description: 'First-time or occasional breeding',
    icon: '🐕',
    color: colors.breeder,
  },
  {
    id: 'breeder_registered',
    title: 'Registered Breeder',
    description: 'Professional kennel with license',
    icon: '🏆',
    color: colors.breeder,
  },
  {
    id: 'shelter',
    title: 'Shelter / Rescue',
    description: 'Manage adoptions and rescues',
    icon: '❤️',
    color: colors.shelter,
  },
  {
    id: 'vet',
    title: 'Veterinarian',
    description: 'Provide health services',
    icon: '⚕️',
    color: colors.vet,
  },
];

export default function RoleSelectionScreen() {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!selectedRole) {
      Alert.alert('Error', 'Please select a role');
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('users')
        .update({ role: selectedRole })
        .eq('id', user.id);

      if (error) throw error;

      // Navigation will be handled by App.tsx auth listener
    } catch (error: any) {
      Alert.alert('Error', error.message);
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Choose Your Role</Text>
        <Text style={styles.subtitle}>
          Select how you'll use PawMatch. You can change this later.
        </Text>
      </View>

      <View style={styles.roles}>
        {roles.map((role) => (
          <TouchableOpacity
            key={role.id}
            style={[
              styles.roleCard,
              selectedRole === role.id && { borderColor: role.color, borderWidth: 3 },
            ]}
            onPress={() => setSelectedRole(role.id)}
            disabled={loading}
          >
            <View style={styles.roleHeader}>
              <Text style={styles.roleIcon}>{role.icon}</Text>
              <View style={styles.roleInfo}>
                <Text style={styles.roleTitle}>{role.title}</Text>
                <Text style={styles.roleDescription}>{role.description}</Text>
              </View>
              {selectedRole === role.id && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleContinue}
        disabled={loading || !selectedRole}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Setting up...' : 'Continue'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
  },
  header: {
    marginTop: 60,
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  roles: {
    gap: 16,
    marginBottom: 30,
  },
  roleCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  roleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  roleIcon: {
    fontSize: 36,
  },
  roleInfo: {
    flex: 1,
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  roleDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  checkmark: {
    fontSize: 24,
    color: colors.success,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
});
