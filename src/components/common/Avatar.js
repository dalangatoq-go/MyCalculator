import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ALIAS_COLORS = {
  SanQua: '#2a9d8f',
  Hass: '#e76f51',
  Vit: '#457b9d',
  Cleo: '#9b2226',
  LeMinerale: '#606c38',
};

export default function Avatar({ alias, size = 40 }) {
  if (!alias) return null;
  const color = ALIAS_COLORS[alias] || '#555';
  return (
    <View style={[styles.circle, { width: size, height: size, borderRadius: size / 2, backgroundColor: color }]}>
      <Text style={styles.text}>{alias[0]}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  circle: { justifyContent: 'center', alignItems: 'center' },
  text: { color: '#FFF', fontWeight: 'bold' }
});
