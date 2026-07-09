import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { formatTime } from '../../utils/timeFormatter';

/**
 * Gelembung pesan.
 * - isOwnMessage : true jika pesan milik user sendiri
 * - onLongPress  : dipanggil saat user long-press pesan miliknya
 *                  (parent yang menampilkan dialog hapus)
 */
const ChatBubble = memo(function ChatBubble({ message, isOwnMessage, onLongPress }) {
  if (!message) return null;

  let timestamp = null;
  try {
    timestamp = message.createdAt?.toDate?.() ?? message.createdAt ?? null;
  } catch {
    timestamp = null;
  }

  return (
    <TouchableOpacity
      onLongPress={isOwnMessage ? onLongPress : undefined}
      delayLongPress={400}
      activeOpacity={isOwnMessage ? 0.75 : 1}
      accessible
      accessibilityHint={isOwnMessage ? 'Tahan untuk menghapus pesan' : undefined}
    >
      <View style={[styles.bubble, isOwnMessage ? styles.right : styles.left]}>
        {!isOwnMessage && !!message.userAlias && (
          <Text style={styles.alias}>{message.userAlias}</Text>
        )}
        <Text style={styles.text}>{message.text || ''}</Text>
        <Text style={styles.time}>{formatTime(timestamp)}</Text>
      </View>
    </TouchableOpacity>
  );
});

export default ChatBubble;

const styles = StyleSheet.create({
  bubble: {
    paddingHorizontal: 12,
    paddingVertical:   8,
    marginVertical:    3,
    marginHorizontal:  8,
    borderRadius:      12,
    maxWidth:          '80%',
  },
  right: {
    alignSelf:       'flex-end',
    backgroundColor: '#1A6B3A',   // hijau WA-style untuk pesan sendiri
    borderBottomRightRadius: 3,
  },
  left: {
    alignSelf:       'flex-start',
    backgroundColor: '#2A2A2E',   // abu gelap untuk pesan lawan bicara
    borderBottomLeftRadius: 3,
  },
  alias: { color: '#FFD700', fontSize: 11, fontWeight: '600', marginBottom: 2 },
  text:  { color: '#F0F0F0', fontSize: 15, lineHeight: 20 },
  time:  { color: 'rgba(255,255,255,0.45)', fontSize: 10, textAlign: 'right', marginTop: 4 },
});
