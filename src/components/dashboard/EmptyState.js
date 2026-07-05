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
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 80 },
  icon: { fontSize: 44, marginBottom: 16, opacity: 0.6 },
  message: { color: '#3A3A42', fontSize: 14, textAlign: 'center', fontWeight: '500' },
});
