import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function PublicRoomTab({ onOpenChat }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.card}
        onPress={() => onOpenChat({ roomType: 'public', roomId: 'general_chat', roomTitle: 'Ruang Publik' })}
        activeOpacity={0.75}>
        <View style={styles.iconWrap}>
          <Text style={styles.icon}>🌐</Text>
        </View>
        <View style={styles.body}>
          <Text style={styles.name}>Ruang Publik</Text>
          <Text style={styles.sub}>general_chat · Semua anggota</Text>
          <View style={styles.row}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>Live</Text>
          </View>
        </View>
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          💬  Ini adalah ruang obrolan bersama. Semua pesan terlihat oleh seluruh anggota.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 18 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    marginBottom: 16,
  },
  iconWrap: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: 'rgba(76,175,80,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(76,175,80,0.15)',
  },
  icon: { fontSize: 26 },
  body: { flex: 1 },
  name: { color: '#F0F0F5', fontSize: 16, fontWeight: '700', marginBottom: 4, letterSpacing: -0.2 },
  sub: { color: '#4A4A52', fontSize: 12, marginBottom: 8, fontWeight: '500' },
  row: { flexDirection: 'row', alignItems: 'center' },
  onlineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#4CAF50', marginRight: 6 },
  onlineText: { color: '#4CAF50', fontSize: 12, fontWeight: '600' },
  chevron: { color: '#2A2A30', fontSize: 22, fontWeight: '300' },
  infoBox: {
    backgroundColor: 'rgba(255,255,255,0.015)',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },
  infoText: { color: '#4A4A52', fontSize: 13, lineHeight: 22, fontWeight: '400' },
});
