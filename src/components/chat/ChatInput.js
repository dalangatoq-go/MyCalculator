import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function ChatInput({ onSend }) {
  const [text, setText] = useState('');
  const handleSend = () => { if (text.trim()) { onSend(text); setText(''); } };
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="Pesan..."
        placeholderTextColor="#555"
      />
      <TouchableOpacity onPress={handleSend}>
        <Text style={styles.send}>Kirim</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flexDirection: 'row', padding: 10, backgroundColor: '#000' },
  input: { flex: 1, color: '#FFF', borderBottomWidth: 1, borderColor: '#333' },
  send: { color: '#FFD700', marginLeft: 10 }
});
