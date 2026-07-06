import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function ContactCard({ contact, onPress }) {
  const { name, color } = contact;
  const avatarBg = color || '#444';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
      <View style={[styles.avatar, { backgroundColor: avatarBg }]}>
        <Text style={styles.avatarText}>{name[0].toUpperCase()}</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.name}>{name}</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.02)',
    marginHorizontal: 18,
    marginVertical: 5,
    borderRadius: 16,
    padding: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarText: { color: 'rgba(255,255,255,0.95)', fontSize: 18, fontWeight: '700' },
  body:       { flex: 1 },
  name:       { color: '#E8E8EC', fontSize: 15, fontWeight: '600', letterSpacing: -0.2 },
  chevron:    { color: '#3A3A42', fontSize: 22 },
});
