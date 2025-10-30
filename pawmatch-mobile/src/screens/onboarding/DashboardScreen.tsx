import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Card } from '../../components/ui/Card';

interface DashboardScreenProps {
  initialTab?: string;
}

const TABS = [
  { key: 'match', label: 'Match', icon: '❤️' },
  { key: 'pets', label: 'My Pets', icon: '🐶' },
  { key: 'heat', label: 'Heat', icon: '📅' },
  { key: 'messages', label: 'Messages', icon: '💬' },
  { key: 'community', label: 'Community', icon: '👥' },
];

export function DashboardScreen({
  initialTab = 'match',
}: DashboardScreenProps) {
  const [tab, setTab] = useState(initialTab);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.headerIcon}>🐾</Text>
          <Text style={styles.headerTitle}>PawMatch</Text>
        </View>
        <Text style={styles.headerSubtitle}>Independent Owner dashboard</Text>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
      >
        {tab === 'match' && (
          <Card style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>❤️</Text>
              <Text style={styles.cardTitle}>Matches near you</Text>
            </View>
            <Text style={styles.cardText}>
              Enable matchmaking during fertile days to get better matches.
            </Text>
            <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
              <Text style={styles.actionButtonText}>Open Swipe Deck</Text>
            </TouchableOpacity>
          </Card>
        )}

        {tab === 'pets' && (
          <Card style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>🐶</Text>
              <Text style={styles.cardTitle}>My Pets</Text>
            </View>
            <Text style={styles.cardText}>
              Add pets, update health info, manage visibility.
            </Text>
            <TouchableOpacity
              style={styles.secondaryButton}
              activeOpacity={0.7}
            >
              <Text style={styles.plusIcon}>➕</Text>
              <Text style={styles.secondaryButtonText}>Add pet</Text>
            </TouchableOpacity>
          </Card>
        )}

        {tab === 'heat' && (
          <Card style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>📅</Text>
              <Text style={styles.cardTitle}>Heat Tracker</Text>
            </View>
            <Text style={styles.cardText}>
              Luna is day 10/28. Fertile window: Nov 6–13.
            </Text>
            <TouchableOpacity
              style={styles.secondaryButton}
              activeOpacity={0.7}
            >
              <Text style={styles.bellIcon}>🔔</Text>
              <Text style={styles.secondaryButtonText}>
                Notify compatible studs
              </Text>
            </TouchableOpacity>
          </Card>
        )}

        {tab === 'messages' && (
          <Card style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>💬</Text>
              <Text style={styles.cardTitle}>Messages</Text>
            </View>
            <Text style={styles.cardText}>
              Start a chat once you match.
            </Text>
          </Card>
        )}

        {tab === 'community' && (
          <Card style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>👥</Text>
              <Text style={styles.cardTitle}>Community</Text>
            </View>
            <Text style={styles.cardText}>
              Tips, meetups & success stories in Malta.
            </Text>
          </Card>
        )}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.nav}>
        <View style={styles.navContainer}>
          {TABS.map(({ key, label, icon }) => (
            <TouchableOpacity
              key={key}
              onPress={() => setTab(key)}
              style={styles.navItem}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.navIcon,
                  tab === key && styles.navIconActive,
                ]}
              >
                {icon}
              </Text>
              <Text
                style={[
                  styles.navLabel,
                  tab === key && styles.navLabelActive,
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
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
    paddingBottom: 120,
  },
  card: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  cardIcon: {
    fontSize: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#171717',
  },
  cardText: {
    fontSize: 13,
    color: '#737373',
    marginBottom: 12,
  },
  actionButton: {
    backgroundColor: '#FFC700',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D4D4D4',
  },
  secondaryButtonText: {
    fontSize: 14,
    color: '#171717',
  },
  plusIcon: {
    fontSize: 16,
  },
  bellIcon: {
    fontSize: 16,
  },
  nav: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
  },
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  navItem: {
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  navIcon: {
    fontSize: 20,
    opacity: 0.5,
  },
  navIconActive: {
    opacity: 1,
  },
  navLabel: {
    fontSize: 11,
    color: '#737373',
  },
  navLabelActive: {
    color: '#D97706',
    fontWeight: '600',
  },
});
