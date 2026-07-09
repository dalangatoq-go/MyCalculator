import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { formatLastActive, isPresenceOnline } from '../../utils/formatLastActive';
import { C, AVATAR_COLORS } from '../../theme/colors';

/**
 * Baris kontak di tab Kontak — avatar circle + nama + status online.
 * Online dot di kanan bawah avatar (gaya WhatsApp).
 */
const PlainContactRow = memo(function PlainContactRow({ contact, presence, onPress }) {
  const { id, name } = contact;
  const isOnline   = isPresenceOnline(presence);
  const avatarBg   = isOnline ? (AVATAR_COLORS[id] || C.accent) : C.card;
  const statusText = isOnline ? 'Online' : formatLastActive(presence?.lastActive);

  return (
    <TouchableOpacity
      style={[styles.row, !isOnline && styles.rowDim]}
      onPress={onPress}
      activeOpacity={0.7}>
      <View style={[styles.avatar, { backgroundColor: avatarBg }]}>
        <Text style={[styles.avatarText, !isOnline && styles.avatarTextDim]}>
          {name[0].toUpperCase()}
        </Text>
        {isOnline && <View style={styles.onlineDot} />}
      </View>
      <View style={styles.body}>
        <Text style={[styles.name, !isOnline && styles.nameDim]}>{name}</Text>
        <Text style={[styles.status, isOnline && styles.statusOnline]}>{statusText}</Text>
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
  rowDim: {
    opacity: 0.5,
  },
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
  avatarText:    { color: '#FFF', fontSize: 17, fontWeight: '700' },
  avatarTextDim: { color: C.text3, opacity: 0.7 },
  body:          { flex: 1 },
  name:          { color: C.text1, fontSize: 15, fontWeight: '600', marginBottom: 3 },
  nameDim:       { color: C.text2 },
  status:        { color: C.text3, fontSize: 12.5 },
  statusOnline:  { color: C.online, fontWeight: '600' },
});
