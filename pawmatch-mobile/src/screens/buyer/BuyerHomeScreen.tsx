import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../../theme/colors';

export default function BuyerHomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Discover Pets</Text>
        <Text style={styles.subtitle}>Find your perfect companion in Malta</Text>
      </View>

      <View style={styles.placeholder}>
        <Text style={styles.placeholderIcon}>🐾</Text>
        <Text style={styles.placeholderText}>
          Pet discovery feed with swipeable cards coming soon!
        </Text>
        <Text style={styles.placeholderSubtext}>
          • Browse available pets{'\n'}
          • Filter by breed, location, price{'\n'}
          • Save favorites{'\n'}
          • Contact breeders & shelters
        </Text>
      </View>
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
  placeholder: {
    margin: 20,
    padding: 40,
    backgroundColor: colors.surface,
    borderRadius: 20,
    alignItems: 'center',
  },
  placeholderIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  placeholderSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});
