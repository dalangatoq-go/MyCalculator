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
          <Text style={styles.sub}>Semua anggota · general_chat</Text>
          <View style={styles.row}>
            <View style={styles.dot} />
            <Text style={styles.liveText}>Live</Text>
          </View>
        </View>
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>

      <View style={styles.note}>
        <Text style={styles.noteText}>
          💬  Ruang obrolan bersama. Semua pesan dapat dilihat seluruh anggota.
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
    backgroundColor: 'rgba(30,123,239,0.06)',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(30,123,239,0.15)',
    marginBottom: 14,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(30,123,239,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  icon: { fontSize: 24 },
  body: { flex: 1 },
  name: { color: '#E8E8EC', fontSize: 15, fontWeight: '700', marginBottom: 3 },
  sub:  { color: '#555', fontSize: 12, marginBottom: 6 },
  row:  { flexDirection: 'row', alignItems: 'center' },
  dot:  { width: 7, height: 7, borderRadius: 4, backgroundColor: '#4CAF50', marginRight: 6 },
  liveText: { color: '#4CAF50', fontSize: 12, fontWeight: '600' },
  chevron: { color: '#333', fontSize: 22 },
  note: {
    backgroundColor: 'rgba(255,255,255,0.015)',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },
  noteText: { color: '#444', fontSize: 13, lineHeight: 22 },
});
