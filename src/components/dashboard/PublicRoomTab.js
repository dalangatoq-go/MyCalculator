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
  container: { flex: 1, padding: 16 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#141414',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#1E1E1E',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  icon: { fontSize: 26 },
  body: { flex: 1 },
  name: { color: '#FFF', fontSize: 16, fontWeight: '700', marginBottom: 3 },
  sub: { color: '#666', fontSize: 12, marginBottom: 6 },
  row: { flexDirection: 'row', alignItems: 'center' },
  onlineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#4CAF50', marginRight: 5 },
  onlineText: { color: '#4CAF50', fontSize: 12, fontWeight: '600' },
  chevron: { color: '#444', fontSize: 26 },
  infoBox: {
    marginTop: 16,
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1E1E1E',
  },
  infoText: { color: '#666', fontSize: 13, lineHeight: 20 },
});
