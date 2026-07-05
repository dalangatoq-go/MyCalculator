import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatTime } from '../../utils/timeFormatter';

export default function ChatBubble({ message, isOwnMessage }) {
  console.log('[ChatBubble] render — id:', message?.id, '| userAlias:', message?.userAlias, '| isOwnMessage:', isOwnMessage);

  if (!message) {
    console.warn('[ChatBubble] message is null/undefined — returning null');
    return null;
  }

  let timestamp = null;
  try {
    if (message.createdAt?.toDate) {
      timestamp = message.createdAt.toDate();
      console.log('[ChatBubble] timestamp via toDate():', timestamp);
    } else if (message.createdAt) {
      timestamp = message.createdAt;
      console.log('[ChatBubble] timestamp raw:', timestamp);
    } else {
      console.log('[ChatBubble] createdAt is null/undefined — timestamp will be empty string');
    }
  } catch (e) {
    console.error('[ChatBubble] ERROR parsing timestamp:', e?.message);
    console.error('[ChatBubble] stack:', e?.stack);
    timestamp = null;
  }

  const alias = message.userAlias || '';
  const text = message.text || '';
  const timeStr = formatTime(timestamp);

  console.log('[ChatBubble] rendering — alias:', alias, '| text length:', text.length, '| time:', timeStr);

  return (
    <View style={[styles.bubble, isOwnMessage ? styles.right : styles.left]}>
      {!!alias && <Text style={styles.alias}>{alias}</Text>}
      <Text style={styles.text}>{text}</Text>
      <Text style={styles.time}>{timeStr}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: { padding: 10, margin: 5, borderRadius: 10, maxWidth: '80%' },
  right: { alignSelf: 'flex-end', backgroundColor: '#333' },
  left: { alignSelf: 'flex-start', backgroundColor: '#222' },
  alias: { color: '#FFD700', fontSize: 10 },
  text: { color: '#FFF', fontSize: 16 },
  time: { color: '#888', fontSize: 8, textAlign: 'right' }
});
