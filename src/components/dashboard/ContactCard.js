import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const STATUS_COLOR = {
  online: '#4CAF50',
  away: '#FFC107',
  offline: '#555',
};

const AVATAR_COLORS = {
  vit: '#457b9d',
  luna: '#9b59b6',
  alex: '#e67e22',
  sarah: '#e91e63',
  niko: '#2a9d8f',
};

export default function ContactCard({ contact, onPress }) {
  const { id, name, status, preview, time, unread } = contact;
  const avatarBg = AVATAR_COLORS[id] || '#444';
  const statusColor = STATUS_COLOR[status] || '#555';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
      <View style={[styles.avatar, { backgroundColor: avatarBg }]}>
        <Text style={styles.avatarText}>{name[0]}</Text>
        <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
      </View>

      <View style={styles.body}>
        <View style={styles.row}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.time}>{time || ''}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.preview} numberOfLines={1}>{preview || ''}</Text>
          {!!unread && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unread > 9 ? '9+' : unread}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#141414',
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#222',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    position: 'relative',
  },
  avatarText: { color: '#FFF', fontSize: 20, fontWeight: '700' },
  statusDot: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 11,
    height: 11,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#141414',
  },
  body: { flex: 1 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  name: { color: '#FFF', fontSize: 15, fontWeight: '600' },
  time: { color: '#555', fontSize: 11 },
  preview: { color: '#777', fontSize: 13, flex: 1, marginRight: 8 },
  badge: {
    backgroundColor: '#FFD700',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  badgeText: { color: '#000', fontSize: 11, fontWeight: '700' },
});
