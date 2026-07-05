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
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarText: { color: 'rgba(255,255,255,0.95)', fontSize: 18, fontWeight: '700' },
  statusDot: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2.5,
    borderColor: '#0D0D0F',
  },
  body: { flex: 1 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  name: { color: '#E8E8EC', fontSize: 15, fontWeight: '600', letterSpacing: -0.2 },
  time: { color: '#3A3A42', fontSize: 11, fontWeight: '500' },
  preview: { color: '#5A5A62', fontSize: 13, flex: 1, marginRight: 8 },
  badge: {
    backgroundColor: '#FFD700',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  badgeText: { color: '#0D0D0F', fontSize: 10, fontWeight: '800' },
});
