import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export default function BuyerFavoritesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favorites</Text>
      <View style={styles.placeholder}>
        <Text style={styles.icon}>❤️</Text>
        <Text style={styles.text}>Your saved pets will appear here</Text>
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
