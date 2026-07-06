import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatTime } from '../../utils/timeFormatter';

const ChatBubble = memo(function ChatBubble({ message, isOwnMessage }) {
  if (!message) return null;

  let timestamp = null;
  try {
    timestamp = message.createdAt?.toDate?.() ?? message.createdAt ?? null;
  } catch {
    timestamp = null;
  }

  return (
    <View style={[styles.bubble, isOwnMessage ? styles.right : styles.left]}>
      {!!message.userAlias && (
        <Text style={styles.alias}>{message.userAlias}</Text>
      )}
      <Text style={styles.text}>{message.text || ''}</Text>
      <Text style={styles.time}>{formatTime(timestamp)}</Text>
    </View>
  );
});

export default ChatBubble;

const styles = StyleSheet.create({
  bubble: { padding: 10, margin: 5, borderRadius: 10, maxWidth: '80%' },
  right:  { alignSelf: 'flex-end',   backgroundColor: '#333' },
  left:   { alignSelf: 'flex-start', backgroundColor: '#222' },
  alias:  { color: '#FFD700', fontSize: 10 },
  text:   { color: '#FFF',    fontSize: 16 },
  time:   { color: '#888',    fontSize: 8, textAlign: 'right' },
});
