import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function EmptyState({ icon = '📭', message = 'Tidak ada data' }) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 60 },
  icon: { fontSize: 48, marginBottom: 12 },
  message: { color: '#555', fontSize: 14, textAlign: 'center' },
});
