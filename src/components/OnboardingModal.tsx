import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { LinearGradient } from 'expo-linear-gradient';
import { PALETTE } from '../theme/palette';

const ROLES = [
  { id: 'breeder_independent', title: 'Independent Breeder', sub: 'Breed pets at home' },
  { id: 'breeder_registered', title: 'Registered Kennel', sub: 'Licensed breeding operation' },
  { id: 'buyer', title: 'Pet Seeker', sub: 'Looking to adopt or buy' },
  { id: 'shelter', title: 'Shelter', sub: 'Rescue and adoption center' },
  { id: 'vet', title: 'Veterinarian', sub: 'Verify health records' },
];

interface OnboardingModalProps {
  visible: boolean;
  onSelect: (role: string) => void;
}

export function OnboardingModal({ visible, onSelect }: OnboardingModalProps) {
  return (
    <Modal 
      isVisible={visible} 
      backdropOpacity={0.85} 
      useNativeDriver
      animationIn="zoomIn"
      animationOut="zoomOut"
    >
      <View style={styles.card}>
        {/* Malta Flag Cue */}
        <LinearGradient 
          colors={[PALETTE.maltaRed, PALETTE.maltaBlue]} 
          start={{ x: 0, y: 0 }} 
          end={{ x: 1, y: 0 }} 
          style={styles.flag}
        >
          <Text style={styles.flagText}>🇲🇹</Text>
        </LinearGradient>

        <Text style={styles.title}>Welcome to PawMatch Malta</Text>
        <Text style={styles.sub}>Choose your role to get started:</Text>

        {ROLES.map(r => (
          <TouchableOpacity
            key={r.id}
            style={styles.role}
            activeOpacity={0.9}
            onPress={() => onSelect(r.id)}
          >
            <Text style={styles.roleTitle}>{r.title}</Text>
            <Text style={styles.roleSub}>{r.sub}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    maxHeight: '80%',
  },
  flag: {
    alignSelf: 'center',
    width: 64,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    overflow: 'hidden',
  },
  flagText: {
    fontSize: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
    color: PALETTE.text,
  },
  sub: {
    textAlign: 'center',
    color: PALETTE.textSecondary,
    marginBottom: 20,
    fontSize: 15,
  },
  role: {
    backgroundColor: PALETTE.neutral,
    borderRadius: 16,
    padding: 16,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: PALETTE.border,
  },
  roleTitle: {
    fontWeight: '700',
    fontSize: 16,
    color: PALETTE.text,
    marginBottom: 4,
  },
  roleSub: {
    color: PALETTE.textSecondary,
    fontSize: 14,
  },
});
