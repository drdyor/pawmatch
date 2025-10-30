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
import { Card } from '../../components/ui/Card';
import { Toggle } from '../../components/ui/Toggle';

interface CatHealthGateScreenProps {
  onNext: (data: { fivFlow: 'vet' | 'upload' }) => void;
  onBack: () => void;
}

export function CatHealthGateScreen({ onNext, onBack }: CatHealthGateScreenProps) {
  const [consent, setConsent] = useState(false);
  const [method, setMethod] = useState<'vet' | 'upload'>('vet');

  return (
    <SafeAreaView style={styles.safe}>
      <Header step={3} max={6} onBack={onBack} title="Independent Owner" />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.icon}>🧪</Text>
          <Text style={styles.title}>FIV / FeLV test required</Text>
        </View>
        <Text style={styles.subtitle}>
          For cat matchmaking, a recent <Text style={styles.bold}>FIV/FeLV negative</Text> certificate
          is required. This protects your cat, any partner, and future kittens.
        </Text>

        <Card style={styles.card}>
          <Text style={styles.cardLabel}>How would you like to verify?</Text>
          <View style={styles.toggleGroup}>
            <Toggle
              checked={method === 'vet'}
              onChange={() => setMethod('vet')}
              label="Ask my vet to issue / verify the test"
              subtitle="We'll send a request to your clinic. They'll add the result and issue the badge."
            />
            <Toggle
              checked={method === 'upload'}
              onChange={() => setMethod('upload')}
              label="Upload an existing certificate"
              subtitle="Photo or PDF. A vet can later verify it."
            />
          </View>
        </Card>

        <Card style={styles.card}>
          <TouchableOpacity
            onPress={() => setConsent(!consent)}
            style={styles.consentRow}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, consent && styles.checkboxActive]}>
              {consent && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <View style={styles.consentText}>
              <Text style={styles.consentLabel}>
                I authorize my chosen clinic to view{' '}
                <Text style={styles.bold}>my cat's basic profile</Text> to issue or
                verify the FIV/FeLV test.
              </Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.hint}>
            You can revoke access anytime in Settings.
          </Text>
        </Card>

        <TouchableOpacity
          disabled={!consent}
          onPress={() => onNext({ fivFlow: method })}
          style={[
            styles.button,
            !consent && styles.buttonDisabled,
          ]}
          activeOpacity={consent ? 0.8 : 1}
        >
          <Text style={[styles.buttonText, !consent && styles.buttonTextDisabled]}>
            {method === 'vet' ? 'Send request to vet' : 'Upload certificate'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.tip}>
          Tip: badges expire after 12 months to keep results fresh.
        </Text>
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
    lineHeight: 22,
  },
  bold: {
    fontWeight: '600',
    color: '#171717',
  },
  card: {
    padding: 16,
    marginBottom: 16,
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#171717',
    marginBottom: 8,
  },
  toggleGroup: {
    gap: 8,
  },
  consentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D4D4D4',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  checkboxActive: {
    backgroundColor: '#FFC700',
    borderColor: '#FFC700',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  consentText: {
    flex: 1,
  },
  consentLabel: {
    fontSize: 13,
    color: '#404040',
    lineHeight: 20,
  },
  hint: {
    fontSize: 12,
    color: '#737373',
    marginTop: 8,
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
  buttonDisabled: {
    backgroundColor: '#E5E5E5',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  buttonTextDisabled: {
    color: '#737373',
  },
  tip: {
    fontSize: 12,
    color: '#737373',
    marginTop: 12,
    textAlign: 'center',
  },
});
