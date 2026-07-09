import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { AuthContext } from '../contexts/AuthContext';
import { useFirestore } from '../hooks/useFirestore';
import TopBar from '../components/chat/TopBar';
import ChatBubble from '../components/chat/ChatBubble';
import ChatInput from '../components/chat/ChatInput';

export default function ChatRoomScreen({ route, navigation }) {
  const {
    roomType  = 'public',
    contactId = null,
    roomTitle = 'Ruang Publik',
  } = route?.params || {};

  const { userAlias, signOut } = useContext(AuthContext);
  const publicMessages         = useFirestore();
  const [privateMessages, setPrivateMessages] = useState([]);
  const isMounted = useRef(true);

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
          setPrivateMessages(
            snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
          );
        },
        err => console.error('[ChatRoom] private error:', err?.message),
      );

    return () => { isMounted.current = false; unsub(); };
  }, [roomType, contactId]);

  useEffect(() => () => { isMounted.current = false; }, []);

  const messages = roomType === 'private' ? privateMessages : (publicMessages || []);

  // Nama koleksi Firestore berdasarkan tipe ruang
  const collectionName = useCallback(() =>
    roomType === 'private' && contactId
      ? `private_${contactId}`
      : 'general_chat',
  [roomType, contactId]);

  // ── Kirim pesan ───────────────────────────────────────────────────
  // senderUid disimpan agar Firestore rules bisa memvalidasi penghapusan.
  const handleSend = useCallback(async text => {
    try {
      const uid = auth().currentUser?.uid || '';
      await firestore().collection(collectionName()).add({
        text,
        userAlias: userAlias || 'Unknown',
        createdAt: firestore.FieldValue.serverTimestamp(),
        senderUid: uid,
      });
      // Notifikasi dikirim otomatis oleh Cloud Functions via FCM.
    } catch (err) {
      console.error('[ChatRoom] send error:', err?.message);
    }
  }, [collectionName, userAlias]);

  // ── Hapus pesan (gaya WA) ─────────────────────────────────────────
  const handleDelete = useCallback(async (message) => {
    try {
      await firestore().collection(collectionName()).doc(message.id).delete();
    } catch (err) {
      console.error('[ChatRoom] delete error:', err?.message);
      Alert.alert('Gagal', 'Pesan tidak dapat dihapus. Coba lagi.');
    }
  }, [collectionName]);

  // ── Long-press → dialog WA-style ──────────────────────────────────
  const handleLongPress = useCallback((message) => {
    Alert.alert(
      'Hapus Pesan',
      'Pesan akan dihapus untuk semua orang.',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus untuk Semua',
          style: 'destructive',
          onPress: () => handleDelete(message),
        },
      ],
      { cancelable: true },
    );
  }, [handleDelete]);

  const keyExtractor = useCallback(
    (item, index) => item?.id || String(index),
    [],
  );

  const renderItem = useCallback(({ item }) => (
    <ChatBubble
      message={item}
      isOwnMessage={item?.userAlias === userAlias}
      onLongPress={() => handleLongPress(item)}
    />
  ), [userAlias, handleLongPress]);

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);

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
          removeClippedSubviews
          maxToRenderPerBatch={10}
          windowSize={5}
          initialNumToRender={20}
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
  container:      { flex: 1, backgroundColor: '#111' },
  flex:           { flex: 1 },
  messageList:    { padding: 10, flexGrow: 1, justifyContent: 'flex-end' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyText:      { color: '#555', fontSize: 14 },
});
