import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { formatLastActive } from '../../utils/formatLastActive';

const AVATAR_COLORS = {
  sanqua:    '#1565C0',
  hass:      '#2E7D32',
  vit:       '#6A1B9A',
  cleo:      '#AD1457',
  lemineral: '#E65100',
};

const OFFLINE_COLOR = '#2A2A2E';

const PlainContactRow = memo(function PlainContactRow({ contact, presence, onPress }) {
  const { id, name, color } = contact;
  const isOnline   = !!presence?.online;
  const avatarBg   = isOnline ? (color || AVATAR_COLORS[id] || '#333') : OFFLINE_COLOR;
  const statusText = isOnline ? 'Online' : formatLastActive(presence?.lastActive);

  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.avatar, { backgroundColor: avatarBg }, !isOnline && styles.avatarDim]}>
        <Text style={[styles.avatarText, !isOnline && styles.avatarTextDim]}>
          {name[0].toUpperCase()}
        </Text>
      </View>

      <View style={styles.body}>
        <Text style={[styles.name, !isOnline && styles.nameDim]}>{name}</Text>
        <View style={styles.statusRow}>
          {isOnline && <View style={styles.onlineDot} />}
          <Text style={[styles.status, isOnline && styles.statusOnline]}>{statusText}</Text>
        </View>
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
    paddingVertical: 13,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarDim: { opacity: 0.5 },
  avatarText: { color: '#FFF', fontSize: 17, fontWeight: '700' },
  avatarTextDim: { color: '#8A8A8E' },
  body: { flex: 1 },
  name: { color: '#E8E8EC', fontSize: 15, fontWeight: '600', marginBottom: 3 },
  nameDim: { color: '#6B6B70' },
  statusRow: { flexDirection: 'row', alignItems: 'center' },
  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 6,
  },
  status: { color: '#555', fontSize: 12 },
  statusOnline: { color: '#4CAF50', fontWeight: '600' },
});
