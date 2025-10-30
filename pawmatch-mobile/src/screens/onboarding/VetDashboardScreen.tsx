import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Card } from '../../components/ui/Card';

export function VetDashboardScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.headerIcon}>🩺</Text>
          <Text style={styles.headerTitle}>Clinic Dashboard</Text>
        </View>
        <Text style={styles.headerSubtitle}>
          Manage patients, certificates and reminders.
        </Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Today</Text>
          <Text style={styles.cardText}>
            No pending certificate requests.
          </Text>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Getting started</Text>
          <View style={styles.list}>
            <Text style={styles.listItem}>
              • Add patients with consent
            </Text>
            <Text style={styles.listItem}>
              • Issue health/vaccination/DNA/hip score certificates
            </Text>
            <Text style={styles.listItem}>
              • Connect with owners for mating readiness
            </Text>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIcon: {
    fontSize: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#171717',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#737373',
    marginTop: 4,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 12,
  },
  card: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#171717',
    marginBottom: 4,
  },
  cardText: {
    fontSize: 13,
    color: '#737373',
  },
  list: {
    gap: 4,
  },
  listItem: {
    fontSize: 13,
    color: '#737373',
    lineHeight: 20,
  },
});
