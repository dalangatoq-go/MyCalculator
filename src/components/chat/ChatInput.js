import React, { useState, useCallback } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function ChatInput({ onSend }) {
  const [text, setText] = useState('');

  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText('');
  }, [text, onSend]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="Pesan..."
        placeholderTextColor="#555"
        returnKeyType="send"
        onSubmitEditing={handleSend}
        blurOnSubmit={false}
      />
      <TouchableOpacity onPress={handleSend} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <Text style={styles.send}>Kirim</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', padding: 10, backgroundColor: '#000', alignItems: 'center' },
  input:     { flex: 1, color: '#FFF', borderBottomWidth: 1, borderColor: '#333', paddingVertical: 6 },
  send:      { color: '#FFD700', marginLeft: 14, fontWeight: '600' },
});
