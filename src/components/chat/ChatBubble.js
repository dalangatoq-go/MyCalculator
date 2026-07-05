import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatTime } from '../../utils/timeFormatter';

export default function ChatBubble({ message, isOwnMessage }) {
  // Native Firestore mengembalikan Timestamp object — perlu .toDate() sebelum diformat
  const timestamp = message.createdAt?.toDate ? message.createdAt.toDate() : message.createdAt;
  return (
    <View style={[styles.bubble, isOwnMessage ? styles.right : styles.left]}>
      <Text style={styles.alias}>{message.userAlias}</Text>
      <Text style={styles.text}>{message.text}</Text>
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
