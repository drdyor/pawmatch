import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { colors } from '../../theme/colors';
import { supabase } from '../../services/supabase';

export default function ShelterHomeScreen({ navigation }: any) {
  const [stats, setStats] = useState({
    totalAnimals: 0,
    atRisk: 0,
    adopted: 0,
    capacity: 40,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Count total animals
      const { count: totalCount } = await supabase
        .from('pets')
        .select('*', { count: 'exact', head: true })
        .eq('owner_id', user.id);

      // Count at-risk animals
      const { count: riskCount } = await supabase
        .from('pets')
        .select('*', { count: 'exact', head: true })
        .eq('owner_id', user.id)
        .eq('status', 'at_risk');

      // Count adopted this month
      const firstOfMonth = new Date();
      firstOfMonth.setDate(1);
      const { count: adoptedCount } = await supabase
        .from('pets')
        .select('*', { count: 'exact', head: true })
        .eq('owner_id', user.id)
        .eq('status', 'adopted')
        .gte('updated_at', firstOfMonth.toISOString());

      setStats({
        totalAnimals: totalCount || 0,
        atRisk: riskCount || 0,
        adopted: adoptedCount || 0,
        capacity: 40,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendUrgentAlert = async () => {
    Alert.alert(
      'Send Urgent Alert?',
      'This will notify all users in Malta about at-risk animals needing immediate homes.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send Alert',
          style: 'destructive',
          onPress: async () => {
            try {
              const { data: { user } } = await supabase.auth.getUser();
              if (!user) return;

              // Get at-risk animals
              const { data: atRiskAnimals } = await supabase
                .from('pets')
                .select('*')
                .eq('owner_id', user.id)
                .eq('status', 'at_risk');

              if (!atRiskAnimals || atRiskAnimals.length === 0) {
                Alert.alert('No urgent animals', 'Mark animals as "at risk" first');
                return;
              }

              // Get all users in Malta (except shelters)
              const { data: users } = await supabase
                .from('users')
                .select('id')
                .neq('role', 'shelter')
                .eq('country', 'Malta');

              // Create notifications
              const notifications = users?.map(u => ({
                user_id: u.id,
                type: 'shelter_urgent',
                title: '🚨 Urgent: Animals Need Homes',
                body: `${atRiskAnimals.length} animal${atRiskAnimals.length > 1 ? 's' : ''} at local shelter need immediate foster/adoption. 72h deadline.`,
                data: { shelter_id: user.id },
                read: false,
              }));

              if (notifications && notifications.length > 0) {
                await supabase.from('notifications').insert(notifications);
                Alert.alert('Success!', `Alerted ${notifications.length} people in Malta`);
              }
            } catch (error: any) {
              Alert.alert('Error', error.message);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.success} />
      </View>
    );
  }

  const capacityPercentage = (stats.totalAnimals / stats.capacity) * 100;
  const isOverCapacity = capacityPercentage > 80;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Shelter Dashboard</Text>
        <Text style={styles.subtitle}>Manage adoptions and rescues</Text>
      </View>

      {/* Urgent Alert Banner */}
      {stats.atRisk > 0 && (
        <TouchableOpacity style={styles.urgentBanner} onPress={sendUrgentAlert}>
          <Text style={styles.urgentIcon}>🚨</Text>
          <View style={styles.urgentContent}>
            <Text style={styles.urgentTitle}>{stats.atRisk} Animal{stats.atRisk > 1 ? 's' : ''} at Risk</Text>
            <Text style={styles.urgentText}>Tap to send urgent alert to community</Text>
          </View>
          <Text style={styles.urgentArrow}>→</Text>
        </TouchableOpacity>
      )}

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <StatCard
          icon="🐾"
          value={stats.totalAnimals}
          label="In Care"
          color={colors.text}
        />
        <StatCard
          icon="🚨"
          value={stats.atRisk}
          label="At Risk"
          color={colors.danger}
        />
        <StatCard
          icon="❤️"
          value={stats.adopted}
          label="Adopted (This Month)"
          color={colors.success}
        />
        <StatCard
          icon="📊"
          value={`${capacityPercentage.toFixed(0)}%`}
          label="Capacity"
          color={isOverCapacity ? colors.danger : colors.success}
        />
      </View>

      {/* Capacity Warning */}
      {isOverCapacity && (
        <View style={styles.warningCard}>
          <Text style={styles.warningIcon}>⚠️</Text>
          <View style={styles.warningContent}>
            <Text style={styles.warningTitle}>Over Capacity</Text>
            <Text style={styles.warningText}>
              Shelter is at {capacityPercentage.toFixed(0)}% capacity. Consider sending urgent alerts.
            </Text>
          </View>
        </View>
      )}

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: colors.success }]}
          onPress={() => navigation.navigate('Animals')}
        >
          <Text style={styles.actionIcon}>➕</Text>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Add Animal Intake</Text>
            <Text style={styles.actionSubtitle}>Register new animal at shelter</Text>
          </View>
          <Text style={styles.actionArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('Listings')}
        >
          <Text style={styles.actionIcon}>📝</Text>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Create Adoption Listing</Text>
            <Text style={styles.actionSubtitle}>Post available animals</Text>
          </View>
          <Text style={styles.actionArrow}>→</Text>
        </TouchableOpacity>

        {stats.atRisk > 0 && (
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: colors.danger }]}
            onPress={sendUrgentAlert}
          >
            <Text style={styles.actionIcon}>🚨</Text>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Send Urgent Alert</Text>
              <Text style={styles.actionSubtitle}>
                Notify community about {stats.atRisk} at-risk animal{stats.atRisk > 1 ? 's' : ''}
              </Text>
            </View>
            <Text style={styles.actionArrow}>→</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Today's Tasks */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Tasks</Text>
        <View style={styles.taskCard}>
          <Text style={styles.taskText}>
            • Feed and water all animals{'\n'}
            • Update adoption listings with new photos{'\n'}
            • Follow up on adoption applications{'\n'}
            • Check animals marked as at-risk{'\n'}
            • Post updates on social media
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

function StatCard({ icon, value, label, color }: { icon: string; value: number | string; label: string; color: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
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
  urgentBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.danger,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  urgentIcon: {
    fontSize: 32,
  },
  urgentContent: {
    flex: 1,
  },
  urgentTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.background,
    marginBottom: 2,
  },
  urgentText: {
    fontSize: 14,
    color: colors.background,
  },
  urgentArrow: {
    fontSize: 24,
    color: colors.background,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    paddingTop: 0,
    gap: 12,
  },
  statCard: {
    width: '48%',
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
  warningCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warning,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  warningIcon: {
    fontSize: 32,
  },
  warningContent: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.background,
    marginBottom: 2,
  },
  warningText: {
    fontSize: 14,
    color: colors.background,
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
  taskCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
  },
  taskText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 22,
  },
});
