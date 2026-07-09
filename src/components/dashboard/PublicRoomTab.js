import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { C } from '../../theme/colors';

/**
 * Tab Ruang Publik — card WA-style untuk general_chat room.
 * Encryption banner di bawah untuk feel "aman".
 */
export default function PublicRoomTab({ onOpenChat }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.row}
        onPress={() => onOpenChat({ roomType: 'public', roomId: 'general_chat', roomTitle: 'Ruang Publik' })}
        activeOpacity={0.75}>
        <View style={styles.avatarWrap}>
          <Text style={styles.avatarIcon}>🌐</Text>
        </View>
        <View style={styles.body}>
          <Text style={styles.name}>Ruang Publik</Text>
          <Text style={styles.sub}>Semua anggota dapat bergabung</Text>
        </View>
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>

      {/* Encryption notice — gaya WA */}
      <View style={styles.banner}>
        <Text style={styles.bannerIcon}>🔒</Text>
        <Text style={styles.bannerText}>
          Pesan dienkripsi. Hanya anggota yang dapat membaca.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: C.card,
    marginHorizontal: 14,
    marginTop: 14,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: C.border,
    gap: 12,
  },
  avatarWrap: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: C.accentDim,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarIcon: { fontSize: 22 },
  body:       { flex: 1 },
  name:       { color: C.text1, fontSize: 16, fontWeight: '600' },
  sub:        { color: C.text2, fontSize: 13, marginTop: 2 },
  chevron:    { color: C.text3, fontSize: 22, fontWeight: '300' },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    margin: 14,
    padding: 14,
    backgroundColor: C.accentDim,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(124,107,255,0.20)',
  },
  bannerIcon: { fontSize: 16 },
  bannerText: { flex: 1, color: C.text2, fontSize: 12.5, lineHeight: 18 },
});
