import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';
import { supabase } from '../../services/supabase';

export default function ShelterProfileScreen() {
  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <TouchableOpacity style={styles.button} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 20 },
  title: { fontSize: 32, fontWeight: 'bold', marginTop: 60, marginBottom: 20 },
  button: { backgroundColor: colors.danger, padding: 16, borderRadius: 12, marginTop: 20 },
  buttonText: { color: 'white', textAlign: 'center', fontWeight: '600' },
});
