import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { colors } from '../../theme/colors';
import { formatEUR } from '../../services/stripe';

export default function BuyerPaymentScreen({ navigation, route }: any) {
  const { listingId, petName, depositAmount, totalAmount } = route.params;
  const [processing, setProcessing] = useState(false);

  const handlePayDeposit = async () => {
    setProcessing(true);
    
    // TODO: Integrate Stripe SDK when ready
    // For now, show payment flow UI
    
    Alert.alert(
      'Payment Flow Ready',
      'Stripe integration is set up. When you add Stripe keys:\n\n' +
      '1. SEPA Direct Debit (EU standard)\n' +
      '2. Card payments\n' +
      '3. Deposit held in escrow\n' +
      '4. Released when contract signed\n\n' +
      'For MVP: Contact breeder directly',
      [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]
    );
    
    setProcessing(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Secure Your Spot</Text>
        <Text style={styles.subtitle}>Pay deposit to reserve {petName}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Payment Summary</Text>
        
        <View style={styles.row}>
          <Text style={styles.label}>Deposit Amount</Text>
          <Text style={styles.value}>{formatEUR(depositAmount)}</Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Total Price</Text>
          <Text style={styles.value}>{formatEUR(totalAmount)}</Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Due at Pickup</Text>
          <Text style={styles.value}>{formatEUR(totalAmount - depositAmount)}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Payment Method</Text>
        <TouchableOpacity style={styles.paymentOption}>
          <Text style={styles.paymentIcon}>🏦</Text>
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentTitle}>SEPA Direct Debit</Text>
            <Text style={styles.paymentSubtitle}>Standard EU bank transfer</Text>
          </View>
          <Text style={styles.recommended}>Recommended</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.paymentOption}>
          <Text style={styles.paymentIcon}>💳</Text>
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentTitle}>Credit Card</Text>
            <Text style={styles.paymentSubtitle}>Instant payment</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>✅ Deposit Protection</Text>
        <Text style={styles.protectionText}>
          • Deposit held in escrow{'\n'}
          • Released only when contract signed{'\n'}
          • Full refund if breeder cancels{'\n'}
          • Secured by Stripe
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.payButton, processing && styles.payButtonDisabled]}
        onPress={handlePayDeposit}
        disabled={processing}
      >
        <Text style={styles.payButtonText}>
          {processing ? 'Processing...' : `Pay ${formatEUR(depositAmount)} Deposit`}
        </Text>
      </TouchableOpacity>

      <Text style={styles.disclaimer}>
        By proceeding, you agree to PawMatch's payment terms and breeding contract.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  backText: {
    fontSize: 16,
    color: colors.secondary,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  card: {
    backgroundColor: colors.surface,
    margin: 20,
    marginTop: 12,
    padding: 20,
    borderRadius: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  label: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  value: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    gap: 12,
  },
  paymentIcon: {
    fontSize: 32,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  paymentSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  recommended: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.success,
  },
  protectionText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 22,
  },
  payButton: {
    backgroundColor: colors.secondary,
    margin: 20,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  payButtonDisabled: {
    opacity: 0.6,
  },
  payButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.background,
  },
  disclaimer: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 40,
    marginBottom: 40,
  },
});
