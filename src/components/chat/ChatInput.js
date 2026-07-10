import React, { useState, useCallback } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { C } from '../../theme/colors';

/**
 * Komposer pesan — pill input + send button.
 * onTypingChange(bool): callback saat user mulai/berhenti mengetik.
 */
export default function ChatInput({ onSend, onTypingChange }) {
  const [text, setText] = useState('');
  const hasText = text.trim().length > 0;

  const handleChangeText = useCallback((val) => {
    setText(val);
    onTypingChange?.(val.trim().length > 0);
  }, [onTypingChange]);

  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onTypingChange?.(false); // bersihkan typing saat kirim
    onSend(trimmed);
    setText('');
  }, [text, onSend, onTypingChange]);

  return (
    <View style={styles.container}>
      <View style={styles.pill}>
        <Text style={styles.emoji}>☺</Text>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={handleChangeText}
          placeholder="Pesan..."
          placeholderTextColor={C.text3}
          returnKeyType="send"
          onSubmitEditing={handleSend}
          blurOnSubmit={false}
          multiline
          maxLength={1000}
        />
        {!hasText && <Text style={styles.attach}>📎</Text>}
      </View>

      <TouchableOpacity
        style={[styles.sendBtn, hasText && styles.sendBtnActive]}
        onPress={handleSend}
        activeOpacity={0.8}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Text style={styles.sendIcon}>{hasText ? '➤' : '🎤'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 16,
    backgroundColor: C.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: C.border,
    gap: 8,
  },
  pill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.card,
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: 6,
    minHeight: 46,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: C.border,
  },
  emoji:  { fontSize: 19, color: C.text2, marginRight: 8 },
  attach: { fontSize: 19, color: C.text2, marginLeft: 6 },
  input: {
    flex: 1,
    color: C.text1,
    fontSize: 15,
    lineHeight: 20,
    maxHeight: 110,
    paddingVertical: 4,
  },
  sendBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: C.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: C.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnActive: {
    backgroundColor: C.accent,
    borderColor: 'transparent',
    shadowColor: '#7C6BFF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.45,
    shadowRadius: 8,
    elevation: 6,
  },
  sendIcon: { fontSize: 16, color: '#FFF' },
});
