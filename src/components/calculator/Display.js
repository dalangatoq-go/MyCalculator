import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

export default function Display({ value }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{value}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { padding: 40, alignItems: 'flex-end', justifyContent: 'center' },
  text: { color: '#FFD700', fontSize: 48, fontWeight: 'bold' }
});
