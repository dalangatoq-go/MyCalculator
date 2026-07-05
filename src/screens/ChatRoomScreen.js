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
      await firestore().collection('general_chat').add({
        text,
        userAlias,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
    } catch (error) {
      console.error('[CHAT] Gagal kirim pesan:', error);
    }
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
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ChatBubble
              message={item}
              isOwnMessage={item.userAlias === userAlias}
            />
          )}
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
  messageList: { paddingHorizontal: 8, paddingVertical: 12 },
});
