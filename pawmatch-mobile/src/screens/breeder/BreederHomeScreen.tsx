import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { colors } from '../../theme/colors';
import { supabase } from '../../services/supabase';

export default function BreederHomeScreen({ navigation }: any) {
  const [stats, setStats] = useState({
    totalPets: 0,
    activeListings: 0,
    inHeat: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Count pets
      const { count: petsCount } = await supabase
        .from('pets')
        .select('*', { count: 'exact', head: true })
        .eq('owner_id', user.id);

      // Count active listings
      const { count: listingsCount } = await supabase
        .from('listings')
        .select('*', { count: 'exact', head: true })
        .eq('owner_id', user.id)
        .eq('status', 'live');

      // Count pets in heat
      const { count: heatCount } = await supabase
        .from('pets')
        .select('*', { count: 'exact', head: true })
        .eq('owner_id', user.id)
        .eq('status', 'in_heat');

      setStats({
        totalPets: petsCount || 0,
        activeListings: listingsCount || 0,
        inHeat: heatCount || 0,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.secondary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Breeder Dashboard</Text>
        <Text style={styles.subtitle}>Manage your breeding program</Text>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsGrid}>
        <StatCard
          icon="🐕"
          value={stats.totalPets}
          label="My Pets"
          color={colors.secondary}
          onPress={() => navigation.navigate('My Pets')}
        />
        <StatCard
          icon="📝"
          value={stats.activeListings}
          label="Active Listings"
          color={colors.success}
          onPress={() => navigation.navigate('My Pets')}
        />
        <StatCard
          icon="🔥"
          value={stats.inHeat}
          label="In Heat"
          color={colors.warning}
          onPress={() => navigation.navigate('My Pets')}
        />
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: colors.secondary }]}
          onPress={() => navigation.navigate('CreateLitter')}
        >
          <Text style={styles.actionIcon}>🎉</Text>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Announce New Litter</Text>
            <Text style={styles.actionSubtitle}>
              Notify matching buyers about your upcoming litter
            </Text>
          </View>
          <Text style={styles.actionArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('My Pets')}
        >
          <Text style={styles.actionIcon}>➕</Text>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Add New Pet</Text>
            <Text style={styles.actionSubtitle}>
              Add a dog or cat to your breeding program
            </Text>
          </View>
          <Text style={styles.actionArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('New Litters')}
        >
          <Text style={styles.actionIcon}>🎉</Text>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>New Litters</Text>
            <Text style={styles.actionSubtitle}>
              View upcoming litters and breeding pairs
            </Text>
          </View>
          <Text style={styles.actionArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('Discovery')}
        >
          <Text style={styles.actionIcon}>💛</Text>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Find Stud Matches</Text>
            <Text style={styles.actionSubtitle}>
              Swipe through available studs for breeding
            </Text>
          </View>
          <Text style={styles.actionArrow}>→</Text>
        </TouchableOpacity>
      </View>

      {/* Tips for First-Time Breeders */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💡 Breeder Tips</Text>
        <View style={styles.tipCard}>
          <Text style={styles.tipText}>
            • Track heat cycles to know the best breeding time{'\n'}
            • Health test your breeding dogs before mating{'\n'}
            • Announce litters early to build a waitlist{'\n'}
            • Respond quickly to buyer inquiries{'\n'}
            • Keep detailed records of each litter
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

function StatCard({
  icon,
  value,
  label,
  color,
  onPress,
}: {
  icon: string;
  value: number;
  label: string;
  color: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity style={styles.statCard} onPress={onPress}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  statsGrid: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    gap: 12,
  },
  actionIcon: {
    fontSize: 32,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  actionArrow: {
    fontSize: 24,
    color: colors.textSecondary,
  },
  tipCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
  },
  tipText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 22,
  },
});
