import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatTime } from '../../utils/timeFormatter';

export default function ChatBubble({ message, isOwnMessage }) {
  if (!message) return null;

  let timestamp = null;
  try {
    if (message.createdAt?.toDate) {
      timestamp = message.createdAt.toDate();
    } else if (message.createdAt) {
      timestamp = message.createdAt;
    }
  } catch (e) {
    console.error('[ChatBubble] Error parsing timestamp:', e);
    timestamp = null;
  }

  const alias = message.userAlias || '';
  const text = message.text || '';

  return (
    <View style={[styles.bubble, isOwnMessage ? styles.right : styles.left]}>
      {!!alias && <Text style={styles.alias}>{alias}</Text>}
      <Text style={styles.text}>{text}</Text>
      <Text style={styles.time}>{formatTime(timestamp)}</Text>
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
