import React, { useContext, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { AuthContext } from '../contexts/AuthContext';
import { useFirestore } from '../hooks/useFirestore';
import TopBar from '../components/chat/TopBar';
import ChatBubble from '../components/chat/ChatBubble';
import ChatInput from '../components/chat/ChatInput';

export default function ChatRoomScreen() {
  console.log('[ChatRoomScreen] render called');

  const { userAlias, signOut } = useContext(AuthContext);
  console.log('[ChatRoomScreen] userAlias from context:', userAlias);

  const messages = useFirestore();
  console.log('[ChatRoomScreen] messages from useFirestore — count:', Array.isArray(messages) ? messages.length : 'NOT ARRAY — typeof: ' + typeof messages);

  useEffect(() => {
    console.log('[ChatRoomScreen] MOUNTED — userAlias:', userAlias);
    return () => {
      console.log('[ChatRoomScreen] UNMOUNTED');
    };
  }, []);

  const handleSend = async (text) => {
    console.log('[ChatRoomScreen] handleSend called — text:', text);
    try {
      if (!text || !text.trim()) {
        console.log('[ChatRoomScreen] handleSend: empty text, skip');
        return;
      }
      const payload = {
        text: text.trim(),
        userAlias: userAlias || 'Unknown',
        createdAt: firestore.FieldValue.serverTimestamp(),
      };
      console.log('[ChatRoomScreen] firestore().collection().add() — payload:', JSON.stringify({ text: payload.text, userAlias: payload.userAlias }));
      await firestore().collection('general_chat').add(payload);
      console.log('[ChatRoomScreen] message sent successfully');
    } catch (error) {
      console.error('[ChatRoomScreen] handleSend ERROR:', error?.message);
      console.error('[ChatRoomScreen] stack:', error?.stack);
    }
  };

  const safeMessages = Array.isArray(messages) ? messages : [];
  console.log('[ChatRoomScreen] safeMessages.length:', safeMessages.length);

  const renderItem = ({ item, index }) => {
    console.log('[ChatRoomScreen] renderItem index:', index, '— id:', item?.id, '| userAlias:', item?.userAlias);
    try {
      return (
        <ChatBubble
          message={item}
          isOwnMessage={item && item.userAlias === userAlias}
        />
      );
    } catch (e) {
      console.error('[ChatRoomScreen] renderItem ERROR at index', index, ':', e?.message);
      console.error('[ChatRoomScreen] stack:', e?.stack);
      return null;
    }
  };

  const keyExtractor = (item, index) => {
    const key = (item && item.id) ? String(item.id) : 'fallback_' + index;
    return key;
  };

  console.log('[ChatRoomScreen] about to render JSX');

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
          onLayout={() => console.log('[ChatRoomScreen] FlatList onLayout — rendered')}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Belum ada pesan</Text>
            </View>
          }
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
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyText: { color: '#555', fontSize: 14 },
});
