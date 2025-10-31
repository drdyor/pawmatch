// First onboarding welcome screen - appears before role selection
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';
import { PALETTE } from '../../theme/palette';

export default function OnboardingWelcomeScreen({ navigation }: any) {
  return (
    <LinearGradient
      colors={['#FFF8F0', '#FFE8D6']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content}>
        {/* Malta Flag Header */}
        <View style={styles.flagContainer}>
          <LinearGradient
            colors={[PALETTE.maltaRed, PALETTE.maltaBlue]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.flag}
          >
            <Text style={styles.flagEmoji}>????</Text>
          </LinearGradient>
        </View>

        {/* Welcome Content */}
        <View style={styles.header}>
          <Text style={styles.emoji}>??</Text>
          <Text style={styles.title}>Welcome to PawMatch!</Text>
          <Text style={styles.subtitle}>
            Malta's premier platform for responsible pet breeding, adoption, and care
          </Text>
        </View>

        {/* Features */}
        <View style={styles.features}>
          <FeatureCard
            icon="??"
            title="Heat Cycle Tracking"
            description="Track your female's cycles with Flo-style precision"
          />
          <FeatureCard
            icon="??"
            title="Find Perfect Matches"
            description="Discover ideal breeding partners with Tinder-style swiping"
          />
          <FeatureCard
            icon="??"
            title="Rescue & Adopt"
            description="Connect with local shelters and find your forever friend"
          />
          <FeatureCard
            icon="??"
            title="Secure Payments"
            description="EUR payments with deposit tracking for peace of mind"
          />
        </View>

        {/* CTA */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('SignUp')}
          >
            <Text style={styles.primaryButtonText}>Get Started</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('SignIn')}
          >
            <Text style={styles.secondaryButtonText}>I Already Have an Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <View style={styles.featureCard}>
      <Text style={styles.featureIcon}>{icon}</Text>
      <View style={styles.featureContent}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingTop: 60,
  },
  flagContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  flag: {
    width: 80,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  flagEmoji: {
    fontSize: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: PALETTE.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: PALETTE.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  features: {
    gap: 16,
    marginBottom: 32,
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  featureIcon: {
    fontSize: 40,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: PALETTE.text,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: PALETTE.textSecondary,
    lineHeight: 20,
  },
  actions: {
    gap: 12,
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: PALETTE.primary,
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  secondaryButton: {
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: PALETTE.primary,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: PALETTE.primary,
  },
});
