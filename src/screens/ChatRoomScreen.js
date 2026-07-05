import React, { useContext, useEffect, useRef, useState } from 'react';
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

export default function ChatRoomScreen({ route, navigation }) {
  const {
    roomType = 'public',
    contactId = null,
    roomTitle = 'Ruang Publik',
  } = route?.params || {};

  const { userAlias, signOut } = useContext(AuthContext);
  const publicMessages = useFirestore();
  const [privateMessages, setPrivateMessages] = useState([]);
  const isMounted = useRef(true);

  // Private room subscription
  useEffect(() => {
    isMounted.current = true;
    if (roomType !== 'private' || !contactId) return;

    const unsub = firestore()
      .collection(`private_${contactId}`)
      .orderBy('createdAt', 'desc')
      .limit(100)
      .onSnapshot(
        snapshot => {
          if (!isMounted.current) return;
          const msgs = (snapshot?.docs || []).map(doc => {
            const d = doc.data() || {};
            return {
              id: doc.id,
              text: d.text || '',
              userAlias: d.userAlias || 'Unknown',
              createdAt: d.createdAt || null,
            };
          });
          setPrivateMessages(msgs);
        },
        err => console.error('[ChatRoomScreen] private snapshot error:', err?.message),
      );

    return () => {
      isMounted.current = false;
      unsub();
    };
  }, [roomType, contactId]);

  useEffect(() => () => { isMounted.current = false; }, []);

  const messages =
    roomType === 'private'
      ? privateMessages
      : Array.isArray(publicMessages)
      ? publicMessages
      : [];

  const handleSend = async text => {
    try {
      if (!text?.trim()) return;
      const col =
        roomType === 'private' && contactId
          ? `private_${contactId}`
          : 'general_chat';
      await firestore().collection(col).add({
        text: text.trim(),
        userAlias: userAlias || 'Unknown',
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
    } catch (err) {
      console.error('[ChatRoomScreen] handleSend error:', err?.message);
    }
  };

  const keyExtractor = (item, index) => item?.id || String(index);

  const renderItem = ({ item }) => {
    try {
      return (
        <ChatBubble
          message={item}
          isOwnMessage={item?.userAlias === userAlias}
        />
      );
    } catch (e) {
      console.error('[ChatRoomScreen] renderItem error:', e?.message);
      return null;
    }
  };

  const handleBack = () => {
    try {
      navigation.goBack();
    } catch (e) {
      console.error('[ChatRoomScreen] goBack error:', e?.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TopBar
        title={roomTitle}
        userAlias={userAlias}
        onLogout={signOut}
        onBack={handleBack}
      />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <FlatList
          data={messages}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          contentContainerStyle={styles.messageList}
          inverted
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
