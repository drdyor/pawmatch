import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export default function VetPatientsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Patients</Text>
      <View style={styles.placeholder}>
        <Text style={styles.icon}>🩺</Text>
        <Text style={styles.text}>Patient management coming soon</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 20 },
  title: { fontSize: 32, fontWeight: 'bold', marginTop: 60, marginBottom: 20 },
  placeholder: { alignItems: 'center', marginTop: 100 },
  icon: { fontSize: 64, marginBottom: 20 },
  text: { fontSize: 16, color: colors.textSecondary },
});
