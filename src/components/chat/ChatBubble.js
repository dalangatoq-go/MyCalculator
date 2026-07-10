import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { formatTime } from '../../utils/timeFormatter';
import { C } from '../../theme/colors';

/**
 * Gelembung pesan gaya WhatsApp.
 * recipientLastRead (Timestamp|null): waktu penerima terakhir membaca room.
 * Jika createdAt <= recipientLastRead → ✓✓ hijau stabilo (dibaca).
 * Else → ✓ abu (terkirim ke server).
 * Hanya muncul untuk pesan sendiri di room privat.
 */
const ChatBubble = memo(function ChatBubble({
  message,
  isOwnMessage,
  onLongPress,
  recipientLastRead,
}) {
  if (!message) return null;

  // Placeholder murni di UI (pesan sudah benar-benar dihapus dari database).
  // Tidak bisa ditekan lama / dihapus lagi.
  if (message.deletedPlaceholder) {
    return (
      <View style={[styles.wrapper, isOwnMessage ? styles.wrapRight : styles.wrapLeft]}>
        <View style={[styles.bubble, styles.deletedBubble]}>
          <Text style={styles.deletedText}>Pesan ini telah dihapus</Text>
        </View>
      </View>
    );
  }

  let timestamp = null;
  try {
    timestamp = message.createdAt?.toDate?.() ?? message.createdAt ?? null;
  } catch {
    timestamp = null;
  }

  // Hitung status ceklis — hanya untuk pesan sendiri & di room privat
  let tickText  = null;
  let tickColor = C.text2;
  if (isOwnMessage && recipientLastRead !== undefined) {
    const msgMs = message.createdAt?.toMillis
      ? message.createdAt.toMillis()
      : timestamp
      ? timestamp.getTime()
      : 0;
    const readMs = recipientLastRead?.toMillis
      ? recipientLastRead.toMillis()
      : recipientLastRead
      ? new Date(recipientLastRead).getTime()
      : 0;

    if (readMs > 0 && msgMs > 0 && readMs >= msgMs) {
      tickText  = '✓✓';
      tickColor = '#25D366'; // hijau stabilo — sudah dibaca
    } else {
      tickText  = '✓';
      tickColor = C.text2;   // abu — terkirim ke server
    }
  }

  return (
    <TouchableOpacity
      onLongPress={onLongPress}
      delayLongPress={400}
      activeOpacity={0.75}
      accessible
      accessibilityHint="Tahan untuk opsi hapus pesan"
      style={[styles.wrapper, isOwnMessage ? styles.wrapRight : styles.wrapLeft]}
    >
      <View style={[styles.bubble, isOwnMessage ? styles.sent : styles.received]}>
        {!isOwnMessage && !!message.userAlias && (
          <Text style={styles.alias}>{message.userAlias}</Text>
        )}
        <Text style={[styles.text, isOwnMessage && styles.textSent]}>
          {message.text || ''}
        </Text>
        <View style={styles.meta}>
          <Text style={[styles.time, isOwnMessage && styles.timeSent]}>
            {formatTime(timestamp)}
          </Text>
          {!!tickText && (
            <Text style={[styles.tick, { color: tickColor }]}>{tickText}</Text>
          )}
        </View>
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
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
    gap: 4,
  },
  time:     { color: C.text2, fontSize: 10.5 },
  timeSent: { color: 'rgba(255,255,255,0.50)' },
  tick:     { fontSize: 11, fontWeight: '700' },
  deletedBubble: {
    backgroundColor: 'transparent',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: C.border,
    paddingVertical: 7,
  },
  deletedText: { color: C.text3, fontSize: 13.5, fontStyle: 'italic' },
});
