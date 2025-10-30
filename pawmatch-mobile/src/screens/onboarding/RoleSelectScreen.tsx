import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Header } from '../../components/ui/Header';

interface RoleSelectScreenProps {
  onNext: (data: { role: string }) => void;
}

const ROLES = [
  {
    key: 'independent',
    label: 'Independent Owner',
    icon: '🐾',
    desc: 'Breed once or twice, find matches nearby',
    recommended: true,
  },
  {
    key: 'breeder',
    label: 'Professional Breeder',
    icon: '👥',
    desc: 'Studs, litters, records & analytics',
  },
  {
    key: 'shelter',
    label: 'Shelter',
    icon: '🏢',
    desc: 'List animals & send urgent alerts',
  },
  {
    key: 'buyer',
    label: 'Buyer / Adopter',
    icon: '❤️',
    desc: 'Swipe to find your pet',
  },
  {
    key: 'vet',
    label: 'Vet / Clinic',
    icon: '🩺',
    desc: 'Certificates & vaccine reminders',
  },
];

export function RoleSelectScreen({ onNext }: RoleSelectScreenProps) {
  const [role, setRole] = useState('independent');

  return (
    <SafeAreaView style={styles.safe}>
      <Header step={1} max={5} title="Onboarding" />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.icon}>🐾</Text>
          <Text style={styles.title}>Welcome to PawMatch</Text>
        </View>
        <Text style={styles.subtitle}>
          You're in Malta 🇲🇹—connect with local pet lovers. Choose how you'll
          use PawMatch:
        </Text>

        <View style={styles.roles}>
          {ROLES.map((item) => (
            <TouchableOpacity
              key={item.key}
              onPress={() => setRole(item.key)}
              style={[
                styles.roleCard,
                role === item.key && styles.roleCardActive,
              ]}
              activeOpacity={0.7}
            >
              <View style={styles.roleContent}>
                <View
                  style={[
                    styles.roleIcon,
                    role === item.key && styles.roleIconActive,
                  ]}
                >
                  <Text style={styles.roleIconText}>{item.icon}</Text>
                </View>
                <View style={styles.roleText}>
                  <View style={styles.roleLabelRow}>
                    <Text style={styles.roleLabel}>{item.label}</Text>
                    {item.recommended && (
                      <Text style={styles.recommended}>(Recommended)</Text>
                    )}
                  </View>
                  <Text style={styles.roleDesc}>{item.desc}</Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          onPress={() => onNext({ role })}
          style={styles.button}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>

        <View style={styles.info}>
          <Text style={styles.infoIcon}>ℹ️</Text>
          <Text style={styles.infoText}>
            You can add more roles later in Settings.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  icon: {
    fontSize: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#171717',
  },
  subtitle: {
    fontSize: 15,
    color: '#737373',
    marginBottom: 16,
    lineHeight: 22,
  },
  roles: {
    gap: 12,
  },
  roleCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    backgroundColor: '#FFFFFF',
  },
  roleCardActive: {
    backgroundColor: '#FFF8E6',
    borderColor: '#FFD966',
  },
  roleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  roleIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleIconActive: {
    backgroundColor: '#FFC700',
  },
  roleIconText: {
    fontSize: 20,
  },
  roleText: {
    flex: 1,
  },
  roleLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  roleLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#171717',
  },
  recommended: {
    fontSize: 13,
    color: '#D97706',
    fontWeight: '500',
  },
  roleDesc: {
    fontSize: 13,
    color: '#737373',
    marginTop: 2,
  },
  chevron: {
    fontSize: 24,
    color: '#A3A3A3',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#FFC700',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  infoIcon: {
    fontSize: 16,
  },
  infoText: {
    fontSize: 12,
    color: '#737373',
    flex: 1,
  },
});
