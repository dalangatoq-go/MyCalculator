import React, { useContext } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { AuthContext } from '../contexts/AuthContext';
import { useFirestore } from '../hooks/useFirestore';
import TopBar from '../components/chat/TopBar';
import ChatBubble from '../components/chat/ChatBubble';
import ChatInput from '../components/chat/ChatInput';

export default function ChatRoomScreen() {
  const { userAlias, signOut } = useContext(AuthContext);
  const messages = useFirestore();

  const handleSend = async (text) => {
    try {
      if (!text || !text.trim()) return;
      await firestore().collection('general_chat').add({
        text: text.trim(),
        userAlias: userAlias || 'Unknown',
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
    } catch (error) {
      console.error('[CHAT] Gagal kirim pesan:', error);
    }
  };

  const safeMessages = Array.isArray(messages) ? messages : [];

  const renderItem = ({ item }) => {
    try {
      return (
        <ChatBubble
          message={item}
          isOwnMessage={item && item.userAlias === userAlias}
        />
      );
    } catch (e) {
      console.error('[ChatRoomScreen] renderItem error:', e);
      return null;
    }
  };

  const keyExtractor = (item) => {
    return (item && item.id) ? String(item.id) : String(Math.random());
  };

  return (
    <SafeAreaView style={styles.container}>
      <TopBar userAlias={userAlias} onLogout={signOut} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <FlatList
          data={safeMessages}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          contentContainerStyle={styles.messageList}
          inverted
        />
        <ChatInput onSend={handleSend} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111' },
  flex: { flex: 1 },
  messageList: { padding: 10, flexGrow: 1, justifyContent: 'flex-end' },
});
