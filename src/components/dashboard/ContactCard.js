import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const AVATAR_COLORS = {
  sanqua:    '#1565C0',
  hass:      '#2E7D32',
  vit:       '#6A1B9A',
  cleo:      '#AD1457',
  lemineral: '#E65100',
};

function formatTime(ts) {
  if (!ts) return '';
  try {
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    const now = new Date();
    const diffDays = Math.floor((now - d) / 86400000);
    if (diffDays === 0) {
      return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    }
    if (diffDays === 1) return 'Kemarin';
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  } catch {
    return '';
  }
}

/**
 * Kartu kontak di tab Chat.
 * isTyping: tampilkan "sedang mengetik..." di preview (poin 7).
 * unread > 0: badge merah + nama & preview bold (poin 5 & 6).
 */
const ContactCard = memo(function ContactCard({ contact, lastMessage, onPress, isTyping }) {
  const { id, name } = contact;
  const avatarBg   = AVATAR_COLORS[id] || '#333';
  const rawPreview = lastMessage?.text   || '';
  const timestamp  = lastMessage?.time   || null;
  const unread     = lastMessage?.unread || 0;
  const hasUnread  = unread > 0;

  const preview = isTyping ? 'sedang mengetik...' : rawPreview;

  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.avatar, { backgroundColor: avatarBg }]}>
        <Text style={styles.avatarText}>{name[0].toUpperCase()}</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.topRow}>
          <Text style={[styles.name, hasUnread && styles.nameBold]}>{name}</Text>
          {!!timestamp && (
            <Text style={[styles.time, hasUnread && styles.timeUnread]}>
              {formatTime(timestamp)}
            </Text>
          )}
        </View>
        <View style={styles.bottomRow}>
          <Text
            style={[
              styles.preview,
              hasUnread && styles.previewBold,
              isTyping  && styles.previewTyping,
            ]}
            numberOfLines={1}>
            {preview}
          </Text>
          {hasUnread && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {unread > 99 ? '99+' : unread}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
});

export default ContactCard;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.07)',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarText:    { color: '#FFF', fontSize: 20, fontWeight: '700' },
  body:          { flex: 1 },
  topRow:        { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  bottomRow:     { flexDirection: 'row', alignItems: 'center' },
  name:          { color: '#EEEDF8', fontSize: 15, fontWeight: '500' },
  nameBold:      { fontWeight: '700' },
  time:          { color: '#555', fontSize: 12 },
  timeUnread:    { color: '#FF3B30', fontWeight: '600' },
  preview:       { color: '#666', fontSize: 13, flex: 1, marginRight: 8 },
  previewBold:   { color: '#AAAFBB', fontWeight: '700' },
  previewTyping: { color: '#4ADE80', fontStyle: 'italic' },
  badge: {
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  badgeText: { color: '#FFF', fontSize: 10, fontWeight: '800' },
});
