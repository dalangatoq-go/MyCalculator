import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { formatTime } from '../../utils/timeFormatter';
import { C } from '../../theme/colors';

/**
 * Gelembung pesan gaya WhatsApp — Gen-Z indigo theme.
 * isOwnMessage → kanan (sent indigo), else → kiri (dark received).
 * Long-press pada pesan sendiri → callback hapus.
 */
const ChatBubble = memo(function ChatBubble({ message, isOwnMessage, onLongPress }) {
  if (!message) return null;

  let timestamp = null;
  try { timestamp = message.createdAt?.toDate?.() ?? message.createdAt ?? null; }
  catch { timestamp = null; }

  return (
    <TouchableOpacity
      onLongPress={isOwnMessage ? onLongPress : undefined}
      delayLongPress={400}
      activeOpacity={isOwnMessage ? 0.75 : 1}
      accessible
      accessibilityHint={isOwnMessage ? 'Tahan untuk menghapus pesan' : undefined}
      style={[styles.wrapper, isOwnMessage ? styles.wrapRight : styles.wrapLeft]}
    >
      <View style={[styles.bubble, isOwnMessage ? styles.sent : styles.received]}>
        {!isOwnMessage && !!message.userAlias && (
          <Text style={styles.alias}>{message.userAlias}</Text>
        )}
        <Text style={[styles.text, isOwnMessage && styles.textSent]}>
          {message.text || ''}
        </Text>
        <Text style={[styles.time, isOwnMessage && styles.timeSent]}>
          {formatTime(timestamp)}
        </Text>
      </View>
    </TouchableOpacity>
  );
});

export default ChatBubble;

const styles = StyleSheet.create({
  wrapper:   { marginVertical: 2, marginHorizontal: 10 },
  wrapRight: { alignItems: 'flex-end' },
  wrapLeft:  { alignItems: 'flex-start' },
  bubble: {
    maxWidth: '78%',
    paddingHorizontal: 13,
    paddingTop: 8,
    paddingBottom: 7,
    borderRadius: 18,
  },
  sent: {
    backgroundColor: C.bubbleSent,
    borderBottomRightRadius: 4,
  },
  received: {
    backgroundColor: C.bubbleReceived,
    borderBottomLeftRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: C.border,
  },
  alias:    { color: C.accentLight, fontSize: 11.5, fontWeight: '700', marginBottom: 3 },
  text:     { color: C.text1, fontSize: 15, lineHeight: 21 },
  textSent: { color: '#FFFFFF' },
  time:     { color: C.text2, fontSize: 10.5, textAlign: 'right', marginTop: 4 },
  timeSent: { color: 'rgba(255,255,255,0.50)' },
});
