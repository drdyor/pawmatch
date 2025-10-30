import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Header } from '../../components/ui/Header';
import { Card } from '../../components/ui/Card';

interface VetIntroScreenProps {
  onNext: (data: { clinic: ClinicData }) => void;
  onBack: () => void;
}

interface ClinicData {
  name: string;
  address: string;
  city: string;
  phone: string;
  vetName: string;
}

export function VetIntroScreen({ onNext, onBack }: VetIntroScreenProps) {
  const [clinic, setClinic] = useState<ClinicData>({
    name: '',
    address: '',
    city: '',
    phone: '',
    vetName: '',
  });

  return (
    <SafeAreaView style={styles.safe}>
      <Header step={2} max={4} onBack={onBack} title="Vet / Clinic" />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.icon}>🏥</Text>
          <Text style={styles.title}>Clinic details</Text>
        </View>
        <Text style={styles.subtitle}>
          Set up your clinic profile so owners can connect and request
          certificates.
        </Text>

        <Card style={styles.card}>
          <View style={styles.form}>
            <View>
              <Text style={styles.label}>Clinic name</Text>
              <TextInput
                style={styles.input}
                value={clinic.name}
                onChangeText={(name) => setClinic({ ...clinic, name })}
                placeholder="Malta Veterinary Clinic"
                placeholderTextColor="#A3A3A3"
              />
            </View>
            <View>
              <Text style={styles.label}>Lead vet name</Text>
              <TextInput
                style={styles.input}
                value={clinic.vetName}
                onChangeText={(vetName) => setClinic({ ...clinic, vetName })}
                placeholder="Dr. John Smith"
                placeholderTextColor="#A3A3A3"
              />
            </View>
            <View>
              <Text style={styles.label}>Address</Text>
              <TextInput
                style={styles.input}
                value={clinic.address}
                onChangeText={(address) => setClinic({ ...clinic, address })}
                placeholder="123 Main Street"
                placeholderTextColor="#A3A3A3"
              />
            </View>
            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Text style={styles.label}>City</Text>
                <TextInput
                  style={styles.input}
                  value={clinic.city}
                  onChangeText={(city) => setClinic({ ...clinic, city })}
                  placeholder="Valletta"
                  placeholderTextColor="#A3A3A3"
                />
              </View>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Phone</Text>
                <TextInput
                  style={styles.input}
                  value={clinic.phone}
                  onChangeText={(phone) => setClinic({ ...clinic, phone })}
                  placeholder="+356 1234 5678"
                  keyboardType="phone-pad"
                  placeholderTextColor="#A3A3A3"
                />
              </View>
            </View>
          </View>
        </Card>

        <TouchableOpacity
          onPress={() => onNext({ clinic })}
          style={styles.button}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
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
    marginBottom: 8,
  },
  icon: {
    fontSize: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#171717',
  },
  subtitle: {
    fontSize: 15,
    color: '#737373',
    marginBottom: 16,
  },
  card: {
    padding: 16,
    marginBottom: 16,
  },
  form: {
    gap: 12,
  },
  label: {
    fontSize: 13,
    color: '#737373',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D4D4D4',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#171717',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  button: {
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
});
