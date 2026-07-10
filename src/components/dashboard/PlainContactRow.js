import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { C, AVATAR_COLORS } from '../../theme/colors';

/**
 * Baris kontak di tab Kontak.
 * Online: opacity 1, dot hijau di avatar.
 * Offline: opacity 0.5, tanpa dot, tanpa tulisan apa pun (tidak ada
 * "Offline" atau "last seen" — hanya redup).
 * presence: boolean (true = online), berasal langsung dari RTDB.
 */
const PlainContactRow = memo(function PlainContactRow({ contact, presence, onPress }) {
  const { id, name } = contact;
  const isOnline = presence === true;
  const avatarBg = AVATAR_COLORS[id] || C.accent;

  return (
    <TouchableOpacity
      style={[styles.row, !isOnline && styles.rowOffline]}
      onPress={onPress}
      activeOpacity={0.7}>
      <View style={[styles.avatar, { backgroundColor: avatarBg }]}>
        <Text style={styles.avatarText}>{name[0].toUpperCase()}</Text>
        {isOnline && <View style={styles.onlineDot} />}
      </View>
      <View style={styles.body}>
        <Text style={styles.name}>{name}</Text>
      </View>
    </TouchableOpacity>
  );
});

export default PlainContactRow;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: C.border,
  },
  rowOffline: { opacity: 0.5 },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: C.online,
    borderWidth: 2,
    borderColor: C.bg,
  },
  avatarText: { color: '#FFF', fontSize: 17, fontWeight: '700' },
  body:       { flex: 1 },
  name:       { color: C.text1, fontSize: 15, fontWeight: '600' },
});
