import React, { useCallback, useContext, useEffect, useRef, useState, useMemo } from 'react';
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
import { useContactsPresence } from '../hooks/usePresence';
import { useSendTyping, useTypingIndicator } from '../hooks/useTyping';
import TopBar from '../components/chat/TopBar';
import ChatBubble from '../components/chat/ChatBubble';
import ChatInput  from '../components/chat/ChatInput';
import { sendChatNotification } from '../utils/pushNotify';
import { C } from '../theme/colors';

export default function ChatRoomScreen({ route, navigation }) {
  const {
    roomType  = 'public',
    contactId = null,
    roomTitle = 'Ruang Publik',
  } = route?.params || {};

  const { userAlias, signOut } = useContext(AuthContext);
  const myAlias = (userAlias || '').toLowerCase();

  const publicMessages                    = useFirestore();
  const [privateMessages, setPrivateMessages] = useState([]);
  const isMounted = useRef(true);

  // ── Nama koleksi berdasarkan tipe ruang ──────────────────
  const collectionName = useCallback(() =>
    roomType === 'private' && contactId
      ? `private_${contactId}`
      : 'general_chat',
  [roomType, contactId]);

  // ── Poin 2: alias kontak (untuk presence & receipts) ─────
  const contactAlias = useMemo(() => {
    if (roomType !== 'private' || !contactId || !myAlias) return null;
    const parts = contactId.split('_');
    return parts.find(p => p !== myAlias) || null;
  }, [roomType, contactId, myAlias]);

  // ── Poin 2: presence kontak real-time ────────────────────
  const [presence, setPresence] = useState({});
  useContactsPresence(
    contactAlias ? [contactAlias] : [],
    setPresence,
  );
  const isOnline = contactAlias
    ? presence[contactAlias] === true
    : undefined; // undefined = ruang publik → TopBar tidak tampilkan status

  // ── Poin 7: typing indicator ─────────────────────────────
  const typingRoomId = roomType === 'private' && contactId
    ? `private_${contactId}`
    : null;
  const setTyping   = useSendTyping(typingRoomId, myAlias);
  const typingUsers = useTypingIndicator(typingRoomId, myAlias);
  const contactIsTyping = typingUsers.length > 0;

  // ── Poin 8: read receipts ────────────────────────────────
  // Ketika user membuka chat ini, tulis receipt → picu ✓✓ hijau di pengirim
  const [receipts, setReceipts] = useState({});

  useEffect(() => {
    if (roomType !== 'private') return undefined;
    const col = collectionName();

    // Tulis receipt kita sendiri
    firestore()
      .collection('receipts')
      .doc(col)
      .set({ [myAlias]: firestore.FieldValue.serverTimestamp() }, { merge: true })
      .catch(() => {});

    // Subscribe ke receipt kontak (agar ✓✓ hijau muncul di pesan kita)
    const unsub = firestore()
      .collection('receipts')
      .doc(col)
      .onSnapshot(doc => {
        setReceipts(doc.data() || {});
      }, () => {});

    return () => {
      isMounted.current = false;
      unsub();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomType, contactId]);

  const recipientLastRead = contactAlias ? (receipts[contactAlias] || null) : undefined;
  // undefined = public room → ChatBubble tidak tampilkan tick

  // ── Pesan privat ─────────────────────────────────────────
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

  // ── Kirim pesan ──────────────────────────────────────────
  const handleSend = useCallback(async text => {
    try {
      const uid = auth().currentUser?.uid || '';
      await firestore().collection(collectionName()).add({
        text,
        userAlias: userAlias || 'Unknown',
        createdAt: firestore.FieldValue.serverTimestamp(),
        senderUid: uid,
      });
      sendChatNotification(collectionName(), userAlias, roomTitle).catch(
        (err) => console.error('[ChatRoom] notif error:', err?.message),
      );
    } catch (err) {
      console.error('[ChatRoom] send error:', err?.message);
    }
  }, [collectionName, userAlias, roomTitle]);

  // ── Hapus pesan ──────────────────────────────────────────
  const handleDelete = useCallback(async (message) => {
    try {
      await firestore().collection(collectionName()).doc(message.id).delete();
    } catch (err) {
      console.error('[ChatRoom] delete error:', err?.message);
      Alert.alert('Gagal', 'Pesan tidak dapat dihapus. Coba lagi.');
    }
  }, [collectionName]);

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
      recipientLastRead={
        item?.userAlias === userAlias ? recipientLastRead : undefined
      }
    />
  ), [userAlias, handleLongPress, recipientLastRead]);

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Poin 2: isOnline real-time */}
      <TopBar
        title={roomTitle}
        userAlias={userAlias}
        onLogout={signOut}
        onBack={handleBack}
        isOnline={isOnline}
      />

      {/* Poin 7: indikator mengetik di bawah header */}
      {contactIsTyping && (
        <View style={styles.typingBar}>
          <Text style={styles.typingDots}>•••</Text>
          <Text style={styles.typingText}>sedang mengetik...</Text>
        </View>
      )}

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
        {/* Poin 7: kirim typing state ke hook */}
        <ChatInput onSend={handleSend} onTypingChange={setTyping} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: '#111' },
  flex:           { flex: 1 },
  typingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: C.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: C.border,
    gap: 6,
  },
  typingDots: { color: C.online, fontSize: 16, letterSpacing: 2 },
  typingText: { color: C.text2, fontSize: 12, fontStyle: 'italic' },
  messageList:    { padding: 10, flexGrow: 1, justifyContent: 'flex-end' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyText:      { color: '#555', fontSize: 14 },
});
